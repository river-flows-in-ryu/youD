import React from "react";

import Image from "next/image";

import UseHandleClickDrawer from "@/hooks/useHandleClickDrawer";

import arrowUp from "../public/arrow_up.png";
import arrowDown from "../public/arrow_down_bold.png";

interface Props {
  totalOriginPrice: number;
  totalDiscountPrice: number;
}

export default function CheckoutFinalPaymentSections({
  totalOriginPrice,
  totalDiscountPrice,
}: Props) {
  const { isOpen, handleClickDrawerChange } = UseHandleClickDrawer();

  const discountRate =
    ((totalOriginPrice - totalDiscountPrice) / totalOriginPrice) * 100;

  return (
    <section className="w-full">
      {isOpen ? (
        <header
          className="flex w-full px-5 justify-between"
          onClick={handleClickDrawerChange}
        >
          <div className=" font-bold text-xl py-5 ">최종 결제금액</div>
          <div className="flex gap-5">
            <div className="leading-[68px] text-sm">
              <div className="flex gap-2.5">
                <strong className="text-red-500">
                  {discountRate?.toFixed()}% SAVE
                </strong>
                <span>{totalDiscountPrice?.toLocaleString()}원</span>
              </div>
            </div>
            <div className="relative w-5 h-5 mt-[25px] cursor-pointer">
              <Image
                src={arrowDown}
                alt="drawerOpen"
                fill
                style={{ objectFit: "contain" }}
              />
            </div>
          </div>
        </header>
      ) : (
        <div className="pb-5">
          <header
            className="flex w-full px-5 justify-between "
            onClick={handleClickDrawerChange}
          >
            <div className=" font-bold text-xl py-5 ">최종 결제금액</div>
            <div className="relative w-5 h-5 mt-[25px] cursor-pointer">
              <Image
                src={arrowUp}
                alt="drawerClose"
                fill
                style={{ objectFit: "contain" }}
              />
            </div>
          </header>
          <div className="px-5 text-sm	">
            <dl className="flex justify-between py-3">
              <dt>상품금액</dt>
              <dd>
                <span>
                  {totalOriginPrice ? totalOriginPrice?.toLocaleString() : 0}
                </span>
                원
              </dd>
            </dl>
            <dl className="flex justify-between py-3">
              <dt>배송비</dt>
              <dd>
                <span className="text-primary">
                  {totalDiscountPrice >= 40000 ? "배송비 무료" : "착불"}
                </span>
              </dd>
            </dl>
            <dl className="flex justify-between py-3">
              <dt>할인금액</dt>
              <dd>
                <strong className="text-red-500 mr-2">
                  {discountRate.toFixed()}% SAVE
                </strong>
                <span className="text-primary">
                  {(totalDiscountPrice - totalOriginPrice)?.toLocaleString()}원
                </span>
              </dd>
            </dl>
            <dl className="flex justify-between py-3">
              <dt>결제금액</dt>
              <dd>
                <span className="font-bold">
                  {totalDiscountPrice?.toLocaleString()}원
                </span>
              </dd>
            </dl>
          </div>
        </div>
      )}
    </section>
  );
}
