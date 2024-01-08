import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

export default {
  content: ["./src/**/*.tsx"],
  theme: {
    extend: {
      colors: {
        primary: "var(--color-blue)",
        background: "var(--color-background)",
        gray: "var(--color-gray)",
        seperator: "var(--color-seperator)",
        textInput: "var(--color-text-input)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", ...fontFamily.sans],
      },
    },
  },
  plugins: [],
} satisfies Config;
