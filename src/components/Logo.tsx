// Logo Itacaramby redesenhado em vetor (SVG), fiel ao original:
// o "sorriso" em cobre + o nome em letras arredondadas (A sem travessão).

const STROKE = 16;
const GAP = 22;

// Cada letra: largura e traço (altura das maiúsculas = 100).
const LETTERS: Record<string, { w: number; d: string }> = {
  I: { w: 0, d: "M0 0V100" },
  T: { w: 70, d: "M0 0H70M35 0V100" },
  A: { w: 80, d: "M0 100L40 0L80 100" },
  C: { w: 86, d: "M85.4 14.6A50 50 0 1 0 85.4 85.4" },
  R: { w: 72, d: "M0 100V0H40A26 26 0 0 1 40 52H0M38 52L72 100" },
  M: { w: 96, d: "M0 100V0L48 92L96 0V100" },
  B: { w: 72, d: "M0 0V100H44A26 26 0 0 0 44 48H0M0 0H36A24 24 0 0 1 36 48" },
  Y: { w: 80, d: "M0 0L40 48L80 0M40 48V100" },
};

const NAME = "ITACARAMBY";

function layout() {
  let x = 0;
  const parts = NAME.split("").map((ch) => {
    const l = LETTERS[ch];
    const part = { x, d: l.d };
    x += l.w + GAP;
    return part;
  });
  return { parts, width: x - GAP };
}

const { parts: NAME_PARTS, width: NAME_W } = layout();
const PAD = STROKE / 2;

export const MARK_PATH =
  "M6 42C2 33 0 23 3 15C7 6 16 1 26 1C35 1 43 4 50 6.5C57 3 66 1 75 1.5C85 2 94 7 97 16C99 25 97 37 90 47.5C93.5 37 93.5 26 89 20C85 15 78 14 72 15C67 16 62.5 18 60 21L71 22L60 23C56 25 52 25.5 48 25C43 24 39 21 33 18C26 15 18 14.5 13 17C8 20 6.5 29 6 42Z";

type Props = { className?: string; title?: string };

/** Só o sorriso. */
export function LogoMark({ className, title }: Props) {
  return (
    <svg viewBox="0 0 100 48" className={className} role={title ? "img" : undefined} aria-label={title} aria-hidden={title ? undefined : true}>
      <path d={MARK_PATH} fill="currentColor" />
    </svg>
  );
}

/** Só o nome ITACARAMBY. */
export function LogoName({ className, title = "Itacaramby" }: Props) {
  return (
    <svg
      viewBox={`${-PAD} ${-PAD} ${NAME_W + STROKE} ${100 + STROKE}`}
      className={className}
      role="img"
      aria-label={title}
    >
      <g fill="none" stroke="currentColor" strokeWidth={STROKE} strokeLinecap="round" strokeLinejoin="round">
        {NAME_PARTS.map((p, i) => (
          <path key={i} d={p.d} transform={`translate(${p.x} 0)`} />
        ))}
      </g>
    </svg>
  );
}

/** Versão completa: sorriso em cima, nome e "Estética em Prótese Dentária" embaixo. */
export function LogoFull({ className, title = "Itacaramby — Estética em Prótese Dentária", taglineClassName = "" }: Props & { taglineClassName?: string }) {
  const markW = 300;
  const markH = markW * 0.48;
  const nameY = markH + 40;
  const tagY = nameY + 100 + 70;
  return (
    <svg
      viewBox={`${-PAD} 0 ${NAME_W + STROKE} ${tagY + 10}`}
      className={className}
      role="img"
      aria-label={title}
    >
      <g transform={`translate(${(NAME_W - markW) / 2} 0) scale(${markW / 100})`}>
        <path d={MARK_PATH} fill="currentColor" />
      </g>
      <g
        transform={`translate(0 ${nameY})`}
        fill="none"
        stroke="currentColor"
        strokeWidth={STROKE}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {NAME_PARTS.map((p, i) => (
          <path key={i} d={p.d} transform={`translate(${p.x} 0)`} />
        ))}
      </g>
      <text
        x={0}
        y={tagY}
        textLength={NAME_W}
        lengthAdjust="spacing"
        className={taglineClassName}
        fill="currentColor"
        style={{ font: "600 40px var(--font-inter), sans-serif" }}
      >
        ESTÉTICA EM PRÓTESE DENTÁRIA
      </text>
    </svg>
  );
}
