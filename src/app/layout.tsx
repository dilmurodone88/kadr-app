import type { Metadata } from "next";
import { IBM_Plex_Sans } from "next/font/google";
import "./globals.css";

const plex = IBM_Plex_Sans({
  weight: ["400", "500", "600"],
  subsets: ["latin", "latin-ext"],
  variable: "--font-plex",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Kadr boshqaruv tizimi",
  description: "Tashkilot kadrlar boshqaruvi — buyruqlar, arizalar va hisobotlar",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="uz" className={plex.variable}>
      <body>{children}</body>
    </html>
  );
}
