import type { Metadata } from "next";
import Script from "next/script";
import { Geist, Geist_Mono, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const inter = Inter({ variable: "--font-inter", subsets: ["latin"], weight: ["400", "500", "600"] });
const jetbrainsMono = JetBrains_Mono({ variable: "--font-jetbrains-mono", subsets: ["latin"], weight: ["400"] });

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
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} ${jetbrainsMono.variable} h-full antialiased`} data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <Script id="theme-init" strategy="beforeInteractive">{`(function(){try{var t=localStorage.getItem('tutorialsadda-theme');if(!['quiet','fresh','night'].includes(t)){t='fresh'}document.documentElement.dataset.theme=t;document.documentElement.style.colorScheme=t==='night'?'dark':'light'}catch(e){document.documentElement.dataset.theme='fresh'}})();`}</Script>
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
