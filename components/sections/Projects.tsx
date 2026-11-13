"use client";

import { useRef, useState } from "react";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { ProjectPreview } from "@/components/sections/projects/ProjectPreview";
import { gsap, useGSAP, FULL } from "@/lib/gsap";
import { projects, portfolioUrl, type Project } from "@/lib/projects";

/**
 * 04 · Projetos
 * Índice editorial (sem cards). No desktop com mouse, a prévia do projeto
 * segue o cursor sobre a lista; no celular, a prévia fica acima de cada item.
 * A palavra gigante desliza na horizontal com o scroll.
 */
export function Projects() {
  const root = useRef<HTMLElement>(null);
  const floating = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useGSAP(
    () => {
      const el = root.current!;
      const mm = gsap.matchMedia();

      mm.add(FULL, () => {
        gsap.fromTo(
          "[data-projects-word]",
          { xPercent: 4 },
          {
            xPercent: -22,
            ease: "none",
            scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
          },
        );
        gsap.from("[data-project-row]", {
          opacity: 0,
          y: 40,
          duration: 1.1,
          ease: "expo.out",
          stagger: 0.1,
          scrollTrigger: { trigger: "[data-projects-list]", start: "top 80%", once: true },
        });
      });

      // Prévia flutuante: só desktop com ponteiro fino.
      mm.add("(min-width: 1024px) and (pointer: fine)", () => {
        const box = floating.current!;
        const list = el.querySelector<HTMLElement>("[data-projects-list]")!;
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const dur = reduce ? 0 : 0.7;
        // Prévia à direita do cursor, para não cobrir o nome do projeto.
        gsap.set(box, { xPercent: 12, yPercent: -50, scale: 0.85, autoAlpha: 0 });
        const xTo = gsap.quickTo(box, "x", { duration: dur, ease: "power3.out" });
        const yTo = gsap.quickTo(box, "y", { duration: dur, ease: "power3.out" });

        // Fonte única de verdade: a posição do cursor comparada à área da lista.
        // Ao rolar (roda/trackpad/teclado) o cursor fica parado e a lista passa
        // por baixo dele sem disparar pointerleave — por isso também checamos
        // no scroll, senão a prévia fica "presa" sobre outras seções.
        const pointer = { x: -1, y: -1, known: false };
        let shown = false;
        let raf = 0;

        const show = () => {
          if (shown) return;
          shown = true;
          gsap.set(box, { x: pointer.x, y: pointer.y });
          gsap.to(box, { autoAlpha: 1, scale: 1, duration: reduce ? 0.15 : 0.5, ease: "expo.out", overwrite: "auto" });
        };
        const hide = (instant = false) => {
          if (!shown) return;
          shown = false;
          gsap.to(box, {
            autoAlpha: 0,
            scale: 0.85,
            duration: instant ? 0.12 : 0.3,
            ease: "power2.out",
            overwrite: "auto",
          });
        };

        const sync = (fromScroll: boolean) => {
          raf = 0;
          if (!pointer.known) return;
          const r = list.getBoundingClientRect();
          const inside =
            pointer.x >= r.left && pointer.x <= r.right && pointer.y >= r.top && pointer.y <= r.bottom;
          if (!inside) return hide(fromScroll);
          // Linha sob o cursor (o pointerenter das linhas também não dispara no scroll).
          const rows = list.querySelectorAll<HTMLElement>("[data-project-row]");
          rows.forEach((row, i) => {
            const rr = row.getBoundingClientRect();
            if (pointer.y >= rr.top && pointer.y <= rr.bottom) setActive(i);
          });
          show();
        };

        const onMove = (e: PointerEvent) => {
          pointer.x = e.clientX;
          pointer.y = e.clientY;
          pointer.known = true;
          xTo(e.clientX);
          yTo(e.clientY);
          sync(false);
        };
        const onScroll = () => {
          if (!raf) raf = requestAnimationFrame(() => sync(true));
        };
        const onLeaveWindow = () => {
          pointer.known = false;
          hide(true);
        };

        window.addEventListener("pointermove", onMove, { passive: true });
        window.addEventListener("scroll", onScroll, { passive: true });
        document.documentElement.addEventListener("pointerleave", onLeaveWindow);
        return () => {
          cancelAnimationFrame(raf);
          window.removeEventListener("pointermove", onMove);
          window.removeEventListener("scroll", onScroll);
          document.documentElement.removeEventListener("pointerleave", onLeaveWindow);
          gsap.set(box, { autoAlpha: 0 });
        };
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id="projetos"
      data-tone="dark"
      aria-labelledby="projetos-titulo"
      className="relative z-10 overflow-hidden bg-preto pb-24 pt-24 text-creme lg:pb-36 lg:pt-36"
    >
      <div className="container-site">
        <SectionLabel index="04" id="projetos-titulo" tone="dark">
          Projetos
        </SectionLabel>
      </div>

      <p
        data-projects-word
        aria-hidden
        className="mt-10 whitespace-nowrap pl-[4vw] font-display text-[clamp(5rem,19vw,20rem)] font-medium uppercase leading-[0.85] text-creme lg:mt-14"
      >
        Projetos <span className="text-turquesa">selecionados</span>
      </p>

      <div className="container-site mt-14 lg:mt-20">
        <p className="max-w-[38ch] text-lead text-areia/70">
          Uma seleção de trabalhos entregues pela Gamma&nbsp;Jr.
        </p>

        <ol data-projects-list className="mt-12 lg:mt-16">
          {projects.map((p, i) => (
            <li key={i} data-project-row>
              <ProjectRow project={p} index={i} onActive={() => setActive(i)} />
            </li>
          ))}
        </ol>

        <a
          href={portfolioUrl}
          className="group mt-14 inline-flex items-center gap-3 py-2 text-[0.9375rem] font-medium text-creme/80 transition-colors hover:text-creme"
        >
          Ver portfólio completo [PREENCHER]
          <span
            aria-hidden
            className="block h-px w-8 bg-turquesa transition-[width] duration-500 ease-[var(--ease-expo)] group-hover:w-14"
          />
        </a>
      </div>

      {/* Prévia flutuante (desktop) */}
      <div
        ref={floating}
        aria-hidden
        className="pointer-events-none invisible fixed left-0 top-0 z-30 hidden w-[min(28vw,26rem)] overflow-hidden rounded-[1rem] shadow-[0_30px_80px_rgba(0,0,0,0.6)] lg:block"
      >
        {projects.map((p, i) => (
          <div
            key={i}
            className={`transition-opacity duration-300 ${i === active ? "relative opacity-100" : "absolute inset-0 opacity-0"}`}
          >
            <ProjectPreview project={p} />
          </div>
        ))}
      </div>
    </section>
  );
}

function ProjectRow({
  project,
  index,
  onActive,
}: {
  project: Project;
  index: number;
  onActive: () => void;
}) {
  const content = (
    <>
      {/* Prévia inline (celular/tablet) */}
      <div className="mb-6 overflow-hidden rounded-[1rem] lg:hidden">
        <ProjectPreview project={project} />
      </div>

      <div className="grid grid-cols-[auto_1fr] items-baseline gap-x-5 gap-y-2 lg:grid-cols-12 lg:gap-x-8">
        <span className="font-display text-sm tracking-[0.18em] text-turquesa lg:col-span-1">
          {String(index + 1).padStart(2, "0")}
        </span>
        <h3 className="col-span-1 font-display text-[clamp(1.9rem,1.2rem+2.6vw,3.75rem)] font-medium uppercase leading-[0.95] transition-[color,transform] duration-500 ease-[var(--ease-expo)] lg:col-span-6 lg:group-hover:translate-x-3 lg:group-hover:text-turquesa lg:group-focus-visible:translate-x-3 lg:group-focus-visible:text-turquesa">
          {project.name}
        </h3>
        <p className="col-start-2 text-[0.9375rem] text-areia/70 lg:col-span-3 lg:col-start-auto">
          {project.client}
          <span className="block text-[0.75rem] uppercase tracking-[var(--tracking-label)] text-creme/45">
            {project.category}
          </span>
        </p>
        <p className="col-start-2 font-display text-sm tracking-[0.14em] text-creme/50 lg:col-span-2 lg:col-start-auto lg:text-right">
          {project.year}
        </p>
      </div>
    </>
  );

  const className =
    "group block border-t border-creme/10 py-8 outline-none lg:py-10 [li:last-child_&]:border-b";

  return project.href ? (
    <a
      href={project.href}
      onPointerEnter={onActive}
      onFocus={onActive}
      className={`${className} focus-visible:outline-2 focus-visible:outline-turquesa`}
    >
      {content}
    </a>
  ) : (
    <div onPointerEnter={onActive} className={className}>
      {content}
    </div>
  );
}
