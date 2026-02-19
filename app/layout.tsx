import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CodeFusion",
  description: "AI-native browser IDE platform"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark">
      <body>{children}</body>
    </html>
  );
}
