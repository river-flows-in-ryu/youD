import React, { useEffect, useState } from "react";

import { cookies } from "next/headers";

import Container from "@/components/container";

import { commonFetch } from "@/utils/commonFetch";
import decodingJwttsx from "@/utils/decodingJwt";

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
      <section className="sm:w-[650px] sm:mx-auto">
        <h2 className=" font-bold text-xl py-5 px-5">나의 구매목록</h2>
        <section>
          <ul className="flex text-center ">
            <li className="w-[25%]">
              <p className="text-xl	mb-[10px]">
                {orderCounts?.total_orders || 0}
              </p>
              <div className="text-xs ">전체</div>
            </li>
            <li className="w-[25%]">
              <p className="text-xl	mb-[10px]">
                {orderCounts?.payment_orders || 0}
              </p>
              <div className="text-xs">입금/결제</div>
            </li>
            <li className="w-[25%]">
              <p className="text-xl	mb-[10px]">{orderCounts?.shipping_orders}</p>
              <div className="text-xs">배송중</div>
            </li>
            <li className="w-[25%]">
              <p className="text-xl	mb-[10px]">
                {orderCounts?.delivery_completed_orders}
              </p>
              <div className="text-xs">배송완료</div>
            </li>
          </ul>
        </section>
      </section>
    </Container>
  );
}
