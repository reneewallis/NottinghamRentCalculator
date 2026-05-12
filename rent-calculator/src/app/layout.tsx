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
            <head><meta name="viewport" content="width=device-width, initial-scale=1.0" /></head>
            <body className={`${ubuntuFont.variable} antialiased bg-gray-500`}>
                {children}
            </body>
        </html>
    );
}
