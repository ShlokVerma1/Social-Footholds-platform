import { Geist, Geist_Mono } from "next/font/google";
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

export const metadata = {
  title: {
    default: 'Social Footholds — Grow Your Channel, Reach Millions',
    template: '%s | Social Footholds',
  },
  description: 'Join 25,000+ creators worldwide. Professional YouTube promotion, music promotion, channel SEO, video editing, shorts creation and web services.',
  keywords: ['YouTube promotion', 'channel growth', 'music promotion', 'channel SEO', 'video editing', 'content creator services'],
  openGraph: {
    type: 'website',
    siteName: 'Social Footholds',
    title: 'Social Footholds — Grow Your Channel, Reach Millions',
    description: 'Professional creator services to grow your audience and reach millions.',
    url: 'https://socialfootholds.com',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Social Footholds',
    description: 'Grow your channel and reach millions.',
  },
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://socialfootholds.com' },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
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
