"use client";

import React from "react";

import Image from "next/image";
import { useRouter } from "next/navigation";

import HorizontalLine from "./horizontalLine";

import { Product } from "@/types/product";

interface Props {
  product: Product;
}

export default function MypageSaleList({ product }: Props) {
  const router = useRouter();

  const handleMovePage = (productId: number) => {
    router?.push(`/products/change?productId=${productId}`);
  };

  return (
    <>
      <div className="flex px-5 mt-5">
        <div className="w-[100px] h-[100px] relative flex-shrink-0">
          <Image
            src={product?.image_url}
            alt="product_img"
            fill
            style={{ objectFit: "contain" }}
            className="w-[100px] h-[100px] rounded"
          />
        </div>
        <div className="ml-5 flex flex-col w-full mt-[5px]">
          <span className="line-clamp-1 break-all	font-bold">
            {product?.productName}
          </span>
          <span className="text-[#aaa] text-sm">
            {product?.productShortName}
          </span>
          <div className="flex mt-[10px] text-sm flex-col">
            <span>원가 {(product?.OriginPrice).toLocaleString()}원</span>
            <span>판매가 {(product?.discountPrice).toLocaleString()}원</span>
          </div>
        </div>
      </div>
      <div className="px-5 flex justify-end py-[10px] mb-[10px]">
        <button
          className="w-[60px] h-[30px] text-sm mr-[10px] border border-secondary"
          onClick={() => handleMovePage(product?.id)}
        >
          수정하기
        </button>
        <button className="w-[60px] h-[30px] text-sm border border-secondary text-red-500">
          삭제하기
        </button>
      </div>
      <HorizontalLine />
    </>
  );
}
