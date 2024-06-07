import React from "react";

import { commonFetch } from "@/utils/commonFetch";

import OverviewClientpage from "@/components/overviewClientPage";

export default async function Page() {
  async function fetchData() {
    const res = await commonFetch(
      `${process.env.NEXT_PUBLIC_API_URL}/top-categories`,
      "get"
    );
    return res;
  }
  const categoriesData = await fetchData();
  return <OverviewClientpage categoriesData={categoriesData?.results} />;
}
