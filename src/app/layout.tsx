import { Analytics } from "@vercel/analytics/next";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import type React from "react";
import { Suspense } from "react";

import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Money Computer Reading Notes",
    template: "%s | Money Computer Reading Notes",
  },
  description:
    "洞察・実験・定着を接続し、売上レバーを磨くための読書ノートをMDXで静的生成しています。",
  metadataBase: new URL("https://money-computer.com"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className={inter.variable}>
      <body className="font-sans antialiased">
        <Suspense>
          {children}
          <Analytics />
        </Suspense>
      </body>
    </html>
  );
}
