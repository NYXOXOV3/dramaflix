"use client";

import { usePathname } from "next/navigation";
import { DataStoreProvider } from "@/lib/data-store";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export function ClientProviders({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  return (
    <DataStoreProvider>
      {isAdmin ? (
        // Admin pages render without Navbar/Footer (admin layout handles its own shell)
        <>{children}</>
      ) : (
        // Public pages get Navbar + Footer
        <>
          <Navbar />
          <main className="flex-1 pt-16">{children}</main>
          <Footer />
        </>
      )}
    </DataStoreProvider>
  );
}
