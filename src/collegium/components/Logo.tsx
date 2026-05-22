type Props = { className?: string; size?: number };

export function CollegiumLogo({ className = "", size = 36 }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="cgrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="hsl(354 55% 30%)" />
          <stop offset="100%" stopColor="hsl(354 55% 22%)" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="10" fill="url(#cgrad)" />
      <path
        d="M16 14h32v6h-12v32h-8V20H16z"
        fill="hsl(38 60% 60%)"
        opacity="0.95"
      />
      <circle cx="32" cy="32" r="1.6" fill="hsl(38 60% 75%)" />
    </svg>
  );
}
