export function LogoMark({ size = 36 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <defs>
        <linearGradient id="logo-g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#8b5cf6" />
          <stop offset="1" stopColor="#ec4899" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="16" fill="url(#logo-g)" />
      <path
        d="M20 24 L12 32 L20 40"
        stroke="#fff"
        strokeWidth="4.5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M44 24 L52 32 L44 40"
        stroke="#fff"
        strokeWidth="4.5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="27" cy="28" r="3.2" fill="#fff" />
      <circle cx="37" cy="28" r="3.2" fill="#fff" />
      <path
        d="M25.5 36 Q32 43 38.5 36"
        stroke="#fff"
        strokeWidth="3.5"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function Logo({ size = 36 }: { size?: number }) {
  return (
    <span className="inline-flex items-center gap-2">
      <LogoMark size={size} />
      <span
        className="font-display text-xl font-semibold tracking-tight"
        style={{ fontSize: size * 0.62 }}
      >
        <span className="text-brand">Kids</span>
        <span className="text-accent">Code</span>
      </span>
    </span>
  );
}
