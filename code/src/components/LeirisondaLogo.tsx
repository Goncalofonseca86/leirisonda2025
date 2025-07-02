import React from "react";

interface LeirisondaLogoProps {
  className?: string;
  width?: number;
  height?: number;
}

export const LeirisondaLogo: React.FC<LeirisondaLogoProps> = ({
  className = "",
  width = 180,
  height = 60,
}) => {
  return (
    <div className={`inline-flex items-center ${className}`}>
      <img
        src="/leirisonda-logo-complete.svg"
        alt="Leirisonda Logo"
        width={width}
        height={height}
        className="h-auto w-auto max-w-full"
        style={{
          maxWidth: `${width}px`,
          maxHeight: `${height}px`,
        }}
        onError={(e) => {
          // Fallback to text logo if image fails to load
          const target = e.target as HTMLImageElement;
          target.style.display = "none";
          const parent = target.parentElement;
          if (parent) {
            parent.innerHTML = `
              <div class="flex items-center space-x-2">
                <div class="w-8 h-8 bg-gradient-to-br from-baby-blue-400 to-baby-blue-500 rounded-lg flex items-center justify-center">
                  <span class="text-white font-bold text-lg">L</span>
                </div>
                <span class="text-2xl font-bold text-gray-800">Leirisonda</span>
              </div>
            `;
          }
        }}
      />
    </div>
  );
};

export default LeirisondaLogo;
