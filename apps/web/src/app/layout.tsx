import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppShell } from "@/components/layout/AppShell";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ContextNode - The Context Behind Better AI Development",
  description: "Discover, reuse, and publish AI prompts, context packs, and repeatable workflows for developers.",
  icons: {
    icon: "/contextnode-logo.png",
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body 
        className="h-full overflow-hidden bg-[#05060A] text-white selection:bg-[#FE7F2D]/30 selection:text-white"
        suppressHydrationWarning
      >
        <AppShell>
          {children}
        </AppShell>
      </body>
    </html>
  );
}
