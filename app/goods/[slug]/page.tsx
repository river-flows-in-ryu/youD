import React from "react";

import { cookies } from "next/headers";

import { commonFetch } from "@/utils/commonFetch";
import decodingJwttsx from "@/utils/decodingJwt";

import Client from "./client";

export default async function Page({ params }: { params: { slug: string } }) {
  const cookieStore = cookies();
  const access_token = cookieStore.get("access_token");
  const decodingJwt = decodingJwttsx(access_token?.value);
  const userId = decodingJwt?.user_id;

  const { slug } = params;

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

  async function getProductCoupons(slug: string) {
    try {
      const userIdValue = userId ?? 0;
      const res = commonFetch(
        `${process.env.NEXT_PUBLIC_API_URL}/coupons/products/${slug}/${userIdValue}`,
        "get"
      );
      return res;
    } catch (error) {
      if (error instanceof Error) {
        alert(error?.message);
      }
    }
  }

  const productData = await getProductData(slug);
  const reviewData = await getReviewData(slug);
  const productCouponsdata = await getProductCoupons(slug);
  console.log(userId);
  return (
    <Client
      productData={productData}
      slug={params?.slug}
      reviewData={reviewData}
      productCouponsdata={productCouponsdata?.results}
    />
  );
}
