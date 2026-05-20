import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sentinel Risk | Global Sports Event Geopolitical Briefing",
  description: "Level 1 Functional Simulation — Security Directors. Real-time threat monitoring, risk assessment, and distribution.",
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='50' cy='50' r='45' fill='none' stroke='%23ff6b00' stroke-width='4'/><circle cx='50' cy='50' r='8' fill='%23ff6b00'/></svg>",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}