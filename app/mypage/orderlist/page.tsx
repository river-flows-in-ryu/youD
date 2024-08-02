import React, { useEffect, useState } from "react";

import { cookies } from "next/headers";

import Container from "@/components/container";

import { commonFetch } from "@/utils/commonFetch";
import decodingJwttsx from "@/utils/decodingJwt";
import OrderlistClientPage from "@/components/orderlistClientPage";

export default async function Page() {
  const cookieStore = cookies();
  const access_token = cookieStore.get("access_token");
  const decodingJwt = decodingJwttsx(access_token?.value);
  const user_id = decodingJwt?.user_id;
  async function getOrderCounts() {
    try {
      const res = await commonFetch(
        `${process.env.NEXT_PUBLIC_API_URL}/order-count/${user_id}`,
        "get"
      );
      return res;
    } catch (error) {
      if (error instanceof Error) {
        alert(error?.message);
      }
    }
  }

  const orderCounts = await getOrderCounts();

  return (
    <Container>
      <OrderlistClientPage orderCounts={orderCounts} />
    </Container>
  );
}
