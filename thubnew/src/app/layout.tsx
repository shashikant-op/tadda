import type { Metadata } from "next";
import "./globals.css";

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
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: `(function(){try{var t=localStorage.getItem('tutorialsadda-theme');if(!['quiet','fresh','night'].includes(t)){t=window.matchMedia('(prefers-color-scheme: dark)').matches?'night':'quiet'}document.documentElement.dataset.theme=t;document.documentElement.style.colorScheme=t==='night'?'dark':'light'}catch(e){document.documentElement.dataset.theme='quiet'}})();` }} />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
