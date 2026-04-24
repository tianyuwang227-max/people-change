import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0b111f",
        mist: "#f5f3ed",
        steel: "#8fa2c7",
        ember: "#f97316",
        pulse: "#14b8a6",
        gold: "#facc15",
      },
      boxShadow: {
        panel: "0 24px 60px rgba(11, 17, 31, 0.18)",
      },
      backgroundImage: {
        grain:
          "radial-gradient(circle at 20% 20%, rgba(250, 204, 21, 0.16), transparent 28%), radial-gradient(circle at 85% 10%, rgba(20, 184, 166, 0.14), transparent 24%), radial-gradient(circle at 50% 100%, rgba(249, 115, 22, 0.16), transparent 28%)",
      },
      fontFamily: {
        display: ["Space Grotesk", "sans-serif"],
        body: ["IBM Plex Sans", "sans-serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;
