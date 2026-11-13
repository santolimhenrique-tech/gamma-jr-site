/* eslint-disable @next/next/no-img-element */
/**
 * Logotipos oficiais extraídos do Kit de Marca (PNG com transparência,
 * apenas recortados nas margens vazias, sem qualquer alteração de desenho/cor).
 * Quando houver SVGs originais, basta trocar os arquivos em /public/brand.
 */

type WordmarkVariant = "turquesa" | "petroleo" | "preto";

const WORDMARK = { w: 706, h: 140 } as const;
const SYMBOL = { w: 458, h: 662 } as const;
const SYMBOL_OUTLINE = { w: 207, h: 296 } as const;

export function Wordmark({
  variant = "turquesa",
  className,
  alt = "Gamma Jr. Engenharia",
}: {
  variant?: WordmarkVariant;
  className?: string;
  alt?: string;
}) {
  return (
    <img
      src={`/brand/gamma-nominal-${variant}.png`}
      width={WORDMARK.w}
      height={WORDMARK.h}
      alt={alt}
      className={className}
      decoding="async"
      draggable={false}
    />
  );
}

export function GammaSymbol({
  variant = "turquesa",
  className,
  alt = "",
  ...rest
}: {
  variant?: "turquesa" | "contorno";
  className?: string;
  alt?: string;
} & Record<`data-${string}`, string | boolean | undefined>) {
  const size = variant === "turquesa" ? SYMBOL : SYMBOL_OUTLINE;
  const src =
    variant === "turquesa"
      ? "/brand/gamma-simbolo-turquesa-hd.png"
      : "/brand/gamma-simbolo-contorno.png";
  return (
    <img
      {...rest}
      src={src}
      width={size.w}
      height={size.h}
      alt={alt}
      aria-hidden={alt ? undefined : true}
      className={className}
      decoding="async"
      fetchPriority={variant === "turquesa" ? "high" : undefined}
      draggable={false}
    />
  );
}
