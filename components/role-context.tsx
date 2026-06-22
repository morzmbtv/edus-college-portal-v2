"use client";

import { createContext, useContext, useEffect, useState } from "react";

export const roles = ["Директор", "Завуч", "Куратор", "Преподаватель", "Психолог", "Кадровик", "Канцелярия"] as const;
export type Role = typeof roles[number];

type RoleContextValue = { role: Role; setRole: (role: Role) => void };
const RoleContext = createContext<RoleContextValue | null>(null);

export const roleRoutes: Record<Role, string[]> = {
  "Директор": ["/dashboard", "/college", "/admissions", "/tasks", "/ai-risks", "/compliance", "/students", "/teachers", "/schedule", "/performance", "/attendance", "/documents", "/communications", "/settings"],
  "Завуч": ["/dashboard", "/college", "/admissions", "/tasks", "/ai-risks", "/compliance", "/students", "/teachers", "/schedule", "/performance", "/attendance", "/documents"],
  "Куратор": ["/dashboard", "/tasks", "/ai-risks", "/students", "/schedule", "/performance", "/attendance", "/documents", "/communications"],
  "Преподаватель": ["/dashboard", "/tasks", "/students", "/schedule", "/performance", "/attendance"],
  "Психолог": ["/dashboard", "/tasks", "/ai-risks", "/students", "/documents"],
  "Кадровик": ["/dashboard", "/college", "/tasks", "/compliance", "/teachers", "/documents", "/settings"],
  "Канцелярия": ["/dashboard", "/college", "/admissions", "/tasks", "/compliance", "/documents"],
};

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const [role, setRoleState] = useState<Role>("Директор");
  useEffect(() => {
    const saved = window.localStorage.getItem("edus-demo-role") as Role | null;
    if (saved && roles.includes(saved)) setRoleState(saved);
  }, []);
  function setRole(next: Role) {
    setRoleState(next);
    window.localStorage.setItem("edus-demo-role", next);
  }
  return <RoleContext.Provider value={{ role, setRole }}>{children}</RoleContext.Provider>;
}

export function useRole() {
  const context = useContext(RoleContext);
  if (!context) throw new Error("useRole должен использоваться внутри RoleProvider");
  return context;
}
