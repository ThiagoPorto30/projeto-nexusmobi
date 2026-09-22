"use client";
import { createContext, useContext, useState, type ReactNode } from "react";
import type { LeadSelection } from "@/lib/leads";
interface LeadContextValue {
  selection: LeadSelection;
  select: (selection: LeadSelection) => void;
}
const LeadContext = createContext<LeadContextValue | null>(null);
export function LeadProvider({ children }: { children: ReactNode }) {
  const [selection, select] = useState<LeadSelection>({
    intent: "test-ride",
    bikeId: "",
  });
  return (
    <LeadContext.Provider value={{ selection, select }}>
      {children}
    </LeadContext.Provider>
  );
}
export function useLead() {
  const context = useContext(LeadContext);
  if (!context) throw new Error("LeadProvider is required.");
  return context;
}
