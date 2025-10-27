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

          {/* send icon */}
          <g
            transform="translate(20,10) scale(0.35) translate(-77, -55)"
            filter={`url(#glow-make-${gid})`}
          >
            <path
              fill="white"
              d="M 73.938034 32.635498 C 13.362068 93 13.362068 93 8.74913 93 C 4.798767 93 3.839134 92.582825 2.068092 90.095627 C 0.838249 88.368469 0 85.6306 0 83.340881 C 0 79.605225 1.176941 78.313812 39.503471 39.995255 C 79.006943 0.5 79.006943 0.5 83.753464 0.187408 C 88.5 -0.125183 88.5 -0.125183 128.25 39.740479 C 168 79.606125 168 79.606125 168 84.23497 C 168 88.231949 167.592392 89.154053 165.013931 90.990082 C 162.888138 92.503784 160.870071 93.027573 158.009171 92.808182 C 154.197495 92.515869 152.419662 90.929245 123.495239 62.006149 L 93 31.512299 L 93 122.069061 C 93 212.625824 93 212.625824 90.195282 215.312912 C 88.240814 217.18541 86.327057 218 83.88237 218 C 81.273254 218 79.621475 217.214447 77.437088 214.934753 C 74.5 211.869492 74.5 211.869492 74.219009 122.252487 L 73.938034 32.635498 Z"
            />
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

