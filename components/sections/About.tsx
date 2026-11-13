"use client";

import { useRef } from "react";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { gsap, ScrollTrigger, SplitText, useGSAP, FULL, motion } from "@/lib/gsap";

const facts = [
  { term: "Instituição", value: "Escola de Engenharia de Lorena · USP" },
  { term: "Sede", value: "Lorena, SP" },
  { term: "Fundação", value: "[PREENCHER]" },
] as const;

const mvv = [
  { term: "Missão", text: "[PREENCHER] Missão da Gamma Jr., em uma ou duas frases." },
  { term: "Visão", text: "[PREENCHER] Visão da Gamma Jr., em uma ou duas frases." },
  { term: "Valores", text: "[PREENCHER] Valores da Gamma Jr., em poucas palavras." },
] as const;

/**
 * 01 · Quem somos
 * Painel creme que desliza sobre a hero (sticky). A frase de apresentação
 * "acende" palavra por palavra conforme o scroll; fatos e MVV entram em sequência.
 */
export function About() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    (_, contextSafe) => {
      let cancelled = false;
      let mm: gsap.MatchMedia | undefined;

      const build = contextSafe!(() => {
        mm = gsap.matchMedia();
        mm.add(FULL, () => {
          const el = root.current!;
          const statement = el.querySelector<HTMLElement>("[data-about-statement]")!;
          const split = SplitText.create(statement, { type: "words", wordsClass: "about-word" });

          gsap.fromTo(
            split.words,
            { opacity: 0.14 },
            {
              opacity: 1,
              ease: "none",
              stagger: 0.12,
              scrollTrigger: {
                trigger: statement,
                start: "top 82%",
                end: "bottom 50%",
                scrub: true,
              },
            },
          );

          gsap.from("[data-about-label] span", {
            opacity: 0,
            x: -10,
            duration: motion.base,
            ease: motion.ease,
            stagger: 0.08,
            scrollTrigger: { trigger: el, start: "top 75%", once: true },
          });

          const items = gsap.utils.toArray<HTMLElement>("[data-about-item]", el);
          gsap.set(items, { opacity: 0, y: 28 });
          ScrollTrigger.batch(items, {
            start: "top 88%",
            once: true,
            onEnter: (batch) =>
              gsap.to(batch, {
                opacity: 1,
                y: 0,
                duration: motion.base,
                ease: motion.ease,
                stagger: 0.09,
              }),
          });

          return () => split.revert();
        });
      });

      document.fonts.ready.then(() => {
        if (!cancelled) build();
      });

      return () => {
        cancelled = true;
        mm?.revert();
      };
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id="quem-somos"
      data-tone="light"
      aria-labelledby="quem-somos-titulo"
      className="relative z-10 rounded-t-[1.75rem] bg-creme text-grafite shadow-[0_-40px_80px_-20px_rgba(0,0,0,0.45)] lg:rounded-t-[2.5rem]"
    >
      <div className="container-site grid grid-cols-1 gap-y-12 pb-24 pt-20 lg:grid-cols-12 lg:gap-x-8 lg:pb-40 lg:pt-36">
        {/* Rótulo fixo na coluna lateral (desktop) */}
        <div className="lg:col-span-3">
          <div className="lg:sticky lg:top-[calc(var(--header-h)+2.5rem)]">
            <div data-about-label>
              <SectionLabel index="01" id="quem-somos-titulo">
                Quem somos
              </SectionLabel>
            </div>
          </div>
        </div>

        <div className="lg:col-span-9">
          <p
            data-about-statement
            className="max-w-[24ch] font-sans text-[clamp(1.75rem,1rem+2.6vw,3.6rem)] font-medium leading-[1.12] tracking-[-0.02em] sm:max-w-[26ch]"
          >
            A Gamma Jr. é a empresa júnior da{" "}
            <span className="text-petroleo">Escola de Engenharia de Lorena</span>. Estudantes de
            engenharia transformando conhecimento técnico em sites, dashboards, marcas e
            capacitações para clientes reais.
          </p>

          {/* Fatos */}
          <dl className="mt-16 grid grid-cols-1 gap-y-8 sm:grid-cols-3 sm:gap-x-8 lg:mt-24">
            {facts.map((f) => (
              <div key={f.term} data-about-item>
                <dt className="text-label uppercase tracking-[var(--tracking-label)] text-petroleo">
                  {f.term}
                </dt>
                <dd className="mt-3 text-[1.0625rem] font-medium leading-snug">{f.value}</dd>
              </div>
            ))}
          </dl>

          {/* Missão, visão e valores */}
          <div className="mt-24 lg:mt-36">
            <h3 className="sr-only">
              Missão, visão e valores
            </h3>
            <dl className="flex flex-col gap-12 lg:gap-16">
              {mvv.map((item) => (
                <div
                  key={item.term}
                  data-about-item
                  className="grid grid-cols-1 gap-3 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:items-baseline md:gap-10"
                >
                  <dt className="font-display text-title font-medium uppercase text-petroleo">
                    {item.term}
                  </dt>
                  <dd className="max-w-[42ch] text-lead text-grafite/75">{item.text}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
