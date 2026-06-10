import type { Metadata } from "next";
import { Geist } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const monaco = localFont({
  src: "../Menlo-Regular.ttf",
  variable: "--font-monaco",
});

const holland = localFont({
  src: "../Holland-eZyA6.ttf",
  variable: "--font-holland",
});

export const metadata: Metadata = {
  title: "tito.dev",
  description: "Product Designer",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${monaco.variable} ${holland.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
