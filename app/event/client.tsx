"use client";

import React from "react";

import Image from "next/image";
import { useRouter } from "next/navigation";

import { useUserIdStore } from "@/app/store";

import coupon from "@/public/coupon.png";
import { commonFetch } from "@/utils/commonFetch";

export default function Client() {
  const { userId } = useUserIdStore();
  const router = useRouter();

  const payload = {
    userId,
    couponId: 1,
  };

  async function handleClickFetch() {
    if (userId) {
      const res = await commonFetch(
        `${process.env.NEXT_PUBLIC_API_URL}/coupons/user/register`,
        "post",
        payload
      );
      if (res.message === "SUCCESS") {
        alert("쿠폰함에 넣어드렸어요!");
      } else {
        alert(res?.error?.error[0]);
      }
    } else {
      alert("로그인 페이지로 이동합니다.");
      router?.push("/login");
    }
  }
  return (
    <div>
      <button onClick={handleClickFetch}>
        <Image src={coupon} alt="쿠폰이미지" />
      </button>
    </div>
  );
}
