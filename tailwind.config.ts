import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

export default {
  content: ["./src/**/*.tsx"],
  theme: {
    extend: {
      transformOrigin: {
        midSize: "0px 10px",
        smallSize: "100% 80%",
      },
      colors: {
        primary: "var(--color-blue)",
        background: "var(--color-background)",
        gray: "var(--color-gray)",
        seperator: "var(--color-seperator)",
        seperatorSecondary: "var(--color-seperator-secondary)",
        textInputBackground: "var(--color-text-input)",
        navbarBackground: "var(--color-navbar-background)",
        opacNavbarBackground: "var(--color-opac-navbar-background)",

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
      backgroundImage: () => ({
        "background-gradient":
          "linear-gradient(180deg, #f1f3f5 0%, #d2dfe2 100%)",
        "dark-background-gradient":
          "linear-gradient(180deg, #000 0%, #2c3e50 100%)",
      }),
      fontFamily: {
        sans: ["var(--font-sans)", ...fontFamily.sans],
      },
    },
  },
  plugins: [],
} satisfies Config;
