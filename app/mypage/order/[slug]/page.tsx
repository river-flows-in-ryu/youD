import React from "react";

import { cookies } from "next/headers";

import { commonFetch } from "@/utils/commonFetch";
import decodingJwttsx from "@/utils/decodingJwt";

export default function Page({ params }: { params: { slug: string } }) {
  const cookieStore = cookies();
  const access_token = cookieStore.get("access_token");
  const decodingJwt = decodingJwttsx(access_token?.value);
  const userId = decodingJwt?.user_id;

  async function fetchData() {
    const res = await commonFetch(
      `${process.env.NEXT_PUBLIC_API_URL}/orders/order/${params?.slug}?userId=${userId}`,
      "get"
    );
    console.log(res);
  }

  const orderData = fetchData();

  return (
    //
    <div></div>
  );
}
