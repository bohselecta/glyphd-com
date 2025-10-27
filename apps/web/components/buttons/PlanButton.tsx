import * as React from "react";
import './buttons.css';

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  label?: string;
};

export const PlanButton = React.forwardRef<HTMLButtonElement, Props>(
  ({ label = "Plan", className, ...btn }, ref) => {
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
          aria-labelledby={`planTitle-${gid}`}
        >
          <title id={`planTitle-${gid}`}>{label} button</title>
          <defs>
            <linearGradient id={`g-plan-${gid}`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#FF2DAA" />
              <stop offset="100%" stopColor="#33FFF2" />
            </linearGradient>
          </defs>

          {/* neon border */}
          <rect
            x="1"
            y="1"
            rx="24"
            ry="24"
            width="238"
            height="46"
            fill="none"
            stroke={`url(#g-plan-${gid})`}
            strokeOpacity=".6"
          />
          {/* glass body */}
          <rect x="3" y="3" rx="22" ry="22" width="234" height="42" fill="#0B0C10" opacity=".72" />

          {/* ellipsis icon */}
          <g transform="translate(20,24)" fill={`url(#g-plan-${gid})`}>
            <circle r="2.2" cx="0" cy="0" />
            <circle r="2.2" cx="8" cy="0" />
            <circle r="2.2" cx="16" cy="0" />
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
PlanButton.displayName = "PlanButton";

