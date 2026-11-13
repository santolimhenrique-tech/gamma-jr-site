/**
 * Miniaturas ilustrativas de cada serviço, feitas em SVG e animadas só com
 * transições CSS (o estado vem de `data-active` no elemento pai `.group`).
 * Não exibem números nem dados reais — são abstrações visuais.
 * prefers-reduced-motion: as transições ficam instantâneas (ver globals.css).
 */

const T = "31 221 189"; // turquesa
const P = "29 126 142"; // petróleo
const C = "255 252 240"; // creme

/** Elemento que entra subindo + aparecendo, com atraso em ms. */
function rise(delay: number) {
  return {
    className:
      "[transform-box:fill-box] translate-y-3 opacity-0 transition-[transform,opacity] duration-700 ease-[var(--ease-expo)] group-data-[active=true]:translate-y-0 group-data-[active=true]:opacity-100",
    style: { transitionDelay: `${delay}ms` },
  };
}

function grow(delay: number, axis: "x" | "y" = "y", origin = "bottom") {
  const scale = axis === "y" ? "scale-y-0" : "scale-x-0";
  const scaleOn =
    axis === "y" ? "group-data-[active=true]:scale-y-100" : "group-data-[active=true]:scale-x-100";
  return {
    className: `[transform-box:fill-box] ${scale} ${scaleOn} transition-transform duration-[900ms] ease-[var(--ease-expo)]`,
    style: { transitionDelay: `${delay}ms`, transformOrigin: origin },
  };
}

function draw(delay: number, duration = 1400) {
  return {
    pathLength: 1,
    strokeDasharray: 1,
    className:
      "[stroke-dashoffset:1] group-data-[active=true]:[stroke-dashoffset:0] transition-[stroke-dashoffset] ease-[var(--ease-in-out-quart)]",
    style: { transitionDelay: `${delay}ms`, transitionDuration: `${duration}ms` },
  };
}

const svgProps = {
  viewBox: "0 0 480 360",
  className: "h-full w-full",
  "aria-hidden": true,
  fill: "none",
} as const;

export function SiteVisual() {
  return (
    <svg {...svgProps}>
      {/* Janela do navegador */}
      <g {...rise(0)}>
        <rect x="40" y="36" width="400" height="288" rx="14" fill={`rgb(${C} / 0.04)`} />
        <circle cx="62" cy="58" r="4" fill={`rgb(${C} / 0.2)`} />
        <circle cx="76" cy="58" r="4" fill={`rgb(${C} / 0.2)`} />
        <circle cx="90" cy="58" r="4" fill={`rgb(${C} / 0.2)`} />
        <rect x="170" y="51" width="140" height="14" rx="7" fill={`rgb(${C} / 0.08)`} />
      </g>
      {/* Navegação */}
      <g {...rise(150)}>
        <rect x="64" y="90" width="44" height="8" rx="2" fill={`rgb(${T})`} />
        <rect x="282" y="91" width="28" height="6" rx="3" fill={`rgb(${C} / 0.25)`} />
        <rect x="318" y="91" width="28" height="6" rx="3" fill={`rgb(${C} / 0.25)`} />
        <rect x="354" y="91" width="28" height="6" rx="3" fill={`rgb(${C} / 0.25)`} />
        <rect x="390" y="88" width="26" height="12" rx="3" fill={`rgb(${T} / 0.9)`} />
      </g>
      {/* Hero do site */}
      <g {...rise(260)}>
        <rect x="64" y="124" width="190" height="16" rx="3" fill={`rgb(${C} / 0.85)`} />
        <rect x="64" y="148" width="150" height="16" rx="3" fill={`rgb(${C} / 0.85)`} />
        <rect x="64" y="176" width="170" height="6" rx="3" fill={`rgb(${C} / 0.3)`} />
        <rect x="64" y="188" width="130" height="6" rx="3" fill={`rgb(${C} / 0.3)`} />
      </g>
      <g {...rise(380)}>
        <rect x="64" y="208" width="70" height="20" rx="4" fill={`rgb(${T})`} />
      </g>
      <g {...rise(320)}>
        <rect x="282" y="120" width="134" height="110" rx="8" fill={`rgb(${P} / 0.55)`} />
        <path
          d="M318 214c6-40 18-70 34-74 9-2 14 6 10 22-5 22-22 44-28 52"
          stroke={`rgb(${T})`}
          strokeWidth="3"
          strokeLinecap="round"
          {...draw(700, 1200)}
        />
      </g>
      {/* Blocos de conteúdo */}
      {[0, 1, 2].map((i) => (
        <g key={i} {...rise(480 + i * 90)}>
          <rect x={64 + i * 120} y="252" width="108" height="50" rx="6" fill={`rgb(${C} / 0.06)`} />
          <rect x={76 + i * 120} y="266" width="40" height="5" rx="2.5" fill={`rgb(${T} / 0.8)`} />
          <rect x={76 + i * 120} y="280" width="76" height="5" rx="2.5" fill={`rgb(${C} / 0.2)`} />
        </g>
      ))}
    </svg>
  );
}

export function DashboardVisual() {
  const bars = [0.42, 0.6, 0.5, 0.78, 0.66, 0.9, 0.72];
  return (
    <svg {...svgProps}>
      {/* Indicadores (abstratos, sem números) */}
      {[0, 1, 2].map((i) => (
        <g key={i} {...rise(i * 90)}>
          <rect x={40 + i * 136} y="36" width="124" height="64" rx="8" fill={`rgb(${C} / 0.05)`} />
          <rect x={54 + i * 136} y="52" width="44" height="5" rx="2.5" fill={`rgb(${C} / 0.3)`} />
          <rect
            x={54 + i * 136}
            y="68"
            width={i === 1 ? 70 : 56}
            height="16"
            rx="3"
            fill={i === 0 ? `rgb(${T})` : `rgb(${C} / 0.8)`}
          />
        </g>
      ))}

      {/* Área do gráfico */}
      <g {...rise(200)}>
        <rect x="40" y="116" width="272" height="208" rx="8" fill={`rgb(${C} / 0.03)`} />
        {[0, 1, 2, 3].map((i) => (
          <line
            key={i}
            x1="60"
            x2="292"
            y1={150 + i * 40}
            y2={150 + i * 40}
            stroke={`rgb(${C} / 0.07)`}
          />
        ))}
      </g>
      {bars.map((h, i) => (
        <rect
          key={i}
          x={66 + i * 32}
          y={300 - 150 * h}
          width="18"
          height={150 * h}
          rx="3"
          fill={`rgb(${P})`}
          {...grow(300 + i * 70)}
        />
      ))}
      <path
        d={bars
          .map((h, i) => `${i === 0 ? "M" : "L"}${75 + i * 32} ${290 - 165 * h + 10}`)
          .join(" ")}
        stroke={`rgb(${T})`}
        strokeWidth="2.5"
        strokeLinejoin="round"
        strokeLinecap="round"
        {...draw(700, 1500)}
      />

      {/* Rosca */}
      <g {...rise(260)}>
        <rect x="328" y="116" width="112" height="208" rx="8" fill={`rgb(${C} / 0.03)`} />
        <circle cx="384" cy="190" r="34" stroke={`rgb(${C} / 0.08)`} strokeWidth="12" />
      </g>
      <circle
        cx="384"
        cy="190"
        r="34"
        stroke={`rgb(${T})`}
        strokeWidth="12"
        transform="rotate(-90 384 190)"
        {...draw(600, 1600)}
        strokeDasharray="0.68 2"
      />
      {[0, 1, 2].map((i) => (
        <g key={i} {...rise(500 + i * 80)}>
          <rect x="346" y={250 + i * 20} width="8" height="8" rx="2" fill={i === 0 ? `rgb(${T})` : `rgb(${C} / 0.2)`} />
          <rect x="362" y={252 + i * 20} width={i === 0 ? 50 : 40} height="5" rx="2.5" fill={`rgb(${C} / 0.3)`} />
        </g>
      ))}
    </svg>
  );
}

export function IdentityVisual() {
  // Paleta oficial do kit, na ordem da página "Paleta de cores".
  const palette = ["#1fddbd", "#1d7e8e", "#f1ead1", "#fffcf0", "#ebebeb", "#212121", "#000000"];
  return (
    <svg {...svgProps}>
      {palette.map((c, i) => (
        <g key={c}>
          <rect
            x={40 + i * 57.14}
            y="36"
            width="57.14"
            height="150"
            fill={c}
            {...grow(i * 80, "y", "top")}
          />
        </g>
      ))}
      <g {...rise(500)}>
        {palette.map((c, i) => (
          <text
            key={c}
            x={46 + i * 57.14}
            y="204"
            fontSize="8.5"
            fill={`rgb(${C} / 0.5)`}
            style={{ fontFamily: "var(--font-sans)", letterSpacing: "0.04em" }}
          >
            {c.toUpperCase()}
          </text>
        ))}
      </g>
      <g {...rise(650)}>
        <text
          x="40"
          y="304"
          fontSize="96"
          fill={`rgb(${C})`}
          style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}
        >
          Aa
        </text>
        <text x="44" y="324" fontSize="10" fill={`rgb(${C} / 0.5)`} style={{ fontFamily: "var(--font-sans)", letterSpacing: "0.2em" }}>
          OSWALD
        </text>
      </g>
      <g {...rise(780)}>
        <text
          x="200"
          y="304"
          fontSize="96"
          fill={`rgb(${T})`}
          style={{ fontFamily: "var(--font-sans)", fontWeight: 500 }}
        >
          Aa
        </text>
        <text x="204" y="324" fontSize="10" fill={`rgb(${C} / 0.5)`} style={{ fontFamily: "var(--font-sans)", letterSpacing: "0.2em" }}>
          MONTSERRAT
        </text>
      </g>
      <g {...rise(900)}>
        <rect x="392" y="236" width="48" height="88" rx="6" fill={`rgb(${C} / 0.05)`} />
        <rect x="402" y="250" width="28" height="4" rx="2" fill={`rgb(${C} / 0.3)`} />
        <rect x="402" y="262" width="20" height="4" rx="2" fill={`rgb(${C} / 0.2)`} />
        <rect x="402" y="274" width="24" height="4" rx="2" fill={`rgb(${C} / 0.2)`} />
        <rect x="402" y="298" width="28" height="14" rx="3" fill={`rgb(${T})`} />
      </g>
    </svg>
  );
}

export function TrainingVisual() {
  const nodes = [
    { x: 80, y: 250 },
    { x: 190, y: 190 },
    { x: 300, y: 220 },
    { x: 400, y: 130 },
  ];
  const path = `M${nodes.map((n) => `${n.x} ${n.y}`).join(" L")}`;
  return (
    <svg {...svgProps}>
      {/* Tela de aula */}
      <g {...rise(0)}>
        <rect x="40" y="36" width="250" height="110" rx="10" fill={`rgb(${C} / 0.05)`} />
        <rect x="58" y="56" width="120" height="12" rx="3" fill={`rgb(${C} / 0.85)`} />
        <rect x="58" y="80" width="190" height="5" rx="2.5" fill={`rgb(${C} / 0.25)`} />
        <rect x="58" y="92" width="160" height="5" rx="2.5" fill={`rgb(${C} / 0.25)`} />
        <rect x="58" y="114" width="60" height="16" rx="4" fill={`rgb(${P})`} />
      </g>
      <g {...rise(120)}>
        <rect x="306" y="36" width="134" height="60" rx="10" fill={`rgb(${C} / 0.05)`} />
        <rect x="322" y="56" width="70" height="5" rx="2.5" fill={`rgb(${C} / 0.3)`} />
        <rect x="322" y="72" width="102" height="6" rx="3" fill={`rgb(${C} / 0.08)`} />
        <rect x="322" y="72" width="102" height="6" rx="3" fill={`rgb(${T})`} {...grow(500, "x", "left")} />
      </g>

      {/* Trilha de módulos */}
      <path d={path} stroke={`rgb(${C} / 0.1)`} strokeWidth="2" />
      <path d={path} stroke={`rgb(${T})`} strokeWidth="2" strokeLinejoin="round" {...draw(300, 1800)} />
      {nodes.map((n, i) => (
        <g key={i} {...rise(400 + i * 320)}>
          <circle cx={n.x} cy={n.y} r="16" fill="#212121" stroke={`rgb(${T})`} strokeWidth="2" />
          <circle cx={n.x} cy={n.y} r="6" fill={i === nodes.length - 1 ? `rgb(${T})` : `rgb(${C} / 0.8)`} />
          <rect x={n.x - 22} y={n.y + 28} width="44" height="5" rx="2.5" fill={`rgb(${C} / 0.3)`} />
        </g>
      ))}
    </svg>
  );
}

export const serviceVisuals = [SiteVisual, DashboardVisual, IdentityVisual, TrainingVisual];
