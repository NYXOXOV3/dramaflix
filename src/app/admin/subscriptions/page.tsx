"use client";

import { useState } from "react";
import { Crown, Search, Check, X, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

const mockSubscriptions = [
  { id: "s1", user: "Budi Santoso", email: "budi@email.com", plan: "VIP Sultan", amount: 65000, status: "paid", method: "QRIS", date: "2025-06-01", expiresAt: "2025-07-01" },
  { id: "s2", user: "Sari Dewi", email: "sari@email.com", plan: "VIP Lifetime", amount: 149999, status: "paid", method: "E-Wallet", date: "2025-02-20", expiresAt: "Never" },
  { id: "s3", user: "Maya Putri", email: "maya@email.com", plan: "VIP Lite", amount: 30000, status: "paid", method: "QRIS", date: "2025-06-10", expiresAt: "2025-06-17" },
  { id: "s4", user: "Rizky Fauzan", email: "rizky@email.com", plan: "VIP Master", amount: 99000, status: "paid", method: "Bank Transfer", date: "2025-04-15", expiresAt: "2025-10-15" },
  { id: "s5", user: "Dimas Arya", email: "dimas@email.com", plan: "VIP Sultan", amount: 65000, status: "pending", method: "QRIS", date: "2025-06-15", expiresAt: "-" },
  { id: "s6", user: "Unknown User", email: "test@email.com", plan: "VIP Lite", amount: 30000, status: "failed", method: "E-Wallet", date: "2025-06-14", expiresAt: "-" },
];

export default function AdminSubscriptionsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const filtered = mockSubscriptions.filter((s) => {
    const matchSearch = s.user.toLowerCase().includes(searchQuery.toLowerCase()) || s.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = filterStatus === "all" || s.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const totalRevenue = mockSubscriptions.filter((s) => s.status === "paid").reduce((sum, s) => sum + s.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Subscriptions</h1>
          <p className="text-sm text-dark-400">{mockSubscriptions.length} total transactions</p>
        </div>
        <div className="p-4 bg-dark-900 border border-dark-800 rounded-xl">
          <p className="text-xs text-dark-400">Total Revenue</p>
          <p className="text-xl font-extrabold text-accent">Rp {totalRevenue.toLocaleString()}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex items-center bg-dark-800 border border-dark-700 rounded-xl px-3 py-2 flex-1">
          <Search size={16} className="text-dark-500 mr-2 shrink-0" />
          <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by user..."
            className="bg-transparent text-sm text-white placeholder:text-dark-500 focus:outline-none w-full" />
        </div>
        <div className="flex gap-1 bg-dark-800 border border-dark-700 rounded-xl p-1">
          {["all", "paid", "pending", "failed"].map((s) => (
            <button key={s} onClick={() => setFilterStatus(s)}
              className={cn("px-3 py-1.5 text-xs font-medium rounded-lg transition-all capitalize",
                filterStatus === s ? "bg-accent text-dark-950 font-bold" : "text-dark-400 hover:text-white hover:bg-dark-700")}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
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
                <th className="text-left px-4 py-3 text-xs font-semibold text-dark-400 uppercase hidden md:table-cell">Expires</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-800">
              {filtered.map((sub) => (
                <tr key={sub.id} className="hover:bg-dark-800/50 transition-colors">
                  <td className="px-4 py-3">
                    <p className="text-sm font-semibold text-white">{sub.user}</p>
                    <p className="text-[11px] text-dark-500">{sub.email}</p>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-accent/10 text-accent text-xs font-medium rounded-lg">
                      <Crown size={12} /> {sub.plan}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-white font-medium">Rp {sub.amount.toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm text-dark-300 hidden lg:table-cell">{sub.method}</td>
                  <td className="px-4 py-3 text-sm text-dark-300 hidden lg:table-cell">{sub.date}</td>
                  <td className="px-4 py-3">
                    <span className={cn("inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-lg",
                      sub.status === "paid" ? "bg-success/10 text-success" :
                      sub.status === "pending" ? "bg-accent/10 text-accent" : "bg-danger/10 text-danger")}>
                      {sub.status === "paid" ? <Check size={12} /> : sub.status === "pending" ? <Clock size={12} /> : <X size={12} />}
                      {sub.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-dark-300 hidden md:table-cell">{sub.expiresAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
