"use client";

import { useRef } from "react";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { gsap, ScrollTrigger, SplitText, useGSAP, FULL, motion } from "@/lib/gsap";

const facts = [
  { term: "Instituição", value: "Escola de Engenharia de Lorena · USP" },
  { term: "Sede", value: "Lorena, SP" },
  { term: "Fundação", value: "[PREENCHER]" },
] as const;

const mvv: { term: string; text?: string; list?: string[] }[] = [
  {
    term: "Missão",
    text: "Transformar o Brasil através de projetos de impacto, formando líderes capazes e com responsabilidade social.",
  },
  {
    term: "Visão",
    text: "Impactar a vida dos pequenos e médios empreendedores, tornando a tecnologia mais acessível, além de proporcionar vivência empresarial ao time.",
  },
  { term: "Valores", list: ["Empatia", "Profissionalismo", "Sinergia", "Adaptabilidade"] },
];

const photos = {
  main: {
    src: "/equipe/equipe-comemorando.webp",
    alt: "Membros da Gamma Jr. comemorando juntos, segurando a bandeira da empresa",
    w: 1317,
    h: 878,
  },
  side: {
    src: "/equipe/equipe-palco-bandeira.jpg",
    alt: "Equipe da Gamma Jr. no palco de um evento, com o rosto pintado de turquesa e a bandeira da empresa",
    w: 1600,
    h: 1066,
  },
  mej: {
    src: "/equipe/mej-empresas-juniores.webp",
    alt: "Gamma Jr. e outras empresas juniores reunidas no palco, cada uma com sua bandeira",
    w: 1317,
    h: 878,
  },
} as const;

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

          // Fotos: leve paralaxe da imagem dentro da moldura.
          gsap.utils.toArray<HTMLElement>("[data-parallax]", el).forEach((img) => {
            gsap.fromTo(
              img,
              { yPercent: -6 },
              {
                yPercent: 6,
                ease: "none",
                scrollTrigger: { trigger: img.parentElement, start: "top bottom", end: "bottom top", scrub: true },
              },
            );
          });

          // MEJ: a foto se expande até as bordas ao entrar; o texto sobe em seguida.
          const mej = el.querySelector<HTMLElement>("[data-mej]")!;
          gsap.fromTo(
            "[data-mej-media]",
            { clipPath: "inset(7% 5% 7% 5% round 2rem)" },
            {
              clipPath: "inset(0% 0% 0% 0% round 0rem)",
              ease: "none",
              scrollTrigger: { trigger: mej, start: "top bottom", end: "top 10%", scrub: true },
            },
          );
          gsap.from("[data-mej-text] > *", {
            opacity: 0,
            y: 28,
            duration: motion.base,
            ease: motion.ease,
            stagger: 0.09,
            scrollTrigger: { trigger: mej, start: "top 35%", once: true },
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
      <div className="container-site grid grid-cols-1 gap-y-12 pb-24 pt-20 lg:grid-cols-12 lg:gap-x-8 lg:pb-36 lg:pt-36">
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

          {/* Equipe: composição editorial, foto principal + foto lateral deslocada */}
          <div className="mt-20 grid grid-cols-12 gap-x-4 lg:mt-28 lg:gap-x-8">
            <figure
              data-about-item
              className="relative col-span-12 aspect-[3/2] overflow-hidden rounded-[1rem] md:col-span-8 md:col-start-1 md:row-start-1"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                data-parallax
                src={photos.main.src}
                alt={photos.main.alt}
                width={photos.main.w}
                height={photos.main.h}
                loading="lazy"
                decoding="async"
                className="absolute inset-x-0 -top-[8%] h-[116%] w-full object-cover"
              />
            </figure>
            <figure
              data-about-item
              className="relative z-10 col-span-9 col-start-4 -mt-10 aspect-[3/2] overflow-hidden rounded-[1rem] shadow-[0_30px_60px_-20px_rgba(0,0,0,0.4)] md:col-span-5 md:col-start-8 md:row-start-1 md:mt-[30%] md:self-start"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                data-parallax
                src={photos.side.src}
                alt={photos.side.alt}
                width={photos.side.w}
                height={photos.side.h}
                loading="lazy"
                decoding="async"
                className="absolute inset-x-0 -top-[8%] h-[116%] w-full object-cover"
              />
            </figure>
          </div>
        </div>
      </div>

      {/* Movimento Empresa Júnior — foto em tela cheia */}
      <div
        data-mej
        data-tone="dark"
        aria-labelledby="mej-titulo"
        role="region"
        className="relative min-h-[88svh] overflow-hidden lg:min-h-[100svh]"
      >
        <div data-mej-media className="absolute inset-0 bg-grafite">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={photos.mej.src}
            alt={photos.mej.alt}
            width={photos.mej.w}
            height={photos.mej.h}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover object-[50%_45%]"
          />
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-t from-preto/90 via-preto/45 to-preto/10"
          />
        </div>

        <div className="container-site relative flex min-h-[88svh] items-end pb-14 lg:min-h-[100svh] lg:pb-20">
          <div data-mej-text className="max-w-2xl text-creme">
            <p className="flex items-center gap-3 font-display text-[0.8125rem] uppercase tracking-[var(--tracking-marca)]">
              <span aria-hidden className="block h-px w-8 bg-turquesa" />
              Movimento Empresa Júnior
            </p>
            <h3
              id="mej-titulo"
              className="mt-6 font-display text-title font-medium uppercase"
            >
              Parte de uma <span className="text-turquesa">rede nacional.</span>
            </h3>
            <p className="mt-6 max-w-[46ch] text-lead text-creme/80">
              A Gamma Jr. integra o Movimento Empresa Júnior, que reúne empresas juniores de
              universidades de todo o país. Nos encontros do movimento, trocamos experiência com
              outras EJs e trazemos esse aprendizado para cada projeto.
            </p>
          </div>
        </div>
      </div>

      {/* Missão, visão e valores */}
      <div className="container-site grid grid-cols-1 pb-24 pt-24 lg:grid-cols-12 lg:gap-x-8 lg:pb-40 lg:pt-36">
        <div className="lg:col-span-9 lg:col-start-4">
          <h3 className="sr-only">Missão, visão e valores</h3>
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
                {item.list ? (
                  <dd>
                    <ul className="flex flex-wrap gap-x-6 gap-y-2 font-display text-[clamp(1.25rem,1rem+0.9vw,1.75rem)] uppercase tracking-[0.06em]">
                      {item.list.map((v) => (
                        <li key={v} className="flex items-center gap-3">
                          <span aria-hidden className="size-1.5 rounded-full bg-turquesa" />
                          {v}
                        </li>
                      ))}
                    </ul>
                  </dd>
                ) : (
                  <dd className="max-w-[44ch] text-lead text-grafite/75">{item.text}</dd>
                )}
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
