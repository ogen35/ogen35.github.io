import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const title = "IDOI — Virtual Idol / Signal 01";
const description = "Enter the IDOI signal: a luminous virtual idol experience shaped by sound, emotion and refracted light.";

export const metadata: Metadata = {
  metadataBase: new URL("https://ogen35.github.io"),
  title,
  description,
  openGraph: { title, description, images: [{ url: "/og.png", width: 1675, height: 939, alt: "IDOI virtual idol signal" }] },
  twitter: { card: "summary_large_image", title, description, images: ["/og.png"] },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <head>
        <script src="/pages-fallback.js" defer />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
