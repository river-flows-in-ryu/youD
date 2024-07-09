import React, { useMemo, useState } from "react";

import Image from "next/image";

import { Product } from "@/types/product";

import HorizontalLine from "./horizontalLine";

import arrowUp from "../public/arrow_up.png";
import arrowDown from "../public/arrow_down_bold.png";

interface ProductInterface {
  size_attribute: {
    size: {
      name: string;
    };
  };
  product: Product;
  quantity: number;
}

interface Props {
  checkoutProduct: ProductInterface[];
}

export default function CheckoutProducts({ checkoutProduct }: Props) {
  const POINT_RATE = 0.01;

  const [productDrawer, setProductDrawer] = useState(false);

  function handleClickProductDrawerChange() {
    setProductDrawer(!productDrawer);
  }

  function calculateTotalPrice() {
    let totalDiscountPrice = 0;
    let totalCount = 0;
    checkoutProduct?.map((product) => {
      totalDiscountPrice += product?.product?.discountPrice;
      totalCount += product?.quantity;
    });
    return { totalDiscountPrice, totalCount };
  }

  const { totalDiscountPrice, totalCount } = useMemo(() => {
    return calculateTotalPrice();
  }, []);

  return (
    <div className="w-full">
      {productDrawer ? (
        <div className="flex w-full px-5 justify-between">
          <div className=" font-bold text-xl py-5 ">상품 정보</div>
          <div className="flex gap-5">
            <div className="leading-[68px] text-sm">
              <span className="">
                {totalCount}건 | {totalDiscountPrice?.toLocaleString()}원
              </span>
            </div>
            <div
              className="relative w-5 h-5 mt-[25px] cursor-pointer"
              onClick={handleClickProductDrawerChange}
            >
              <Image
                src={arrowDown}
                alt="drawerOpen"
                fill
                style={{ objectFit: "contain" }}
              />
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="flex w-full px-5 justify-between">
            <div className=" font-bold text-xl py-5 ">상품 정보</div>
            <div
              className="relative w-5 h-5 mt-[25px] cursor-pointer"
              onClick={handleClickProductDrawerChange}
            >
              <Image
                src={arrowUp}
                alt="drawerClose"
                fill
                style={{ objectFit: "contain" }}
              />
            </div>
          </div>
          {checkoutProduct?.map((product: ProductInterface) => (
            <li
              key={product?.product?.id}
              className="list-none	pt-5  border-b-[1px] border-secondary-500 pb-5"
            >
              <div className="flex px-[15px] ">
                <div className="w-[80px] h-[80px] relative rounded mr-2">
                  <Image
                    src={product?.product?.image_url}
                    fill
                    style={{ objectFit: "contain" }}
                    alt={product?.product?.productName}
                    className="rounded"
                  />
                </div>
                <div className="flex flex-col w-[calc(100%-170px)]">
                  <span className="line-clamp-1 break-all text-xs font-semibold	">
                    {product?.product?.productName}
                  </span>
                  <span className="text-xs text-[#888]">
                    옵션 : {product?.size_attribute?.size?.name}
                  </span>
                  <span className="text-xs text-[#888]">
                    수량 : {product?.quantity} 개
                  </span>
                </div>
                <div className="w-[90px] flex flex-col text-end">
                  <span className="line-through text-xs text-[#888]">
                    {(
                      product?.product?.OriginPrice * product?.quantity
                    ).toLocaleString()}
                    원
                  </span>
                  <span className="text-primary text-xs">
                    {(
                      product?.product?.discountPrice * POINT_RATE
                    ).toLocaleString()}
                    원 적립
                  </span>
                  <span className="font-bold text-lg">
                    {(
                      product?.product?.discountPrice * product?.quantity
                    ).toLocaleString()}
                    원
                  </span>
                </div>
              </div>
            </li>
          ))}
        </>
      )}
      <HorizontalLine />
    </div>
  );
}
