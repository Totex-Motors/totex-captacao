import type { Metadata, Viewport } from "next";
import "./globals.css";
import FullscreenManager from "./components/FullscreenManager";

export const metadata: Metadata = {
  title: "Totex Captação",
  description: "Plataforma de captação automotiva Totex",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>
        <FullscreenManager />
        {children}
      </body>
    </html>
  );
}
