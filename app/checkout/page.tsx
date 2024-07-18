"use client";
import React, { useEffect, useState, useMemo } from "react";

import { useRouter } from "next/navigation";

import CheckoutProductSection from "@/components/checkoutProductSection";
import CheckoutAddressSections from "@/components/checkoutAddressSections";
import HorizontalLine from "@/components/horizontalLine";
import CheckoutTabBar from "@/components/checkoutTabBar";

import { Product } from "@/types/product";

interface ProductInfo {
  index: string;
  product: Product;
  quantity: number;
}

export default function Page() {
  const router = useRouter();

  const [checkoutProduct, setCheckoutProduct] = useState([]);

  useEffect(() => {
    const userId = JSON.parse(localStorage?.getItem("userId") || "{}");
    const productItem = JSON.parse(
      sessionStorage.getItem("selectedProducts") || "{}"
    );
    setCheckoutProduct(productItem);
    if (!userId) {
      alert("로그인이 필요한 페이지입니다.");
      router.push("/login");
    }
    if (
      !productItem ||
      (Array.isArray(productItem) && productItem.length === 0) ||
      (!Array.isArray(productItem) && Object.keys(productItem).length === 0)
    ) {
      alert("상품이 없습니다.");
      router.push("/");
    }
  }, [router]);

  //총 금액 변경 useMemo
  function calculateTotalPrice() {
    let totalDiscountPrice = 0;
    let totalCount = 0;
    checkoutProduct?.map((product: ProductInfo) => {
      totalDiscountPrice += product?.product?.discountPrice * product?.quantity;
      totalCount += product?.quantity;
    });
    return { totalDiscountPrice, totalCount };
  }
  const { totalDiscountPrice, totalCount } = useMemo(() => {
    return calculateTotalPrice();
  }, [checkoutProduct]);

  if (checkoutProduct)
    return (
      <div className="w-full pb-[70px] sm:pb-0">
        <div className="sm:w-[650px] sm:mx-auto">
          <div className=" font-bold text-xl py-5 px-5 ">주문/결제</div>
          <HorizontalLine />
          <CheckoutAddressSections />
          <CheckoutProductSection
            checkoutProduct={checkoutProduct}
            totalDiscountPrice={totalDiscountPrice}
            totalCount={totalCount}
          />
          <CheckoutTabBar totalDiscountPrice={totalDiscountPrice} />
        </div>
      </div>
    );
}
