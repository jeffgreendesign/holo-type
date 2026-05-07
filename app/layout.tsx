import type { Metadata } from "next";
import { ThemeToggle } from "./components/ThemeToggle";
import { AmbientBackground } from "./components/AmbientBackground";
import "./globals.css";

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
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@1,700&family=Barlow:wght@400;500;600&family=JetBrains+Mono:wght@700&display=swap"
          rel="stylesheet"
        />
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
