import { FileText, AlertTriangle, CheckCircle, Clock } from "lucide-react";

export const metadata = {
  title: "Terms of Service",
  description: "DramaFlix Terms of Service.",
};

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="mb-8">
        <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mb-4">
          <FileText size={32} className="text-accent" />
        </div>
        <h1 className="text-3xl font-extrabold text-white mb-2">Terms of Service</h1>
        <p className="text-sm text-dark-400">Last updated: June 2025</p>
      </div>

      <div className="space-y-6">
        <section className="p-6 bg-dark-800 border border-dark-700 rounded-2xl">
          <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2"><CheckCircle size={20} className="text-accent" /> Acceptance of Terms</h2>
          <p className="text-sm text-dark-300 leading-relaxed">
            By accessing or using DramaFlix, you agree to be bound by these Terms of Service. If you do not agree
            with any part of these terms, you must not use our service. We reserve the right to modify these terms
            at any time.
          </p>
        </section>

        <section className="p-6 bg-dark-800 border border-dark-700 rounded-2xl">
          <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2"><Clock size={20} className="text-accent" /> Service Description</h2>
          <p className="text-sm text-dark-300 leading-relaxed">
            DramaFlix is a streaming platform that aggregates and provides access to short drama content from
            various third-party providers. We do not produce, host, or store any video content on our own servers.
          </p>
        </section>

        <section className="p-6 bg-dark-800 border border-dark-700 rounded-2xl">
          <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2"><AlertTriangle size={20} className="text-accent" /> User Conduct</h2>
          <p className="text-sm text-dark-300 leading-relaxed mb-3">You agree not to:</p>
          <ul className="space-y-2 text-sm text-dark-300">
            <li>• Use the service for any illegal purpose</li>
            <li>• Attempt to gain unauthorized access to our systems</li>
            <li>• Share your account credentials with others</li>
            <li>• Use automated tools to scrape or download content</li>
            <li>• Distribute malware or malicious code through our platform</li>
          </ul>
        </section>

        <section className="p-6 bg-dark-800 border border-dark-700 rounded-2xl">
          <h2 className="text-lg font-bold text-white mb-3">Subscriptions & Payments</h2>
          <p className="text-sm text-dark-300 leading-relaxed">
            VIP subscriptions are billed according to the selected plan. Refunds are available within 24 hours of purchase
            if no VIP content was accessed. Prices may change with 30 days advance notice.
          </p>
        </section>

        <section className="p-6 bg-dark-800 border border-dark-700 rounded-2xl">
          <h2 className="text-lg font-bold text-white mb-3">Limitation of Liability</h2>
          <p className="text-sm text-dark-300 leading-relaxed">
            DramaFlix is provided &ldquo;as is&rdquo; without warranties of any kind. We are not liable for any indirect,
            incidental, or consequential damages arising from the use of our service.
          </p>
        </section>
      </div>
    </div>
  );
}
