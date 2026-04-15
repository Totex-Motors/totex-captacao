import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Totex Captação",
  description: "Plataforma de captação automotiva Totex",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
