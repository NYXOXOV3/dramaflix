"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Crown, Check, Calendar, Clock, Zap, Shield, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const USER_SESSION_KEY = "dramaflix_user_session";
const PROFILES_KEY = "dramaflix_user_profiles";

interface SubscriptionInfo {
  plan: string;
  startDate: string;
  expiryDate: string;
  status: "active" | "expired" | "none";
  features: string[];
}

const plans: Record<string, { features: string[]; duration: string }> = {
  "VIP Lite": { features: ["Ad-Free", "HD Quality", "Limited Providers", "3 Devices"], duration: "7 days" },
  "VIP Sultan": { features: ["Ad-Free", "HD Quality", "All Movies", "Limited Providers", "3 Devices"], duration: "1 month" },
  "VIP Master": { features: ["Ad-Free", "HD Quality", "All Movies", "All Providers", "4 Devices", "Priority Support"], duration: "6 months" },
  "VIP Lifetime": { features: ["Ad-Free", "HD & 4K", "All Movies", "All Providers", "6 Devices", "Priority Support", "Early Access", "Family Sharing"], duration: "Forever" },
};

export default function SubscriptionPage() {
  const router = useRouter();
  const [sub, setSub] = useState<SubscriptionInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const sessionRaw = localStorage.getItem(USER_SESSION_KEY);
      if (!sessionRaw) { router.replace("/login"); return; }
      const session = JSON.parse(sessionRaw);
      if (!session?.email) { router.replace("/login"); return; }

      const profilesRaw = localStorage.getItem(PROFILES_KEY);
      const profiles: Record<string, { vipPlan?: string; vipExpiry?: string }> = profilesRaw ? JSON.parse(profilesRaw) : {};
      const profile = profiles[session.email];

      if (profile?.vipPlan) {
        const planInfo = plans[profile.vipPlan];
        setSub({
          plan: profile.vipPlan,
          startDate: "—",
          expiryDate: profile.vipExpiry || (profile.vipPlan === "VIP Lifetime" ? "Never" : "—"),
          status: profile.vipExpiry === "Never" ? "active" : profile.vipExpiry ? "active" : "active",
          features: planInfo?.features || [],
        });
      } else {
        setSub({ plan: "Free", startDate: "—", expiryDate: "—", status: "none", features: ["Basic Access", "SD Quality", "Limited Content", "1 Device", "With Ads"] });
      }
    } catch { router.replace("/login"); }
    setLoading(false);
  }, [router]);

  if (loading) return <div className="max-w-2xl mx-auto px-4 py-12 text-dark-400">Loading...</div>;
  if (!sub) return null;

  const isActive = sub.status === "active";
  const isLifetime = sub.plan === "VIP Lifetime";

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      <h1 className="text-2xl font-extrabold text-white flex items-center gap-2"><Crown size={24} className="text-accent" /> My Subscription</h1>

      {/* Current Plan */}
      <div className={cn("bg-dark-900 border rounded-2xl p-6", isActive ? "border-accent/40" : "border-dark-800")}>
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-xs text-dark-400 uppercase tracking-wider mb-1">Current Plan</p>
            <h2 className={cn("text-2xl font-extrabold", isActive ? "text-accent" : "text-white")}>{sub.plan}</h2>
          </div>
          <span className={cn("px-3 py-1 rounded-full text-xs font-bold",
            isActive ? "bg-success/20 text-success" : "bg-dark-800 text-dark-400")}>
            {isActive ? "Active" : "No Plan"}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="p-3 bg-dark-800/50 rounded-xl">
            <p className="text-[11px] text-dark-500 flex items-center gap-1"><Calendar size={10} /> Duration</p>
            <p className="text-sm font-bold text-white mt-1">{plans[sub.plan]?.duration || "—"}</p>
          </div>
          <div className="p-3 bg-dark-800/50 rounded-xl">
            <p className="text-[11px] text-dark-500 flex items-center gap-1"><Clock size={10} /> Expires</p>
            <p className="text-sm font-bold text-white mt-1">{sub.expiryDate}</p>
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold text-dark-400 uppercase tracking-wider mb-3">Features</p>
          <div className="space-y-2">
            {sub.features.map((f) => (
              <div key={f} className="flex items-center gap-2 text-sm">
                <Check size={14} className={isActive ? "text-success" : "text-dark-500"} />
                <span className={isActive ? "text-dark-200" : "text-dark-400"}>{f}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Upgrade Options */}
      {sub.plan === "Free" && (
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-white">Upgrade Your Plan</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {Object.entries(plans).map(([name, info]) => (
              <Link key={name} href="/vip"
                className="p-4 bg-dark-900 border border-dark-800 hover:border-accent/30 rounded-xl transition-all group">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-bold text-white">{name}</p>
                  <Zap size={14} className="text-accent" />
                </div>
                <p className="text-xs text-dark-400 mb-3">{info.duration}</p>
                <div className="flex items-center gap-1 text-xs text-accent font-medium group-hover:underline">
                  View Details <ArrowRight size={12} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Manage */}
      <div className="bg-dark-900 border border-dark-800 rounded-2xl p-4 space-y-2">
        <h3 className="text-sm font-bold text-white mb-2">Manage</h3>
        <Link href="/profile" className="flex items-center gap-3 px-4 py-3 text-dark-300 hover:bg-dark-800 hover:text-white rounded-xl transition-all">
          <Shield size={16} className="text-accent" /> Edit Profile
        </Link>
        <Link href="/vip" className="flex items-center gap-3 px-4 py-3 text-dark-300 hover:bg-dark-800 hover:text-white rounded-xl transition-all">
          <Crown size={16} className="text-accent" /> {sub.plan === "Free" ? "Upgrade Plan" : "Change Plan"}
        </Link>
      </div>
    </div>
  );
}
