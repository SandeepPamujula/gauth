import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../styles/globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SessionProvider } from "@/components/SessionProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MyApp - Google Authentication",
  description: "Simple, secure authentication with Google",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider>
          <Navbar />
          {children}
          <Footer />
        </SessionProvider>
      </body>
    </html>
  );
}
