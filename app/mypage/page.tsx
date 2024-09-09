"use client";
import React, { useEffect, useState } from "react";

import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

import Container from "@/components/container";

import { useUserIdStore } from "../store";
import { commonFetch } from "@/utils/commonFetch";

import fullHeart from "../../public/full_heart.png";
import products from "../../public/productsImg.png";
import coins from "../../public/coinImg.png";

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
      <div className="sm:w-[650px] sm:mx-auto">
        <div
          className="w-full h-[250px]  bg-white  mb-[10px] p-3 border border-secondary"
          style={{
            backgroundImage: `${
              brandBGImage ? `url(${brandBGImage})` : "none"
            } `,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="flex justify-end ">
            <button
              className="w-[100px] h-10  rounded-full  bg-white/[.3] text-primary"
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
        <div className="flex py-5 ">
          <div className="flex flex-col items-center w-[33.3%]">
            <Link href={"/mypage/wishlist"}>
              <Image
                src={fullHeart}
                alt="Flaticon_image_fullHeart"
                className="w-[55px] h-[50px]"
              />
              <span className="mt-2">관심목록</span>
            </Link>
          </div>
          <div className="flex flex-col items-center w-[33.3%]">
            <Link href={"/mypage/salelist"}>
              <Image
                src={coins}
                alt="Flaticon_image_fullHeart"
                className="w-[55px] h-[50px]"
              />
              <span className="mt-2">판매목록</span>
            </Link>
          </div>
          <div className="flex flex-col items-center w-[33.3%]">
            <Link href={"/mypage/orderlist"}>
              <Image
                src={products}
                alt="Flaticon_image_fullHeart"
                className="w-[55px] h-[50px]"
              />
              <span className="mt-2">구매목록</span>
            </Link>
          </div>
        </div>
        <div className="flex w-full justify-between">
          <span>주소지 관리</span>
          <span>&gt;</span>
        </div>
      </div>
    </Container>
  );
}
