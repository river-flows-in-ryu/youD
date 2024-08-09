"use client";

import React, { useState } from "react";

import Image from "next/image";
import Link from "next/link";

import HorizontalLine from "@/components/horizontalLine";

import UseHandleClickDrawer from "@/hooks/useHandleClickDrawer";
import { nameMasking, phoneMasking } from "@/utils/masking";

import { Product } from "@/types/product";

import arrowDown from "@/public/arrow_down.png";
import arrowUp from "@/public/arrow_up.png";

interface Props {
  orderData: {
    id: number;
    created_at: string;
    order_details: OrderProduct[];
    receiver_name: string;
    receiver_phone: string;
    receiver_address: string;
    receiver_memo: string;
  };
}

type DeliveryStatus = "PENDING" | "SHIPPED" | "DELIVERED" | "CANCELLED";

type deliveryStatusMap = {
  [key in DeliveryStatus]: string;
};

interface OrderProduct {
  id: number;
  product_name: string;
  quantity: number;
  price: number;
  origin_price: number;
  size: {
    id: number;
    name: string;
  };
  delivery_status: DeliveryStatus;
  tracking_number: string;
  product: Product;
}

export default function Client({ orderData }: Props) {
  const [indexArray, setIndexArray] = useState<number[]>([]);

  const { isOpen, handleClickDrawerChange } = UseHandleClickDrawer();

  const deliveryStatusMap: deliveryStatusMap = {
    PENDING: "배송 준비중",
    SHIPPED: "배송 중",
    DELIVERED: "배송 완료",
    CANCELLED: "취소됨",
  };

  function changeDateFormat(str: string) {
    return str?.slice(0, 19)?.replaceAll("T", " ");
  }

  function toggleDetails(id: number) {
    setIndexArray((prev) => {
      if (prev.includes(id)) {
        return prev.filter((idx) => idx !== id);
      } else return [...prev, id];
    });
  }

  return (
    <section className="sm:w-[650px] sm:mx-auto w-full">
      <h2 className=" font-bold text-xl py-5 px-5">주문 상세내역</h2>
      <div className="flex gap-2 p-5 justify-between">
        <span>No. {orderData?.id}</span>
        <span className="text-sm text-[#aaa]">
          {changeDateFormat(orderData?.created_at)}
        </span>
      </div>
      <div className="px-5">
        <span className="text-lg font-bold">
          주문 상품 {orderData?.order_details?.length || 0}개
        </span>
        {orderData?.order_details?.map((product: OrderProduct) => (
          <div
            className="pb-[30px] "
            key={`${product?.product?.brandName}${product?.product_name}${product?.size?.name}`}
          >
            <div className="flex pt-5 pb-2.5">
              <Image
                src={product?.product?.image_url}
                alt="이미지"
                width={70}
                height={70}
              />
              <div className="flex flex-col w-[calc(100%-70px)] pl-2.5">
                <span className="font-bold">
                  {deliveryStatusMap[product?.delivery_status]}
                </span>
                <Link href="" className="overflow-hidden text-ellipsis">
                  <span className="text-sm ">
                    {product?.product?.brandName}
                  </span>
                </Link>
                <Link href="" className="overflow-hidden text-ellipsis">
                  <span className="text-sm font-bold ">
                    {product?.product_name}
                  </span>
                </Link>
                <div className="flex text-sm">
                  <span>{product?.size?.name || ""}</span>
                  <span className="mx-2 ">|</span>
                  <span>{product?.quantity}개</span>
                </div>
              </div>
            </div>
            <div className=" pl-[85px] pr-5 pb-5">
              <div className="flex justify-between ">
                <span className="text-sm">주문 금액 (상세)</span>
                <div
                  className="flex"
                  onClick={() =>
                    toggleDetails(
                      Number(`${product?.product?.id}${product?.size?.id}`)
                    )
                  }
                >
                  <span className="font-bold">
                    {product?.price?.toLocaleString()}원
                  </span>
                  <button className="w-5 h-5 mt-0.5">
                    <Image src={arrowDown} alt="downImg" />
                  </button>
                </div>
              </div>

              {!indexArray?.includes(
                Number(`${product?.product?.id}${product?.size?.id}`)
              ) && (
                <>
                  <div className="flex justify-between text-sm mt-2">
                    <span>상품 금액</span>
                    <span>{product?.origin_price?.toLocaleString()}원</span>
                  </div>
                  <div className="flex justify-between text-sm mt-2">
                    <span>상품 할인</span>
                    <span className="text-primary">
                      -
                      {(
                        product?.origin_price - product?.price
                      ).toLocaleString()}
                      원
                    </span>
                  </div>
                </>
              )}
            </div>
            <button className="w-full h-10 border-[1px] border-secondary">
              배송 조회
            </button>
          </div>
        ))}
      </div>
      <HorizontalLine />
      {isOpen ? (
        <div className="pb-5">
          <header
            className="flex w-full px-5 justify-between "
            onClick={handleClickDrawerChange}
          >
            <div className=" font-bold text-xl py-5 ">배송지 정보</div>
            <div className="relative w-5 h-5 mt-[25px] cursor-pointer">
              <Image
                src={arrowUp}
                alt="drawerClose"
                fill
                style={{ objectFit: "contain" }}
              />
            </div>
          </header>
          <div className="px-5 ">
            <dl className="flex justify-between mb-2">
              <dt className="text-[#aaa]">받으시는 분</dt>
              <dd>{nameMasking(orderData?.receiver_name) || ""}</dd>
            </dl>
            <dl className="flex justify-between mb-2">
              <dt className="text-[#aaa]">연락처</dt>
              <dd>{phoneMasking(orderData?.receiver_phone) || ""}</dd>
            </dl>
            <dl className="flex justify-between mb-2">
              <dt className="text-[#aaa]">배송지</dt>
              <dd className="max-w-[250px] text-right">
                {orderData?.receiver_address || ""}
              </dd>
            </dl>
            <dl className="flex justify-between">
              <dt className="text-[#aaa]">배송 메세지</dt>
              <dd>{orderData?.receiver_memo || ""}</dd>
            </dl>
          </div>
        </div>
      ) : (
        <>
          <header
            className="flex w-full px-5 justify-between"
            onClick={handleClickDrawerChange}
          >
            <div className=" font-bold text-xl py-5 ">배송지 정보</div>
            <div className="flex gap-5">
              <div className="leading-[68px] text-sm">
                <div className="flex gap-2.5">
                  <span>{orderData?.receiver_name}</span>
                  <span> | </span>
                  <span className="w-[150px] truncate">
                    {orderData?.receiver_address}
                  </span>
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
        </>
      )}
      <HorizontalLine />
    </section>
  );
}
