import type { Metadata } from 'next';
import { Playfair_Display, Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Biblioteca UTM | Catálogo y Recursos',
  description: 'Sistema de consulta y préstamos de libros',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang='es'
      data-theme='biblioteca-light'
      className={`${playfair.variable} ${inter.variable} ${jetbrainsMono.variable}`}>
      <body className='min-h-screen flex flex-col bg-base-200 text-base-content font-sans antialiased'>
        {children}
      </body>
    </html>
  );
}
