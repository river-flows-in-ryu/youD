import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "./globals.css";

import { Suspense } from "react";

import MainLayout from "@/components/mainLayout";
import TabBar from "@/components/tabBar";
import Loading from "./loading";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={inter.className}>
        <Suspense fallback={<Loading />}>
          <MainLayout />
          <div className="min-h-[calc(100vh-theme('spacing.mobile'))] sm:min-h-[calc(100vh-theme('spacing.web'))] flex items-stretch overflow-y-auto  sm:pb-0">
            {children}
          </div>
          <TabBar />
        </Suspense>
      </body>
    </html>
  );
}
