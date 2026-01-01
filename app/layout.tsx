import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ThemeProvider from "@/components/ThemeProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://madhav.pro"),
  title: {
    default: "Madhav's portfolio",
    template: "%s | Madhav",
  },
  description:
    "Full-Stack Developer and Machine Learning Engineer building AI-powered web applications with Next.js, React, TypeScript, and Python. Creating immersive experiences with GSAP and Three.js.",
  keywords: [
    "Madhavendranath",
    "Full-Stack Developer",
    "Machine Learning Engineer",
    "Next.js",
    "React",
    "TypeScript",
    "Python",
    "PyTorch",
    "GSAP",
    "Three.js",
    "Web Developer",
    "AI Developer",
  ],
  authors: [{ name: "Madhavendranath S", url: "https://madhav.pro" }],
  creator: "Madhavendranath S",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://madhav.pro",
    siteName: "Madhav's Portfolio",
    title: "Madhavendranath | Full-Stack Developer & ML Engineer",
    description:
      "Full-Stack Developer and Machine Learning Engineer building AI-powered web applications. Creating immersive experiences with modern web technologies.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
