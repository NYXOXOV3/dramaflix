import { Send, MessageCircle, Users, AlertTriangle } from "lucide-react";

export const metadata = {
  title: "Contact Us",
  description: "Get in touch with the DramaFlix team for support and inquiries.",
};

export default function ContactPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-extrabold text-white mb-3">Contact Us</h1>
        <p className="text-dark-400 max-w-lg mx-auto">
          Need help? Have a suggestion? We&apos;re here for you. Reach out through any of the channels below.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Telegram Support */}
        <a
          href="https://t.me/dramaflix_support"
          target="_blank"
          rel="noopener noreferrer"
          className="group p-6 bg-dark-800 hover:bg-dark-700 border border-dark-700 hover:border-primary rounded-2xl transition-all"
        >
          <Send size={32} className="text-primary mb-4" />
          <h3 className="text-lg font-bold text-white mb-2 group-hover:text-primary transition-colors">Telegram Support</h3>
          <p className="text-sm text-dark-400">Fast response via Telegram. Usually replies within 1 hour.</p>
          <p className="text-sm text-primary mt-3 font-medium">@dramaflix_support →</p>
        </a>

        {/* Community Group */}
        <a
          href="https://t.me/dramaflix_community"
          target="_blank"
          rel="noopener noreferrer"
          className="group p-6 bg-dark-800 hover:bg-dark-700 border border-dark-700 hover:border-success rounded-2xl transition-all"
        >
          <Users size={32} className="text-success mb-4" />
          <h3 className="text-lg font-bold text-white mb-2 group-hover:text-success transition-colors">Community Group</h3>
          <p className="text-sm text-dark-400">Join our Telegram community for updates and discussions.</p>
          <p className="text-sm text-success mt-3 font-medium">Join Community →</p>
        </a>

        {/* Direct Email */}
        <a
          href="mailto:support@dramaflix.com"
          className="group p-6 bg-dark-800 hover:bg-dark-700 border border-dark-700 hover:border-accent rounded-2xl transition-all"
        >
          <MessageCircle size={32} className="text-accent mb-4" />
          <h3 className="text-lg font-bold text-white mb-2 group-hover:text-accent transition-colors">Email Support</h3>
          <p className="text-sm text-dark-400">For business inquiries and partnership requests.</p>
          <p className="text-sm text-accent mt-3 font-medium">support@dramaflix.com →</p>
        </a>

        {/* Report Error */}
        <a
          href="https://t.me/dramaflix_report"
          target="_blank"
          rel="noopener noreferrer"
          className="group p-6 bg-dark-800 hover:bg-dark-700 border border-dark-700 hover:border-danger rounded-2xl transition-all"
        >
          <AlertTriangle size={32} className="text-danger mb-4" />
          <h3 className="text-lg font-bold text-white mb-2 group-hover:text-danger transition-colors">Report Error</h3>
          <p className="text-sm text-dark-400">Found a broken link or error? Let us know so we can fix it.</p>
          <p className="text-sm text-danger mt-3 font-medium">Report Now →</p>
        </a>
      </div>

      <div className="mt-12 p-6 bg-dark-800/50 border border-dark-700 rounded-2xl">
        <h3 className="text-sm font-bold text-white mb-3">Response Time</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-success" />
            <span className="text-dark-300">Telegram: &lt; 1 hour</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-accent" />
            <span className="text-dark-300">Email: 24-48 hours</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary" />
            <span className="text-dark-300">Community: Active daily</span>
          </div>
        </div>
      </div>
    </div>
  );
}
