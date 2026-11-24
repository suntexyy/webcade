import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import QueryProvider from "@/features/components/QueryProvider";
import Header from "@/features/components/Header";
import Footer from "@/features/components/Footer";
import { getQueryClient } from "@/features/lib/get-query-client";
import { categoriesQuery } from "@/features/lib/queries";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Webcade",
  description: "A web-based arcade for playing classic games online.",
  other: {
    "strix-verification": "strix-verify-0c48f39f005eac928f99845e7ba250ee",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery(categoriesQuery());

  return (
    <html lang="en">
      <body>
        <QueryProvider>
          <HydrationBoundary state={dehydrate(queryClient)}>
            <Header />
            {children}
            <Footer />
          </HydrationBoundary>
        </QueryProvider>
      </body>
    </html>
  );
}
