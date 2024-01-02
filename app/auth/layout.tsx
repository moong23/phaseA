"use client";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import Topbar from "@/components/topbar";
import { RecoilRoot } from "recoil";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  useEffect(() => {
    if (router) {
      if (localStorage.getItem("auth") !== "true") {
        alert("로그인 후 이용해주세요!");
        router.replace("/");
      }
    }
  }, []);

  return (
    <html lang="en">
      <body className={`${inter.className}`}>
        <RecoilRoot>
          <Topbar />
          {children}
        </RecoilRoot>
      </body>
    </html>
  );
}
