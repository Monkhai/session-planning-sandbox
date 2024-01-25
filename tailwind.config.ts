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
        seperatorSecondary: "var(--color-seperator-secondary)",
        textInputBackground: "var(--color-text-input)",
        navbarBackground: "var(--color-navbar-background)",

        darkBackground: "var(--color-dark-background)",
        darkSecondaryBackground: "var(--color-dark-secondary-background)",
        darkTeritaryBackground: "var(--color-dark-tertiary-background)",
        darkSeperator: "var(--color-dark-seperator)",
        darkSeperatorSecondary: "var(--color-dark-seperator-secondary)",
        darkTextInput: "var(--color-dark-text-input)",
        darkTextInputBackground: "var(--color-dark-text-input-field)",
        darkSecondaryTextInputBackground:
          "var(--color-dark-secondary-text-input-field)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", ...fontFamily.sans],
      },
    },
  },
  plugins: [],
} satisfies Config;
