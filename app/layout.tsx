import type { Metadata } from "next";
import { Lora, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-lora",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: "quack.sh — el pato won't give you the answer",
  description:
    "A rubber duck debugger powered by AI. El pato only asks questions. Never answers. You already have the answer.",
  icons: {
    icon: "/elpato-favicon.svg",
  },
  openGraph: {
    title: "quack.sh",
    description: "el pato won't give you the answer — you already have it",
    siteName: "quack.sh",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${lora.variable} ${jetbrains.variable}`}>
      <body>{children}</body>
    </html>
  );
}
