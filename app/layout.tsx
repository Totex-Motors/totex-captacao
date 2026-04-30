import type { Metadata } from "next";
import "./globals.css";
import AutoFullscreen from "./components/kiosk/AutoFullscreen";

export const metadata: Metadata = {
  title: "Totex Captação",
  description: "Plataforma de captação automotiva Totex",
  icons: {
    icon: [
      {
        url: "/imports/logo_totex.png",
        type: "image/png",
      },
    ],
    apple: [
      {
        url: "/imports/logo_totex.png",
        type: "image/png",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>
        <AutoFullscreen />
        {children}
      </body>
    </html>
  );
}
