import type { Metadata } from "next";
import "./globals.css";
import { ClientProviders } from "@/components/ClientProviders";

export const metadata: Metadata = {
  title: {
    default: "DramaFlix - Stream Short Dramas Free",
    template: "%s | DramaFlix",
  },
  description:
    "Platform streaming drama pendek terbaik. Tonton ribuan drama dari 40+ provider dengan subtitle Indonesia. Kualitas HD, update setiap hari, gratis!",
  keywords: ["drama", "short drama", "streaming", "free", "subtitle indonesia", "drama cina", "drama korea"],
  openGraph: {
    title: "DramaFlix - Stream Short Dramas Free",
    description: "Platform streaming drama pendek terbaik dengan 10,000+ film dari 40+ provider.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="dark">
      <body className="min-h-screen flex flex-col">
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
