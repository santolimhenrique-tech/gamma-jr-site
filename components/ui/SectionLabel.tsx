/**
 * Rótulo de seção: índice numérico + nome com o tracking da marca nominal.
 * Mantém a numeração consistente entre as seções (01, 02, ...).
 */
export function SectionLabel({
  index,
  children,
  className = "",
  id,
  tone = "light",
}: {
  index: string;
  children: React.ReactNode;
  className?: string;
  id?: string;
  /** Tom do fundo: em fundo escuro o índice usa turquesa (contraste). */
  tone?: "light" | "dark";
}) {
  return (
    <h2 id={id} className={`flex items-center gap-3 font-display font-normal uppercase ${className}`}>
      <span
        className={`text-[0.75rem] tracking-[0.18em] ${tone === "dark" ? "text-turquesa" : "text-petroleo"}`}
      >
        {index}
      </span>
      <span aria-hidden className="block h-px w-8 bg-current opacity-30" />
      <span className="text-[0.8125rem] tracking-[var(--tracking-marca)]">{children}</span>
    </h2>
  );
}
