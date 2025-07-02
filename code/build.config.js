// Build configuration for Leirisonda project
module.exports = {
  // Input source directory
  src: "./client",

  // Output directory (should match leirisonda-deploy)
  dist: "../leirisonda-deploy",

  // Baby blue theme colors
  theme: {
    primary: "#87CEFA", // Sky blue
    secondary: "#ADD8E6", // Light blue
    accent: "#007784", // Teal (for buttons/accents)
  },

  // CSS custom properties
  cssVariables: {
    "--baby-blue-primary": "#87CEFA",
    "--baby-blue-secondary": "#ADD8E6",
    "--login-gradient": "linear-gradient(135deg, #87CEFA, #ADD8E6)",
  },

  // Manifest theme color
  manifestThemeColor: "#87CEFA",

  // Build targets
  targets: ["es2020", "chrome80", "firefox80", "safari13"],

  // Asset optimization
  assets: {
    images: true,
    fonts: true,
    minify: true,
  },
};
