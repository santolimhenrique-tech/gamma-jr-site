"use client";

import { useRef, useState } from "react";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { serviceVisuals } from "@/components/sections/services/ServiceVisuals";
import { gsap, ScrollTrigger, useGSAP, FULL } from "@/lib/gsap";

const items = [
  {
    index: "01",
    title: "Sites institucionais",
    text: "Sites sob medida que apresentam sua organização com clareza e funcionam bem em qualquer tela.",
    scope: ["Design de interface", "Desenvolvimento", "Publicação"],
  },
  {
    index: "02",
    title: "Dashboards em Power BI",
    text: "Painéis que reúnem seus dados em indicadores claros, prontos para apoiar decisões.",
    scope: ["Modelagem de dados", "Indicadores", "Painéis interativos"],
  },
  {
    index: "03",
    title: "Identidade visual",
    text: "Marcas consistentes, do logotipo às aplicações, com regras claras de uso.",
    scope: ["Logotipo", "Paleta e tipografia", "Manual de marca"],
  },
  {
    index: "04",
    title: "Capacitações",
    text: "Treinamentos práticos em ferramentas digitais para equipes e estudantes.",
    scope: ["Conteúdo sob medida", "Prática guiada", "Material de apoio"],
  },
] as const;

/**
 * 02 · Serviços
 * Ao entrar, o painel grafite se expande até as bordas (o creme da seção
 * anterior "recua"). No desktop, o serviço ativo acompanha o scroll e um
 * painel fixo mostra a miniatura animada correspondente; no celular, cada
 * miniatura aparece logo abaixo do seu serviço.
 */
export function Services() {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);

  useGSAP(
    () => {
      const el = root.current!;
      const articles = gsap.utils.toArray<HTMLElement>("[data-service]", el);

      // Serviço ativo = o que cruza o centro da tela (vale também em reduced-motion).
      articles.forEach((a, i) => {
        ScrollTrigger.create({
          trigger: a,
          start: "top 55%",
          end: "bottom 55%",
          onToggle: (self) => self.isActive && setActive(i),
        });
      });

      const mm = gsap.matchMedia();
      mm.add(FULL, () => {
        gsap.fromTo(
          "[data-services-bg]",
          { clipPath: "inset(0% 3.5% 0% 3.5% round 2.5rem)" },
          {
            clipPath: "inset(0% 0% 0% 0% round 0rem)",
            ease: "none",
            scrollTrigger: { trigger: el, start: "top bottom", end: "top 15%", scrub: true },
          },
        );
        gsap.from("[data-services-head] > *", {
          opacity: 0,
          y: 24,
          duration: 1.1,
          ease: "expo.out",
          stagger: 0.08,
          scrollTrigger: { trigger: el, start: "top 70%", once: true },
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id="servicos"
      data-tone="dark"
      aria-labelledby="servicos-titulo"
      className="relative z-10 bg-creme text-creme"
    >
      <div data-services-bg aria-hidden className="absolute inset-0 bg-grafite" />

      <div className="container-site relative pb-16 pt-24 lg:pb-24 lg:pt-36">
        <div data-services-head className="max-w-3xl">
          <SectionLabel index="02" id="servicos-titulo" tone="dark">
            Serviços
          </SectionLabel>
          <p className="mt-8 font-display text-title font-medium uppercase">
            Quatro frentes, <span className="text-turquesa">um mesmo método.</span>
          </p>
        </div>

        <div className="mt-12 lg:mt-8 lg:grid lg:grid-cols-12 lg:gap-x-8">
          {/* Lista */}
          <ol className="lg:col-span-6">
            {items.map((item, i) => {
              const Visual = serviceVisuals[i];
              const isActive = active === i;
              return (
                <li
                  key={item.index}
                  data-service
                  className="flex flex-col justify-center py-12 lg:min-h-[78vh] lg:py-16"
                >
                  <article
                    className={`transition-opacity duration-700 ease-[var(--ease-expo)] lg:opacity-30 ${
                      isActive ? "lg:opacity-100" : ""
                    }`}
                  >
                    <span className="font-display text-sm tracking-[0.18em] text-turquesa">
                      {item.index}
                    </span>
                    <h3 className="mt-3 font-display text-[clamp(2.25rem,1.4rem+3vw,4.25rem)] font-medium uppercase leading-[0.95]">
                      {item.title}
                    </h3>
                    <p className="mt-5 max-w-[38ch] text-lead text-areia/75">{item.text}</p>
                    <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-[0.8125rem] uppercase tracking-[0.14em] text-creme/55">
                      {item.scope.map((s) => (
                        <li key={s} className="flex items-center gap-2">
                          <span aria-hidden className="size-1 rounded-full bg-turquesa" />
                          {s}
                        </li>
                      ))}
                    </ul>
                  </article>

                  {/* Miniatura inline (celular/tablet) */}
                  <div
                    data-active={isActive}
                    className="group mt-10 aspect-[4/3] w-full overflow-hidden rounded-[1.25rem] bg-preto/35 lg:hidden"
                  >
                    <Visual />
                  </div>
                </li>
              );
            })}
          </ol>

          {/* Painel fixo (desktop) */}
          <div className="hidden lg:col-span-6 lg:block">
            <div className="sticky top-[11vh] flex h-[78vh] items-center">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[1.5rem] bg-preto/35">
                {serviceVisuals.map((Visual, i) => (
                  <div
                    key={i}
                    data-active={active === i}
                    aria-hidden
                    className="group absolute inset-0 opacity-0 transition-opacity duration-500 data-[active=true]:opacity-100"
                  >
                    <Visual />
                  </div>
                ))}
                <p
                  aria-hidden
                  className="absolute bottom-5 right-6 font-display text-xs tracking-[0.18em] text-creme/40"
                >
                  {items[active].index} / 04
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
