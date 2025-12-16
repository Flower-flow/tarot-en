import type { Metadata } from "next";
import React from "react";
import { Inter, Crimson_Text } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const crimson = Crimson_Text({ weight: ["400", "600", "700"], subsets: ["latin"], variable: "--font-crimson" });

export const metadata: Metadata = {
  title: "行动塔罗 - Action Tarot",
  description: "Your blunt, insightful tarot friend.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className={`${inter.variable} ${crimson.variable} font-sans`}>{children}</body>
    </html>
  );
}