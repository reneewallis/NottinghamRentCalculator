import type { Metadata } from "next";
import { Ubuntu } from "next/font/google";
import "./globals.css";

const ubuntuFont = Ubuntu({
  variable: "--font-ubuntu",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Nottingham Rent Calculator",
  description: "Rent Calculator",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-GB">
      <body className={`${ubuntuFont.variable} antialiased`}>{children}</body>
    </html>
  );
}
