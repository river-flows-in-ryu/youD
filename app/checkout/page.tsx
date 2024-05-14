"use client";
import React, { useEffect } from "react";

import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  useEffect(() => {
    const userId = JSON.parse(localStorage?.getItem("userId") || "{}");
    if (userId && userId?.state?.userId === 0) {
      alert("주문 상품이 없습니다.");
      router.push("/login");
    }
  }, [router]);

  return (
    //
    <div></div>
  );
}
