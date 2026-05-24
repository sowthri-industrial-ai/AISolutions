// Lucide-style line icons used by the control-plane chrome.
// Stroke uses currentColor so colors come from the parent — matches the
// CD bundle's `src/icons.jsx` exactly.

import type { SVGProps } from "react";

interface IconProps extends Omit<SVGProps<SVGSVGElement>, "stroke"> {
  size?: number;
  stroke?: number;
}

export function Icon({
  size = 14,
  stroke = 1.5,
  children,
  style,
  ...rest
}: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ display: "block", flexShrink: 0, ...style }}
      {...rest}
    >
      {children}
    </svg>
  );
}

export const IconChevronRight = (p: IconProps) => (
  <Icon {...p}><polyline points="9 18 15 12 9 6" /></Icon>
);
export const IconChevronDown = (p: IconProps) => (
  <Icon {...p}><polyline points="6 9 12 15 18 9" /></Icon>
);
export const IconSearch = (p: IconProps) => (
  <Icon {...p}>
    <circle cx="11" cy="11" r="7" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </Icon>
);
export const IconMoon = (p: IconProps) => (
  <Icon {...p}><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" /></Icon>
);
export const IconSun = (p: IconProps) => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
  </Icon>
);
export const IconArrowRight = (p: IconProps) => (
  <Icon {...p}>
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </Icon>
);
export const IconPlay = (p: IconProps) => (
  <Icon {...p}><polygon points="6 4 20 12 6 20 6 4" /></Icon>
);
export const IconCircle = (p: IconProps) => (
  <Icon {...p}><circle cx="12" cy="12" r="9" /></Icon>
);
export const IconArrowSm = (p: IconProps) => (
  <Icon {...p}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </Icon>
);
export const IconCommand = (p: IconProps) => (
  <Icon {...p}>
    <path d="M18 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3H6a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3V6a3 3 0 0 0-3-3 3 3 0 0 0-3 3 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 3 3 0 0 0-3-3z" />
  </Icon>
);

// Brand-y filled sparkle — used for the Claude model chip and the
// "Ask about this project" affordance.
interface SparkleProps extends Omit<SVGProps<SVGSVGElement>, "stroke"> {
  size?: number;
}
export function IconSparkle({ size = 14, style, ...rest }: SparkleProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      style={{ display: "block", ...style }}
      {...rest}
    >
      <path d="M12 2c.6 3.7 2.3 5.4 6 6-3.7.6-5.4 2.3-6 6-.6-3.7-2.3-5.4-6-6 3.7-.6 5.4-2.3 6-6zM19 14c.3 1.7 1 2.4 2.6 2.7-1.6.3-2.3 1-2.6 2.7-.3-1.7-1-2.4-2.6-2.7 1.6-.3 2.3-1 2.6-2.7zM5 13c.3 1.7 1 2.4 2.6 2.7C6 16 5.3 16.7 5 18.4 4.7 16.7 4 16 2.4 15.7 4 15.4 4.7 14.7 5 13z" />
    </svg>
  );
}
