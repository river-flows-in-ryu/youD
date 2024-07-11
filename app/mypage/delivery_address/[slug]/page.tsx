import React from "react";

import { cookies } from "next/headers";

import Container from "@/components/container";
import DeliveryAddressSlugClinetPage from "@/components/DeliveryAddressSlugClinetPage";

import decodingJwttsx from "@/utils/decodingJwt";
import { commonFetch } from "@/utils/commonFetch";

interface Request {
  searchParams: {
    addressId: string;
  };
  params: {
    slug: string;
  };
}

export default async function Page(request: Request) {
  const cookieStore = cookies();
  const access_token = cookieStore.get("access_token");
  const decodingJwt = decodingJwttsx(access_token?.value);
  const userId = decodingJwt?.user_id;

  const addressId = Number(request?.searchParams?.addressId);
  async function fetchData() {
    try {
      if (userId) {
        const res = await commonFetch(
          `${process.env.NEXT_PUBLIC_API_URL}/user/address/${userId}/${addressId}`,
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
  const userAddressDetailData = await fetchData();
  return (
    <Container>
      <DeliveryAddressSlugClinetPage slug={request?.params?.slug} />
    </Container>
  );
}
