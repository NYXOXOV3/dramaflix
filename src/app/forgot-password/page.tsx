"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, Shield, ArrowRight, Check, AlertCircle, Loader2, Eye, EyeOff, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

const USERS_KEY = "dramaflix_users";

type Step = "email" | "otp" | "new-password" | "success";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [timer, setTimer] = useState(60);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  // OTP countdown timer
  useEffect(() => {
    if (step === "otp" && timer > 0) {
      const t = setTimeout(() => setTimer(timer - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [step, timer]);

  // Check if already logged in
  useEffect(() => {
    const stored = localStorage.getItem("dramaflix_user_session");
    if (stored) {
      try {
        const user = JSON.parse(stored);
        if (user?.email) router.replace("/");
      } catch { /* ignore */ }
    }
  }, [router]);

  const handleSendOtp = async () => {
    setError("");
    if (!email.trim()) { setError("Email is required."); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError("Please enter a valid email."); return; }

    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));

    // Check if user exists
    const usersRaw = localStorage.getItem(USERS_KEY);
    const users: Array<{ email: string }> = usersRaw ? JSON.parse(usersRaw) : [];
    const found = users.find((u) => u.email.toLowerCase() === email.toLowerCase());

    if (!found) {
      setError("No account found with this email address.");
      setLoading(false);
      return;
    }

    // Generate 6-digit OTP
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(code);
    setStep("otp");
    setTimer(60);
    setLoading(false);

    // In production, this would send an email. For demo, show it:
    console.log(`[DramaFlix] OTP for ${email}: ${code}`);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) value = value.slice(-1);
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    // Auto-focus next input
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOtp = () => {
    setError("");
    const enteredOtp = otp.join("");
    if (enteredOtp.length !== 6) { setError("Please enter all 6 digits."); return; }
    if (enteredOtp !== generatedOtp) { setError("Invalid OTP. Please try again."); return; }
    setStep("new-password");
  };

  const handleResetPassword = async () => {
    setError("");
    if (!newPassword) { setError("Password is required."); return; }
    if (newPassword.length < 8) { setError("Password must be at least 8 characters."); return; }
    if (newPassword !== confirmPassword) { setError("Passwords do not match."); return; }

    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));

    // Update password
    const usersRaw = localStorage.getItem(USERS_KEY);
    const users: Array<{ email: string; password: string; name: string }> = usersRaw ? JSON.parse(usersRaw) : [];
    const updated = users.map((u) => u.email.toLowerCase() === email.toLowerCase() ? { ...u, password: newPassword } : u);
    localStorage.setItem(USERS_KEY, JSON.stringify(updated));

    setStep("success");
    setLoading(false);
  };

  const handleResendOtp = () => {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(code);
    setOtp(["", "", "", "", "", ""]);
    setTimer(60);
    setError("");
    console.log(`[DramaFlix] New OTP for ${email}: ${code}`);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-8">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <div className="w-14 h-14 bg-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Shield size={28} className="text-accent" />
          </div>
          <h1 className="text-2xl font-extrabold text-white">Reset Password</h1>
          <p className="text-sm text-dark-400 mt-1">
            {step === "email" && "Enter your email to receive a verification code"}
            {step === "otp" && `We sent a 6-digit code to ${email}`}
            {step === "new-password" && "Create a new password for your account"}
            {step === "success" && "Your password has been reset successfully"}
          </p>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-2 justify-center">
          {["email", "otp", "new-password", "success"].map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div className={cn("w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all",
                step === s ? "bg-accent text-dark-950" :
                ["email", "otp", "new-password", "success"].indexOf(step) > i ? "bg-success text-white" : "bg-dark-800 text-dark-500")}>
                {["email", "otp", "new-password", "success"].indexOf(step) > i ? <Check size={14} /> : i + 1}
              </div>
              {i < 3 && <div className={cn("w-6 h-0.5 rounded", ["email", "otp", "new-password", "success"].indexOf(step) > i ? "bg-success" : "bg-dark-800")} />}
            </div>
          ))}
        </div>

        {error && (
          <div className="flex items-start gap-2 p-3 bg-danger/10 border border-danger/20 rounded-xl text-sm text-danger">
            <AlertCircle size={16} className="shrink-0 mt-0.5" />{error}
          </div>
        )}

        <div className="bg-dark-900 border border-dark-800 rounded-2xl p-6">
          {/* Step 1: Email */}
          {step === "email" && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-dark-300 mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-500" />
                  <input type="email" value={email} onChange={(e) => { setEmail(e.target.value); setError(""); }}
                    onKeyDown={(e) => e.key === "Enter" && handleSendOtp()}
                    className="w-full bg-dark-800 border border-dark-700 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder:text-dark-500 focus:outline-none focus:border-accent"
                    placeholder="you@example.com" />
                </div>
              </div>
              <button onClick={handleSendOtp} disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 bg-accent hover:bg-accent-dark disabled:opacity-50 text-dark-950 font-bold rounded-xl transition-all">
                {loading ? <Loader2 size={18} className="animate-spin" /> : <><Mail size={18} /> Send Verification Code</>}
              </button>
            </div>
          )}

          {/* Step 2: OTP */}
          {step === "otp" && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-dark-300 mb-3 text-center">Enter 6-digit code</label>
                <div className="flex justify-center gap-2">
                  {otp.map((digit, i) => (
                    <input key={i} ref={(el) => { otpRefs.current[i] = el; }}
                      type="text" inputMode="numeric" maxLength={1} value={digit}
                      onChange={(e) => handleOtpChange(i, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(i, e)}
                      className="w-12 h-14 text-center text-xl font-bold bg-dark-800 border border-dark-700 rounded-xl text-white focus:outline-none focus:border-accent transition-all" />
                  ))}
                </div>
              </div>

              {/* Demo OTP hint */}
              <div className="p-3 bg-primary/10 border border-primary/20 rounded-xl text-center">
                <p className="text-xs text-primary">Demo OTP: <span className="font-bold text-lg tracking-wider">{generatedOtp}</span></p>
                <p className="text-[10px] text-dark-400 mt-1">In production, this would be sent to your email</p>
              </div>

              <button onClick={handleVerifyOtp}
                className="w-full flex items-center justify-center gap-2 py-3 bg-accent hover:bg-accent-dark text-dark-950 font-bold rounded-xl transition-all">
                <ArrowRight size={18} /> Verify Code
              </button>

              <div className="flex items-center justify-between text-xs">
                <button onClick={handleResendOtp} disabled={timer > 0}
                  className="text-dark-400 hover:text-white disabled:opacity-50 flex items-center gap-1 transition-colors">
                  <RefreshCw size={12} /> Resend Code
                </button>
                <span className="text-dark-500">{timer > 0 ? `${timer}s` : "Ready"}</span>
              </div>
            </div>
          )}

          {/* Step 3: New Password */}
          {step === "new-password" && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-dark-300 mb-1.5">New Password</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-500" />
                  <input type={showPassword ? "text" : "password"} value={newPassword}
                    onChange={(e) => { setNewPassword(e.target.value); setError(""); }}
                    className="w-full bg-dark-800 border border-dark-700 rounded-xl pl-10 pr-12 py-2.5 text-sm text-white focus:outline-none focus:border-accent"
                    placeholder="Min. 8 characters" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-500 hover:text-white">
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-dark-300 mb-1.5">Confirm Password</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-500" />
                  <input type="password" value={confirmPassword}
                    onChange={(e) => { setConfirmPassword(e.target.value); setError(""); }}
                    className="w-full bg-dark-800 border border-dark-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-accent"
                    placeholder="Confirm password" />
                </div>
              </div>
              <button onClick={handleResetPassword} disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 bg-accent hover:bg-accent-dark disabled:opacity-50 text-dark-950 font-bold rounded-xl transition-all">
                {loading ? <Loader2 size={18} className="animate-spin" /> : <><Lock size={18} /> Reset Password</>}
              </button>
            </div>
          )}

          {/* Step 4: Success */}
          {step === "success" && (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-success/20 rounded-full flex items-center justify-center mx-auto">
                <Check size={32} className="text-success" />
              </div>
              <div>
                <p className="text-lg font-bold text-white">Password Reset Complete!</p>
                <p className="text-sm text-dark-400 mt-1">You can now sign in with your new password.</p>
              </div>
              <Link href="/login"
                className="inline-flex items-center gap-2 px-6 py-3 bg-accent hover:bg-accent-dark text-dark-950 font-bold rounded-xl transition-all">
                <Lock size={18} /> Sign In Now
              </Link>
            </div>
          )}
        </div>

        <p className="text-center text-sm text-dark-400">
          Remember your password? <Link href="/login" className="text-accent hover:text-accent-light font-medium">Sign In</Link>
        </p>
      </div>
    </div>
  );
}
