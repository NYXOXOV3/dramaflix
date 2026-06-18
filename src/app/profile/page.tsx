"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useData } from "@/lib/data-store";
import SecureImageUpload from "@/components/SecureImageUpload";
import { User, Mail, Save, Check, AlertCircle, LogOut, Crown, Film, Star, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

const USER_SESSION_KEY = "dramaflix_user_session";
const PROFILES_KEY = "dramaflix_user_profiles";

interface UserProfile {
  email: string;
  name: string;
  avatar?: string;
  bio?: string;
  vipPlan?: string;
  vipExpiry?: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const { movies } = useData();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [form, setForm] = useState({ name: "", bio: "", avatar: "" });

  useEffect(() => {
    try {
      const sessionRaw = localStorage.getItem(USER_SESSION_KEY);
      if (!sessionRaw) { router.replace("/login"); return; }
      const session = JSON.parse(sessionRaw);
      if (!session?.email) { router.replace("/login"); return; }

      // Load profile data
      const profilesRaw = localStorage.getItem(PROFILES_KEY);
      const profiles: Record<string, UserProfile> = profilesRaw ? JSON.parse(profilesRaw) : {};
      const profile = profiles[session.email] || { email: session.email, name: session.name };
      setUser(profile);
      setForm({ name: profile.name, bio: profile.bio || "", avatar: profile.avatar || "" });
    } catch { router.replace("/login"); }
    setLoading(false);
  }, [router]);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSave = () => {
    if (!user || !form.name.trim()) return;
    setSaving(true);

    const updatedProfile: UserProfile = {
      ...user,
      name: form.name.trim(),
      bio: form.bio.trim(),
      avatar: form.avatar,
    };

    // Save profile
    const profilesRaw = localStorage.getItem(PROFILES_KEY);
    const profiles: Record<string, UserProfile> = profilesRaw ? JSON.parse(profilesRaw) : {};
    profiles[user.email] = updatedProfile;
    localStorage.setItem(PROFILES_KEY, JSON.stringify(profiles));

    // Update session name
    const sessionRaw = localStorage.getItem(USER_SESSION_KEY);
    if (sessionRaw) {
      const session = JSON.parse(sessionRaw);
      session.name = updatedProfile.name;
      localStorage.setItem(USER_SESSION_KEY, JSON.stringify(session));
      window.dispatchEvent(new Event("dramaflix:auth-changed"));
    }

    setUser(updatedProfile);
    showToast("Profile updated successfully!");
    setSaving(false);
  };

  const handleLogout = () => {
    localStorage.removeItem(USER_SESSION_KEY);
    window.dispatchEvent(new Event("dramaflix:auth-changed"));
    router.push("/");
  };

  if (loading) return <div className="max-w-2xl mx-auto px-4 py-12 text-dark-400">Loading...</div>;
  if (!user) return null;

  // Count user's rated movies
  const ratingsRaw = localStorage.getItem("dramaflix_ratings");
  const ratings: Record<string, Array<{ userId: string }>> = ratingsRaw ? JSON.parse(ratingsRaw) : {};
  const ratedCount = Object.values(ratings).filter(arr => arr.some(r => r.userId?.includes(user.email.split("@")[0]))).length;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      {toast && (
        <div className={cn("fixed top-4 right-4 z-[60] flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg animate-slide-up text-sm font-medium",
          toast.type === "success" ? "bg-success/20 text-success border border-success/30" : "bg-danger/20 text-danger border border-danger/30")}>
          {toast.type === "success" ? <Check size={16} /> : <AlertCircle size={16} />}{toast.message}
        </div>
      )}

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold text-white flex items-center gap-2"><User size={24} className="text-accent" /> My Profile</h1>
        <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 text-danger text-sm hover:bg-danger/10 rounded-xl transition-all">
          <LogOut size={16} /> Sign Out
        </button>
      </div>

      {/* Profile Card */}
      <div className="bg-dark-900 border border-dark-800 rounded-2xl p-6 space-y-6">
        <SecureImageUpload
          value={form.avatar}
          onChange={(v) => setForm({ ...form, avatar: v })}
          label="Profile Picture"
        />

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-dark-300 mb-1.5">Full Name</label>
            <div className="relative">
              <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-500" />
              <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full bg-dark-800 border border-dark-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-accent" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-dark-300 mb-1.5">Email</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-500" />
              <input type="email" value={user.email} disabled
                className="w-full bg-dark-800/50 border border-dark-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-dark-400 cursor-not-allowed" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-dark-300 mb-1.5">Bio</label>
            <textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} rows={3}
              className="w-full bg-dark-800 border border-dark-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-accent resize-none"
              placeholder="Tell us about yourself..." />
          </div>
        </div>

        <button onClick={handleSave} disabled={saving || !form.name.trim()}
          className="flex items-center gap-2 px-6 py-2.5 bg-accent hover:bg-accent-dark disabled:opacity-50 text-dark-950 font-bold text-sm rounded-xl transition-all">
          {saving ? "Saving..." : <><Save size={16} /> Save Changes</>}
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-dark-900 border border-dark-800 rounded-2xl p-4 text-center">
          <Film size={20} className="text-accent mx-auto mb-2" />
          <p className="text-xl font-extrabold text-white">{ratedCount}</p>
          <p className="text-xs text-dark-400">Rated</p>
        </div>
        <div className="bg-dark-900 border border-dark-800 rounded-2xl p-4 text-center">
          <Star size={20} className="text-accent mx-auto mb-2" />
          <p className="text-xl font-extrabold text-white">{user.vipPlan || "Free"}</p>
          <p className="text-xs text-dark-400">Plan</p>
        </div>
        <div className="bg-dark-900 border border-dark-800 rounded-2xl p-4 text-center">
          <Clock size={20} className="text-accent mx-auto mb-2" />
          <p className="text-xl font-extrabold text-white">{user.vipExpiry || "—"}</p>
          <p className="text-xs text-dark-400">Expires</p>
        </div>
      </div>

      {/* Quick Links */}
      <div className="bg-dark-900 border border-dark-800 rounded-2xl p-4 space-y-2">
        <h3 className="text-sm font-bold text-white mb-2">Quick Links</h3>
        <Link href="/subscription" className="flex items-center gap-3 px-4 py-3 text-dark-300 hover:bg-dark-800 hover:text-white rounded-xl transition-all">
          <Crown size={16} className="text-accent" /> My Subscription
        </Link>
        <Link href="/vip" className="flex items-center gap-3 px-4 py-3 text-dark-300 hover:bg-dark-800 hover:text-white rounded-xl transition-all">
          <Crown size={16} className="text-accent" /> Upgrade VIP
        </Link>
      </div>
    </div>
  );
}
