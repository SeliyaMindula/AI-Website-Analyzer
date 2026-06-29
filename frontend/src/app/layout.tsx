import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SiteHeader } from "@/components/SiteHeader";
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
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.webpulsesai.com'),
  title: "WebPulse AI",
  description: "Pulse-check the web — site analysis, internet speed, DNS, SSL, uptime, and IP geolocation tools.",
  openGraph: {
    title: "WebPulse AI",
    description: "Pulse-check the web — site analysis, internet speed, DNS, SSL, uptime, and IP geolocation tools.",
    siteName: "WebPulse AI",
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
      className={`dark ${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-zinc-950 text-zinc-100">
        <SiteHeader />
        {children}
      </body>
    </html>
  );
}
