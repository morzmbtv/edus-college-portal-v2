import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "#172033",
        canvas: "#F5F7FB",
        primary: "#2563EB",
      },
      boxShadow: {
        card: "0 8px 30px rgba(30, 56, 90, 0.06)",
      },
    },
  },
  plugins: [],
} satisfies Config;
