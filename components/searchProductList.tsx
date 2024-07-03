import { commonFetch } from "@/utils/commonFetch";
import React from "react";

export default async function SearchProductList() {
  async function getProductData() {
    try {
      const res = await commonFetch(``, "get");
    } catch (error) {
      if (error instanceof Error) {
        alert(error?.message);
      }
    }
  }

  return (
    //
    <div></div>
  );
}
