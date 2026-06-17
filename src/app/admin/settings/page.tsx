"use client";

import { useState } from "react";
import { useAdminAuth } from "@/lib/admin-auth";
import { Save, Check, AlertCircle, Shield, Globe, Bell, Palette } from "lucide-react";
import { cn } from "@/lib/utils";

export default function AdminSettingsPage() {
  const { user } = useAdminAuth();
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [siteSettings, setSiteSettings] = useState({
    siteName: "DramaFlix",
    siteDescription: "Platform streaming drama pendek terbaik.",
    contactEmail: "support@dramaflix.com",
    telegramUrl: "https://t.me/dramaflix",
    maintenanceMode: false,
    allowRegistration: true,
    defaultLanguage: "en",
  });
  const [profileForm, setProfileForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSaveSite = () => {
    if (!siteSettings.siteName.trim()) return;
    showToast("Site settings saved successfully.");
  };

  const handleSaveProfile = () => {
    if (!profileForm.name.trim() || !profileForm.email.trim()) {
      showToast("Name and email are required.", "error");
      return;
    }
    if (profileForm.newPassword && profileForm.newPassword !== profileForm.confirmPassword) {
      showToast("Passwords do not match.", "error");
      return;
    }
    if (profileForm.newPassword && profileForm.newPassword.length < 8) {
      showToast("New password must be at least 8 characters.", "error");
      return;
    }
    showToast("Profile updated successfully.");
    setProfileForm(prev => ({ ...prev, currentPassword: "", newPassword: "", confirmPassword: "" }));
  };

  return (
    <div className="space-y-6 max-w-3xl">
      {toast && (
        <div className={cn("fixed top-4 right-4 z-[60] flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg animate-slide-up text-sm font-medium",
          toast.type === "success" ? "bg-success/20 text-success border border-success/30" : "bg-danger/20 text-danger border border-danger/30")}>
          {toast.type === "success" ? <Check size={16} /> : <AlertCircle size={16} />}{toast.message}
        </div>
      )}

      <div>
        <h1 className="text-2xl font-extrabold text-white">Settings</h1>
        <p className="text-sm text-dark-400">Manage site configuration and your profile</p>
      </div>

      {/* Site Settings */}
      <div className="bg-dark-900 border border-dark-800 rounded-2xl p-6">
        <h2 className="text-sm font-bold text-white flex items-center gap-2 mb-5"><Globe size={16} className="text-accent" /> Site Configuration</h2>
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-dark-300 mb-1.5">Site Name</label>
              <input type="text" value={siteSettings.siteName} onChange={(e) => setSiteSettings({ ...siteSettings, siteName: e.target.value })}
                className="w-full bg-dark-800 border border-dark-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-accent" />
            </div>
            <div>
              <label className="block text-xs font-medium text-dark-300 mb-1.5">Contact Email</label>
              <input type="email" value={siteSettings.contactEmail} onChange={(e) => setSiteSettings({ ...siteSettings, contactEmail: e.target.value })}
                className="w-full bg-dark-800 border border-dark-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-accent" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-dark-300 mb-1.5">Site Description</label>
            <textarea value={siteSettings.siteDescription} onChange={(e) => setSiteSettings({ ...siteSettings, siteDescription: e.target.value })} rows={2}
              className="w-full bg-dark-800 border border-dark-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-accent resize-none" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-dark-300 mb-1.5">Telegram URL</label>
              <input type="url" value={siteSettings.telegramUrl} onChange={(e) => setSiteSettings({ ...siteSettings, telegramUrl: e.target.value })}
                className="w-full bg-dark-800 border border-dark-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-accent" />
            </div>
            <div>
              <label className="block text-xs font-medium text-dark-300 mb-1.5">Default Language</label>
              <select value={siteSettings.defaultLanguage} onChange={(e) => setSiteSettings({ ...siteSettings, defaultLanguage: e.target.value })}
                className="w-full bg-dark-800 border border-dark-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-accent">
                <option value="en">English</option>
                <option value="id">Bahasa Indonesia</option>
              </select>
            </div>
          </div>
          <div className="flex flex-col gap-2 pt-1">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={siteSettings.maintenanceMode} onChange={(e) => setSiteSettings({ ...siteSettings, maintenanceMode: e.target.checked })}
                className="w-4 h-4 rounded border-dark-600 bg-dark-800 text-accent focus:ring-accent" />
              <span className="text-sm text-dark-300">Maintenance Mode</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={siteSettings.allowRegistration} onChange={(e) => setSiteSettings({ ...siteSettings, allowRegistration: e.target.checked })}
                className="w-4 h-4 rounded border-dark-600 bg-dark-800 text-accent focus:ring-accent" />
              <span className="text-sm text-dark-300">Allow User Registration</span>
            </label>
          </div>
          <button onClick={handleSaveSite}
            className="flex items-center gap-2 px-5 py-2.5 bg-accent hover:bg-accent-dark text-dark-950 font-bold text-sm rounded-xl transition-all mt-2">
            <Save size={16} /> Save Site Settings
          </button>
        </div>
      </div>

      {/* Profile Settings */}
      <div className="bg-dark-900 border border-dark-800 rounded-2xl p-6">
        <h2 className="text-sm font-bold text-white flex items-center gap-2 mb-5"><Shield size={16} className="text-primary" /> Admin Profile</h2>
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-dark-300 mb-1.5">Full Name</label>
              <input type="text" value={profileForm.name} onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                className="w-full bg-dark-800 border border-dark-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-accent" />
            </div>
            <div>
              <label className="block text-xs font-medium text-dark-300 mb-1.5">Email</label>
              <input type="email" value={profileForm.email} onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                className="w-full bg-dark-800 border border-dark-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-accent" />
            </div>
          </div>
          <div className="pt-2 border-t border-dark-800">
            <p className="text-xs font-semibold text-dark-400 uppercase tracking-wider mb-3">Change Password</p>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-dark-300 mb-1.5">Current Password</label>
                <input type="password" value={profileForm.currentPassword} onChange={(e) => setProfileForm({ ...profileForm, currentPassword: e.target.value })}
                  className="w-full bg-dark-800 border border-dark-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-accent" placeholder="Enter current password" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-dark-300 mb-1.5">New Password</label>
                  <input type="password" value={profileForm.newPassword} onChange={(e) => setProfileForm({ ...profileForm, newPassword: e.target.value })}
                    className="w-full bg-dark-800 border border-dark-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-accent" placeholder="Min 8 chars" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-dark-300 mb-1.5">Confirm Password</label>
                  <input type="password" value={profileForm.confirmPassword} onChange={(e) => setProfileForm({ ...profileForm, confirmPassword: e.target.value })}
                    className="w-full bg-dark-800 border border-dark-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-accent" placeholder="Confirm" />
                </div>
              </div>
            </div>
          </div>
          <button onClick={handleSaveProfile}
            className="flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary-dark text-white font-bold text-sm rounded-xl transition-all mt-2">
            <Save size={16} /> Save Profile
          </button>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-dark-900 border border-danger/20 rounded-2xl p-6">
        <h2 className="text-sm font-bold text-danger flex items-center gap-2 mb-3"><AlertCircle size={16} /> Danger Zone</h2>
        <p className="text-xs text-dark-400 mb-4">Irreversible actions. Proceed with caution.</p>
        <div className="flex flex-wrap gap-3">
          <button onClick={() => showToast("Cache cleared successfully.")}
            className="px-4 py-2 bg-dark-800 hover:bg-dark-700 border border-dark-700 text-white text-sm rounded-xl transition-all">
            Clear Cache
          </button>
          <button onClick={() => showToast("Database backup initiated.", "success")}
            className="px-4 py-2 bg-dark-800 hover:bg-dark-700 border border-dark-700 text-white text-sm rounded-xl transition-all">
            Backup Database
          </button>
          <button className="px-4 py-2 bg-danger/10 hover:bg-danger/20 border border-danger/30 text-danger text-sm rounded-xl transition-all">
            Reset All Data
          </button>
        </div>
      </div>
    </div>
  );
}
