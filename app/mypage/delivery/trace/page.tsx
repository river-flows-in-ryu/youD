import React from "react";

import { cookies } from "next/headers";

import { commonFetch } from "@/utils/commonFetch";

import Container from "@/components/container";
import Client from "./client";

import decodingJwttsx from "@/utils/decodingJwt";
interface Props {
  shippingCompany: string;
  trackingNo: string;
  orderDetailId: string;
  orderId: string;
}

export default async function Page({ searchParams }: { searchParams: Props }) {
  const cookieStore = cookies();
  const access_token = cookieStore.get("access_token");
  const decodingJwt = decodingJwttsx(access_token?.value);
  const userId = decodingJwt?.user_id;

  const { orderDetailId, orderId } = searchParams;
  async function fetchOrderDetailData() {
    const res = await commonFetch(
      `${process.env.NEXT_PUBLIC_API_URL}/orders/order_detail/${Number(orderDetailId)}`,
      "get"
    );
    return res;
  }

  async function fetchOrderData() {
    const res = await commonFetch(
      `${process.env.NEXT_PUBLIC_API_URL}/orders/order/${orderId}?userId=${userId}`,
      "get"
    );
    return res;
  }

  const orderDetailData = await fetchOrderDetailData();
  const orderData = await fetchOrderData();
  return (
    <Container>
      <Client orderDetailData={orderDetailData} orderData={orderData} />
    </Container>
  );
}
