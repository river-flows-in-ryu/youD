"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { commonFetch } from "@/utils/commonFetch";
import { serverFetch } from "@/components/serverFetch";
import { useUserIdStore } from "@/app/store";

export default function Page({ params }: { params: { slug: string } }) {
  const { userId } = useUserIdStore();
  useEffect(() => {
    const fetchAsync = async () => {
      if (userId) {
        const res = await fetchData();
        const like = await fetchLikeData();
        console.log(like);
        setProductDetail(res);
        // fetchLikeData();
      }
    };
    fetchAsync();
  }, [userId]);
  const [productDetail, setProductDetail] = useState([]);

  console.log(productDetail);

  const payload = {
    user_id: userId,
    product_id: params.slug,
  };

  async function fetchData() {
    const res = await serverFetch(
      `${process.env.NEXT_PUBLIC_API_URL}/product_list/${params.slug}`,
      "get"
    );
    return res;
  }

  async function fetchLikeData() {
    const res = await serverFetch(
      `${process.env.NEXT_PUBLIC_API_URL}/product/is_like`,
      "post",
      payload
    );
    return res;
  }

  const handleLikeClick = async () => {
    const res = await serverFetch(
      `${process.env.NEXT_PUBLIC_API_URL}/product/like`,
      "post",
      payload
    );
    // console.log(res);
  };

  return (
    <div className="mx-auto">
      <div className="sm:w-[1050px] sm:mt-[30px]">
        <>
          {productDetail?.product?.image_url && (
            <Image
              src={productDetail?.product?.image_url}
              alt="zzz"
              width={3000}
              height={3000}
              className="w-full h-full sm:w-[500px] sm:h-[600px]"
            />
          )}
        </>
        <div className="px-4 py-5 text-xl	">
          <div className="flex flex-col mb-3">
            <span className="text-sm">
              {productDetail?.product?.user?.username}
            </span>
            <h2 className="font-extrabold">
              {productDetail?.product?.productName}
            </h2>
            <p className="text-sm	text-[#b5b5b5]">
              {productDetail?.product?.productShortName}
            </p>
          </div>
          <div className="flex ">
            <span className="text-primary font-medium mr-2">
              {productDetail?.product?.discountRate}%
            </span>
            <span className="font-medium mr-2">
              {productDetail?.product?.discountPrice.toLocaleString()}원
            </span>
            <span className="line-through	text-base leading-7 text-[#b5b5b5]	">
              {productDetail?.product?.OriginPrice.toLocaleString()}원
            </span>
          </div>
        </div>

        <button className="w-10 h-10" onClick={handleLikeClick}>
          누르면 바뀜
        </button>
      </div>
    </div>
  );
}
