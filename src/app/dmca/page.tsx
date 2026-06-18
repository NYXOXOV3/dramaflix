import { Shield, AlertTriangle, FileText, Mail } from "lucide-react";

export const metadata = {
  title: "DMCA & Copyright",
  description: "DramaFlix DMCA and copyright policy.",
};

export default function DmcaPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="mb-8">
        <div className="w-16 h-16 bg-danger/10 rounded-2xl flex items-center justify-center mb-4">
          <Shield size={32} className="text-danger" />
        </div>
        <h1 className="text-3xl font-extrabold text-white mb-2">DMCA & Copyright Policy</h1>
        <p className="text-sm text-dark-400">Last updated: June 2025</p>
      </div>

      <div className="prose prose-invert max-w-none space-y-6">
        <section className="p-6 bg-dark-800 border border-dark-700 rounded-2xl">
          <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2"><AlertTriangle size={20} className="text-accent" /> Respect for Intellectual Property</h2>
          <p className="text-sm text-dark-300 leading-relaxed">
            DramaFlix respects the intellectual property rights of others and expects its users to do the same.
            We will respond to notices of alleged copyright infringement that comply with applicable law and are
            properly provided to us.
          </p>
        </section>

        <section className="p-6 bg-dark-800 border border-dark-700 rounded-2xl">
          <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2"><FileText size={20} className="text-accent" /> DMCA Takedown Notices</h2>
          <p className="text-sm text-dark-300 leading-relaxed mb-3">
            If you believe that your copyrighted work has been copied in a way that constitutes copyright infringement
            and is accessible through our service, please provide our Copyright Agent with the following information:
          </p>
          <ul className="space-y-2 text-sm text-dark-300">
            <li>• A physical or electronic signature of the copyright owner or authorized agent</li>
            <li>• Identification of the copyrighted work claimed to have been infringed</li>
            <li>• Identification of the material that is claimed to be infringing</li>
            <li>• Contact information (address, telephone number, email)</li>
            <li>• A statement that the complaining party has a good faith belief the use is unauthorized</li>
            <li>• A statement, under penalty of perjury, that the information is accurate</li>
          </ul>
        </section>

        <section className="p-6 bg-dark-800 border border-dark-700 rounded-2xl">
          <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2"><Mail size={20} className="text-accent" /> Contact</h2>
          <p className="text-sm text-dark-300 leading-relaxed">
            For copyright-related inquiries, please contact us at: <strong className="text-white">dmca@dramaflix.com</strong>
          </p>
        </section>

        <section className="p-6 bg-dark-800 border border-dark-700 rounded-2xl">
          <h2 className="text-lg font-bold text-white mb-3">Content Disclaimer</h2>
          <p className="text-sm text-dark-300 leading-relaxed">
            DramaFlix is a content aggregator platform. We do not host, store, or distribute any video content on our servers.
            All content is provided by third-party sources. We are not responsible for the content available through these sources.
          </p>
        </section>
      </div>
    </div>
  );
}
