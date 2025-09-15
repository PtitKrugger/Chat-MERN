/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
        keyframes: {
            overlayShow: {
              from: { opacity: 0 },
              to: { opacity: 1 },
            },
            overlayHide: {
              from: { opacity: 1 },
              to: { opacity: 0 },
            },
            contentShow: {
              from: { opacity: 0, transform: "translate(-50%, -48%) scale(0.96)" },
              to: { opacity: 1, transform: "translate(-50%, -50%) scale(1)" },
            },
            contentHide: {
              from: { opacity: 1, transform: "translate(-50%, -50%) scale(1)" },
              to: { opacity: 0, transform: "translate(-50%, -48%) scale(0.96)" },
            },
          },
          animation: {
            overlayShow: "overlayShow 200ms ease-out",
            overlayHide: "overlayHide 200ms ease-in",
            contentShow: "contentShow 200ms ease-out",
            contentHide: "contentHide 200ms ease-in",
          },
    },
  },
  plugins: [],
};
