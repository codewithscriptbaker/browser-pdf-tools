import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PDF Tools Admin",
  description: "Owner dashboard for PDF Tools analytics",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
