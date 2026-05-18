import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Team 27 - SEL",
  description: "AI Native Enterprise Lab - Team 27",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}