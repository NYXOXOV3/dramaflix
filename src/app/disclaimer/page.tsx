import { AlertTriangle, Info, ExternalLink } from "lucide-react";

export const metadata = {
  title: "Disclaimer",
  description: "DramaFlix Disclaimer.",
};

export default function DisclaimerPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="mb-8">
        <div className="w-16 h-16 bg-warning/10 rounded-2xl flex items-center justify-center mb-4">
          <AlertTriangle size={32} className="text-warning" />
        </div>
        <h1 className="text-3xl font-extrabold text-white mb-2">Disclaimer</h1>
        <p className="text-sm text-dark-400">Last updated: June 2025</p>
      </div>

      <div className="space-y-6">
        <section className="p-6 bg-dark-800 border border-dark-700 rounded-2xl">
          <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2"><Info size={20} className="text-accent" /> General Disclaimer</h2>
          <p className="text-sm text-dark-300 leading-relaxed">
            The information provided on DramaFlix is for general informational purposes only. All information
            on the site is provided in good faith, however we make no representation or warranty of any kind,
            express or implied, regarding the accuracy, adequacy, validity, reliability, availability, or
            completeness of any information on the site.
          </p>
        </section>

        <section className="p-6 bg-dark-800 border border-dark-700 rounded-2xl">
          <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2"><ExternalLink size={20} className="text-accent" /> External Links Disclaimer</h2>
          <p className="text-sm text-dark-300 leading-relaxed">
            The site may contain links to other websites or content belonging to or originating from third parties.
            Such external links are not investigated, monitored, or checked for accuracy, adequacy, validity,
            reliability, availability, or completeness by us. We do not warrant, endorse, guarantee, or assume
            responsibility for the accuracy or reliability of information offered by third-party websites.
          </p>
        </section>

        <section className="p-6 bg-dark-800 border border-dark-700 rounded-2xl">
          <h2 className="text-lg font-bold text-white mb-3">Content Disclaimer</h2>
          <p className="text-sm text-dark-300 leading-relaxed">
            DramaFlix is a content aggregation platform. We do not host, upload, or store any video files on our servers.
            All content is provided by unaffiliated third parties. We are not responsible for the content, quality,
            or availability of videos provided by external sources. If you believe any content on our platform
            infringes on your copyright, please refer to our <a href="/dmca" className="text-accent hover:text-accent-light">DMCA Policy</a>.
          </p>
        </section>

        <section className="p-6 bg-dark-800 border border-dark-700 rounded-2xl">
          <h2 className="text-lg font-bold text-white mb-3">Fair Use Disclaimer</h2>
          <p className="text-sm text-dark-300 leading-relaxed">
            We believe that our use of any copyrighted materials is protected under the fair use doctrine.
            If you believe that your copyrighted work has been used in a way that constitutes copyright infringement,
            please contact us immediately at <strong className="text-white">legal@dramaflix.com</strong>.
          </p>
        </section>
      </div>
    </div>
  );
}
