"use client";
import React, { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import Container from "@/components/container";

import { useUserIdStore } from "../store";
import { commonFetch } from "@/utils/commonFetch";
import Image from "next/image";

export default function Page() {
  const [brandName, setBrandName] = useState("");
  const [brandDesc, setBrandDesc] = useState("");
  const [brandImage, setBrandImage] = useState("");
  const [brandBGImage, setBrandBGImage] = useState("");

  const { userId } = useUserIdStore();

  useEffect(() => {
    async function fetchUserData() {
      const res = await commonFetch(
        `${process.env.NEXT_PUBLIC_API_URL}/brand_info/${userId}`,
        "get"
      );
      setBrandName(res?.brand_info?.name);
      setBrandDesc(res?.brand_info?.description);
      setBrandImage(res?.brand_info?.image);
      setBrandBGImage(res?.brand_info?.bg_image);
    }
    if (userId) {
      fetchUserData();
    }
  }, [userId]);

  const router = useRouter();

  return (
    <Container>
      <div
        className="w-full h-[250px] sm:w-[650px] sm:mx-auto bg-primary  mb-[10px] p-3 "
        style={{
          backgroundImage: `${brandBGImage ? `url(${brandBGImage})` : "none"} `,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="flex justify-end ">
          <button
            className="w-[100px] h-10  rounded-full  bg-white/[.3] text-white"
            onClick={() => router?.push("/mypage/brand")}
          >
            변경하기
          </button>
        </div>
        <div className="flex flex-col items-center">
          <div
            className={`w-20 h-20 rounded-[50%] relative ${
              brandImage ? "" : "bg-black"
            }`}
          >
            {brandImage && (
              <Image
                src={brandImage}
                alt="유저 이미지"
                fill
                style={{ objectFit: "contain", borderRadius: "50%" }}
              />
            )}
          </div>
          <h2 className="mt-3 text-xl	text-white font-bold">
            {brandName || "브랜드 네임"}
          </h2>
          <span className="text-white text-sm mt-2">
            {brandDesc || "브랜드 설명을 작성해주세요"}
          </span>
        </div>
      </div>
    </Container>
  );
}
