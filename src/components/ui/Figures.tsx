// Inline blueprint line-art. Decorative only, so every figure is aria-hidden.

export function AgentsFigure({ className }: { className?: string }) {
  const nodes = [
    { x: 60, y: 50, l: "DOCS" },
    { x: 260, y: 50, l: "TOOLS" },
    { x: 60, y: 150, l: "FAQ" },
    { x: 260, y: 150, l: "WIDGET" },
  ];
  return (
    <svg viewBox="0 0 320 200" aria-hidden="true" focusable="false" className={className} fontFamily="var(--font-mono)">
      <g stroke="var(--accent)" strokeDasharray="3 4">
        {nodes.map((n) => (
          <line key={n.l} x1="160" y1="100" x2={n.x} y2={n.y} />
        ))}
      </g>
      <circle cx="160" cy="100" r="30" fill="var(--accent-soft)" stroke="var(--accent)" />
      <text x="160" y="104" textAnchor="middle" fontSize="11" fill="var(--accent-ink)">
        AGENT
      </text>
      {nodes.map((n) => (
        <g key={n.l}>
          <rect x={n.x - 34} y={n.y - 13} width="68" height="26" fill="var(--surface)" stroke="var(--line-strong)" />
          <text x={n.x} y={n.y + 4} textAnchor="middle" fontSize="9.5" letterSpacing="0.08em" fill="var(--muted)">
            {n.l}
          </text>
        </g>
      ))}
    </svg>
  );
}

function Fan({ cx, cy, r, accent = false }: { cx: number; cy: number; r: number; accent?: boolean }) {
  const stroke = accent ? "var(--accent)" : "var(--line-strong)";
  return (
    <g stroke={stroke} fill="none">
      <circle cx={cx} cy={cy} r={r} />
      <circle cx={cx} cy={cy} r={r * 0.28} fill={accent ? "var(--accent)" : "var(--line-strong)"} />
      {[0, 72, 144, 216, 288].map((a) => (
        <path
          key={a}
          d={`M${cx} ${cy - r * 0.28} Q${cx + r * 0.55} ${cy - r * 0.55} ${cx + r * 0.2} ${cy - r * 0.92}`}
          transform={`rotate(${a} ${cx} ${cy})`}
        />
      ))}
    </g>
  );
}

function Check({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <circle r="5.5" fill="var(--accent)" />
      <path d="M-2.6 0 l1.8 1.9 L2.8 -2" fill="none" stroke="var(--on-accent)" strokeWidth="1.4" />
    </g>
  );
}

// Blueprint of a custom PC build: the case, its parts, and compatibility callouts.
export function PcFigure({ className }: { className?: string }) {
  const callouts = [
    { y: 84, from: 136, label: "CPU", sub: "AM5 · 120W" },
    { y: 112, from: 167, label: "RAM", sub: "DDR5 · 2x16" },
    { y: 150, from: 190, label: "GPU", sub: "PCIe 4.0 x16" },
    { y: 228, from: 204, label: "PSU", sub: "850W · OK" },
  ];
  return (
    <svg viewBox="0 0 330 300" aria-hidden="true" focusable="false" className={className} fontFamily="var(--font-mono)">
      <text x="48" y="20" fontSize="10" letterSpacing="0.12em" fill="var(--muted)">
        BUILD · 01
      </text>

      {/* case */}
      <rect x="48" y="30" width="164" height="232" rx="6" fill="var(--surface)" stroke="var(--line-strong)" />
      <rect x="56" y="38" width="148" height="216" rx="3" fill="var(--accent-soft)" fillOpacity="0.35" stroke="var(--line)" />
      {/* glass glare */}
      <path d="M150 40 L196 40 L130 252 L84 252 Z" fill="var(--surface)" opacity="0.35" />

      {/* motherboard */}
      <rect x="66" y="50" width="110" height="140" fill="none" stroke="var(--line-strong)" />
      <g stroke="var(--line)">
        <line x1="66" y1="62" x2="92" y2="62" />
        <line x1="66" y1="72" x2="92" y2="72" />
      </g>

      {/* cpu cooler */}
      <rect x="96" y="64" width="40" height="40" rx="2" fill="var(--surface)" stroke="var(--line-strong)" />
      <Fan cx={116} cy={84} r={15} />

      {/* ram */}
      {[146, 153, 160, 167].map((x) => (
        <rect key={x} x={x} y="62" width="4" height="50" fill={x < 160 ? "var(--accent)" : "var(--line-strong)"} opacity={x < 160 ? 0.75 : 1} />
      ))}

      {/* m.2 */}
      <rect x="98" y="118" width="38" height="7" rx="1" fill="var(--line-strong)" />

      {/* gpu */}
      <rect x="64" y="136" width="126" height="30" rx="3" fill="var(--accent-soft)" stroke="var(--accent)" />
      <Fan cx={96} cy={151} r={11} accent />
      <Fan cx={150} cy={151} r={11} accent />

      {/* front intake fans */}
      <Fan cx={192} cy={66} r={8} />
      <Fan cx={192} cy={96} r={8} />

      {/* psu shroud */}
      <rect x="56" y="206" width="148" height="48" fill="var(--line)" stroke="var(--line-strong)" />
      <g stroke="var(--line-strong)">
        {[68, 76, 84, 92].map((x) => (
          <line key={x} x1={x} y1="218" x2={x} y2="242" />
        ))}
      </g>

      {/* dimension lines */}
      <g stroke="var(--muted)" strokeWidth="0.75">
        <line x1="32" y1="30" x2="32" y2="262" />
        <line x1="27" y1="30" x2="37" y2="30" />
        <line x1="27" y1="262" x2="37" y2="262" />
        <line x1="48" y1="278" x2="212" y2="278" />
        <line x1="48" y1="273" x2="48" y2="283" />
        <line x1="212" y1="273" x2="212" y2="283" />
      </g>
      <text x="24" y="146" fontSize="9.5" letterSpacing="0.1em" fill="var(--muted)" transform="rotate(-90 24 146)" textAnchor="middle">
        460 MM
      </text>
      <rect x="106" y="271" width="48" height="14" fill="var(--surface)" />
      <text x="130" y="281" fontSize="9.5" letterSpacing="0.1em" fill="var(--muted)" textAnchor="middle">
        230 MM
      </text>

      {/* compatibility callouts */}
      <g fontSize="11" letterSpacing="0.06em">
        {callouts.map((c) => (
          <g key={c.label}>
            <line x1={c.from} y1={c.y} x2="226" y2={c.y} stroke="var(--accent)" strokeDasharray="2 3" />
            <circle cx={c.from} cy={c.y} r="1.8" fill="var(--accent)" />
            <Check x={232} y={c.y} />
            <text x="242" y={c.y + 1} fill="var(--ink)">
              {c.label}
            </text>
            <text x="242" y={c.y + 11} fontSize="8.5" fill="var(--muted)">
              {c.sub}
            </text>
          </g>
        ))}
      </g>

      {/* live price tag */}
      <g transform="translate(236 258)">
        <rect width="84" height="24" rx="12" fill="var(--accent)" />
        <circle cx="11" cy="12" r="2.5" fill="var(--on-accent)" />
        <text x="49" y="16" textAnchor="middle" fontSize="9" letterSpacing="0.1em" fill="var(--on-accent)">
          LIVE PRICE
        </text>
      </g>
    </svg>
  );
}
