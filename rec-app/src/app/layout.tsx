import type { Metadata } from "next";
import { Inter_Tight } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

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
      <body
        className={body_font.className}
      >
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
