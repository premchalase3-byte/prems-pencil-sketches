import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  title: "PREM'S Pencil Sketches | Custom Handmade Portraits in India",

  description:
    "Transform your favorite photos into realistic handmade pencil sketches. Custom portrait sketches, couple sketches, family portraits, pet portraits, and gift sketches delivered across India.",

  keywords: [
    "pencil sketch artist India",
    "custom pencil portrait",
    "photo to pencil sketch",
    "portrait sketch artist",
    "handmade pencil sketch",
    "couple portrait sketch",
    "family portrait sketch",
    "pet portrait sketch",
    "custom sketch gift",
    "realistic pencil drawing",
    "pencil sketches India",
    "portrait artist India",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfair.variable}`}
    >
      <body className="min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}