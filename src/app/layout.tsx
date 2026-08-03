import type { Metadata } from "next";
import { IBM_Plex_Mono, IBM_Plex_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { site } from "@/lib/config";
import { siteUrl } from "@/lib/format";

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const plexSans = IBM_Plex_Sans({
  variable: "--font-plex-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  // Needed so OG/Twitter image URLs (from opengraph-image.tsx files)
  // resolve to an absolute URL instead of defaulting to localhost. Set
  // site.domain in src/lib/config.ts once you have a real one.
  metadataBase: new URL(siteUrl(site.domain)),
  title: `${site.brand} — ${site.name}`,
  description: site.summary,
  openGraph: {
    title: `${site.brand} — ${site.name}`,
    description: site.summary,
    type: "website",
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
      className={`${plexMono.variable} ${plexSans.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-ink text-text">
        {/* Runs before first paint to set the saved/system theme, avoiding a
            flash of the wrong theme. Kept tiny and defensive (try/catch). */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');if(t!=='light'&&t!=='dark'){t=window.matchMedia('(prefers-color-scheme: light)').matches?'light':'dark';}if(t==='light'){document.documentElement.setAttribute('data-theme','light');}}catch(e){}})();`,
          }}
        />
        <Nav />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
