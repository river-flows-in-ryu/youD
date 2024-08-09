import React from "react";

import { cookies } from "next/headers";

import { commonFetch } from "@/utils/commonFetch";
import decodingJwttsx from "@/utils/decodingJwt";

import Container from "@/components/container";

import Client from "./client";

export default async function Page({ params }: { params: { slug: string } }) {
  const cookieStore = cookies();
  const access_token = cookieStore.get("access_token");
  const decodingJwt = decodingJwttsx(access_token?.value);
  const userId = decodingJwt?.user_id;

  async function fetchData() {
    const res = await commonFetch(
      `${process.env.NEXT_PUBLIC_API_URL}/orders/order/${params?.slug}?userId=${userId}`,
      "get"
    );
    return res;
  }

  const orderData = await fetchData();

  return (
    <Container>
      <Client orderData={orderData} />
    </Container>
  );
}
