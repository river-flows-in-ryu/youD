import React from "react";

import { cookies } from "next/headers";

import Container from "@/components/container";
import Client from "./client";

import decodingJwttsx from "@/utils/decodingJwt";
import { commonFetch } from "@/utils/commonFetch";

export default async function Page() {
  const cookieStore = cookies();
  const access_token = cookieStore.get("access_token");
  const decodingJwt = decodingJwttsx(access_token?.value);
  const userId = decodingJwt?.user_id;
  async function fetchUserCoupon() {
    const res = await commonFetch(
      `${process.env.NEXT_PUBLIC_API_URL}/coupons/${userId}`,
      "get"
    );
    return res;
  }

  const userCouponData = await fetchUserCoupon();
  return (
    <Container>
      <Client userCouponData={userCouponData?.data} />
    </Container>
  );
}
