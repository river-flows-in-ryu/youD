import React from "react";

import { cookies } from "next/headers";

import Container from "@/components/container";
import MypageDeliveryAddressClientPage from "@/components/mypageDeliveryAddressClientPage";

import { commonFetch } from "@/utils/commonFetch";
import decodingJwttsx from "@/utils/decodingJwt";

export default async function Page() {
  const cookieStore = cookies();
  const access_token = cookieStore.get("access_token");
  const decodingJwt = decodingJwttsx(access_token?.value);
  const user_id = decodingJwt?.user_id;

  async function fetchData() {
    try {
      if (user_id) {
        const res = await commonFetch(
          `${process.env.NEXT_PUBLIC_API_URL}/user/address/${user_id}`,
          "get"
        );
        return res;
      }
    } catch (error) {
      if (error instanceof Error) {
        alert(error?.message);
      }
    }
  }

  const addressData = await fetchData();

  return (
    <Container>
      <div className="sm:w-[650px] sm:mx-auto">
        <MypageDeliveryAddressClientPage
          addressData={addressData?.userAddress}
        />
      </div>
    </Container>
  );
}
