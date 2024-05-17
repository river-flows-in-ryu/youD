import React from "react";

import { commonFetch } from "@/utils/commonFetch";

import GoodsClientPage from "@/components/goodsClientPage";

export default async function Page({ params }: { params: { slug: string } }) {
  async function getData(slug: string) {
    try {
      const res = commonFetch(
        `${process.env.NEXT_PUBLIC_API_URL}/product_list/${slug}`,
        "get"
      );
      return res;
    } catch (event) {
      console.log(event);
    }
  }
  const data = await getData(params?.slug);

  return (
    <>
      <GoodsClientPage data={data} slug={params?.slug} />
    </>
  );
}
