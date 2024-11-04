import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";

import { ClerkProvider } from "@clerk/nextjs";
import { QueryProvider } from "@/components/providers/query-provider";
import { Toaster } from "sonner";

const roboto = Roboto({
  weight: ["300", "400", "500", "700", "900"],
  subsets: ["latin"],
  fallback: ["sans-serif"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Chat App",
  description: "A chat app built with Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${roboto.className} antialiased`}>
          <QueryProvider>{children}</QueryProvider>
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}
