"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import {
  ArrowUpRight,
  Check,
  CheckCircle2,
  LoaderCircle,
  LockKeyhole,
  MessageCircle,
} from "lucide-react";
import { bikes, contact, type BikeId } from "@/lib/catalog";
import {
  formatPhone,
  submitLead,
  validateLead,
  type LeadErrors,
  type LeadFields,
  type LeadIntent,
} from "@/lib/leads";
import { useLead } from "./lead-context";

const empty: LeadFields = { name: "", email: "", whatsapp: "", city: "" };
const fieldDefinitions = [
  {
    name: "name",
    label: "Nome completo",
    placeholder: "Como podemos te chamar?",
    autoComplete: "name",
    type: "text",
  },
  {
    name: "email",
    label: "E-mail",
    placeholder: "voce@exemplo.com",
    autoComplete: "email",
    type: "email",
  },
  {
    name: "whatsapp",
    label: "WhatsApp",
    placeholder: "(21) 99999-9999",
    autoComplete: "tel-national",
    type: "tel",
  },
  {
    name: "city",
    label: "Cidade",
    placeholder: "Onde você mora?",
    autoComplete: "address-level2",
    type: "text",
  },
] as const;

export function LeadCaptureSection() {
  const { selection, select } = useLead();
  const [fields, setFields] = useState<LeadFields>(empty);
  const [errors, setErrors] = useState<LeadErrors>({});
  const [status, setStatus] = useState<
    "idle" | "sending" | "success" | "error"
  >("idle");
  const [submitError, setSubmitError] = useState("");
  const busyRef = useRef(false);
  const successRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const returnToFormRef = useRef(false);

  useEffect(() => {
    if (status === "success") successRef.current?.focus();
    if (status === "idle" && returnToFormRef.current) {
      formRef.current
        ?.querySelector<HTMLInputElement>('[name="name"]')
        ?.focus();
      returnToFormRef.current = false;
    }
  }, [status]);

  function changeIntent(intent: LeadIntent) {
    select({ ...selection, intent });
  }
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busyRef.current) return;
    const nextErrors = validateLead(fields);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      const first = Object.keys(nextErrors)[0];
      formRef.current
        ?.querySelector<HTMLInputElement>(`[name="${first}"]`)
        ?.focus();
      return;
    }
    busyRef.current = true;
    setStatus("sending");
    try {
      await submitLead({ ...fields, ...selection });
      setStatus("success");
      setFields(empty);
    } catch (error: unknown) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Não foi possível enviar. Tente novamente.",
      );
      setStatus("error");
    } finally {
      busyRef.current = false;
    }
  }

  return (
    <section
      id="contato"
      className="lead-section section-space"
      aria-labelledby="lead-title"
    >
      <div className="shell lead-layout">
        <div className="lead-copy">
          <p className="eyebrow">SEU PRÓXIMO MOVIMENTO COMEÇA AQUI</p>
          <h2 id="lead-title" tabIndex={-1}>
            Bora sentir
            <br />
            essa <span>liberdade?</span>
            <ArrowUpRight className="lead-big-arrow" aria-hidden="true" />
          </h2>
          <p>
            Conte como você pretende usar sua bike. Consulte as condições para
            experimentar um modelo e tire suas dúvidas com a gente.
          </p>
          <ul>
            <li>
              <Check size={18} /> Encontre o modelo ideal para sua rotina
            </li>
            <li>
              <Check size={18} /> Atendimento de quem entende de mobilidade
            </li>
            <li>
              <Check size={18} /> Sem compromisso. Só novas possibilidades.
            </li>
          </ul>
          <a
            className="whatsapp-link"
            href={contact.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
          >
            <MessageCircle size={22} />
            <span>
              Prefere uma conversa direta?
              <strong>
                Chame no WhatsApp <ArrowUpRight size={16} />
              </strong>
            </span>
          </a>
        </div>
        <div className="lead-form-card">
          {status === "success" ? (
            <div
              className="success-panel"
              tabIndex={-1}
              ref={successRef}
              role="status"
            >
              <span
                className="t-success-check"
                data-state="in"
                aria-hidden="true"
              >
                <CheckCircle2 size={60} />
              </span>
              <p className="eyebrow">PRÓXIMA PARADA: LIBERDADE</p>
              <h3>
                Pronto para um
                <br />
                novo caminho!
              </h3>
              <p>
                Recebemos seu interesse. Nossa equipe vai conversar com você
                sobre os próximos passos.
              </p>
              <button
                className="button button-accent"
                onClick={() => {
                  returnToFormRef.current = true;
                  setStatus("idle");
                }}
              >
                Fazer outra solicitação <ArrowUpRight size={18} />
              </button>
            </div>
          ) : (
            <>
              <h3>Vamos dar o primeiro passo?</h3>
              <p className="form-intro">
                Deixe seus dados. A gente cuida do próximo movimento.
              </p>
              <form
                ref={formRef}
                onSubmit={handleSubmit}
                noValidate
                aria-busy={status === "sending"}
              >
                <fieldset
                  disabled={status === "sending"}
                  className="intent-fieldset"
                >
                  <legend className="sr-only">O que você deseja?</legend>
                  <div className="intent-options">
                    {(
                      [
                        { value: "test-ride", label: "Consultar test ride" },
                        { value: "prices", label: "Consultar preços" },
                      ] as const
                    ).map((option) => (
                      <label
                        key={option.value}
                        className={
                          selection.intent === option.value ? "selected" : ""
                        }
                      >
                        <input
                          type="radio"
                          name="intent"
                          value={option.value}
                          checked={selection.intent === option.value}
                          onChange={() => changeIntent(option.value)}
                        />
                        <span>{option.label}</span>
                      </label>
                    ))}
                  </div>
                </fieldset>
                <fieldset className="fields" disabled={status === "sending"}>
                  <legend className="sr-only">Dados de contato</legend>
                  {fieldDefinitions.map((field) => (
                    <div className="field" key={field.name}>
                      <label htmlFor={`lead-${field.name}`}>
                        {field.label}
                        <span aria-hidden="true"> *</span>
                      </label>
                      <input
                        id={`lead-${field.name}`}
                        name={field.name}
                        type={field.type}
                        inputMode={
                          field.type === "tel"
                            ? "tel"
                            : field.type === "email"
                              ? "email"
                              : "text"
                        }
                        autoComplete={field.autoComplete}
                        placeholder={field.placeholder}
                        required
                        maxLength={field.name === "whatsapp" ? 20 : 120}
                        value={fields[field.name]}
                        aria-invalid={Boolean(errors[field.name])}
                        aria-describedby={
                          errors[field.name] ? `error-${field.name}` : undefined
                        }
                        onChange={(event) => {
                          const value =
                            field.name === "whatsapp"
                              ? formatPhone(event.target.value)
                              : event.target.value;
                          setFields((previous) => ({
                            ...previous,
                            [field.name]: value,
                          }));
                          if (errors[field.name])
                            setErrors((previous) => ({
                              ...previous,
                              [field.name]: undefined,
                            }));
                        }}
                        onBlur={() =>
                          setErrors((previous) => ({
                            ...previous,
                            [field.name]: validateLead(fields)[field.name],
                          }))
                        }
                      />
                      {errors[field.name] && (
                        <p id={`error-${field.name}`} className="field-error">
                          {errors[field.name]}
                        </p>
                      )}
                    </div>
                  ))}
                  <div className="field field-full">
                    <label htmlFor="lead-bike">
                      Qual bike chamou sua atenção?{" "}
                      <span className="optional">Opcional</span>
                    </label>
                    <select
                      id="lead-bike"
                      value={selection.bikeId}
                      onChange={(event) =>
                        select({
                          ...selection,
                          bikeId: event.target.value as BikeId | "",
                        })
                      }
                    >
                      <option value="">Ainda quero descobrir</option>
                      {bikes.map((bike) => (
                        <option key={bike.id} value={bike.id}>
                          {bike.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </fieldset>
                {status === "error" && (
                  <p role="alert" className="field-error">
                    {submitError}
                  </p>
                )}
                <button
                  className="button button-accent submit-button"
                  type="submit"
                  disabled={status === "sending"}
                >
                  {status === "sending" ? (
                    <>
                      <LoaderCircle className="spinner" size={19} /> Enviando...
                    </>
                  ) : (
                    <>
                      {selection.intent === "test-ride"
                        ? "Consultar test ride"
                        : "Consultar preços"}
                      <ArrowUpRight size={19} />
                    </>
                  )}
                </button>
                <p className="privacy-note">
                  <LockKeyhole size={13} /> Seus dados serão usados para atender
                  à sua solicitação.
                </p>
              </form>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
