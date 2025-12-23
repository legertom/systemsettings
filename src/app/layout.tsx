import type { Metadata } from "next";
import "./globals.css";
import "jsoneditor/dist/jsoneditor.css";
import { ThemeToggle } from "@/components/ThemeToggle";

export const metadata: Metadata = {
  title: "System Settings Trainer",
  description: "Practice editing system settings safely.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(() => {
  const key = "sst-theme";
  const stored = localStorage.getItem(key); // "light" | "dark" | null (system)
  const systemDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  const isDark = stored === "dark" || (stored !== "light" && systemDark);
  document.documentElement.classList.toggle("dark", isDark);
  document.documentElement.style.colorScheme = isDark ? "dark" : "light";
})();`,
          }}
        />
      </head>
      <body className="antialiased">
        <div className="min-h-dvh bg-background text-foreground">
          <header className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
              <div className="text-sm font-semibold">System Settings Trainer</div>
              <div className="flex items-center gap-3">
                <div className="hidden text-xs text-zinc-600 dark:text-zinc-400 sm:block">
                  Anonymous practice environment
                </div>
                <ThemeToggle />
              </div>
            </div>
          </header>
          {children}
        </div>
      </body>
    </html>
  );
}
