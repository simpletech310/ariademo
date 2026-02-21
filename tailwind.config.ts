import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                display: ["var(--font-outfit)", "system-ui", "sans-serif"],
                body: ["var(--font-inter)", "system-ui", "sans-serif"],
            },
            colors: {
                sage: {
                    50: "#f4f7f4",
                    100: "#e7ece7",
                    200: "#ced9ce",
                    300: "#a7bbae",
                    400: "#7a9484",
                    500: "#5c7868",
                    600: "#496053",
                    700: "#3c4e43",
                    800: "#323f37",
                    900: "#2a342f",
                },
                ink: "#2D2926",
            },
        },
    },
    plugins: [],
};
export default config;
