import React, { useEffect, useState } from "react";
import { commonFetch } from "@/utils/commonFetch";

export default async function Page({ params }: { params: { slug: string } }) {
  async function fetchData() {
    const res = await commonFetch(
      `${process.env.NEXT_PUBLIC_API_URL}/user_list`,
      "get"
    );
    return res;
  }
  const userData = await fetchData();
  console.log(userData);
  return (
    //
    <div></div>
  );
}
