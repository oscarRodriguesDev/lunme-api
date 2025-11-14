import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        background: "#0A4D4D",
        foreground: "var(--foreground)",

        // Tema Tivi substituído pela sua paleta
        tivi: {
          primary: "#009E9D", // Azul Turquesa forte
          secondary: "#1DD1C1", // Turquesa claro
          tertiary: "#64E6DA", // Ciano suave
          light: "#A7FFF7", // Azul/Turquesa bem claro
          white: "##009E9D", // Branco puro
        },

        // Azul Petróleo / Verde Azulado
        petroleum: {
          50: "#9FE4D6",
          100: "#66BFBF",
          200: "#3A9D9D",
          300: "#1E6F6F",
          400: "#0A4D4D",
        },

        // Cinza Escuro / Preto (fundos)
        dark: {
          50: "#3A3A3A",
          100: "#2E2E2E",
          200: "#222222",
          300: "#1E6F6F", // repetindo para coerência
          400: "#0A4D4D",
        },

    

        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",

        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },

      padding: {
        "extra-sm": "6px",
        "extra-lg": "48px",
        "98": "500px",
        "100": "600px",
      },

      spacing: {
        'ml-perc-1': '10%',
        'ml-perc-2': '15%',
        'ml-perc-3': '30%',
        'ml-perc-4': '40%',
        'ml-perc-5': '50%',
        'ml-perc-6': '80%',
      },

      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },

      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },

      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}

export default config
