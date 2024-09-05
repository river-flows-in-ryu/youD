import React from "react";

import { cookies } from "next/headers";

import Container from "@/components/container";
import Client from "./client";

import { commonFetch } from "@/utils/commonFetch";
import decodingJwttsx from "@/utils/decodingJwt";

interface Request {
  params: {
    slug: string;
  };
  searchParams: {
    productId: string;
  };
}

export default async function Page(request: Request) {
  const cookieStore = cookies();
  const access_token = cookieStore.get("access_token");
  const decodingJwt = await decodingJwttsx(access_token?.value);
  const userId = decodingJwt?.user_id;

  const { slug } = request?.params;
  const { productId } = request?.searchParams;

  let couponDetailData = null;

  if (slug === "modify" && productId && userId) {
    const fetchCouponDetail = async () => {
      const res = await commonFetch(
        `${process.env.NEXT_PUBLIC_API_URL}/coupons/coupon/${Number(productId)}/${userId}`,
        "get"
      );
      return res;
    };

    couponDetailData = await fetchCouponDetail();
  }

  async function fetchUserProductNames() {
    const res = await commonFetch(
      `${process.env.NEXT_PUBLIC_API_URL}/brands/${userId}/names`,
      "get"
    );
    return res;
  }

  const userProductNames = await fetchUserProductNames();
  return (
    <Container>
      <div className="sm:w-[650px] sm:mx-auto pb-5">
        <Client
          userProductNames={userProductNames?.data}
          userId={userId}
          couponData={couponDetailData}
        />
      </div>
    </Container>
  );
}
