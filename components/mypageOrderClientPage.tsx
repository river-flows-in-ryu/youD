import React from "react";

import Image from "next/image";
import Link from "next/link";

import HorizontalLine from "@/components/horizontalLine";

import { Product } from "@/types/product";

interface Props {
  orderData: {
    id: number;
    created_at: string;
    order_details: OrderProduct[];
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
    name: string;
  };
  delivery_status: DeliveryStatus;
  tracking_number: string;
  product: Product;
}

export default function MypageOrderClientPage({ orderData }: Props) {
  const deliveryStatusMap: deliveryStatusMap = {
    PENDING: "배송 준비중",
    SHIPPED: "배송 중",
    DELIVERED: "배송 완료",
    CANCELLED: "취소됨",
  };

  function changeDateFormat(str: string) {
    return str?.slice(0, 19)?.replaceAll("T", " ");
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
                <span className="font-bold">
                  {product?.price?.toLocaleString()}원
                </span>
              </div>
              <div className="flex justify-between text-sm mt-2">
                <span>상품 금액</span>
                <span>{product?.origin_price?.toLocaleString()}원</span>
              </div>
              <div className="flex justify-between text-sm mt-2">
                <span>상품 할인</span>
                <span className="text-primary">
                  -{(product?.origin_price - product?.price).toLocaleString()}원
                </span>
              </div>
            </div>
            <button className="w-full h-10 border-[1px] border-secondary">
              배송 조회
            </button>
          </div>
        ))}
      </div>
      <HorizontalLine />
    </section>
  );
}
