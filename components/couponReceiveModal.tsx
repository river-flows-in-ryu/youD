"use client";
import React, { ReactEventHandler, useEffect, useState, useRef } from "react";

import Image from "next/image";
import { useRouter } from "next/navigation";

import { changeDateType, changeEndTime } from "@/utils/changeDateType";

import { useUserIdStore } from "@/app/store";

import close from "@/public/close.png";
import download from "@/public/download.png";
import check from "@/public/check.png";
import infomation from "@/public/information.png";

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
  per_user_limit: number;
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

  const [infoBoxItem, setInfoBoxItem] = useState<number | null>();

  const couponInfoRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

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

  const handleClickInfo =
    (id: number) => async (event: React.MouseEvent<HTMLButtonElement>) => {
      setInfoBoxItem(id);
    };

  const handleClickClose = () => {
    setInfoBoxItem(null);
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        couponInfoRef.current &&
        !couponInfoRef.current.contains(event.target as Node)
      ) {
        setInfoBoxItem(null);
      }
    }
    if (infoBoxItem !== null) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [infoBoxItem, setInfoBoxItem]);

  return (
    <div
      className="w-[90%] h-[60%] p-6 sm:w-[450px] sm:h-[50%] sm:p-8  bg-white rounded text-center"
      ref={containerRef}
    >
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
          valid_from,
          valid_to,
          per_user_limit,
        } = coupon;

        const isDownloaded = downloadedCoupons.includes(id);
        const hasNotCoupon = !is_redeemed && !isDownloaded;
        return (
          <ul key={id}>
            <li className="mb-[10px]">
              <div className="flex-coll text-left border border-secondary pl-4 py-[15px] relative flex rounded">
                <div className="w-[75%]">
                  <p
                    className={` font-bold leading-4 ${hasNotCoupon ? "text-red-500" : "text-secondary"} `}
                  >
                    {discount_type === "fixed"
                      ? max_discount !== null &&
                        Number(discount_value) > max_discount
                        ? max_discount.toLocaleString()
                        : Number(discount_value).toLocaleString()
                      : max_discount !== null &&
                          discountPrice * (Number(discount_value) / 100) >
                            max_discount
                        ? max_discount.toLocaleString()
                        : (
                            discountPrice *
                            (Number(discount_value) / 100)
                          ).toLocaleString()}
                    원
                  </p>
                  <p
                    className={`${hasNotCoupon ? "text-black" : "text-secondary"} font-bold text-sm mt-1 truncate`}
                  >
                    {name}
                  </p>
                  {
                    <div
                      className={`text-sm ${hasNotCoupon ? "text-black" : "text-secondary"}`}
                    >
                      <button
                        onClick={handleClickInfo(id)}
                        className="flex place-items-center gap-1"
                      >
                        <span>{changeDateType(valid_to)}일 까지 사용</span>
                        <Image
                          src={infomation}
                          alt="infoImg"
                          width={10}
                          height={10}
                          className="leading-5"
                        />
                      </button>
                    </div>
                  }
                </div>
                <button
                  className=" h-full flex-col items-center w-[25%] border-l-[2px] ml-[5px]"
                  onClick={handleCouponClick(id)}
                  disabled={!hasNotCoupon}
                >
                  <div className="flex justify-center ">
                    <Image
                      src={hasNotCoupon ? download : check}
                      alt="다운로드이미지"
                      className="w-[30px] h-[30px]"
                    />
                  </div>
                  <p className="text-sm mt-[10px]">
                    {hasNotCoupon ? "다운로드" : "완료"}
                  </p>
                </button>
                {infoBoxItem === id && (
                  <div
                    className="w-full h-auto border border-secondary absolute left-0 top-[75px] z-10 bg-white rounded"
                    ref={couponInfoRef}
                  >
                    <div className="w-full h-full relative p-4">
                      <button
                        onClick={handleClickClose}
                        className="absolute top-2.5 right-2.5"
                      >
                        <Image
                          src={close}
                          alt="closeImg"
                          width={20}
                          height={20}
                        />
                      </button>
                      <p className="font-bold truncate">{name}</p>
                      <dl className="mt-2.5 text-sm">
                        <div className="flex gap-2 ">
                          <dt>발급조건</dt>
                          <dd>ID당 {per_user_limit}장</dd>
                        </div>
                        <div className="flex gap-2">
                          <dt>발급기간</dt>
                          <dd>
                            {changeDateType(valid_from)}&nbsp;~&nbsp;
                            {changeDateType(valid_to)}
                          </dd>
                        </div>
                        <div className="flex gap-2">
                          <dt>사용기간</dt>
                          <dd>{changeEndTime(valid_to)}</dd>
                        </div>
                      </dl>
                    </div>
                  </div>
                )}
              </div>
            </li>
          </ul>
        );
      })}
      <ul className=" border-t-[1px] mt-5 pt-5 text-left text-sm text-[#616161]">
        <li className="leading-5">- 쿠폰 사용기간 내에 할인받고 구매하세요</li>
        <li className="leading-5">
          - 쿠폰 사용시 최소구매금액과 최대할인금액을 확인하세요.
        </li>
        <li className="leading-5">- 일부 쿠폰은 조기소진될 수 있습니다.</li>
      </ul>
    </div>
  );
}
