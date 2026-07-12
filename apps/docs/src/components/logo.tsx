export const Logo = ({ size = 22 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" aria-hidden="true">
    <line
      x1="15"
      y1="9"
      x2="15"
      y2="45"
      stroke="var(--bk-color-accent)"
      strokeWidth="6"
      strokeLinecap="round"
    />
    <rect
      x="15"
      y="28"
      width="36"
      height="26"
      rx="9"
      stroke="var(--bk-color-accent)"
      strokeWidth="6"
    />
  </svg>
);
