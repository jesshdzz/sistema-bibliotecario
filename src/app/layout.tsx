import type { Metadata } from "next";
import {
  JetBrains_Mono,
  Playfair_Display,
  Source_Serif_4,
} from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  axes: ["opsz"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Biblioteca UTM | Catálogo y Recursos",
  description: "Sistema de consulta y préstamos de libros",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      suppressHydrationWarning
      className={`${playfair.variable} ${sourceSerif.variable} ${jetbrainsMono.variable}`}
    >
      <head>
        <script
          // biome-ignore lint/security/noDangerouslySetInnerHtml: script estático propio
          dangerouslySetInnerHTML={{
            __html:
              'try{var t=localStorage.getItem("tema");if(t)document.documentElement.dataset.theme=t}catch(e){}',
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-base-200 text-base-content font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
