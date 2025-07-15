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
  title: "Recommendation List App",
  description: "Make cool and pretty recommendations lists!"
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
