import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

// TriPay config from env or localStorage fallback
const TRIPAY_BASE = {
  sandbox: "https://tripay.co.id/api-sandbox",
  production: "https://tripay.co.id/api",
};

function getConfig(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const apiKey = searchParams.get("apiKey") || process.env.TRIPAY_API_KEY || "";
  const privateKey = searchParams.get("privateKey") || process.env.TRIPAY_PRIVATE_KEY || "";
  const merchantCode = searchParams.get("merchantCode") || process.env.TRIPAY_MERCHANT_CODE || "";
  const mode = (searchParams.get("mode") || process.env.TRIPAY_MODE || "sandbox") as "sandbox" | "production";
  const baseUrl = TRIPAY_BASE[mode] || TRIPAY_BASE.sandbox;
  return { apiKey, privateKey, merchantCode, mode, baseUrl };
}

// ---- TEST CONNECTION ----
async function handleTest(request: NextRequest) {
  const { apiKey, baseUrl } = getConfig(request);
  if (!apiKey) {
    return NextResponse.json({ success: false, error: "API Key not configured" });
  }
  try {
    const res = await fetch(`${baseUrl}/merchant/payment-channel`, {
      headers: { Authorization: `Bearer ${apiKey}` },
    });
    const data = await res.json();
    if (data.success) {
      const channels = (data.data || []).filter((c: { active: boolean }) => c.active);
      return NextResponse.json({
        success: true,
        message: `Connection successful! ${channels.length} active payment channels found.`,
        channels: channels.map((c: { code: string; name: string; group: string; icon_url: string; fee_merchant: { flat: number; percent: number }; minimum_amount: number; maximum_amount: number }) => ({
          code: c.code,
          name: c.name,
          group: c.group,
          icon: c.icon_url,
          feeFlat: c.fee_merchant?.flat || 0,
          feePercent: c.fee_merchant?.percent || 0,
          minAmount: c.minimum_amount || 10000,
          maxAmount: c.maximum_amount || 10000000,
        })),
      });
    }
    return NextResponse.json({ success: false, error: data.message || "Connection failed" });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Network error connecting to TriPay" });
  }
}

// ---- GET CHANNELS ----
async function handleChannels(request: NextRequest) {
  const { apiKey, baseUrl } = getConfig(request);
  if (!apiKey) {
    return NextResponse.json({ success: false, error: "API Key not configured" });
  }
  try {
    const res = await fetch(`${baseUrl}/merchant/payment-channel`, {
      headers: { Authorization: `Bearer ${apiKey}` },
    });
    const data = await res.json();
    if (data.success) {
      return NextResponse.json({
        success: true,
        channels: (data.data || []).filter((c: { active: boolean }) => c.active).map((c: { code: string; name: string; group: string; type: string; icon_url: string; fee_merchant: { flat: number; percent: number }; fee_customer: { flat: number; percent: number }; minimum_amount: number; maximum_amount: number }) => ({
          code: c.code,
          name: c.name,
          group: c.group,
          type: c.type,
          icon: c.icon_url,
          feeFlat: c.fee_merchant?.flat || 0,
          feePercent: c.fee_merchant?.percent || 0,
          feeCustomerFlat: c.fee_customer?.flat || 0,
          minAmount: c.minimum_amount || 10000,
          maxAmount: c.maximum_amount || 10000000,
        })),
      });
    }
    return NextResponse.json({ success: false, error: data.message || "Failed to fetch channels" });
  } catch {
    return NextResponse.json({ success: false, error: "Network error" });
  }
}

// ---- CREATE TRANSACTION ----
async function handleCreate(request: NextRequest) {
  try {
    const body = await request.json();

    // Read credentials from body first, then env vars. TRIM all to remove whitespace.
    const apiKey = (body.apiKey || process.env.TRIPAY_API_KEY || "").trim();
    const privateKey = (body.privateKey || process.env.TRIPAY_PRIVATE_KEY || "").trim();
    const merchantCode = (body.merchantCode || process.env.TRIPAY_MERCHANT_CODE || "").trim();
    const mode = (body.mode || process.env.TRIPAY_MODE || "sandbox") as "sandbox" | "production";
    const baseUrl = TRIPAY_BASE[mode] || TRIPAY_BASE.sandbox;

    if (!apiKey || !privateKey || !merchantCode) {
      return NextResponse.json({
        success: false,
        error: `TriPay credentials not fully configured. Missing: ${!apiKey ? "[API Key] " : ""}${!privateKey ? "[Private Key] " : ""}${!merchantCode ? "[Merchant Code]" : ""}`.trim()
      });
    }

    const { method, amount, customerName, customerEmail, customerPhone, planName, returnUrl, callbackUrl } = body;

    if (!method || !amount || !customerName || !customerEmail || !customerPhone) {
      return NextResponse.json({ success: false, error: "Missing required fields: method, amount, customerName, customerEmail, customerPhone" });
    }

    const merchantRef = `INV${Date.now()}${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    const expiry = Math.floor(Date.now() / 1000) + 24 * 60 * 60; // 24 hours
    const amountInt = Math.round(Number(amount));

    if (isNaN(amountInt) || amountInt < 1000) {
      return NextResponse.json({ success: false, error: `Invalid amount: ${amount}. Must be at least 1000.` });
    }

    // Signature: HMAC-SHA256(merchantCode + merchantRef + amount, privateKey)
    const signatureString = merchantCode + merchantRef + amountInt;
    const signature = crypto
      .createHmac("sha256", privateKey)
      .update(signatureString)
      .digest("hex");

    // Build payload as form-encoded (TriPay examples use form data)
    const formData = new URLSearchParams();
    formData.append("method", method);
    formData.append("merchant_ref", merchantRef);
    formData.append("amount", String(amountInt));
    formData.append("customer_name", customerName);
    formData.append("customer_email", customerEmail);
    formData.append("customer_phone", customerPhone);
    formData.append("order_items[0][sku]", planName?.replace(/\s+/g, "-").toUpperCase() || "VIP");
    formData.append("order_items[0][name]", planName || "VIP Subscription");
    formData.append("order_items[0][price]", String(amountInt));
    formData.append("order_items[0][quantity]", "1");
    formData.append("expired_time", String(expiry));
    formData.append("signature", signature);

    // Only add optional fields if they have values
    if (callbackUrl) formData.append("callback_url", callbackUrl);
    if (returnUrl) formData.append("return_url", returnUrl);

    const res = await fetch(`${baseUrl}/transaction/create`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
      body: formData.toString(),
    });

    const data = await res.json();

    if (data.success) {
      return NextResponse.json({
        success: true,
        data: {
          reference: data.data?.reference,
          merchantRef: data.data?.merchant_ref,
          payCode: data.data?.pay_code,
          payUrl: data.data?.pay_url,
          checkoutUrl: data.data?.checkout_url,
          amount: data.data?.amount,
          status: data.data?.status,
          expiredAt: data.data?.expired_time,
        },
      });
    }

    return NextResponse.json({ success: false, error: data.message || "Transaction creation failed" });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Server error creating transaction" });
  }
}

// ---- CALLBACK HANDLER ----
async function handleCallback(request: NextRequest) {
  const privateKey = process.env.TRIPAY_PRIVATE_KEY || "";

  try {
    const body = await request.text();
    const callbackSignature = request.headers.get("x-callback-signature") || "";
    const callbackEvent = request.headers.get("x-callback-event") || "";

    // Validate signature
    const expectedSignature = crypto
      .createHmac("sha256", privateKey)
      .update(body)
      .digest("hex");

    if (callbackSignature !== expectedSignature) {
      return NextResponse.json({ success: false, message: "Invalid signature" }, { status: 403 });
    }

    if (callbackEvent !== "payment_status") {
      return NextResponse.json({ success: false, message: `Unknown event: ${callbackEvent}` });
    }

    const data = JSON.parse(body);

    // Process payment based on status
    // In production, this would update the user's VIP status in the database
    // For now, we store it in localStorage via the frontend
    const paymentResult = {
      reference: data.reference,
      merchantRef: data.merchant_ref,
      status: data.status, // PAID, FAILED, EXPIRED, REFUND
      amount: data.total_amount,
      method: data.payment_method,
      paidAt: data.paid_at,
    };

    // Log for debugging (in production, update DB here)
    console.log("[TriPay Callback]", JSON.stringify(paymentResult));

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false, message: "Callback processing error" }, { status: 500 });
  }
}

// ---- MAIN ROUTER ----
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get("action") || "channels";

  switch (action) {
    case "test": return handleTest(request);
    case "channels": return handleChannels(request);
    default: return NextResponse.json({ success: false, error: "Unknown action" });
  }
}

export async function POST(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get("action") || "create";

  switch (action) {
    case "create": return handleCreate(request);
    case "callback": return handleCallback(request);
    default: return NextResponse.json({ success: false, error: "Unknown action" });
  }
}
