module.exports = {
  important: true,
  theme: {
    extend: {
      colors: {
        primary: "#7eec00",
        secondary: "#0080ff",
        accent: "#F74371",
      },
      fontFamily: {
        display: "Libre Baskerville, Arial, sans-serif",
        body: "Noto Sans JP, Arial, sans-serif",
      },
      animation: {
        fadeIn: 'fadeIn 0.3s ease-in-out',
        slideDown: 'slideDown 0.3s ease-in-out',
        slideUp: 'slideUp 0.3s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  content: [
    "./components/**/*.jsx", // all components
    "./pages/**/*.js", // all pages as well
  ],
  plugins: [
    require("@tailwindcss/forms")({
      strategy: "class",
    }),
    require("@tailwindcss/typography"),
  ],
};
