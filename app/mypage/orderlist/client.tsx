"use client";

import React, { useEffect, useState } from "react";

import Image from "next/image";
import Link from "next/link";

import HorizontalLine from "@/components/horizontalLine";

import { commonFetch } from "@/utils/commonFetch";

import { useUserIdStore } from "@/app/store";

import arrowImage from "@/public/arrow_forward_balck.png";

import { Product } from "@/types/product";

interface Props {
  orderCounts: {
    total_orders: number;
    payment_orders: number;
    shipping_orders: number;
    delivery_completed_orders: number;
  };
}

interface OrderProductInfo {
  price: number;
  product: Product;
  quantity: number;
  product_name: string;
  size: {
    name: string;
    id: number;
  };
}

interface ProductData {
  date: string;
  products: OrderProductInfo[];
  order_id: number;
}

type Type = "all" | "paid" | "shipped" | "delivered";

export default function Client({ orderCounts }: Props) {
  const { userId } = useUserIdStore();

  const [deliveryType, setDeliveryType] = useState<Type>("all");

  const [productData, setProductData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      if (userId) {
        const res = await commonFetch(
          `${process.env.NEXT_PUBLIC_API_URL}/orders/orderlist/${userId}?type=${deliveryType}`,
          "get"
        );
        console.log(res);
        setProductData(res);
      }
    }
    fetchData();
  }, [userId, deliveryType]);

  console.log(productData);

  return (
    <section className="sm:w-[650px] sm:mx-auto w-full">
      <h2 className=" font-bold text-xl py-5 px-5">나의 구매목록</h2>
      <section className="py-5">
        <ul className="flex text-center cursor-pointer">
          <li className={`w-[25%]`} onClick={() => setDeliveryType("all")}>
            <p
              className={`text-xl	mb-[10px] font-bold ${deliveryType === "all" ? "text-primary" : ""}`}
            >
              {orderCounts?.total_orders || 0}
            </p>
            <div
              className={`text-xs ${deliveryType === "all" ? "text-primary" : "text-[#aaa]"}`}
            >
              전체
            </div>
          </li>
          <li className="w-[25%]" onClick={() => setDeliveryType("paid")}>
            <p
              className={`text-xl	mb-[10px] font-bold ${deliveryType === "paid" ? "text-primary" : ""}`}
            >
              {orderCounts?.payment_orders || 0}
            </p>
            <div
              className={`text-xs ${deliveryType === "paid" ? "text-primary" : "text-[#aaa]"}`}
            >
              입금/결제
            </div>
          </li>
          <li className="w-[25%]" onClick={() => setDeliveryType("shipped")}>
            <p
              className={`text-xl	mb-[10px] font-bold ${deliveryType === "shipped" ? "text-primary" : ""}`}
            >
              {orderCounts?.shipping_orders}
            </p>
            <div
              className={`text-xs ${deliveryType === "shipped" ? "text-primary" : "text-[#aaa]"}`}
            >
              배송중
            </div>
          </li>
          <li className="w-[25%]" onClick={() => setDeliveryType("delivered")}>
            <p
              className={`text-xl	mb-[10px] font-bold ${deliveryType === "delivered" ? "text-primary" : ""}`}
            >
              {orderCounts?.delivery_completed_orders}
            </p>
            <div
              className={`text-xs ${deliveryType === "delivered" ? "text-primary" : "text-[#aaa]"}`}
            >
              배송완료
            </div>
          </li>
        </ul>
      </section>
      <HorizontalLine />
      <div>
        {productData?.map((product: ProductData) => (
          <dl className="px-4 " key={`${product?.date}-${product?.order_id}`}>
            <Link href={`/mypage/order/${product?.order_id}`}>
              <dt className="flex justify-between px-4 py-5">
                <span className="text-xl text-[#aaa] font-bold">
                  {product?.date}
                </span>
                <Image src={arrowImage} alt=">" className="w-5 h-5 mt-1" />
              </dt>
            </Link>
            <hr className="h-[1px]" />
            <dd className="w-full">
              {product?.products?.map((productDetail) => (
                <div
                  className=" w-full flex py-5"
                  key={`${productDetail?.product_name}${productDetail?.size?.name}`}
                >
                  <Image
                    src={productDetail?.product?.image_url}
                    alt={productDetail?.product_name}
                    width={70}
                    height={70}
                  />
                  <div className="flex flex-col w-[calc(100%-70px)] pl-2.5">
                    <span className="text-sm">
                      {productDetail?.product?.brandName || ""}
                    </span>
                    <span className="text-sm font-bold">
                      {productDetail?.product_name || ""}
                    </span>
                    <div className="flex text-sm mt-0.5">
                      <span>{productDetail?.size?.name || ""}</span>
                      &nbsp; | &nbsp;
                      <span>{productDetail?.quantity || 0}개</span>
                    </div>
                    <span className="text-lg font-bold">
                      {productDetail?.price?.toLocaleString() || 0}원
                    </span>
                  </div>
                </div>
              ))}
            </dd>
            <HorizontalLine />
          </dl>
        ))}
      </div>
    </section>
  );
}
