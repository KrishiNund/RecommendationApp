import type { Metadata } from "next";
import {Fredoka } from "next/font/google";
import "./globals.css";
import Footer from "./components/Footer";
import AppLayout from "./components/AppLayout";
import { Toaster } from "@/components/ui/sonner";
import Script from "next/script";

const body_font = Fredoka({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"], // You can add more weights as needed, e.g. ["400", "700"]
});

export const metadata: Metadata = {
  title: "Recoards",
  description: "Make pretty recommendations boards for the things you love! Made with love by Knyro.",
  icons:{
    icon: "/icon/rounded_favicon.ico"
  },
  openGraph: {
    title: "Recoards",
    description: "Make pretty recommendation boards for the things you love! Made with love by Knyro.",
    siteName: "Recoards",
    images: [
      {
        url: "/icon/social-preview.png", // <-- new image just for social thumbnails
        alt: "Recoards - make pretty recommendation boards"
      }
    ],
    type: "website"
  },
  twitter: {
    card: "summary_large_image"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Google Analytics Tag */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-EVN1WXDYD6"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-EVN1WXDYD6');
          `}
        </Script>
      </head>
      <body className={body_font.className}>
        <AppLayout>{children}</AppLayout>
        <Toaster richColors position="top-right" />
        <Footer />
      </body>
    </html>
  );
}
