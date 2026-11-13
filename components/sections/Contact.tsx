"use client";

import { useId, useRef, useState } from "react";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Button } from "@/components/ui/Button";
import { SocialIcons } from "@/components/ui/SocialIcons";
import { gsap, SplitText, useGSAP, FULL } from "@/lib/gsap";
import { contact, services } from "@/lib/site";

type Errors = Partial<Record<"name" | "email" | "message", string>>;

/**
 * 05 · Contato
 * Site estático: o formulário monta a mensagem e abre o aplicativo de e-mail
 * do visitante (mailto:), sem backend nem serviço de terceiros.
 */
export function Contact() {
  const root = useRef<HTMLElement>(null);
  const [service, setService] = useState<string>(services[0].label);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState("");
  const uid = useId();

  useGSAP(
    (_, contextSafe) => {
      let cancelled = false;
      let mm: gsap.MatchMedia | undefined;
      const build = contextSafe!(() => {
        mm = gsap.matchMedia();
        mm.add(FULL, () => {
          const el = root.current!;
          const title = el.querySelector<HTMLElement>("[data-contact-title]")!;
          const split = SplitText.create(title, { type: "lines", mask: "lines" });
          const tl = gsap.timeline({
            scrollTrigger: { trigger: el, start: "top 65%", once: true },
            defaults: { ease: "expo.out" },
          });
          tl.from(split.lines, { yPercent: 105, duration: 1.3, stagger: 0.09 })
            .from("[data-contact-fade]", { opacity: 0, y: 24, duration: 1, stagger: 0.08 }, 0.3)
            .add(() => split.revert());
        });
      });
      document.fonts.ready.then(() => !cancelled && build());
      return () => {
        cancelled = true;
        mm?.revert();
      };
    },
    { scope: root },
  );

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const org = String(data.get("org") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();

    const next: Errors = {};
    if (!name) next.name = "Informe seu nome.";
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = "Informe um e-mail válido.";
    if (!message) next.message = "Conte um pouco sobre o projeto.";
    setErrors(next);
    if (Object.keys(next).length) {
      setStatus("Revise os campos destacados.");
      const first = Object.keys(next)[0];
      e.currentTarget.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }

    if (!contact.email) {
      setStatus("[PREENCHER] E-mail de destino ainda não configurado em lib/site.ts.");
      return;
    }

    const subject = `Projeto · ${service} · ${name}`;
    const body = [
      `Nome: ${name}`,
      `E-mail: ${email}`,
      org ? `Organização: ${org}` : null,
      `Serviço: ${service}`,
      "",
      message,
    ]
      .filter((l) => l !== null)
      .join("\n");
    window.location.href = `mailto:${contact.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setStatus("Abrimos seu aplicativo de e-mail com a mensagem pronta. É só enviar.");
  };

  const field =
    "peer w-full border-0 border-b border-grafite/20 bg-transparent px-0 pb-3 pt-2 text-[1.0625rem] text-grafite placeholder:text-grafite/35 transition-colors focus:border-petroleo focus:outline-none focus-visible:outline-none aria-[invalid=true]:border-b-2 aria-[invalid=true]:border-grafite";
  const label = "text-label uppercase tracking-[var(--tracking-label)] text-petroleo";

  return (
    <section
      ref={root}
      id="contato"
      data-tone="light"
      aria-labelledby="contato-titulo"
      className="relative z-10 bg-creme text-grafite"
    >
      <div className="container-site grid grid-cols-1 gap-16 py-24 lg:grid-cols-12 lg:gap-x-8 lg:py-36">
        {/* Chamada + canais diretos */}
        <div className="lg:col-span-5">
          <SectionLabel index="05" id="contato-titulo">
            Contato
          </SectionLabel>
          <p
            data-contact-title
            className="mt-8 font-display text-[clamp(2.75rem,1.6rem+4.4vw,6rem)] font-medium uppercase leading-[0.92]"
          >
            Conte o que <br className="hidden sm:block" />
            você <span className="text-petroleo">precisa.</span>
          </p>
          <p data-contact-fade className="mt-6 max-w-[34ch] text-lead text-grafite/70">
            Respondemos com os próximos passos e, se fizer sentido, marcamos uma conversa.
          </p>

          <dl data-contact-fade className="mt-12 grid gap-6 text-[1.0625rem]">
            <div>
              <dt className={label}>E-mail</dt>
              <dd className="mt-2 font-medium">
                {contact.email ? (
                  <a href={`mailto:${contact.email}`} className="underline-offset-4 hover:underline">
                    {contact.email}
                  </a>
                ) : (
                  "[PREENCHER]"
                )}
              </dd>
            </div>
            <div>
              <dt className={label}>Onde estamos</dt>
              <dd className="mt-2 font-medium">EEL-USP · {contact.location}</dd>
            </div>
          </dl>
          <div data-contact-fade className="mt-8 -ml-2.5 text-grafite">
            <SocialIcons />
          </div>
        </div>

        {/* Formulário */}
        <form
          data-contact-fade
          noValidate
          onSubmit={onSubmit}
          className="grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:col-span-6 lg:col-start-7 lg:pt-20"
        >
          <fieldset className="sm:col-span-2">
            <legend className={label}>Serviço</legend>
            <div className="mt-4 flex flex-wrap gap-2">
              {services.map((s) => (
                <label key={s.index} className="cursor-pointer">
                  <input
                    type="radio"
                    name="service"
                    value={s.label}
                    checked={service === s.label}
                    onChange={() => setService(s.label)}
                    className="peer sr-only"
                  />
                  <span className="inline-flex h-10 items-center rounded-full bg-grafite/[0.06] px-4 text-[0.875rem] font-medium transition-colors duration-300 hover:bg-grafite/10 peer-checked:bg-grafite peer-checked:text-creme peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-turquesa">
                    {s.label}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          {(
            [
              { name: "name", label: "Nome", type: "text", auto: "name", required: true },
              { name: "email", label: "E-mail", type: "email", auto: "email", required: true },
              { name: "org", label: "Empresa ou organização", type: "text", auto: "organization", required: false },
            ] as const
          ).map((f) => (
            <div key={f.name} className={f.name === "org" ? "sm:col-span-2" : ""}>
              <label htmlFor={`${uid}-${f.name}`} className={label}>
                {f.label}
                {!f.required && <span className="normal-case tracking-normal text-grafite/45"> (opcional)</span>}
              </label>
              <input
                id={`${uid}-${f.name}`}
                name={f.name}
                type={f.type}
                autoComplete={f.auto}
                required={f.required}
                aria-invalid={Boolean(errors[f.name as keyof Errors])}
                aria-describedby={errors[f.name as keyof Errors] ? `${uid}-${f.name}-err` : undefined}
                className={field}
              />
              {errors[f.name as keyof Errors] && (
                <p id={`${uid}-${f.name}-err`} className="mt-2 text-sm font-semibold text-grafite">
                  {errors[f.name as keyof Errors]}
                </p>
              )}
            </div>
          ))}

          <div className="sm:col-span-2">
            <label htmlFor={`${uid}-message`} className={label}>
              Sobre o projeto
            </label>
            <textarea
              id={`${uid}-message`}
              name="message"
              rows={4}
              required
              aria-invalid={Boolean(errors.message)}
              aria-describedby={errors.message ? `${uid}-message-err` : undefined}
              className={`${field} resize-none`}
            />
            {errors.message && (
              <p id={`${uid}-message-err`} className="mt-2 text-sm font-semibold text-grafite">
                {errors.message}
              </p>
            )}
          </div>

          <div className="flex flex-col items-start gap-4 sm:col-span-2">
            <Button type="submit">Enviar mensagem</Button>
            <p role="status" aria-live="polite" className="min-h-[1.5em] text-sm text-grafite/70">
              {status}
            </p>
          </div>
        </form>
      </div>
    </section>
  );
}
