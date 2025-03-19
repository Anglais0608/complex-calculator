"use client";

import { Inter } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import ThemeToggle from "../components/ui/ThemeToggle";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <main className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
            <div className="container mx-auto max-w-6xl">
              <header className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                  Calculatrice Complexe
                </h1>
                <ThemeToggle />
              </header>
              {children}
            </div>
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}

export const metadata = {
  title: "Calculatrice Complexe",
  description: "Une calculatrice avancée avec support pour les nombres complexes et graphiques 3D",
};
