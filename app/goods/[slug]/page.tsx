import React from "react";

import { commonFetch } from "@/utils/commonFetch";

import GoodsClientPage from "@/components/goodsClientPage";

export default async function Page({ params }: { params: { slug: string } }) {
  async function getProductData(slug: string) {
    try {
      const res = commonFetch(
        `${process.env.NEXT_PUBLIC_API_URL}/product_list/${slug}`,
        "get"
      );
      return res;
    } catch (error) {
      if (error instanceof Error) {
        alert(error?.message);
      }
    }
  }
  async function getReviewData(slug: string) {
    try {
      const res = commonFetch(
        `${process.env.NEXT_PUBLIC_API_URL}/products/${slug}/reviews/count`,
        "get"
      );
      return res;
    } catch (error) {
      if (error instanceof Error) {
        alert(error?.message);
      }
    }
  }

  const productData = await getProductData(params?.slug);
  const reviewData = await getReviewData(params?.slug);
  return (
    <GoodsClientPage
      productData={productData}
      slug={params?.slug}
      reviewData={reviewData}
    />
  );
}
