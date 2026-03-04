import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PassTheBot — ATS Resume Scanner for Software Engineers",
  description:
    "See exactly why ATS systems reject your tech resume — and fix it in minutes. Free scan, instant results.",
  openGraph: {
    title: "PassTheBot — ATS Resume Scanner",
    description: "See exactly why ATS systems reject your tech resume and fix it in minutes.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
