import * as React from "react";
import './buttons.css';

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  ariaLabel?: string;
  size?: number; // pixel size of the square button (default 56)
};

export const SendButton = React.forwardRef<HTMLButtonElement, Props>(
  ({ ariaLabel = "Send", size = 56, className, ...btn }, ref) => {
    const gid = React.useId();
    return (
      <button
        ref={ref}
        aria-label={ariaLabel}
        {...btn}
        className={className}
        style={{
          border: "0",
          background: "transparent",
          padding: 0,
          cursor: "pointer",
          outline: "none",
          width: size,
          height: size,
        }}
      >
        <svg
          width={size}
          height={size}
          viewBox="0 0 56 56"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-labelledby={`sendTitle-${gid}`}
        >
          <title id={`sendTitle-${gid}`}>{ariaLabel}</title>
          <defs>
            <linearGradient id={`g-send-${gid}`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#FF2DAA" />
              <stop offset="100%" stopColor="#33FFF2" />
            </linearGradient>
            <filter id={`send-glow-${gid}`} x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* circle body */}
          <circle cx="28" cy="28" r="26" fill="#0B0C10" stroke={`url(#g-send-${gid})`} strokeOpacity=".5" />

          {/* up-arrow */}
          <g
            stroke={`url(#g-send-${gid})`}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            filter={`url(#send-glow-${gid})`}
          >
            <path d="M14 42 L42 14" />
            <path d="M42 14 H29 M42 14 V27" />
          </g>
        </svg>
      </button>
    );
  }
);
SendButton.displayName = "SendButton";

