"use client";
import React, { useEffect, useState } from "react";

import { useRouter } from "next/navigation";
import Container from "@/components/container";

import CheckoutProducts from "@/components/checkoutProducts";

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
    if (!productItem) {
      alert("상품이 없습니다.");
      router.push("/");
    }
  }, [router]);

  return (
    <Container>
      <div className="sm:w-[650px] sm:mx-auto">
        <CheckoutProducts checkoutProduct={checkoutProduct} />
      </div>
    </Container>
  );
}
