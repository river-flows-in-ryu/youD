"use client";
import React, { useEffect, useState, useMemo } from "react";

import { useRouter } from "next/navigation";

import CheckoutProductSection from "@/components/checkoutProductSection";
import CheckoutAddressSections from "@/components/checkoutAddressSections";
import HorizontalLine from "@/components/horizontalLine";
import CheckoutTabBar from "@/components/checkoutTabBar";
import CheckoutFinalPaymentSection from "@/components/checkoutFinalPaymentSections";

import { useCartCountStore, useUserIdStore } from "../store";

import { Product } from "@/types/product";
import { commonFetch } from "@/utils/commonFetch";

interface ProductInfo {
  index: string;
  product: Product;
  quantity: number;
  size_attribute: {
    size: {
      id: number;
    };
  };
}

export default function Page() {
  const router = useRouter();

  const { userId } = useUserIdStore();

  const [checkoutProduct, setCheckoutProduct] = useState([]);

  const { fetchCartItemCount } = useCartCountStore();

  const [deliveryDetails, setDeliveryDetails] = useState({
    deliveryName: "",
    deliveryPhone: "",
    deliveryAddress: "",
    deliveryAddressDetail: "",
    deliveryMemoType: "",
    deliveryMemo: "",
  });

  const [loading, setLoading] = useState<boolean>(false);

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
    let totalOriginPrice = 0;
    let totalCount = 0;
    checkoutProduct?.map((product: ProductInfo) => {
      totalDiscountPrice += product?.product?.discountPrice * product?.quantity;
      totalOriginPrice += product?.product?.OriginPrice * product?.quantity;
      totalCount += product?.quantity;
    });
    return { totalDiscountPrice, totalCount, totalOriginPrice };
  }
  const { totalDiscountPrice, totalCount, totalOriginPrice } = useMemo(() => {
    return calculateTotalPrice();
  }, [checkoutProduct]);

  async function handleSubmit() {
    setLoading(true);
    const productData = checkoutProduct?.map((productData: ProductInfo) => ({
      productId: productData?.product?.id,
      productName: productData?.product?.productName,
      quantity: productData?.quantity,
      price: productData?.product?.discountPrice,
      size: productData?.size_attribute?.size?.id,
    }));
    const payload = {
      userId: userId,
      origin_price: totalOriginPrice,
      discount_price: totalDiscountPrice,
      status: "PENDING",
      payment_method: "CARD",
      delivery_fee: 0,
      receiver_name: deliveryDetails?.deliveryName,
      receiver_address: `${deliveryDetails?.deliveryAddress} ${deliveryDetails?.deliveryAddressDetail}`,
      receiver_phone: deliveryDetails?.deliveryPhone,
      receiver_memo: deliveryDetails?.deliveryMemo
        ? deliveryDetails?.deliveryMemo
        : deliveryDetails?.deliveryMemoType,
      orderDetails: productData,
    };
    try {
      const res = await commonFetch(
        `${process.env.NEXT_PUBLIC_API_URL}/test`,
        "post",
        payload
      );
      if (res.message === "SUCCESS") {
        await fetchCartItemCount(userId);
        sessionStorage.removeItem("selectedProducts");
      }
    } finally {
      setLoading(false);
    }
  }

  if (checkoutProduct)
    return (
      <div className="w-full pb-[70px] sm:pb-0">
        <div className="sm:w-[650px] sm:mx-auto">
          <h2 className=" font-bold text-xl py-5 px-5 ">주문/결제</h2>
          <HorizontalLine />
          <CheckoutAddressSections
            deliveryDetails={deliveryDetails}
            setDeliveryDetails={setDeliveryDetails}
          />
          <CheckoutProductSection
            checkoutProduct={checkoutProduct}
            totalDiscountPrice={totalDiscountPrice}
            totalCount={totalCount}
          />
          <CheckoutFinalPaymentSection
            totalOriginPrice={totalOriginPrice}
            totalDiscountPrice={totalDiscountPrice}
          />
          <HorizontalLine />
          <CheckoutTabBar
            totalDiscountPrice={totalDiscountPrice}
            handleSubmit={handleSubmit}
            loading={loading}
          />
        </div>
      </div>
    );
}
