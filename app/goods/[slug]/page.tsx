import React, { useEffect, useState } from "react";
import Image from "next/image";
import { commonFetch } from "@/utils/commonFetch";

export default async function Page({ params }: { params: { slug: string } }) {
  async function fetchData() {
    const res = await commonFetch(
      `${process.env.NEXT_PUBLIC_API_URL}/product_list/${params.slug}`,
      "get"
    );
    return res;
  }
  const productData = await fetchData();
  return (
    <div className="mx-auto">
      <div className="sm:w-[1050px]">
        <Image
          src={productData?.image_url}
          alt="zzz"
          width={100}
          height={100}
          style={{ width: "100%", height: "100%" }}
        ></Image>
      </div>
    </div>
  );
}
