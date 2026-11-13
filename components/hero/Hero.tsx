"use client";

import { useEffect, useRef } from "react";
import { GammaSymbol } from "@/components/brand/Logo";
import { MeshCanvas } from "@/components/hero/MeshCanvas";
import { ButtonLink } from "@/components/ui/Button";
import { gsap, ScrollTrigger, SplitText, useGSAP, REDUCED, FULL, motion } from "@/lib/gsap";
import { services } from "@/lib/site";

/**
 * Hero — "Da malha à estrutura".
 * Entrada: a malha acende, o título sobe linha a linha por máscara, o γ é
 * revelado de baixo para cima. Scroll: a malha converge para uma grade e o
 * conteúdo recua, preparando a transição para a próxima seção.
 */
export function Hero() {
  const root = useRef<HTMLElement>(null);
  const progress = useRef(0);

  // A hero é `sticky` para que a próxima seção deslize por cima dela.
  // Se a hero for mais alta que a tela (celulares baixos), o `top` negativo
  // deixa rolar até o fim dela antes de fixar — nada fica escondido.
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const fit = () => {
      el.style.top = `${Math.min(0, window.innerHeight - el.offsetHeight)}px`;
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    window.addEventListener("resize", fit);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", fit);
    };
  }, []);

  useGSAP(
    (_, contextSafe) => {
      let cancelled = false;
      let mm: gsap.MatchMedia | undefined;

      const build = contextSafe!(() => {
        mm = gsap.matchMedia();
        mm.add({ full: FULL, reduce: REDUCED }, (ctx) => {
          const { reduce } = ctx.conditions as { full: boolean; reduce: boolean };
          const el = root.current!;
          const reveal = Array.from(el.querySelectorAll<HTMLElement>("[data-reveal]"));

          if (reduce) {
            gsap.set(reveal, { autoAlpha: 0 });
            gsap.to(reveal, { autoAlpha: 1, duration: 0.5, stagger: 0.04, ease: "none" });
            return;
          }

          gsap.set(reveal, { autoAlpha: 1 });
          const split = SplitText.create(el.querySelector<HTMLElement>("[data-hero-title]")!, {
            type: "lines",
            mask: "lines",
            linesClass: "hero-line",
          });

          const tl = gsap.timeline({ defaults: { ease: motion.ease } });
          tl.from("[data-hero-glow]", { opacity: 0, scale: 0.85, duration: 2.2 }, 0)
            .from("[data-hero-eyebrow-line]", { scaleX: 0, transformOrigin: "left", duration: 1 }, 0.15)
            .from("[data-hero-eyebrow-text]", { opacity: 0, x: -12, duration: 0.9 }, 0.3)
            .from(split.lines, { yPercent: 105, duration: motion.slow, stagger: 0.09 }, 0.25)
            .fromTo(
              "[data-hero-symbol]",
              { clipPath: "inset(100% 0% 0% 0%)", yPercent: 6 },
              { clipPath: "inset(0% 0% 0% 0%)", yPercent: 0, duration: 1.8, ease: "expo.inOut" },
              0.2,
            )
            .from("[data-hero-outline]", { opacity: 0, rotate: -4, scale: 1.04, duration: 2.4 }, 0.6)
            .from("[data-hero-sub]", { opacity: 0, y: 16, duration: motion.base }, 0.85)
            .from("[data-hero-cta] > *", { opacity: 0, y: 16, duration: motion.base, stagger: 0.08 }, 0.95)
            .from("[data-hero-index] li", { opacity: 0, y: 14, duration: motion.base, stagger: 0.07 }, 1.05)
            .from("[data-hero-cue]", { opacity: 0, duration: 1 }, 1.4)
            .add(() => split.revert());

          // Scroll: medido pela seção que cobre a hero (a hero é sticky).
          // Malha converge para a grade; conteúdo recua.
          const cover = (el.nextElementSibling as HTMLElement | null) ?? el;
          const range = { trigger: cover, start: "top bottom", end: "top top" };
          ScrollTrigger.create({
            ...range,
            scrub: true,
            onUpdate: (self) => {
              progress.current = self.progress;
            },
          });

          const scrollTl = gsap.timeline({
            scrollTrigger: { ...range, scrub: 0.6 },
            defaults: { ease: "none" },
          });
          scrollTl
            .to("[data-hero-content]", { yPercent: -18, opacity: 0.15 }, 0)
            .to("[data-hero-art]", { yPercent: -10, scale: 0.94, opacity: 0.4 }, 0)
            .to("[data-hero-index]", { opacity: 0 }, 0);

          // Paralaxe sutil do γ com o cursor (só ponteiros finos).
          if (window.matchMedia("(pointer: fine)").matches) {
            const xTo = gsap.quickTo("[data-hero-outline]", "x", { duration: 1.4, ease: "power3.out" });
            const yTo = gsap.quickTo("[data-hero-outline]", "y", { duration: 1.4, ease: "power3.out" });
            const onMove = (e: PointerEvent) => {
              xTo((e.clientX / window.innerWidth - 0.5) * -28);
              yTo((e.clientY / window.innerHeight - 0.5) * -20);
            };
            window.addEventListener("pointermove", onMove, { passive: true });
            return () => window.removeEventListener("pointermove", onMove);
          }
        });
      });

      // Aguarda as fontes para que a divisão em linhas use as métricas reais.
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
      id="inicio"
      data-tone="dark"
      aria-labelledby="hero-title"
      className="sticky top-0 isolate z-0 flex min-h-[100svh] flex-col overflow-hidden bg-grafite text-creme"
    >
      {/* Fundo: malha + brilho em petróleo + vinheta */}
      <div aria-hidden className="absolute inset-0 -z-10">
        <MeshCanvas progress={progress} className="absolute inset-0" />
        <div
          data-hero-glow
          className="absolute right-[-20%] top-[5%] h-[85vmax] w-[85vmax] rounded-full bg-[radial-gradient(closest-side,rgba(29,126,142,0.38),rgba(29,126,142,0.08)_55%,transparent)] lg:right-[-12%] lg:top-[-10%]"
        />
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-grafite to-transparent" />
      </div>

      <div className="container-site relative flex flex-1 flex-col pt-[calc(var(--header-h)+1.5rem)] lg:grid lg:grid-cols-12 lg:items-center lg:gap-x-8 lg:pt-[var(--header-h)]">
        {/* Arte: γ oficial + contorno oficial como "planta técnica" */}
        <div
          data-hero-art
          className="relative mx-auto flex h-[26svh] min-h-[180px] w-full items-center justify-end sm:h-[40svh] lg:order-2 lg:col-span-5 lg:col-start-8 lg:h-[70svh] lg:max-h-[720px] lg:justify-center"
        >
          <div data-reveal className="relative h-full">
            <GammaSymbol
              variant="contorno"
              data-hero-outline
              className="absolute left-[-14%] top-[-6%] h-[112%] w-auto max-w-none opacity-35 select-none"
            />
            <GammaSymbol
              variant="turquesa"
              alt="Símbolo γ da Gamma Jr."
              data-hero-symbol
              className="relative h-full w-auto select-none drop-shadow-[0_30px_80px_rgba(31,221,189,0.18)]"
            />
          </div>
        </div>

        {/* Conteúdo */}
        <div
          data-hero-content
          className="relative mt-6 flex flex-col pb-10 lg:order-1 lg:col-span-7 lg:mt-0 lg:pb-0"
        >
          <p data-reveal className="mb-5 flex items-center gap-4 lg:mb-8">
            <span data-hero-eyebrow-line className="block h-px w-10 bg-turquesa" />
            <span
              data-hero-eyebrow-text
              className="text-label font-medium uppercase tracking-[var(--tracking-label)] text-areia/80"
            >
              Empresa Júnior · EEL-USP
            </span>
          </p>

          <h1
            id="hero-title"
            data-reveal
            data-hero-title
            className="font-display text-display font-medium uppercase tracking-[-0.01em] text-creme"
          >
            Engenharia
            <br />
            aplicada ao <span className="text-turquesa">digital.</span>
          </h1>

          <p
            data-reveal
            data-hero-sub
            className="mt-6 max-w-[34ch] text-lead text-areia/75 lg:mt-8"
          >
            Estudantes de engenharia da USP desenvolvendo produtos digitais para empresas e organizações.
          </p>

          <div data-reveal data-hero-cta className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4 lg:mt-10">
            <ButtonLink href="#contato">Iniciar um projeto</ButtonLink>
            <a
              href="#servicos"
              className="group inline-flex items-center gap-2 py-2 text-[0.9375rem] font-medium text-creme/80 transition-colors hover:text-creme"
            >
              Ver serviços
              <span
                aria-hidden
                className="block h-px w-6 bg-turquesa transition-[width] duration-500 ease-[var(--ease-expo)] group-hover:w-10"
              />
            </a>
          </div>
        </div>
      </div>

      {/* Índice de serviços + indicador de rolagem */}
      <div className="container-site relative pb-6 lg:pb-10">
        <div className="flex items-end justify-between gap-8 border-t border-creme/10 pt-5">
          <ul
            data-reveal
            data-hero-index
            aria-label="Serviços"
            className="grid flex-1 grid-cols-2 gap-x-6 gap-y-3 md:flex md:gap-10 lg:gap-14"
          >
            {services.map((s) => (
              <li key={s.index}>
                <a href="#servicos" className="group flex items-baseline gap-2.5">
                  <span className="font-display text-[0.6875rem] tracking-[0.18em] text-turquesa">
                    {s.index}
                  </span>
                  <span className="font-display text-[0.8125rem] uppercase tracking-[0.14em] text-creme/70 transition-colors group-hover:text-creme md:text-sm">
                    {s.label}
                  </span>
                </a>
              </li>
            ))}
          </ul>

          <div data-reveal data-hero-cue className="hidden flex-col items-center gap-3 md:flex" aria-hidden>
            <span className="font-display text-[0.625rem] uppercase tracking-[var(--tracking-marca)] text-creme/50 [writing-mode:vertical-rl]">
              Role
            </span>
            <span className="relative block h-12 w-px overflow-hidden bg-creme/10">
              <span className="animate-scroll-cue absolute inset-0 bg-turquesa" />
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
