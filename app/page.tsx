"use client";
import { Suspense, useEffect, useState } from "react";

import useFecth from "@/hooks/useFetch";

export default function Home() {
  const { data, err } = useFecth(
    `${process.env.NEXT_PUBLIC_API_URL}/user_list`,
    "get"
  );
  console.log(data, err);

  return (
    <main className="flex f-full ">
      <div className="w-full h-[300px] bg-blue-300"></div>
    </main>
  );
}
