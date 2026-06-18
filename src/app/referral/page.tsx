import Link from "next/link";
import { Gift, Users, CheckCircle, ArrowRight } from "lucide-react";

export const metadata = {
  title: "Referral Program",
  description: "Invite friends to DramaFlix and earn rewards.",
};

export default function ReferralPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="text-center mb-12">
        <div className="w-20 h-20 bg-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Gift size={36} className="text-accent" />
        </div>
        <h1 className="text-3xl font-extrabold text-white mb-3">Referral Program</h1>
        <p className="text-dark-400 max-w-lg mx-auto">
          Invite your friends to DramaFlix and both of you earn rewards. The more you invite, the more you earn!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {[
          { step: 1, icon: Users, title: "Share Your Link", desc: "Share your unique referral link with friends via social media, email, or messaging." },
          { step: 2, icon: CheckCircle, title: "Friend Signs Up", desc: "Your friend creates a free DramaFlix account using your referral link." },
          { step: 3, icon: Gift, title: "Both Earn Rewards", desc: "You get 3 free VIP days and your friend gets a 10% discount on their first VIP plan." },
        ].map(({ step, icon: Icon, title, desc }) => (
          <div key={step} className="p-6 bg-dark-800 border border-dark-700 rounded-2xl text-center">
            <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-accent font-bold text-lg">{step}</span>
            </div>
            <Icon size={24} className="text-accent mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
            <p className="text-sm text-dark-400">{desc}</p>
          </div>
        ))}
      </div>

      <div className="p-8 bg-gradient-to-br from-accent/10 to-dark-800 border border-accent/20 rounded-2xl text-center">
        <h2 className="text-xl font-extrabold text-white mb-3">Ready to Start Earning?</h2>
        <p className="text-sm text-dark-300 mb-6">Create a free account to get your referral link and start inviting friends.</p>
        <Link
          href="/register"
          className="inline-flex items-center gap-2 px-8 py-3 bg-accent hover:bg-accent-dark text-dark-950 font-bold rounded-xl transition-all"
        >
          Get Started <ArrowRight size={18} />
        </Link>
      </div>
    </div>
  );
}
