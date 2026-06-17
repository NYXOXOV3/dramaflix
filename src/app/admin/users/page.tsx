"use client";

import { useState } from "react";
import { Search, Shield, Crown, Ban, Mail, X, Check, AlertCircle, UserCheck, UserX, Save } from "lucide-react";
import { cn } from "@/lib/utils";

interface MockUser {
  id: string; name: string; email: string; plan: string | null; status: "active" | "banned";
  joinedAt: string; lastLogin: string;
}

const initialUsers: MockUser[] = [
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
  const [users, setUsers] = useState<MockUser[]>(initialUsers);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterPlan, setFilterPlan] = useState("all");
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [editUser, setEditUser] = useState<MockUser | null>(null);
  const [editForm, setEditForm] = useState({ name: "", email: "", plan: "" });

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const filtered = users.filter((u: MockUser) => {
    const matchSearch = u.name.toLowerCase().includes(searchQuery.toLowerCase()) || u.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchPlan = filterPlan === "all" || (filterPlan === "free" ? !u.plan : u.plan?.toLowerCase().includes(filterPlan));
    return matchSearch && matchPlan;
  });

  const handleBan = (user: MockUser) => {
    setUsers((prev: MockUser[]) => prev.map((u: MockUser) => u.id === user.id ? { ...u, status: u.status === "banned" ? "active" as const : "banned" as const } : u));
    showToast(`${user.name} has been ${user.status === "banned" ? "unbanned" : "banned"}.`, user.status === "banned" ? "success" : "error");
  };

  const handleDelete = (user: MockUser) => {
    setUsers((prev: MockUser[]) => prev.filter((u: MockUser) => u.id !== user.id));
    showToast(`${user.name} has been removed.`, "error");
  };

  const openEdit = (user: MockUser) => {
    setEditUser(user);
    setEditForm({ name: user.name, email: user.email, plan: user.plan || "" });
  };

  const saveEdit = () => {
    if (!editUser || !editForm.name.trim() || !editForm.email.trim()) return;
    setUsers((prev: MockUser[]) => prev.map((u: MockUser) =>
      u.id === editUser.id ? { ...u, name: editForm.name, email: editForm.email, plan: editForm.plan || null } : u
    ));
    showToast(`${editForm.name}'s profile has been updated.`);
    setEditUser(null);
  };

  return (
    <div className="space-y-6">
      {toast && (
        <div className={cn("fixed top-4 right-4 z-[60] flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg animate-slide-up text-sm font-medium",
          toast.type === "success" ? "bg-success/20 text-success border border-success/30" : "bg-danger/20 text-danger border border-danger/30")}>
          {toast.type === "success" ? <Check size={16} /> : <AlertCircle size={16} />}{toast.message}
        </div>
      )}

      <div>
        <h1 className="text-2xl font-extrabold text-white">Users</h1>
        <p className="text-sm text-dark-400">{users.length} registered users</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex items-center bg-dark-800 border border-dark-700 rounded-xl px-3 py-2 flex-1">
          <Search size={16} className="text-dark-500 mr-2 shrink-0" />
          <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name or email..." className="bg-transparent text-sm text-white placeholder:text-dark-500 focus:outline-none w-full" />
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
              {filtered.map((user: MockUser) => (
                <tr key={user.id} className="hover:bg-dark-800/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className={cn("w-9 h-9 rounded-full flex items-center justify-center shrink-0",
                        user.status === "banned" ? "bg-danger/20" : "bg-dark-700")}>
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
                        <Crown size={12} />{user.plan}
                      </span>
                    ) : <span className="px-2 py-1 bg-dark-800 text-dark-400 text-xs rounded-lg">Free</span>}
                  </td>
                  <td className="px-4 py-3 text-sm text-dark-300 hidden lg:table-cell">{user.joinedAt}</td>
                  <td className="px-4 py-3 text-sm text-dark-300 hidden lg:table-cell">{user.lastLogin}</td>
                  <td className="px-4 py-3">
                    <span className={cn("inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-lg",
                      user.status === "active" ? "bg-success/10 text-success" : "bg-danger/10 text-danger")}>
                      {user.status === "active" ? <UserCheck size={12} /> : <UserX size={12} />}{user.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => openEdit(user)} className="p-1.5 hover:bg-dark-700 rounded-lg text-dark-400 hover:text-accent transition-colors" title="Edit user">
                        <Shield size={15} />
                      </button>
                      <button onClick={() => handleBan(user)}
                        className={cn("p-1.5 hover:bg-dark-700 rounded-lg transition-colors",
                          user.status === "banned" ? "text-dark-400 hover:text-success" : "text-dark-400 hover:text-danger")}
                        title={user.status === "banned" ? "Unban user" : "Ban user"}>
                        <Ban size={15} />
                      </button>
                      <button onClick={() => handleDelete(user)} className="p-1.5 hover:bg-dark-700 rounded-lg text-dark-400 hover:text-danger transition-colors" title="Delete user">
                        <Mail size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && <div className="text-center py-12 text-dark-400 text-sm">No users found.</div>}
      </div>

      {/* Edit Modal */}
      {editUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setEditUser(null)} />
          <div className="relative bg-dark-900 border border-dark-700 rounded-2xl p-6 max-w-md w-full animate-fade-in">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-white">Edit User</h3>
              <button onClick={() => setEditUser(null)} className="p-1 hover:bg-dark-800 rounded-lg text-dark-400"><X size={20} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-dark-300 mb-1.5">Full Name</label>
                <input type="text" value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full bg-dark-800 border border-dark-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-accent" />
              </div>
              <div>
                <label className="block text-xs font-medium text-dark-300 mb-1.5">Email</label>
                <input type="email" value={editForm.email} onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  className="w-full bg-dark-800 border border-dark-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-accent" />
              </div>
              <div>
                <label className="block text-xs font-medium text-dark-300 mb-1.5">VIP Plan</label>
                <select value={editForm.plan} onChange={(e) => setEditForm({ ...editForm, plan: e.target.value })}
                  className="w-full bg-dark-800 border border-dark-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-accent">
                  <option value="">No Plan (Free)</option>
                  <option value="VIP Lite">VIP Lite</option>
                  <option value="VIP Sultan">VIP Sultan</option>
                  <option value="VIP Master">VIP Master</option>
                  <option value="VIP Lifetime">VIP Lifetime</option>
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setEditUser(null)} className="flex-1 py-2.5 bg-dark-800 hover:bg-dark-700 text-white text-sm rounded-xl transition-all">Cancel</button>
                <button onClick={saveEdit} disabled={!editForm.name.trim() || !editForm.email.trim()}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-accent hover:bg-accent-dark disabled:opacity-50 text-dark-950 font-bold text-sm rounded-xl transition-all">
                  <Save size={16} />Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
