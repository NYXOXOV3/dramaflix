"use client";

import { useState } from "react";
import { Crown, Search, Check, X, Clock, RefreshCw, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface Subscription {
  id: string; user: string; email: string; plan: string; amount: number;
  status: "paid" | "pending" | "failed" | "refunded"; method: string; date: string; expiresAt: string;
}

const initialSubs: Subscription[] = [
  { id: "s1", user: "Budi Santoso", email: "budi@email.com", plan: "VIP Sultan", amount: 65000, status: "paid", method: "QRIS", date: "2025-06-01", expiresAt: "2025-07-01" },
  { id: "s2", user: "Sari Dewi", email: "sari@email.com", plan: "VIP Lifetime", amount: 149999, status: "paid", method: "E-Wallet", date: "2025-02-20", expiresAt: "Never" },
  { id: "s3", user: "Maya Putri", email: "maya@email.com", plan: "VIP Lite", amount: 30000, status: "paid", method: "QRIS", date: "2025-06-10", expiresAt: "2025-06-17" },
  { id: "s4", user: "Rizky Fauzan", email: "rizky@email.com", plan: "VIP Master", amount: 99000, status: "paid", method: "Bank Transfer", date: "2025-04-15", expiresAt: "2025-10-15" },
  { id: "s5", user: "Dimas Arya", email: "dimas@email.com", plan: "VIP Sultan", amount: 65000, status: "pending", method: "QRIS", date: "2025-06-15", expiresAt: "-" },
  { id: "s6", user: "Test User", email: "test@email.com", plan: "VIP Lite", amount: 30000, status: "failed", method: "E-Wallet", date: "2025-06-14", expiresAt: "-" },
];

export default function AdminSubscriptionsPage() {
  const [subs, setSubs] = useState<Subscription[]>(initialSubs);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const filtered = subs.filter((s: Subscription) => {
    const matchSearch = s.user.toLowerCase().includes(searchQuery.toLowerCase()) || s.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = filterStatus === "all" || s.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const totalRevenue = subs.filter((s: Subscription) => s.status === "paid").reduce((sum: number, s: Subscription) => sum + s.amount, 0);

  const handleApprove = (id: string) => {
    setSubs((prev: Subscription[]) => prev.map((s: Subscription) => s.id === id ? { ...s, status: "paid" as const, expiresAt: "2025-07-15" } : s));
    showToast("Subscription approved and activated.");
  };

  const handleRefund = (id: string) => {
    const sub = subs.find((s: Subscription) => s.id === id);
    setSubs((prev: Subscription[]) => prev.map((s: Subscription) => s.id === id ? { ...s, status: "refunded" as const } : s));
    showToast(`Refund processed for ${sub?.user}.`, "error");
  };

  const handleDelete = (id: string) => {
    setSubs((prev: Subscription[]) => prev.filter((s: Subscription) => s.id !== id));
    showToast("Subscription record deleted.", "error");
  };

  const statusColors: Record<string, string> = {
    paid: "bg-success/10 text-success",
    pending: "bg-accent/10 text-accent",
    failed: "bg-danger/10 text-danger",
    refunded: "bg-purple/10 text-purple",
  };

  const statusIcons: Record<string, typeof Check> = { paid: Check, pending: Clock, failed: X, refunded: RefreshCw };

  return (
    <div className="space-y-6">
      {toast && (
        <div className={cn("fixed top-4 right-4 z-[60] flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg animate-slide-up text-sm font-medium",
          toast.type === "success" ? "bg-success/20 text-success border border-success/30" : "bg-danger/20 text-danger border border-danger/30")}>
          {toast.type === "success" ? <Check size={16} /> : <AlertCircle size={16} />}{toast.message}
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Subscriptions</h1>
          <p className="text-sm text-dark-400">{subs.length} total transactions</p>
        </div>
        <div className="p-4 bg-dark-900 border border-dark-800 rounded-xl">
          <p className="text-xs text-dark-400">Total Revenue</p>
          <p className="text-xl font-extrabold text-accent">Rp {totalRevenue.toLocaleString()}</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex items-center bg-dark-800 border border-dark-700 rounded-xl px-3 py-2 flex-1">
          <Search size={16} className="text-dark-500 mr-2 shrink-0" />
          <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by user..." className="bg-transparent text-sm text-white placeholder:text-dark-500 focus:outline-none w-full" />
        </div>
        <div className="flex gap-1 bg-dark-800 border border-dark-700 rounded-xl p-1">
          {["all", "paid", "pending", "failed", "refunded"].map((s) => (
            <button key={s} onClick={() => setFilterStatus(s)}
              className={cn("px-3 py-1.5 text-xs font-medium rounded-lg transition-all capitalize",
                filterStatus === s ? "bg-accent text-dark-950 font-bold" : "text-dark-400 hover:text-white hover:bg-dark-700")}>
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-dark-900 border border-dark-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-dark-800">
                <th className="text-left px-4 py-3 text-xs font-semibold text-dark-400 uppercase">User</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-dark-400 uppercase hidden md:table-cell">Plan</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-dark-400 uppercase">Amount</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-dark-400 uppercase hidden lg:table-cell">Method</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-dark-400 uppercase hidden lg:table-cell">Date</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-dark-400 uppercase">Status</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-dark-400 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-800">
              {filtered.map((sub: Subscription) => {
                const StatusIcon = statusIcons[sub.status] || Clock;
                return (
                  <tr key={sub.id} className="hover:bg-dark-800/50 transition-colors">
                    <td className="px-4 py-3">
                      <p className="text-sm font-semibold text-white">{sub.user}</p>
                      <p className="text-[11px] text-dark-500">{sub.email}</p>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-accent/10 text-accent text-xs font-medium rounded-lg"><Crown size={12} />{sub.plan}</span>
                    </td>
                    <td className="px-4 py-3 text-sm text-white font-medium">Rp {sub.amount.toLocaleString()}</td>
                    <td className="px-4 py-3 text-sm text-dark-300 hidden lg:table-cell">{sub.method}</td>
                    <td className="px-4 py-3 text-sm text-dark-300 hidden lg:table-cell">{sub.date}</td>
                    <td className="px-4 py-3">
                      <span className={cn("inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-lg", statusColors[sub.status])}>
                        <StatusIcon size={12} />{sub.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        {sub.status === "pending" && (
                          <button onClick={() => handleApprove(sub.id)} className="px-2.5 py-1 bg-success/10 hover:bg-success/20 text-success text-xs font-medium rounded-lg transition-all">
                            Approve
                          </button>
                        )}
                        {sub.status === "paid" && (
                          <button onClick={() => handleRefund(sub.id)} className="px-2.5 py-1 bg-purple/10 hover:bg-purple/20 text-purple text-xs font-medium rounded-lg transition-all">
                            Refund
                          </button>
                        )}
                        <button onClick={() => handleDelete(sub.id)} className="p-1.5 hover:bg-dark-700 rounded-lg text-dark-400 hover:text-danger transition-colors" title="Delete record">
                          <X size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && <div className="text-center py-12 text-dark-400 text-sm">No subscriptions found.</div>}
      </div>
    </div>
  );
}
