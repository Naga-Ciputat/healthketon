"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

export interface UserProfile {
  id: string;
  name: string;
  role: string;
  nip: string;
  branch: string;
  initial: string;
  avatarBg: string;
  avatarText: string;
  avatarBorder: string;
}

export const AVAILABLE_USERS: UserProfile[] = [
  {
    id: "usr-siti",
    name: "dr. Siti Aminah",
    role: "Verifikator Utama BPJS",
    nip: "19850412 201012 2 003",
    branch: "KCU Jakarta Pusat",
    initial: "S",
    avatarBg: "bg-blue-100",
    avatarText: "text-blue-800",
    avatarBorder: "border-blue-200",
  },
  {
    id: "usr-budi",
    name: "dr. Budi Santoso, Sp.A",
    role: "Verifikator Medis FKRTL",
    nip: "19890215 201403 1 002",
    branch: "KC Jakarta Selatan",
    initial: "B",
    avatarBg: "bg-emerald-100",
    avatarText: "text-emerald-800",
    avatarBorder: "border-emerald-200",
  },
  {
    id: "usr-hendra",
    name: "dr. Hendra Pratama",
    role: "Analis Tim PK-JKN Fraud",
    nip: "19910722 201601 1 004",
    branch: "Kantor Pusat BPJS Kesehatan",
    initial: "H",
    avatarBg: "bg-purple-100",
    avatarText: "text-purple-800",
    avatarBorder: "border-purple-200",
  },
];

interface UserContextType {
  currentUser: UserProfile;
  switchUser: (userId: string) => void;
  availableUsers: UserProfile[];
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const USER_STORAGE_KEY = "telisik_active_user_id";

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<UserProfile>(AVAILABLE_USERS[0]);

  // Load saved user on initial mount
  useEffect(() => {
    try {
      const savedId = localStorage.getItem(USER_STORAGE_KEY);
      if (savedId) {
        const found = AVAILABLE_USERS.find((u) => u.id === savedId);
        if (found) setCurrentUser(found);
      }
    } catch {
      // Ignore storage errors in SSR or restricted environments
    }
  }, []);

  const switchUser = useCallback((userId: string) => {
    const user = AVAILABLE_USERS.find((u) => u.id === userId);
    if (user) {
      setCurrentUser(user);
      try {
        localStorage.setItem(USER_STORAGE_KEY, user.id);
        // Trigger a custom event so other components or tabs can react immediately
        window.dispatchEvent(new CustomEvent("telisik:user-switched", { detail: user }));
      } catch {
        // Ignore
      }
    }
  }, []);

  return (
    <UserContext.Provider value={{ currentUser, switchUser, availableUsers: AVAILABLE_USERS }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}

