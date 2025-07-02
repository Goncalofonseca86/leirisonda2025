import React from "react";

interface LeirisondaLogoProps {
  className?: string;
  width?: number;
  height?: number;
}

export const LeirisondaLogo: React.FC<LeirisondaLogoProps> = ({
  className = "",
  width = 120,
  height = 40,
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 120 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Leirisonda Logo SVG */}
      <rect width="120" height="40" rx="8" fill="#007784" />
      <text
        x="60"
        y="25"
        textAnchor="middle"
        fill="white"
        fontSize="14"
        fontWeight="600"
        fontFamily="Open Sans, sans-serif"
      >
        LEIRISONDA
      </text>
      <circle cx="15" cy="12" r="3" fill="#87CEFA" />
      <circle cx="25" cy="12" r="2" fill="#ADD8E6" />
      <circle cx="105" cy="28" r="3" fill="#87CEFA" />
      <circle cx="95" cy="28" r="2" fill="#ADD8E6" />
    </svg>
  );
};

export default LeirisondaLogo;
