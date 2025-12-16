import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // 👇 下面这部分就是你缺失的“调色盘”
      colors: {
        gold: {
          400: "#FACC15", // 明亮的金色
          500: "#EAB308", // 标准金色
        },
        mystic: {
          100: "#E0E7FF", // 极淡的紫/白
          600: "#4F46E5",
          700: "#4338ca",
          800: "#3730A3", // 深紫
          900: "#312E81", // 更深的紫
          950: "#1E1B4B", // 接近黑色的紫
        },
      },
      // 👆 补全结束
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};
export default config;
