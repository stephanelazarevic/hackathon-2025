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

export const metadata: Metadata = {
  title: "Ervia",
  description: "Ervia - Assistant IA moderne pour vos évènements",
  //icon
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
    other: [
      {
        rel: "icon",
        url: "/img/ervia_small_logo.png",
        sizes: "16x16",
      },
      {
        rel: "icon",
        url: "/img/ervia_small_logo.png",
        sizes: "32x32",
      },
      {
        rel: "icon",
        url: "/img/ervia_small_logo.png",
        sizes: "48x48",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
