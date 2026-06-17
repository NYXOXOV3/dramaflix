"use client";

import { useState } from "react";
import { Users, Search, MoreVertical, Shield, Crown, Ban, Mail } from "lucide-react";
import { cn } from "@/lib/utils";

const mockUsers = [
  { id: "u1", name: "Budi Santoso", email: "budi@email.com", plan: "VIP Sultan", status: "active", joinedAt: "2025-01-15", lastLogin: "2025-06-15" },
  { id: "u2", name: "Sari Dewi", email: "sari@email.com", plan: "VIP Lifetime", status: "active", joinedAt: "2025-02-20", lastLogin: "2025-06-14" },
  { id: "u3", name: "Andi Pratama", email: "andi@email.com", plan: null, status: "active", joinedAt: "2025-03-10", lastLogin: "2025-06-12" },
  { id: "u4", name: "Maya Putri", email: "maya@email.com", plan: "VIP Lite", status: "active", joinedAt: "2025-04-05", lastLogin: "2025-06-10" },
  { id: "u5", name: "Rizky Fauzan", email: "rizky@email.com", plan: "VIP Master", status: "active", joinedAt: "2025-01-30", lastLogin: "2025-06-15" },
  { id: "u6", name: "Lina Marlina", email: "lina@email.com", plan: null, status: "banned", joinedAt: "2025-05-12", lastLogin: "2025-05-20" },
  { id: "u7", name: "Dimas Arya", email: "dimas@email.com", plan: "VIP Sultan", status: "active", joinedAt: "2025-03-22", lastLogin: "2025-06-13" },
  { id: "u8", name: "Putri Handayani", email: "putri@email.com", plan: null, status: "active", joinedAt: "2025-06-01", lastLogin: "2025-06-15" },
];

export default function AdminUsersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterPlan, setFilterPlan] = useState("all");

  const filtered = mockUsers.filter((u) => {
    const matchSearch = u.name.toLowerCase().includes(searchQuery.toLowerCase()) || u.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchPlan = filterPlan === "all" || (filterPlan === "free" ? !u.plan : u.plan?.toLowerCase().includes(filterPlan));
    return matchSearch && matchPlan;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-white">Users</h1>
        <p className="text-sm text-dark-400">{mockUsers.length} registered users</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex items-center bg-dark-800 border border-dark-700 rounded-xl px-3 py-2 flex-1">
          <Search size={16} className="text-dark-500 mr-2 shrink-0" />
          <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search users by name or email..."
            className="bg-transparent text-sm text-white placeholder:text-dark-500 focus:outline-none w-full" />
        </div>
        <div className="flex gap-1 bg-dark-800 border border-dark-700 rounded-xl p-1">
          {["all", "free", "lite", "sultan", "master", "lifetime"].map((f) => (
            <button key={f} onClick={() => setFilterPlan(f)}
              className={cn("px-3 py-1.5 text-xs font-medium rounded-lg transition-all capitalize",
                filterPlan === f ? "bg-accent text-dark-950 font-bold" : "text-dark-400 hover:text-white hover:bg-dark-700")}>
              {f}
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
                <th className="text-left px-4 py-3 text-xs font-semibold text-dark-400 uppercase hidden lg:table-cell">Joined</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-dark-400 uppercase hidden lg:table-cell">Last Login</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-dark-400 uppercase">Status</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-dark-400 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-800">
              {filtered.map((user) => (
                <tr key={user.id} className="hover:bg-dark-800/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-dark-700 rounded-full flex items-center justify-center shrink-0">
                        <span className="text-sm font-bold text-dark-300">{user.name.charAt(0)}</span>
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-white truncate">{user.name}</p>
                        <p className="text-[11px] text-dark-500">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    {user.plan ? (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-accent/10 text-accent text-xs font-medium rounded-lg">
                        <Crown size={12} /> {user.plan}
                      </span>
                    ) : (
                      <span className="px-2 py-1 bg-dark-800 text-dark-400 text-xs rounded-lg">Free</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-dark-300 hidden lg:table-cell">{user.joinedAt}</td>
                  <td className="px-4 py-3 text-sm text-dark-300 hidden lg:table-cell">{user.lastLogin}</td>
                  <td className="px-4 py-3">
                    <span className={cn("px-2 py-1 text-xs font-medium rounded-lg",
                      user.status === "active" ? "bg-success/10 text-success" : "bg-danger/10 text-danger")}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button className="p-1.5 hover:bg-dark-700 rounded-lg text-dark-400 hover:text-primary transition-colors" title="Email">
                        <Mail size={15} />
                      </button>
                      <button className="p-1.5 hover:bg-dark-700 rounded-lg text-dark-400 hover:text-accent transition-colors" title="Edit role">
                        <Shield size={15} />
                      </button>
                      <button className="p-1.5 hover:bg-dark-700 rounded-lg text-dark-400 hover:text-danger transition-colors" title="Ban">
                        <Ban size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
