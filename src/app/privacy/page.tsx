import { Shield, Eye, Cookie, Lock, UserCheck } from "lucide-react";

export const metadata = {
  title: "Privacy Policy",
  description: "DramaFlix Privacy Policy - How we handle your data.",
};

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="mb-8">
        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
          <Shield size={32} className="text-primary" />
        </div>
        <h1 className="text-3xl font-extrabold text-white mb-2">Privacy Policy</h1>
        <p className="text-sm text-dark-400">Last updated: June 2025</p>
      </div>

      <div className="space-y-6">
        <section className="p-6 bg-dark-800 border border-dark-700 rounded-2xl">
          <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2"><Eye size={20} className="text-accent" /> Information We Collect</h2>
          <p className="text-sm text-dark-300 leading-relaxed mb-3">We may collect the following information when you use DramaFlix:</p>
          <ul className="space-y-2 text-sm text-dark-300">
            <li>• Account information (name, email address)</li>
            <li>• Usage data (watching history, preferences, device information)</li>
            <li>• Log data (IP address, browser type, pages visited)</li>
            <li>• Payment information (processed securely through third-party providers)</li>
          </ul>
        </section>

        <section className="p-6 bg-dark-800 border border-dark-700 rounded-2xl">
          <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2"><Lock size={20} className="text-accent" /> How We Use Your Information</h2>
          <p className="text-sm text-dark-300 leading-relaxed mb-3">We use collected information to:</p>
          <ul className="space-y-2 text-sm text-dark-300">
            <li>• Provide and improve our streaming services</li>
            <li>• Personalize your viewing experience and recommendations</li>
            <li>• Process payments and manage subscriptions</li>
            <li>• Send service-related communications</li>
            <li>• Detect and prevent fraud or abuse</li>
          </ul>
        </section>

        <section className="p-6 bg-dark-800 border border-dark-700 rounded-2xl">
          <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2"><Cookie size={20} className="text-accent" /> Cookies</h2>
          <p className="text-sm text-dark-300 leading-relaxed">
            We use cookies and similar technologies to enhance your experience, remember your preferences,
            and analyze site traffic. You can control cookie preferences through your browser settings.
          </p>
        </section>

        <section className="p-6 bg-dark-800 border border-dark-700 rounded-2xl">
          <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2"><UserCheck size={20} className="text-accent" /> Your Rights</h2>
          <p className="text-sm text-dark-300 leading-relaxed">
            You have the right to access, update, or delete your personal information at any time.
            Contact us at <strong className="text-white">privacy@dramaflix.com</strong> for any data-related requests.
          </p>
        </section>
      </div>
    </div>
  );
}
