import type { Metadata } from "next";
import { Inter_Tight } from "next/font/google";
import "./globals.css";
import Footer from "./components/Footer";
import AppLayout from "./components/AppLayout";
import { Toaster } from "@/components/ui/sonner";

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
      <body className={body_font.className}>
        <AppLayout>{children}</AppLayout>
        <Toaster richColors position="top-right" />
        <Footer />
      </body>
    </html>
  );
}
