/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#233238",
        paper: "#f6f3ee",
        moss: "#6f8f7c",
        coral: "#d97c65",
        tide: "#4b8f9f"
      },
      boxShadow: {
        soft: "0 18px 45px rgba(35, 50, 56, 0.08)",
        premium: "0 30px 80px rgba(35, 50, 56, 0.14)"
      }
    }
  },
  plugins: []
};
