"use client";
import React, { ReactEventHandler, useEffect, useState } from "react";

import Image from "next/image";
import { useRouter } from "next/navigation";

import { changeDateType } from "@/utils/changeDateType";

import { useUserIdStore } from "@/app/store";

import close from "@/public/close.png";
import download from "@/public/download.png";
import { commonFetch } from "@/utils/commonFetch";

interface ProductCoupon {
  id: number;
  is_redeemed: boolean;
  name: string;
  discount_type: string;
  discount_value: string;
  min_purchase: number;
  max_discount: number;
  valid_from: string;
  valid_to: string;
}

interface Props {
  onClose: () => void;
  productCouponsdata: ProductCoupon[];
  discountPrice: number;
}
export default function CouponReceiveModal({
  onClose,
  productCouponsdata,
  discountPrice,
}: Props) {
  const { userId } = useUserIdStore();

  const [downloadedCoupons, setDownloadedCoupons] = useState<number[]>([]);

  const router = useRouter();

  const handleCouponClick =
    (id: number) => async (evnet: React.MouseEvent<HTMLButtonElement>) => {
      if (!userId) {
        alert("로그인해주세요");
        router.push("/login");
      }
      const payload = { user_id: userId, coupon_id: id };
      try {
        const res = await commonFetch(
          `${process.env.NEXT_PUBLIC_API_URL}/coupons/user/register`,
          "post",
          payload
        );
        if (res?.message === "SUCCESS") {
          setDownloadedCoupons((prev) => [...prev, id]);
        }
      } catch {}
    };

  return (
    <div className="w-[90%] h-[60%] p-6 sm:w-[450px] sm:h-[50%] sm:p-8  bg-white rounded text-center">
      <div className="text-center mb-5 text-xl font-bold relative ">
        <Image
          src={close}
          width={20}
          height={20}
          alt="close_img"
          className="absolute right-0 mt-1 cursor-pointer"
          onClick={onClose}
        />
        쿠폰 받기
      </div>
      {productCouponsdata?.map((coupon) => {
        const {
          id,
          name,
          discount_type,
          discount_value,
          max_discount,
          is_redeemed,
          valid_to,
        } = coupon;

        const isDownloaded = downloadedCoupons.includes(id);
        return (
          <ul key={id}>
            <li className="mb-[10px]">
              <div className="flex-coll text-left border border-secondary pl-2.5 py-[15px] relative flex rounded">
                <div className="w-[75%]">
                  <p className="text-red-500">
                    {discount_type === "fixed"
                      ? max_discount !== null &&
                        Number(discount_value) > max_discount
                        ? max_discount.toLocaleString()
                        : Number(discount_value).toLocaleString()
                      : max_discount !== null &&
                          discountPrice * (100 - Number(discount_value)) >
                            max_discount
                        ? max_discount.toLocaleString()
                        : (
                            discountPrice *
                            (100 - Number(discount_value))
                          ).toLocaleString()}
                    원
                  </p>
                  <p className="font-bold">{name}</p>
                  {
                    <p className="text-sm">
                      {changeDateType(valid_to)}일 까지 사용
                    </p>
                  }
                </div>
                {!is_redeemed && !isDownloaded ? (
                  <button
                    className=" h-full flex-col items-center w-[25%] border-l-[2px] ml-[5px]"
                    onClick={handleCouponClick(id)}
                  >
                    <div className="flex justify-center ">
                      <Image
                        src={download}
                        alt="다운로드이미지"
                        className="w-[30px] h-[30px]"
                      />
                    </div>
                    <p className="text-sm mt-[10px]">다운로드</p>
                  </button>
                ) : null}
              </div>
            </li>
          </ul>
        );
      })}
    </div>
  );
}
