import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://tutorialsadda.com"),
  title: "TutorialsAdda - Technical Tutorials & Engineering Guides",
  description: "Explore technical documentation, engineering guides, and structured tutorials.",
  icons: {
    icon: "/logo.jpeg",
    shortcut: "/logo.jpeg",
    apple: "/logo.jpeg",
  },
  openGraph: {
    title: "TutorialsAdda - Technical Tutorials & Engineering Guides",
    description: "Explore technical documentation, engineering guides, and structured tutorials.",
    images: [
      {
        url: "/banner.jpeg",
        width: 1200,
        height: 630,
        alt: "TutorialsAdda Banner",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "TutorialsAdda - Technical Tutorials & Engineering Guides",
    description: "Explore technical documentation, engineering guides, and structured tutorials.",
    images: ["/banner.jpeg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
