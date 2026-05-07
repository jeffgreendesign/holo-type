import type { Metadata } from "next";
import { Barlow, Barlow_Condensed, JetBrains_Mono, Source_Sans_3 } from "next/font/google";
import { ThemeToggle } from "./components/ThemeToggle";
import { AmbientBackground } from "./components/AmbientBackground";
import "./globals.css";

const barlow = Barlow({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-barlow",
});

const barlowCondensed = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["700"],
  style: ["italic"],
  variable: "--font-barlow-condensed",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["700"],
  variable: "--font-jetbrains-mono",
});

const sourceSans3 = Source_Sans_3({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-source-sans-3",
});

export const metadata: Metadata = {
  title: "Holo-Type | AI Athlete Archetypes",
  description: "Generate AI-powered athlete archetypes with a holographic aesthetic.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${barlow.variable} ${barlowCondensed.variable} ${jetbrainsMono.variable} ${sourceSans3.variable} h-full antialiased`} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const theme = localStorage.getItem('theme') || 'light';
                if (theme === 'dark') {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-bg-main text-text-main font-body">
        <AmbientBackground />
        <ThemeToggle />
        {children}
      </body>
    </html>
  );
}
