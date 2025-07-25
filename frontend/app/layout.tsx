import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "REPRODUTOR SYSTEM HAHA",
  description: "BY OS CARA, PIRANHA",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <body
        className={`${inter.variable} font-sans antialiased`}
      >
        <main className="w-screen h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}
