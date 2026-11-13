"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Wordmark } from "@/components/brand/Logo";
import { ButtonLink } from "@/components/ui/Button";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { navItems } from "@/lib/site";

type Tone = "dark" | "light";

/**
 * Navegação fixa. O tom (claro/escuro) acompanha a seção que está sob o header,
 * lida a partir de [data-tone] em cada <section>. Some ao rolar para baixo e
 * volta ao rolar para cima.
 */
export function SiteHeader() {
  const [tone, setTone] = useState<Tone>("dark");
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const y = window.scrollY;
      setScrolled(y > 8);
      const delta = y - lastY.current;
      if (Math.abs(delta) > 6) {
        setHidden(delta > 0 && y > 160);
        lastY.current = y;
      }
      const probe = 36;
      // De trás para frente: seções posteriores se sobrepõem às anteriores
      // (a hero é sticky e fica por baixo).
      const sections = Array.from(document.querySelectorAll<HTMLElement>("[data-tone]")).reverse();
      for (const s of sections) {
        const r = s.getBoundingClientRect();
        if (r.top <= probe && r.bottom > probe) {
          setTone((s.dataset.tone as Tone) ?? "dark");
          break;
        }
      }
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  const close = useCallback(() => setOpen(false), []);

  const effectiveTone: Tone = open ? "dark" : tone;
  const isDark = effectiveTone === "dark";
  const surface = open
    ? "bg-transparent"
    : scrolled
      ? isDark
        ? "bg-grafite/75 backdrop-blur-xl"
        : "bg-creme/80 backdrop-blur-xl"
      : "bg-transparent";

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-[transform,background-color,color] duration-500 ease-[var(--ease-expo)] ${surface} ${
          hidden && !open ? "-translate-y-full" : "translate-y-0"
        } ${isDark ? "text-creme" : "text-grafite"}`}
      >
        <div className="container-site flex h-[var(--header-h)] items-center justify-between gap-6">
          <a
            href="#inicio"
            className="relative block h-[22px] w-[111px] shrink-0 lg:h-[26px] lg:w-[131px]"
            aria-label="Gamma Jr. Engenharia, voltar ao início"
            onClick={close}
          >
            <Wordmark
              variant="turquesa"
              alt=""
              className={`absolute inset-0 h-full w-auto transition-opacity duration-500 ${isDark ? "opacity-100" : "opacity-0"}`}
            />
            <Wordmark
              variant="petroleo"
              alt=""
              className={`absolute inset-0 h-full w-auto transition-opacity duration-500 ${isDark ? "opacity-0" : "opacity-100"}`}
            />
          </a>

          <nav aria-label="Principal" className="hidden lg:block">
            <ul className="flex items-center gap-9">
              {navItems.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="group relative py-2 text-[0.8125rem] font-medium tracking-[0.04em] opacity-80 transition-opacity duration-300 hover:opacity-100"
                  >
                    {item.label}
                    <span
                      aria-hidden
                      className="absolute inset-x-0 -bottom-0.5 h-px origin-right scale-x-0 bg-turquesa transition-transform duration-500 ease-[var(--ease-expo)] group-hover:origin-left group-hover:scale-x-100"
                    />
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-3">
            <span className="hidden lg:block">
              <ButtonLink href="#contato" size="sm">
                Iniciar projeto
              </ButtonLink>
            </span>

            <button
              type="button"
              className="relative -mr-2 grid size-11 place-items-center lg:hidden"
              aria-expanded={open}
              aria-controls="menu-mobile"
              aria-label={open ? "Fechar menu" : "Abrir menu"}
              onClick={() => setOpen((v) => !v)}
              data-menu-toggle
            >
              <span className="relative block h-3 w-6">
                <span
                  className={`absolute left-0 top-0 h-[1.5px] w-full bg-current transition-transform duration-500 ease-[var(--ease-expo)] ${
                    open ? "translate-y-[5.25px] rotate-45" : ""
                  }`}
                />
                <span
                  className={`absolute bottom-0 right-0 h-[1.5px] bg-current transition-[transform,width] duration-500 ease-[var(--ease-expo)] ${
                    open ? "w-full -translate-y-[5.25px] -rotate-45" : "w-4"
                  }`}
                />
              </span>
            </button>
          </div>
        </div>
      </header>

      <MobileMenu open={open} onClose={close} />
    </>
  );
}
