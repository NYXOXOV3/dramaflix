import { Crown, Check, Zap, Shield, Film, Monitor, Headphones, Clock } from "lucide-react";
import { vipPlans } from "@/lib/mock-data";

export const metadata = {
  title: "VIP Membership",
  description: "Upgrade to VIP for unlimited access to all dramas and movies in HD quality.",
};

export default function VipPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 text-accent text-sm font-bold rounded-full mb-4">
          <Crown size={16} /> Premium Access
        </div>
        <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-3">
          Choose Your <span className="gradient-text">VIP Plan</span>
        </h1>
        <p className="text-dark-400 max-w-xl mx-auto">
          Unlock unlimited access to 10,000+ films and dramas from 40+ providers. Ad-free, HD quality, and more.
        </p>
      </div>

      {/* Plans */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        {vipPlans.map((plan) => (
          <div
            key={plan.id}
            className={`relative rounded-2xl p-6 transition-all ${
              plan.isPopular
                ? "bg-gradient-to-b from-accent/20 to-dark-800 border-2 border-accent shadow-xl shadow-accent/10"
                : plan.isPromo
                ? "bg-gradient-to-b from-purple/15 to-dark-800 border-2 border-purple shadow-xl shadow-purple/10"
                : "bg-dark-800 border border-dark-700"
            }`}
          >
            {plan.isPopular && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-accent text-dark-950 text-xs font-bold rounded-full">
                Most Popular
              </span>
            )}
            {plan.isPromo && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-purple text-white text-xs font-bold rounded-full">
                Best Value
              </span>
            )}

            <h3 className="text-lg font-extrabold text-white mb-1">{plan.name}</h3>
            <p className="text-xs text-dark-400 mb-4">
              {plan.durationUnit === "lifetime" ? "Forever" : `${plan.duration} ${plan.durationUnit}`}
            </p>

            <div className="mb-6">
              {plan.originalPrice && (
                <span className="text-sm text-dark-500 line-through">
                  Rp {plan.originalPrice.toLocaleString()}
                </span>
              )}
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-extrabold text-white">
                  Rp {plan.price.toLocaleString()}
                </span>
              </div>
            </div>

            <ul className="space-y-3 mb-6">
              {plan.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-dark-300">
                  <Check size={16} className="text-success shrink-0 mt-0.5" />
                  {f}
                </li>
              ))}
            </ul>

            <button
              className={`w-full py-3 rounded-xl font-bold text-sm transition-all ${
                plan.isPopular
                  ? "bg-accent hover:bg-accent-dark text-dark-950 shadow-lg shadow-accent/20"
                  : plan.isPromo
                  ? "bg-purple hover:bg-purple/80 text-white"
                  : "bg-dark-700 hover:bg-dark-600 text-white"
              }`}
            >
              Get {plan.name}
            </button>
          </div>
        ))}
      </div>

      {/* Features Comparison */}
      <div className="mb-16">
        <h2 className="text-2xl font-extrabold text-white text-center mb-8">Why Go VIP?</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { icon: Zap, title: "Ad-Free", desc: "No interruptions, ever" },
            { icon: Film, title: "All Movies", desc: "10,000+ titles unlocked" },
            { icon: Monitor, title: "HD & 4K", desc: "Crystal clear quality" },
            { icon: Headphones, title: "Priority Support", desc: "24/7 dedicated help" },
            { icon: Shield, title: "Multi-Device", desc: "Watch on 3-6 devices" },
            { icon: Clock, title: "Early Access", desc: "New releases first" },
            { icon: Crown, title: "VIP Providers", desc: "Exclusive content" },
            { icon: Monitor, title: "Download", desc: "Offline viewing" },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="text-center p-4 bg-dark-800/50 rounded-2xl border border-dark-700/50">
              <Icon size={28} className="text-accent mx-auto mb-3" />
              <h4 className="text-sm font-bold text-white mb-1">{title}</h4>
              <p className="text-xs text-dark-400">{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl font-extrabold text-white text-center mb-8">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {[
            { q: "How do I activate VIP?", a: "Choose a plan, complete payment, and VIP will be activated instantly on your account." },
            { q: "Can I upgrade my plan?", a: "Yes! You can upgrade anytime and the remaining balance will be prorated." },
            { q: "What payment methods are accepted?", a: "We accept QRIS, e-wallets (GoPay, OVO, Dana), and bank transfer." },
            { q: "Is there a refund policy?", a: "Due to the digital nature of the service, refunds are available within 24 hours of purchase if no VIP content was accessed." },
            { q: "How many devices can I use?", a: "Depending on your plan, you can use 3-6 devices simultaneously." },
          ].map((faq, i) => (
            <div key={i} className="p-4 bg-dark-800/50 border border-dark-700/50 rounded-xl">
              <h4 className="text-sm font-bold text-white mb-2">{faq.q}</h4>
              <p className="text-xs text-dark-400 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
