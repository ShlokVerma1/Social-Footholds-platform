import { Geist, Geist_Mono, Syne, Space_Grotesk } from "next/font/google";
import "./globals.css";
import "./app.css";
import { AuthProvider } from "@/context/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["700", "800"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata = {
  metadataBase: new URL('https://socialfootholds.com'),
  title: {
    default: 'Social Foothold LLC — YouTube Growth, Music Promotion & Channel SEO Agency',
    template: '%s | Social Foothold LLC',
  },
  description: 'Social Foothold LLC helps YouTube creators, musicians, and brands grow organically. We specialize in YouTube video promotion, channel SEO, Spotify promotion, video editing, Shorts creation, and professional web design.',
  keywords: [
    'YouTube promotion agency',
    'organic YouTube channel growth',
    'YouTube video promotion service',
    'Spotify playlist promotion',
    'Apple Music promotion',
    'channel SEO optimization',
    'YouTube Shorts creation',
    'professional video editing',
    'content creator growth agency',
    'music promotion service',
    'social media growth',
    'YouTube subscriber growth',
    'digital marketing for creators',
    'Social Foothold LLC',
  ],
  openGraph: {
    type: 'website',
    siteName: 'Social Foothold LLC',
    title: 'Social Foothold LLC — YouTube Growth, Music Promotion & Channel SEO Agency',
    description: 'We help YouTube creators, musicians, and brands grow their digital presence organically. Real results. No bots. Professional service.',
    url: 'https://socialfootholds.com',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Social Foothold LLC - Digital Growth Agency' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Social Foothold LLC — YouTube Growth & Music Promotion Agency',
    description: 'Organic YouTube promotion, channel SEO, Spotify promotion, Shorts creation, video editing and web services. Trusted by 25,000+ creators worldwide.',
  },
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://socialfootholds.com' },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} ${syne.variable} ${spaceGrotesk.variable}`}>
      <body>
        <AuthProvider>
          <div className="min-h-screen flex flex-col">
            <main className="flex-1">{children}</main>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
