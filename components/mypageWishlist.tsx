import React from "react";

import Image from "next/image";

import fullHeart from "../public/full_heart.png";
import emptyHeart from "../public/empty_heart.png";

import { Product } from "@/types/product";

import HorizontalLine from "./horizontalLine";

interface LikeStatus {
  [key: number]: boolean;
}

interface Props {
  product: Product;
  likeStatus: LikeStatus;
  handleChangeLike: (productId: number) => Promise<void>;
}
export default function MypageWishlist({
  product,
  likeStatus,
  handleChangeLike,
}: Props) {
  return (
    <>
      <div className="flex px-5 my-10">
        <div className="w-[100px] h-[100px] relative flex-shrink-0">
          <Image
            src={product?.image_url}
            alt={product?.productName}
            fill
            style={{ objectFit: "contain" }}
          />
        </div>
        <div className="ml-5 w-full">
          <div className="flex justify-between">
            <span className="line-clamp-1 break-all	font-bold leading-8">
              {product?.productName}
            </span>
            <button onClick={() => handleChangeLike(product?.id)}>
              {!likeStatus[product?.id] ? (
                <Image
                  src={fullHeart}
                  alt="fullHeart"
                  className="w-8 h-8 rounded"
                />
              ) : (
                <Image
                  src={emptyHeart}
                  alt="fullHeart"
                  className="w-8 h-8 rounded"
                />
              )}
            </button>
          </div>
          <span className="text-[#aaa] text-sm">
            {product?.productShortName}
          </span>
          <div className="flex mt-[10px] text-sm gap-2">
            <span className="line-through text-[#aaa]">
              {(product?.OriginPrice || 0).toLocaleString()}원
            </span>
            <span className="font-bold">
              {(product?.discountPrice || 0).toLocaleString()}원
            </span>
          </div>
          <div className="flex  justify-end">
            <div className="flex gap-1">
              <Image src={emptyHeart} alt="빈하트" className="w-5 h-5 mt-0.5" />
              <span className="text-[#aaa]">{product?.total_likes}</span>
            </div>
          </div>
        </div>
      </div>
      <HorizontalLine />
    </>
  );
}
