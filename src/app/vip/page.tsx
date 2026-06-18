"use client";

import { useState, useEffect } from "react";
import { Crown, Check, Zap, Shield, Film, Monitor, Headphones, Clock, X, CreditCard, Loader2, ExternalLink, AlertCircle } from "lucide-react";
import { vipPlans } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const TRIPAY_CONFIG_KEY = "dramaflix_tripay_config";

interface PaymentChannel {
  code: string;
  name: string;
  group: string;
  icon: string;
  feeFlat: number;
  feePercent: number;
  minAmount: number;
  maxAmount: number;
}

type CheckoutStep = "select-method" | "customer-info" | "processing" | "payment" | "success" | "error";

export default function VipPage() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [showCheckout, setShowCheckout] = useState(false);
  const [channels, setChannels] = useState<PaymentChannel[]>([]);
  const [channelsLoading, setChannelsLoading] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [checkoutStep, setCheckoutStep] = useState<CheckoutStep>("select-method");
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [paymentData, setPaymentData] = useState<Record<string, string> | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [tripayConfig, setTripayConfig] = useState<{ apiKey: string; mode: string } | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(TRIPAY_CONFIG_KEY);
    if (stored) {
      try { setTripayConfig(JSON.parse(stored)); } catch { /* ignore */ }
    }
  }, []);

  const loadChannels = async () => {
    if (!tripayConfig?.apiKey) return;
    setChannelsLoading(true);
    try {
      const params = new URLSearchParams({ action: "channels", apiKey: tripayConfig.apiKey, mode: tripayConfig.mode });
      const res = await fetch(`/api/tripay?${params}`);
      const data = await res.json();
      if (data.success) setChannels(data.channels || []);
    } catch { /* ignore */ }
    setChannelsLoading(false);
  };

  const handleGetPlan = (planId: string) => {
    setSelectedPlan(planId);
    setShowCheckout(true);
    setCheckoutStep("select-method");
    setSelectedMethod(null);
    setPaymentData(null);
    setErrorMsg("");
    // Load current user info
    try {
      const session = localStorage.getItem("dramaflix_user_session");
      if (session) {
        const user = JSON.parse(session);
        setCustomerName(user.name || "");
        setCustomerEmail(user.email || "");
      }
    } catch { /* ignore */ }
    loadChannels();
  };

  const handleCreatePayment = async () => {
    if (!selectedMethod || !customerName || !customerEmail || !selectedPlan) return;
    const plan = vipPlans.find((p) => p.id === selectedPlan);
    if (!plan || !tripayConfig) return;

    setCheckoutStep("processing");
    setErrorMsg("");

    try {
      const stored = localStorage.getItem(TRIPAY_CONFIG_KEY);
      const config = stored ? JSON.parse(stored) : {};

      const res = await fetch("/api/tripay?action=create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          method: selectedMethod,
          amount: plan.price,
          customerName,
          customerEmail,
          planName: plan.name,
          apiKey: config.apiKey,
          privateKey: config.privateKey,
          merchantCode: config.merchantCode,
          mode: config.mode,
          returnUrl: typeof window !== "undefined" ? `${window.location.origin}/subscription` : "",
          callbackUrl: typeof window !== "undefined" ? `${window.location.origin}/api/tripay?action=callback` : "",
        }),
      });

      const data = await res.json();
      if (data.success) {
        setPaymentData(data.data as Record<string, string>);
        setCheckoutStep("payment");
      } else {
        setErrorMsg(data.error || "Failed to create payment");
        setCheckoutStep("error");
      }
    } catch {
      setErrorMsg("Network error. Please try again.");
      setCheckoutStep("error");
    }
  };

  const handleCloseCheckout = () => {
    setShowCheckout(false);
    setCheckoutStep("select-method");
    setSelectedMethod(null);
    setPaymentData(null);
    setErrorMsg("");
  };

  const selectedPlanData = vipPlans.find((p) => p.id === selectedPlan);

  // Group channels
  const grouped = channels.reduce<Record<string, PaymentChannel[]>>((acc, ch) => {
    if (!acc[ch.group]) acc[ch.group] = [];
    acc[ch.group].push(ch);
    return acc;
  }, {});

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 text-accent text-sm font-bold rounded-full mb-4">
          <Crown size={16} /> Premium Access
        </div>
        <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-3">
          Choose Your <span className="gradient-text">VIP Plan</span>
        </h1>
        <p className="text-dark-400 max-w-xl mx-auto">
          Unlock unlimited access to 10,000+ films and dramas from 40+ providers. Ad-free, HD quality, and more.
        </p>
      </div>

      {/* Plans */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        {vipPlans.map((plan) => (
          <div key={plan.id}
            className={`relative rounded-2xl p-6 transition-all ${
              plan.isPopular ? "bg-gradient-to-b from-accent/20 to-dark-800 border-2 border-accent shadow-xl shadow-accent/10"
                : plan.isPromo ? "bg-gradient-to-b from-purple/15 to-dark-800 border-2 border-purple shadow-xl shadow-purple/10"
                : "bg-dark-800 border border-dark-700"}`}>
            {plan.isPopular && <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-accent text-dark-950 text-xs font-bold rounded-full">Most Popular</span>}
            {plan.isPromo && <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-purple text-white text-xs font-bold rounded-full">Best Value</span>}
            <h3 className="text-lg font-extrabold text-white mb-1">{plan.name}</h3>
            <p className="text-xs text-dark-400 mb-4">{plan.durationUnit === "lifetime" ? "Forever" : `${plan.duration} ${plan.durationUnit}`}</p>
            <div className="mb-6">
              {plan.originalPrice && <span className="text-sm text-dark-500 line-through">Rp {plan.originalPrice.toLocaleString()}</span>}
              <p className="text-3xl font-extrabold text-white">Rp {plan.price.toLocaleString()}</p>
            </div>
            <ul className="space-y-3 mb-6">
              {plan.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-dark-300"><Check size={16} className="text-success shrink-0 mt-0.5" />{f}</li>
              ))}
            </ul>
            <button onClick={() => handleGetPlan(plan.id)}
              className={`w-full py-3 rounded-xl font-bold text-sm transition-all ${
                plan.isPopular ? "bg-accent hover:bg-accent-dark text-dark-950 shadow-lg shadow-accent/20"
                  : plan.isPromo ? "bg-purple hover:bg-purple/80 text-white"
                  : "bg-dark-700 hover:bg-dark-600 text-white"}`}>
              Get {plan.name}
            </button>
          </div>
        ))}
      </div>

      {/* Features */}
      <div className="mb-16">
        <h2 className="text-2xl font-extrabold text-white text-center mb-8">Why Go VIP?</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { icon: Zap, title: "Ad-Free", desc: "No interruptions, ever" },
            { icon: Film, title: "All Movies", desc: "10,000+ titles unlocked" },
            { icon: Monitor, title: "HD & 4K", desc: "Crystal clear quality" },
            { icon: Headphones, title: "Priority Support", desc: "24/7 dedicated help" },
            { icon: Shield, title: "Multi-Device", desc: "Watch on 3-6 devices" },
            { icon: Clock, title: "Early Access", desc: "New releases first" },
            { icon: Crown, title: "VIP Providers", desc: "Exclusive content" },
            { icon: Monitor, title: "Download", desc: "Offline viewing" },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="text-center p-4 bg-dark-800/50 rounded-2xl border border-dark-700/50">
              <Icon size={28} className="text-accent mx-auto mb-3" />
              <h4 className="text-sm font-bold text-white mb-1">{title}</h4>
              <p className="text-xs text-dark-400">{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl font-extrabold text-white text-center mb-8">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {[
            { q: "How do I activate VIP?", a: "Choose a plan, complete payment via TriPay, and VIP will be activated instantly." },
            { q: "What payment methods are accepted?", a: "We accept bank transfers (BCA, BRI, BNI, Mandiri), e-wallets (GoPay, OVO, Dana, ShopeePay), QRIS, and convenience stores (Alfamart, Indomaret)." },
            { q: "Is there a refund policy?", a: "Refunds are available within 24 hours of purchase if no VIP content was accessed." },
            { q: "How many devices can I use?", a: "Depending on your plan, you can use 3-6 devices simultaneously." },
          ].map((faq, i) => (
            <div key={i} className="p-4 bg-dark-800/50 border border-dark-700/50 rounded-xl">
              <h4 className="text-sm font-bold text-white mb-2">{faq.q}</h4>
              <p className="text-xs text-dark-400 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Checkout Modal */}
      {showCheckout && selectedPlanData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleCloseCheckout} />
          <div className="relative bg-dark-900 border border-dark-700 rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto animate-fade-in">
            <button onClick={handleCloseCheckout} className="absolute top-4 right-4 p-1 hover:bg-dark-800 rounded-lg text-dark-400"><X size={20} /></button>

            {/* Step: Select Payment Method */}
            {checkoutStep === "select-method" && (
              <>
                <div className="text-center mb-6">
                  <div className="w-14 h-14 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-3"><Crown size={24} className="text-accent" /></div>
                  <h3 className="text-xl font-bold text-white">Checkout</h3>
                  <p className="text-sm text-dark-400 mt-1">{selectedPlanData.name} — Rp {selectedPlanData.price.toLocaleString()}</p>
                </div>

                {!tripayConfig?.apiKey ? (
                  <div className="p-4 bg-accent/10 border border-accent/20 rounded-xl mb-4">
                    <p className="text-xs text-accent flex items-center gap-1"><AlertCircle size={14} /> Payment gateway not configured. Contact admin to set up TriPay.</p>
                  </div>
                ) : channelsLoading ? (
                  <div className="flex items-center justify-center py-8"><Loader2 size={24} className="animate-spin text-accent" /></div>
                ) : channels.length > 0 ? (
                  <div className="space-y-4 mb-6">
                    {Object.entries(grouped).map(([group, chs]) => (
                      <div key={group}>
                        <p className="text-xs font-semibold text-dark-400 uppercase tracking-wider mb-2">{group}</p>
                        <div className="grid grid-cols-2 gap-2">
                          {chs.map((ch) => (
                            <button key={ch.code} onClick={() => setSelectedMethod(ch.code)}
                              className={cn("flex items-center gap-2 p-3 rounded-xl text-xs font-medium transition-all border text-left",
                                selectedMethod === ch.code ? "bg-accent/10 border-accent text-white" : "bg-dark-800 border-dark-700 text-dark-300 hover:border-dark-600 hover:text-white")}>
                              {ch.icon && <img src={ch.icon} alt="" className="w-5 h-5 rounded object-contain shrink-0" />}
                              <span className="truncate">{ch.name}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 bg-danger/10 border border-danger/20 rounded-xl mb-4">
                    <p className="text-xs text-danger">No payment channels available.</p>
                  </div>
                )}

                <button onClick={() => setCheckoutStep("customer-info")} disabled={!selectedMethod || !tripayConfig?.apiKey}
                  className="w-full py-3 bg-accent hover:bg-accent-dark disabled:opacity-50 text-dark-950 font-bold rounded-xl transition-all">
                  Continue
                </button>
              </>
            )}

            {/* Step: Customer Info */}
            {checkoutStep === "customer-info" && (
              <>
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-white">Your Information</h3>
                  <p className="text-sm text-dark-400 mt-1">Enter your details for the payment</p>
                </div>
                <div className="space-y-3 mb-6">
                  <div>
                    <label className="block text-xs font-medium text-dark-300 mb-1.5">Full Name</label>
                    <input type="text" value={customerName} onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full bg-dark-800 border border-dark-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-accent" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-dark-300 mb-1.5">Email</label>
                    <input type="email" value={customerEmail} onChange={(e) => setCustomerEmail(e.target.value)}
                      className="w-full bg-dark-800 border border-dark-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-accent" />
                  </div>
                </div>
                <div className="p-3 bg-dark-800 rounded-xl mb-6">
                  <div className="flex justify-between text-sm"><span className="text-dark-300">Method</span><span className="text-white">{channels.find((c) => c.code === selectedMethod)?.name}</span></div>
                  <div className="flex justify-between text-sm mt-1"><span className="text-dark-300">Total</span><span className="font-bold text-accent">Rp {selectedPlanData.price.toLocaleString()}</span></div>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setCheckoutStep("select-method")} className="flex-1 py-3 bg-dark-800 text-white rounded-xl">Back</button>
                  <button onClick={handleCreatePayment} disabled={!customerName || !customerEmail}
                    className="flex-1 py-3 bg-accent hover:bg-accent-dark disabled:opacity-50 text-dark-950 font-bold rounded-xl transition-all">
                    Pay Now
                  </button>
                </div>
              </>
            )}

            {/* Step: Processing */}
            {checkoutStep === "processing" && (
              <div className="text-center py-12">
                <Loader2 size={40} className="animate-spin text-accent mx-auto mb-4" />
                <p className="text-sm text-dark-300">Creating payment...</p>
              </div>
            )}

            {/* Step: Payment */}
            {checkoutStep === "payment" && paymentData && (
              <>
                <div className="text-center mb-6">
                  <div className="w-14 h-14 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-3"><CreditCard size={24} className="text-success" /></div>
                  <h3 className="text-xl font-bold text-white">Payment Created!</h3>
                  <p className="text-sm text-dark-400 mt-1">Complete your payment using the details below</p>
                </div>
                <div className="p-4 bg-dark-800 rounded-xl mb-4 space-y-2">
                  {paymentData.payCode && (
                    <div className="flex justify-between text-sm"><span className="text-dark-300">Payment Code</span><span className="text-white font-mono font-bold">{paymentData.payCode}</span></div>
                  )}
                  <div className="flex justify-between text-sm"><span className="text-dark-300">Reference</span><span className="text-dark-400 font-mono text-xs">{paymentData.reference}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-dark-300">Amount</span><span className="font-bold text-accent">Rp {selectedPlanData.price.toLocaleString()}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-dark-300">Status</span><span className="text-accent">{paymentData.status}</span></div>
                </div>
                {paymentData.checkoutUrl && (
                  <a href={paymentData.checkoutUrl} target="_blank" rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 py-3 bg-accent hover:bg-accent-dark text-dark-950 font-bold rounded-xl transition-all mb-3">
                    <ExternalLink size={16} /> Open Payment Page
                  </a>
                )}
                <p className="text-[11px] text-dark-500 text-center mb-4">After payment, your VIP status will be activated automatically.</p>
                <button onClick={handleCloseCheckout} className="w-full py-3 bg-dark-800 text-white rounded-xl">Close</button>
              </>
            )}

            {/* Step: Error */}
            {checkoutStep === "error" && (
              <>
                <div className="text-center py-8">
                  <div className="w-14 h-14 bg-danger/20 rounded-full flex items-center justify-center mx-auto mb-3"><AlertCircle size={24} className="text-danger" /></div>
                  <h3 className="text-lg font-bold text-white mb-2">Payment Failed</h3>
                  <p className="text-sm text-danger">{errorMsg}</p>
                </div>
                <div className="flex gap-3">
                  <button onClick={handleCloseCheckout} className="flex-1 py-3 bg-dark-800 text-white rounded-xl">Cancel</button>
                  <button onClick={() => setCheckoutStep("customer-info")} className="flex-1 py-3 bg-accent text-dark-950 font-bold rounded-xl">Try Again</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
