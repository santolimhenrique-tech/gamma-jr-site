"use client";

import { useRef } from "react";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";

// Proposta de processo — validar com a Gamma Jr. antes da publicação.
const steps = [
  {
    index: "01",
    title: "Diagnóstico",
    text: "Entendemos o contexto, os objetivos e as restrições do projeto.",
    result: "Escopo definido",
  },
  {
    index: "02",
    title: "Proposta",
    text: "Apresentamos solução, prazo e investimento antes de começar.",
    result: "Proposta aprovada",
  },
  {
    index: "03",
    title: "Desenvolvimento",
    text: "Execução em ciclos curtos, com validação a cada etapa.",
    result: "Versões revisadas",
  },
  {
    index: "04",
    title: "Entrega",
    text: "Publicação, documentação e orientação para o uso no dia a dia.",
    result: "Projeto em uso",
  },
] as const;

const HORIZONTAL = "(min-width: 1024px) and (prefers-reduced-motion: no-preference)";
const VERTICAL = "(max-width: 1023.98px) and (prefers-reduced-motion: no-preference)";

/**
 * 03 · Como trabalhamos
 * Desktop: a seção fixa e a trilha de etapas corre na horizontal com o scroll;
 * a linha de progresso acende cada etapa ao passar.
 * Celular: trilha vertical que se desenha conforme o scroll.
 * Reduced-motion: layout estático em grade (sem fixar, sem deslocamento).
 */
export function Process() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = root.current!;
      const track = el.querySelector<HTMLElement>("[data-process-track]")!;
      const fill = el.querySelector<HTMLElement>("[data-process-fill]")!;
      const items = gsap.utils.toArray<HTMLElement>("[data-step]", el);
      const mm = gsap.matchMedia();

      mm.add(HORIZONTAL, () => {
        track.dataset.horizontal = "true";
        const distance = () => Math.max(0, track.scrollWidth - window.innerWidth);

        const tween = gsap.to(track, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.8,
            invalidateOnRefresh: true,
          },
        });

        gsap.fromTo(
          fill,
          { scaleX: 0 },
          {
            scaleX: 1,
            ease: "none",
            scrollTrigger: {
              trigger: fill.parentElement,
              containerAnimation: tween,
              start: "left 75%",
              end: "right 75%",
              scrub: true,
            },
          },
        );

        items.forEach((item) => {
          ScrollTrigger.create({
            trigger: item,
            containerAnimation: tween,
            start: "left 75%",
            toggleClass: { targets: item, className: "is-reached" },
          });
          gsap.from(item.querySelectorAll("[data-step-anim]"), {
            opacity: 0,
            y: 30,
            stagger: 0.08,
            duration: 1,
            ease: "expo.out",
            scrollTrigger: { trigger: item, containerAnimation: tween, start: "left 85%" },
          });
        });

        ScrollTrigger.refresh();
        return () => {
          delete track.dataset.horizontal;
          gsap.set(track, { clearProps: "transform" });
        };
      });

      mm.add(VERTICAL, () => {
        gsap.fromTo(
          fill,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: {
              trigger: fill.parentElement,
              start: "top 65%",
              end: "bottom 65%",
              scrub: true,
            },
          },
        );
        items.forEach((item) => {
          ScrollTrigger.create({
            trigger: item,
            start: "top 65%",
            toggleClass: { targets: item, className: "is-reached" },
          });
          gsap.from(item.querySelectorAll("[data-step-anim]"), {
            opacity: 0,
            y: 24,
            stagger: 0.08,
            duration: 1,
            ease: "expo.out",
            scrollTrigger: { trigger: item, start: "top 85%", once: true },
          });
        });
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id="como-trabalhamos"
      data-tone="light"
      aria-labelledby="como-trabalhamos-titulo"
      className="relative z-10 overflow-hidden bg-areia text-grafite"
    >
      <div
        data-process-track
        className="group/track container-site grid grid-cols-1 gap-16 py-24 lg:grid-cols-12 lg:gap-x-8 lg:py-36 data-[horizontal=true]:flex data-[horizontal=true]:h-svh data-[horizontal=true]:w-max data-[horizontal=true]:max-w-none data-[horizontal=true]:items-center data-[horizontal=true]:gap-[7vw] data-[horizontal=true]:py-0 data-[horizontal=true]:pr-[10vw] data-[horizontal=true]:will-change-transform"
      >
        {/* Cabeçalho */}
        <header className="lg:col-span-4 group-data-[horizontal=true]/track:w-[30vw] group-data-[horizontal=true]/track:shrink-0">
          <SectionLabel index="03" id="como-trabalhamos-titulo">
            Como trabalhamos
          </SectionLabel>
          <p className="mt-8 font-display text-title font-medium uppercase">
            Do diagnóstico <span className="text-petroleo">à entrega.</span>
          </p>
          <p className="mt-6 max-w-[34ch] text-lead text-grafite/70">
            Etapas claras, com você acompanhando cada decisão.
          </p>
        </header>

        {/* Trilha */}
        <ol className="relative grid grid-cols-1 gap-14 pl-12 lg:col-span-8 lg:grid-cols-2 lg:gap-x-12 lg:gap-y-16 lg:pl-0 group-data-[horizontal=true]/track:flex group-data-[horizontal=true]/track:gap-[5vw] group-data-[horizontal=true]/track:pt-14">
          {/* Linha de progresso */}
          <span
            aria-hidden
            className="absolute bottom-3 left-[7px] top-3 w-px bg-grafite/15 lg:hidden group-data-[horizontal=true]/track:left-0 group-data-[horizontal=true]/track:right-0 group-data-[horizontal=true]/track:top-[7px] group-data-[horizontal=true]/track:bottom-auto group-data-[horizontal=true]/track:block group-data-[horizontal=true]/track:h-px group-data-[horizontal=true]/track:w-auto"
          >
            <span
              data-process-fill
              className="absolute inset-0 origin-top bg-petroleo group-data-[horizontal=true]/track:origin-left"
            />
          </span>

          {steps.map((step) => (
            <li
              key={step.index}
              data-step
              className="group/step relative group-data-[horizontal=true]/track:w-[26vw] group-data-[horizontal=true]/track:max-w-[26rem] group-data-[horizontal=true]/track:shrink-0"
            >
              <span
                aria-hidden
                className="absolute -left-12 top-5 size-3.5 rounded-full border border-petroleo/40 bg-areia transition-[background-color,border-color,transform] duration-500 ease-[var(--ease-expo)] lg:hidden group-[.is-reached]/step:scale-110 group-[.is-reached]/step:border-petroleo group-[.is-reached]/step:bg-petroleo group-data-[horizontal=true]/track:-top-14 group-data-[horizontal=true]/track:left-0 group-data-[horizontal=true]/track:block"
              />
              <p
                data-step-anim
                aria-hidden
                className="font-display text-[clamp(3.5rem,2.6rem+3.5vw,6.5rem)] font-medium leading-none text-petroleo"
              >
                {step.index}
              </p>
              <h3
                data-step-anim
                className="mt-4 font-display text-[clamp(1.5rem,1.2rem+1vw,2.1rem)] font-medium uppercase tracking-[0.02em]"
              >
                {step.title}
              </h3>
              <p data-step-anim className="mt-3 max-w-[32ch] text-[1.0625rem] leading-relaxed text-grafite/75">
                {step.text}
              </p>
              <p
                data-step-anim
                className="mt-5 text-label leading-relaxed uppercase tracking-[var(--tracking-label)] text-petroleo"
              >
                Resultado · <span className="text-grafite">{step.result}</span>
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
