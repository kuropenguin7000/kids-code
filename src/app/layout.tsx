import type { Metadata } from "next";
import { Fredoka, Nunito } from "next/font/google";
import { LocaleProvider } from "@/components/LocaleProvider";
import { AuthProvider } from "@/components/AuthProvider";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import "./globals.css";

const fredoka = Fredoka({
  subsets: ["latin"],
  variable: "--font-fredoka",
});

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
});

export const metadata: Metadata = {
  title: "KidsCode — Coding for kids",
  description:
    "Fun, bite-sized coding lessons that turn kids into real programmers.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${fredoka.variable} ${nunito.variable} flex min-h-screen flex-col antialiased`}
      >
        <LocaleProvider>
          <AuthProvider>
            <Navbar />
            <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-6">
              {children}
            </main>
            <Footer />
          </AuthProvider>
        </LocaleProvider>
      </body>
    </html>
  );
}
