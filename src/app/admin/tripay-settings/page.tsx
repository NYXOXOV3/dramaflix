"use client";

import { useState, useEffect } from "react";
import { CreditCard, Save, TestTube, Loader2, Check, AlertCircle, Eye, EyeOff, Zap, RefreshCw, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

const TRIPAY_CONFIG_KEY = "dramaflix_tripay_config";

interface TriPayConfig {
  apiKey: string;
  privateKey: string;
  merchantCode: string;
  mode: "sandbox" | "production";
}

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

export default function TriPaySettingsPage() {
  const [config, setConfig] = useState<TriPayConfig>({ apiKey: "", privateKey: "", merchantCode: "", mode: "sandbox" });
  const [showKeys, setShowKeys] = useState(false);
  const [saved, setSaved] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [channels, setChannels] = useState<PaymentChannel[]>([]);
  const [channelsLoading, setChannelsLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // Test transaction state
  const [testTxLoading, setTestTxLoading] = useState(false);
  const [testTxResult, setTestTxResult] = useState<{ success: boolean; data?: Record<string, unknown>; error?: string } | null>(null);
  const [testForm, setTestForm] = useState({ method: "BRIVA", amount: "10000", customerName: "Test User", customerEmail: "test@example.com" });

  useEffect(() => {
    const stored = localStorage.getItem(TRIPAY_CONFIG_KEY);
    if (stored) {
      try { setConfig(JSON.parse(stored)); } catch { /* ignore */ }
    }
  }, []);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSave = () => {
    localStorage.setItem(TRIPAY_CONFIG_KEY, JSON.stringify(config));
    setSaved(true);
    showToast("TriPay configuration saved!");
    setTimeout(() => setSaved(false), 3000);
  };

  const handleTest = async () => {
    if (!config.apiKey) { showToast("API Key is required", "error"); return; }
    setTesting(true);
    setTestResult(null);
    setChannelsLoading(true);
    try {
      const params = new URLSearchParams({
        action: "test",
        apiKey: config.apiKey,
        mode: config.mode,
      });
      const res = await fetch(`/api/tripay?${params}`);
      const data = await res.json();
      setTestResult({ success: data.success, message: data.success ? data.message : data.error });
      if (data.success && data.channels) {
        setChannels(data.channels);
      }
    } catch {
      setTestResult({ success: false, message: "Network error" });
    }
    setTesting(false);
    setChannelsLoading(false);
  };

  const handleTestTransaction = async () => {
    if (!config.apiKey || !config.privateKey || !config.merchantCode) {
      showToast("All credentials required for test transaction", "error");
      return;
    }
    setTestTxLoading(true);
    setTestTxResult(null);
    try {
      const res = await fetch("/api/tripay?action=create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          method: testForm.method,
          amount: parseInt(testForm.amount),
          customerName: testForm.customerName,
          customerEmail: testForm.customerEmail,
          planName: "Test Transaction",
          apiKey: config.apiKey,
          privateKey: config.privateKey,
          merchantCode: config.merchantCode,
          mode: config.mode,
        }),
      });
      const data = await res.json();
      setTestTxResult(data);
    } catch {
      setTestTxResult({ success: false, error: "Network error" });
    }
    setTestTxLoading(false);
  };

  // Group channels by group name
  const groupedChannels = channels.reduce<Record<string, PaymentChannel[]>>((acc, ch) => {
    if (!acc[ch.group]) acc[ch.group] = [];
    acc[ch.group].push(ch);
    return acc;
  }, {});

  return (
    <div className="max-w-4xl space-y-6">
      {toast && (
        <div className={cn("fixed top-4 right-4 z-[60] flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg animate-slide-up text-sm font-medium",
          toast.type === "success" ? "bg-success/20 text-success border border-success/30" : "bg-danger/20 text-danger border border-danger/30")}>
          {toast.type === "success" ? <Check size={16} /> : <AlertCircle size={16} />}{toast.message}
        </div>
      )}

      <div>
        <h1 className="text-2xl font-extrabold text-white flex items-center gap-2"><CreditCard size={24} className="text-accent" /> TriPay Settings</h1>
        <p className="text-sm text-dark-400 mt-1">Configure TriPay payment gateway for VIP subscriptions. Get credentials at <a href="https://tripay.co.id/member" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">tripay.co.id</a></p>
      </div>

      {/* Configuration */}
      <div className="bg-dark-900 border border-dark-800 rounded-2xl p-6 space-y-4">
        <h2 className="text-sm font-bold text-white flex items-center gap-2"><Shield size={16} className="text-accent" /> API Credentials</h2>

        <div>
          <label className="block text-xs font-medium text-dark-300 mb-1.5">Mode</label>
          <div className="flex gap-2">
            {(["sandbox", "production"] as const).map((mode) => (
              <button key={mode} onClick={() => setConfig({ ...config, mode })}
                className={cn("flex-1 py-2.5 rounded-xl text-sm font-medium transition-all border",
                  config.mode === mode ? "bg-accent text-dark-950 border-accent font-bold" : "bg-dark-800 text-dark-300 border-dark-700 hover:border-dark-600")}>
                {mode === "sandbox" ? "🧪 Sandbox (Testing)" : "🚀 Production (Live)"}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-dark-300 mb-1.5">API Key</label>
          <div className="relative">
            <input type={showKeys ? "text" : "password"} value={config.apiKey}
              onChange={(e) => setConfig({ ...config, apiKey: e.target.value })}
              className="w-full bg-dark-800 border border-dark-700 rounded-xl pl-4 pr-12 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-accent"
              placeholder="Enter API Key" />
            <button onClick={() => setShowKeys(!showKeys)} className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-500 hover:text-white">
              {showKeys ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-dark-300 mb-1.5">Private Key</label>
          <input type={showKeys ? "text" : "password"} value={config.privateKey}
            onChange={(e) => setConfig({ ...config, privateKey: e.target.value })}
            className="w-full bg-dark-800 border border-dark-700 rounded-xl px-4 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-accent"
            placeholder="Enter Private Key" />
        </div>

        <div>
          <label className="block text-xs font-medium text-dark-300 mb-1.5">Merchant Code</label>
          <input type={showKeys ? "text" : "password"} value={config.merchantCode}
            onChange={(e) => setConfig({ ...config, merchantCode: e.target.value })}
            className="w-full bg-dark-800 border border-dark-700 rounded-xl px-4 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-accent"
            placeholder="e.g. T0001" />
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button onClick={handleSave}
            className="flex items-center gap-2 px-5 py-2.5 bg-accent hover:bg-accent-dark text-dark-950 font-bold text-sm rounded-xl transition-all">
            {saved ? <Check size={16} /> : <Save size={16} />}
            {saved ? "Saved!" : "Save Configuration"}
          </button>
          <button onClick={handleTest} disabled={testing || !config.apiKey}
            className="flex items-center gap-2 px-5 py-2.5 bg-dark-700 hover:bg-dark-600 disabled:opacity-50 text-white text-sm font-medium rounded-xl transition-all">
            {testing ? <Loader2 size={16} className="animate-spin" /> : <TestTube size={16} />}
            {testing ? "Testing..." : "Test Connection"}
          </button>
        </div>

        {testResult && (
          <div className={cn("flex items-start gap-2 p-3 rounded-xl text-sm",
            testResult.success ? "bg-success/10 border border-success/20 text-success" : "bg-danger/10 border border-danger/20 text-danger")}>
            {testResult.success ? <Check size={16} className="shrink-0 mt-0.5" /> : <AlertCircle size={16} className="shrink-0 mt-0.5" />}
            {testResult.message}
          </div>
        )}
      </div>

      {/* Payment Channels */}
      {channels.length > 0 && (
        <div className="bg-dark-900 border border-dark-800 rounded-2xl p-6">
          <h2 className="text-sm font-bold text-white flex items-center gap-2 mb-4"><Zap size={16} className="text-accent" /> Available Payment Channels ({channels.length})</h2>
          {Object.entries(groupedChannels).map(([group, chs]) => (
            <div key={group} className="mb-4">
              <h3 className="text-xs font-semibold text-dark-400 uppercase tracking-wider mb-2">{group}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {chs.map((ch) => (
                  <div key={ch.code} className="flex items-center gap-2 p-2 bg-dark-800 rounded-lg">
                    {ch.icon && <img src={ch.icon} alt="" className="w-6 h-6 rounded object-contain" />}
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium text-white truncate">{ch.name}</p>
                      <p className="text-[10px] text-dark-500">Rp {ch.feeFlat.toLocaleString()} fee</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Test Transaction */}
      <div className="bg-dark-900 border border-dark-800 rounded-2xl p-6 space-y-4">
        <h2 className="text-sm font-bold text-white flex items-center gap-2"><RefreshCw size={16} className="text-accent" /> Test Transaction</h2>
        <p className="text-xs text-dark-400">Create a test transaction to verify your TriPay integration works correctly.</p>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-dark-300 mb-1.5">Payment Method</label>
            <select value={testForm.method} onChange={(e) => setTestForm({ ...testForm, method: e.target.value })}
              className="w-full bg-dark-800 border border-dark-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-accent">
              {channels.length > 0 ? channels.map((ch) => (
                <option key={ch.code} value={ch.code}>{ch.name} ({ch.code})</option>
              )) : (
                <>
                  <option value="BRIVA">BRI Virtual Account</option>
                  <option value="BCAVA">BCA Virtual Account</option>
                  <option value="MANDIRIVA">Mandiri Virtual Account</option>
                  <option value="BNIVA">BNI Virtual Account</option>
                  <option value="PERMATAVA">Permata Virtual Account</option>
                  <option value="ALFAMART">Alfamart</option>
                  <option value="INDOMARET">Indomaret</option>
                </>
              )}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-dark-300 mb-1.5">Amount (IDR)</label>
            <input type="number" value={testForm.amount} onChange={(e) => setTestForm({ ...testForm, amount: e.target.value })}
              className="w-full bg-dark-800 border border-dark-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-accent" min={10000} />
          </div>
          <div>
            <label className="block text-xs font-medium text-dark-300 mb-1.5">Customer Name</label>
            <input type="text" value={testForm.customerName} onChange={(e) => setTestForm({ ...testForm, customerName: e.target.value })}
              className="w-full bg-dark-800 border border-dark-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-accent" />
          </div>
          <div>
            <label className="block text-xs font-medium text-dark-300 mb-1.5">Customer Email</label>
            <input type="email" value={testForm.customerEmail} onChange={(e) => setTestForm({ ...testForm, customerEmail: e.target.value })}
              className="w-full bg-dark-800 border border-dark-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-accent" />
          </div>
        </div>

        <button onClick={handleTestTransaction} disabled={testTxLoading || !config.apiKey || !config.privateKey}
          className="flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary-dark disabled:opacity-50 text-white text-sm font-bold rounded-xl transition-all">
          {testTxLoading ? <Loader2 size={16} className="animate-spin" /> : <Zap size={16} />}
          {testTxLoading ? "Creating..." : "Create Test Transaction"}
        </button>

        {testTxResult && (
          <div className={cn("p-4 rounded-xl text-sm",
            testTxResult.success ? "bg-success/10 border border-success/20" : "bg-danger/10 border border-danger/20")}>
            {testTxResult.success ? (
              <div className="space-y-2">
                <p className="text-success font-bold flex items-center gap-1"><Check size={14} /> Transaction Created!</p>
                <div className="text-xs text-dark-300 space-y-1 font-mono">
                  <p>Reference: {(testTxResult.data as Record<string, string>)?.reference}</p>
                  <p>Merchant Ref: {(testTxResult.data as Record<string, string>)?.merchantRef}</p>
                  <p>Pay Code: {(testTxResult.data as Record<string, string>)?.payCode}</p>
                  <p>Status: {(testTxResult.data as Record<string, string>)?.status}</p>
                  {(testTxResult.data as Record<string, string>)?.checkoutUrl && (
                    <a href={(testTxResult.data as Record<string, string>)?.checkoutUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      Open Checkout URL →
                    </a>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-danger flex items-center gap-1"><AlertCircle size={14} /> {testTxResult.error}</p>
            )}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="bg-dark-900 border border-dark-800 rounded-2xl p-6 space-y-3">
        <h2 className="text-sm font-bold text-white">Setup Guide</h2>
        <ol className="space-y-2 text-xs text-dark-400 list-decimal list-inside">
          <li>Create account at <a href="https://tripay.co.id" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">tripay.co.id</a></li>
          <li>Go to <strong>API & Integrasi → Simulator → Merchant → Detail</strong> for sandbox credentials</li>
          <li>Copy API Key, Private Key, and Merchant Code</li>
          <li>Paste credentials above and select mode</li>
          <li>Click <strong>Test Connection</strong> to verify</li>
          <li>Create a test transaction to verify full flow</li>
          <li>Switch to <strong>Production</strong> mode when ready for live payments</li>
        </ol>
        <div className="p-3 bg-accent/10 border border-accent/20 rounded-xl">
          <p className="text-xs text-accent"><strong>Callback URL:</strong> Set your callback URL in TriPay merchant settings to <code className="bg-dark-800 px-1.5 py-0.5 rounded">https://yourdomain.com/api/tripay?action=callback</code></p>
        </div>
      </div>
    </div>
  );
}
