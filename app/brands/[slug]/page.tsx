import React from "react";

import { commonFetch } from "@/utils/commonFetch";
import BrandsClientPage from "@/components/brandsClientPage";

export default async function Page({ params }: { params: { slug: string } }) {
  async function getUsertData(slug: number) {
    try {
      const res = await commonFetch(
        `${process.env.NEXT_PUBLIC_API_URL}/brand_info/${slug}`,
        "get"
      );
      return res;
    } catch (error) {
      if (error instanceof Error) {
        alert(error?.message);
      }
    }
  }

  const userData = await getUsertData(parseInt(params?.slug));
  console.log(userData);

  return <BrandsClientPage userData={userData} slug={params?.slug} />;
}
