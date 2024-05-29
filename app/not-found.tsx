"use client";

import React from "react";

import { useRouter } from "next/navigation";

import Image from "next/image";
import Link from "next/link";

import error404 from "../public/404.png";
export default function NotFound() {
  const router = useRouter();
  return (
    <div className="w-full h-full">
      <div className="w-full sm:w-[500px] mx-auto">
        <Image src={error404} alt="404error" />
      </div>
      <div className="w-full flex justify-center gap-5 mt-10">
        <button
          className="border border-primary w-[150px] h-[50px] rounded"
          onClick={() => router.back()}
        >
          이전 페이지
        </button>
        <Link href="/">
          <button className="border border-primary bg-primary text-white w-[150px] h-[50px] rounded ">
            HOME
          </button>
        </Link>
      </div>
    </div>
  );
}
