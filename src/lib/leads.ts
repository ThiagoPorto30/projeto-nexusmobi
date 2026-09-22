import type { BikeId } from "./catalog";
export type LeadIntent = "test-ride" | "prices";
export interface LeadSelection {
  intent: LeadIntent;
  bikeId: BikeId | "";
}
export interface LeadFields {
  name: string;
  email: string;
  whatsapp: string;
  city: string;
}
export type LeadErrors = Partial<Record<keyof LeadFields, string>>;
export interface LeadPayload extends LeadFields, LeadSelection {}
export function validateLead(fields: LeadFields): LeadErrors {
  const errors: LeadErrors = {};
  if (fields.name.trim().split(/\s+/).filter(Boolean).length < 2)
    errors.name = "Informe seu nome e sobrenome.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email.trim()))
    errors.email = "Informe um e-mail válido.";
  const phone = fields.whatsapp.replace(/\D/g, "");
  const national =
    phone.length === 13 && phone.startsWith("55") ? phone.slice(2) : phone;
  if (!/^[1-9]{2}9\d{8}$/.test(national))
    errors.whatsapp =
      "Informe um celular com DDD, por exemplo (21) 99999-9999.";
  if (fields.city.trim().length < 2) errors.city = "Informe sua cidade.";
  return errors;
}
export function formatPhone(value: string): string {
  let digits = value.replace(/\D/g, "");
  if (digits.length > 11 && digits.startsWith("55")) digits = digits.slice(2);
  digits = digits.slice(0, 11);
  if (digits.length <= 2) return digits;
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}
/** Presentation adapter. No network, logging, storage or real scheduling.
 * Replace with a real integration and server validation before public launch. */
export async function submitLead(payload: LeadPayload): Promise<void> {
  if (Object.keys(validateLead(payload)).length)
    throw new Error("Confira os dados antes de continuar.");
  await new Promise<void>((resolve) => setTimeout(resolve, 900));
}
