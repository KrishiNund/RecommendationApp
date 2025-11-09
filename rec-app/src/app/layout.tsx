import type { Metadata } from "next";
import {Fredoka } from "next/font/google";
import "./globals.css";
import Footer from "./components/Footer";
import AppLayout from "./components/AppLayout";
import { Toaster } from "@/components/ui/sonner";
import Script from "next/script";

const body_font = Fredoka({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
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
        url: "/icon/social-preview.png",
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
      <body className={body_font.className}>
        <AppLayout>{children}</AppLayout>
        <Toaster richColors position="top-right" />
        <Footer />
      </body>
    </html>
  );
}
