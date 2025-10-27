import * as React from "react";
import './buttons.css';

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  label?: string;
};

export const MakeButton = React.forwardRef<HTMLButtonElement, Props>(
  ({ label = "Make", className, ...btn }, ref) => {
    const gid = React.useId();
    return (
      <button
        ref={ref}
        aria-label={label}
        {...btn}
        className={className}
        style={{
          border: "0",
          background: "transparent",
          padding: 0,
          cursor: "pointer",
          outline: "none",
        }}
      >
        <svg
          width="240"
          height="48"
          viewBox="0 0 240 48"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-label={`${label} button`}
        >
          <defs>
            <linearGradient id={`g-make-${gid}`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#FF2DAA" />
              <stop offset="100%" stopColor="#33FFF2" />
            </linearGradient>
            <filter id={`glow-make-${gid}`} x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="6" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* pill */}
          <rect x="1" y="1" rx="24" ry="24" width="238" height="46" fill={`url(#g-make-${gid})`} />
          {/* inner glass sheen */}
          <rect x="3" y="3" rx="22" ry="22" width="234" height="42" fill="white" opacity="0.08" />

          {/* icon (magic wand/sparkle) */}
          <g
            transform="translate(20,10)"
            stroke="white"
            strokeWidth="2"
            fill="none"
            filter={`url(#glow-make-${gid})`}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {/* Sparkle/wand icon */}
            <path d="M12 0 L12 14 M4 6 L20 6 M8.4 2 L8.4 10 M15.6 2 L15.6 10" />
            <circle cx="12" cy="16" r="2" fill="white" />
          </g>

          {/* label */}
          <text
            x="120"
            y="30"
            textAnchor="middle"
            fontFamily="Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial"
            fontSize="16"
            fontWeight="600"
            fill="white"
            letterSpacing=".3px"
          >
            {label}
          </text>
        </svg>
      </button>
    );
  }
);
MakeButton.displayName = "MakeButton";

