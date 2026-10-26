import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        cream: "var(--bg)",
        paper: "var(--paper)",
        ink: "var(--ink)",
        muted: "var(--muted)",
        pine: "var(--pine)",
        "on-pine": "var(--on-pine)",
        clay: "var(--clay)",
        line: "var(--line)",
        gold: "var(--gold)",
        soft: "var(--soft)",
        focus: "var(--focus)",
      },
      fontFamily: {
        sans: ['"Atkinson Hyperlegible"', "ui-sans-serif", "system-ui", "sans-serif"],
        serif: ["Fraunces", "ui-serif", "Georgia", "serif"],
      },
      boxShadow: {
        card: "0 1px 0 rgba(28, 25, 21, 0.04), 0 12px 32px rgba(28, 25, 21, 0.06)",
      },
      maxWidth: {
        page: "72rem",
      },
    },
  },
  plugins: [],
};

export default config;
