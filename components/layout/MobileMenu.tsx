"use client";

import { useEffect, useRef } from "react";
import { GammaSymbol } from "@/components/brand/Logo";
import { SocialIcons } from "@/components/ui/SocialIcons";
import { gsap, useGSAP, REDUCED, FULL, motion } from "@/lib/gsap";
import { navItems } from "@/lib/site";

/**
 * Menu em tela cheia para telas < lg. Acessibilidade:
 * - o conteúdo da página fica `inert` enquanto aberto (foco preso no menu + header);
 * - Esc fecha e devolve o foco ao botão;
 * - rolagem do body bloqueada.
 */
export function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const root = useRef<HTMLDivElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);
  const firstRender = useRef(true);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add({ full: FULL, reduce: REDUCED }, (ctx) => {
        const { reduce } = ctx.conditions as { full: boolean; reduce: boolean };
        const t = gsap.timeline({ paused: true });
        t.set(root.current, { autoAlpha: 1 });
        if (reduce) {
          t.from(root.current, { opacity: 0, duration: 0.2 });
        } else {
          t.fromTo(
            root.current,
            { clipPath: "inset(0% 0% 100% 0%)" },
            { clipPath: "inset(0% 0% 0% 0%)", duration: 0.8, ease: motion.easeInOut },
          )
            .from(
              "[data-menu-link]",
              { yPercent: 110, duration: 0.9, stagger: 0.06, ease: motion.ease },
              "-=0.35",
            )
            .from("[data-menu-foot]", { opacity: 0, y: 12, duration: 0.6, ease: motion.ease }, "-=0.6")
            .from(
              "[data-menu-symbol]",
              { opacity: 0, yPercent: 8, duration: 1.2, ease: motion.ease },
              "<-0.2",
            );
        }
        tl.current = t;
        if (open) t.progress(1);
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    const t = tl.current;
    if (!t) return;
    if (open) {
      t.timeScale(1).play();
    } else {
      t.timeScale(1.6).reverse();
    }

    const regions = document.querySelectorAll("main, body > footer");
    const html = document.documentElement;
    if (open) {
      regions.forEach((r) => r.setAttribute("inert", ""));
      html.style.overflow = "hidden";
      requestAnimationFrame(() =>
        root.current?.querySelector<HTMLAnchorElement>("[data-menu-link]")?.focus(),
      );
    } else {
      regions.forEach((r) => r.removeAttribute("inert"));
      html.style.overflow = "";
    }

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        onClose();
        document.querySelector<HTMLButtonElement>("[data-menu-toggle]")?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // Fecha automaticamente se a tela crescer para o layout desktop.
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const onChange = () => mq.matches && onClose();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [onClose]);

  const go = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    onClose();
    const reduce = window.matchMedia(REDUCED).matches;
    requestAnimationFrame(() => {
      document.documentElement.style.overflow = "";
      document.querySelector(href)?.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
      history.replaceState(null, "", href);
    });
  };

  return (
    <div
      ref={root}
      id="menu-mobile"
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
      aria-hidden={!open}
      className="invisible fixed inset-0 z-40 flex flex-col overflow-y-auto bg-grafite text-creme lg:hidden"
    >
      <GammaSymbol
        variant="contorno"
        className="pointer-events-none absolute -right-[18%] top-[14%] h-[62svh] w-auto opacity-30 select-none"
        data-menu-symbol
      />

      <nav aria-label="Menu móvel" className="container-site relative flex flex-1 flex-col justify-center pt-[var(--header-h)]">
        <ol className="flex flex-col gap-1">
          {navItems.map((item, i) => (
            <li key={item.href} className="overflow-hidden">
              <a
                href={item.href}
                data-menu-link
                tabIndex={open ? 0 : -1}
                onClick={(e) => go(e, item.href)}
                className="group flex items-baseline gap-4 py-1.5"
              >
                <span className="font-display text-xs tracking-[var(--tracking-label)] text-turquesa">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="font-display text-[clamp(2.4rem,11vw,3.75rem)] font-medium uppercase leading-[1.05] transition-colors duration-300 group-hover:text-turquesa">
                  {item.label}
                </span>
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <div
        data-menu-foot
        className="container-site relative flex items-center justify-between border-t border-creme/10 py-5"
      >
        <span className="text-[0.6875rem] uppercase tracking-[var(--tracking-label)] text-creme/60">
          EEL-USP · Lorena, SP
        </span>
        <SocialIcons />
      </div>
    </div>
  );
}
