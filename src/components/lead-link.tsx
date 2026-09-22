"use client";
import type { ReactNode } from "react";
import { useLead } from "./lead-context";
import type { LeadSelection } from "@/lib/leads";
interface Props extends Partial<LeadSelection> {
  children: ReactNode;
  className?: string;
  onNavigate?: () => void;
}
export function LeadLink({
  children,
  className,
  intent = "test-ride",
  bikeId = "",
  onNavigate,
}: Props) {
  const { select } = useLead();
  return (
    <a
      href="#contato"
      className={className}
      onClick={() => {
        select({ intent, bikeId });
        onNavigate?.();
        document.getElementById("lead-title")?.focus({ preventScroll: true });
      }}
    >
      {children}
    </a>
  );
}
