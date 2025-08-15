import type { Metadata } from "next";
import { Inter_Tight } from "next/font/google";
import "./globals.css";
import Footer from "./components/Footer";
import AppLayout from "./components/AppLayout";
import { Toaster } from "@/components/ui/sonner";
import Script from "next/script";

const body_font = Inter_Tight({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Recoards",
  description: "Make pretty recommendations boards for the things you love! Made with love by Knyro.",
  icons:{
    icon: "/icon/rounded_favicon.ico"
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
