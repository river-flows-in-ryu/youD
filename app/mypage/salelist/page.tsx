"use client";
import React, { useState, useEffect } from "react";

import Container from "@/components/container";

import { commonFetch } from "@/utils/commonFetch";
import Pagination from "@/utils/pagination";

import { useUserIdStore } from "@/app/store";

import { Product } from "@/types/product";
import MypageSaleList from "@/components/mypageSaleList";
export default function Page() {
  const { userId } = useUserIdStore();

  const [salesData, setSalesData] = useState([]);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      if (userId) {
        try {
          const res = await commonFetch(
            `${process.env.NEXT_PUBLIC_API_URL}/brands/${userId}?offset=${(page - 1) * 10}&limit=10`,
            "get"
          );
          console.log(res);
          setTotalCount(res?.totalCount);
          setSalesData(res.results);
        } catch (error) {
          if (error instanceof Error) {
            alert(error?.message);
          }
        }
      }
    };
    fetchData();
  }, [userId]);

  return (
    <Container>
      <div className="sm:w-[650px] sm:mx-auto">
        <h2 className=" font-bold text-xl py-5 px-5">나의 판매내역</h2>
        <div className="mb-5">
          {salesData?.map((product: Product) => (
            <MypageSaleList product={product} key={product?.id} />
          ))}
        </div>
        <Pagination
          page={page}
          totalCount={totalCount}
          pageSize={10}
          onChange={setPage}
        />
      </div>
    </Container>
  );
}
