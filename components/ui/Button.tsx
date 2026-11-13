import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

type Size = "sm" | "md";

/**
 * CTA principal. A sombra deslocada em petróleo vem dos elementos gráficos
 * do kit (cards com contorno deslocado) e é a única assinatura "sólida" do site.
 */
function classes(size: Size, extra: string) {
  const sizing = size === "sm" ? "h-10 px-5 text-[0.8125rem]" : "h-14 px-7 text-[0.9375rem]";
  return `group relative inline-flex items-center gap-3 rounded-[3px] bg-turquesa font-sans font-semibold text-grafite shadow-[0_0_0_0_var(--color-petroleo)] transition-[transform,box-shadow] duration-300 ease-[var(--ease-expo)] hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[4px_4px_0_0_var(--color-petroleo)] active:translate-x-0 active:translate-y-0 active:shadow-none disabled:pointer-events-none disabled:opacity-60 ${sizing} ${extra}`;
}

function Arrow() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 16 16"
      className="size-4 transition-transform duration-300 ease-[var(--ease-expo)] group-hover:translate-x-1"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
    >
      <path d="M2 8h11M9 4l4 4-4 4" />
    </svg>
  );
}

export function ButtonLink({
  children,
  className = "",
  size = "md",
  ...rest
}: AnchorHTMLAttributes<HTMLAnchorElement> & { children: ReactNode; size?: Size }) {
  return (
    <a {...rest} className={classes(size, className)}>
      <span>{children}</span>
      <Arrow />
    </a>
  );
}

export function Button({
  children,
  className = "",
  size = "md",
  type = "button",
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { children: ReactNode; size?: Size }) {
  return (
    <button type={type} {...rest} className={classes(size, className)}>
      <span>{children}</span>
      <Arrow />
    </button>
  );
}
