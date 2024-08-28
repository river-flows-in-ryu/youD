import React from "react";

import { cookies } from "next/headers";

import Container from "@/components/container";
import Client from "./client";

import { commonFetch } from "@/utils/commonFetch";
import decodingJwttsx from "@/utils/decodingJwt";

export default async function Page() {
  const cookieStore = cookies();
  const access_token = cookieStore.get("access_token");
  const decodingJwt = decodingJwttsx(access_token?.value);
  const userId = decodingJwt?.user_id;

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
        <Client userProductNames={userProductNames?.data} />
      </div>
    </Container>
  );
}
