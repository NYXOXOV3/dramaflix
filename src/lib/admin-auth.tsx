"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";

interface AdminUser {
  email: string;
  name: string;
  role: "superadmin" | "admin" | "editor";
}

interface AdminAuthContextType {
  user: AdminUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AdminAuthContext = createContext<AdminAuthContextType>({
  user: null,
  isLoading: true,
  login: async () => ({ success: false }),
  logout: () => {},
  isAuthenticated: false,
});

export function useAdminAuth() {
  return useContext(AdminAuthContext);
}

// Default admin credentials for demo
const ADMIN_ACCOUNTS: Record<string, { password: string; user: AdminUser }> = {
  "admin@dramaflix.com": {
    password: "admin123",
    user: { email: "admin@dramaflix.com", name: "Super Admin", role: "superadmin" },
  },
  "editor@dramaflix.com": {
    password: "editor123",
    user: { email: "editor@dramaflix.com", name: "Content Editor", role: "editor" },
  },
};

const STORAGE_KEY = "dramaflix_admin_session";

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as AdminUser;
        if (parsed?.email && parsed?.role) {
          setUser(parsed);
        }
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    // Simulate network delay
    await new Promise((r) => setTimeout(r, 800));

    const account = ADMIN_ACCOUNTS[email.toLowerCase()];
    if (!account) {
      return { success: false, error: "No admin account found with this email." };
    }
    if (account.password !== password) {
      return { success: false, error: "Incorrect password. Please try again." };
    }

    setUser(account.user);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(account.user));
    return { success: true };
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return (
    <AdminAuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}
