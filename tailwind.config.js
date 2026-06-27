/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          '"Plus Jakarta Sans"',
          '"PingFang SC"',
          '"HarmonyOS Sans SC"',
          '"Source Han Sans SC"',
          '"Microsoft YaHei"',
          "ui-sans-serif",
          "system-ui",
          "sans-serif"
        ],
        display: [
          '"Plus Jakarta Sans"',
          '"PingFang SC"',
          '"HarmonyOS Sans SC"',
          '"Source Han Sans SC"',
          "ui-sans-serif",
          "system-ui",
          "sans-serif"
        ]
      },
      letterSpacing: {
        tightish: "-0.012em"
      },
      colors: {
        ink: {
          DEFAULT: "#233238",
          soft: "#3c4f56",
          muted: "#6b7d83"
        },
        paper: {
          DEFAULT: "#f6f3ee",
          warm: "#faf7f2"
        },
        moss: {
          DEFAULT: "#6f8f7c",
          50: "#eef3f0",
          600: "#587665"
        },
        coral: {
          DEFAULT: "#d97c65",
          50: "#fbeee9",
          600: "#c2664f"
        },
        tide: {
          DEFAULT: "#4b8f9f",
          50: "#e9f2f4",
          600: "#3a7585"
        },
        sun: {
          DEFAULT: "#d9b365",
          50: "#f8f1e2"
        }
      },
      borderRadius: {
        xl: "16px",
        "2xl": "20px",
        "3xl": "28px"
      },
      boxShadow: {
        card: "0 4px 14px rgba(35, 50, 56, 0.05), 0 1px 2px rgba(35, 50, 56, 0.04)",
        float: "0 14px 36px rgba(35, 50, 56, 0.09)",
        soft: "0 18px 45px rgba(35, 50, 56, 0.08)",
        premium: "0 34px 80px rgba(35, 50, 56, 0.16)",
        glow: "0 0 0 4px rgba(75, 143, 159, 0.12)"
      },
      keyframes: {
        "fade-rise": {
          from: { opacity: "0", transform: "translateY(10px)" },
          to: { opacity: "1", transform: "translateY(0)" }
        },
        "ring-draw": {
          from: { strokeDashoffset: "var(--dash)" },
          to: { strokeDashoffset: "0" }
        }
      },
      animation: {
        "fade-rise": "fade-rise 480ms cubic-bezier(0.22, 1, 0.36, 1) both"
      }
    }
  },
  plugins: []
};
