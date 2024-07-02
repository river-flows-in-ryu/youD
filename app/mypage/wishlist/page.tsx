"use client";

import React, { useEffect, useState } from "react";

import Container from "@/components/container";

import { commonFetch } from "@/utils/commonFetch";
import Pagination from "@/utils/pagination";

import { useUserIdStore } from "@/app/store";

import { Product } from "@/types/product";

import MypageWishlist from "@/components/mypageWishlist";

interface LikeStatus {
  [key: number]: boolean;
}
export default function Page() {
  const { userId } = useUserIdStore();

  const [likeProductList, setLikeProductList] = useState([]);
  const [likeStatus, setLikeStatus] = useState<LikeStatus>({});

  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(1);

  useEffect(() => {
    const getLikeProductData = async () => {
      if (userId) {
        try {
          const res = await commonFetch(
            `${process.env.NEXT_PUBLIC_API_URL}/product/like?userId=${userId}&offset=${(page - 1) * 10}&limit=10`,
            "get"
          );
          setTotalCount(res?.count);
          setLikeProductList(res?.data);
        } catch (error) {
          if (error instanceof Error) {
            alert(error.message);
          }
        }
      }
    };
    getLikeProductData();
  }, [userId]);

  const handleChangeLike = async (productId: number) => {
    const payload = {
      user_id: userId,
      product_id: productId,
    };
    const res = await commonFetch(
      `${process.env.NEXT_PUBLIC_API_URL}/product/like`,
      "post",
      payload
    );
    if (res) {
      setLikeStatus((prev) => ({
        ...prev,
        [productId]: !prev[productId],
      }));
    }
  };

  return (
    <Container>
      <div className="sm:w-[650px] sm:mx-auto">
        <h2 className=" font-bold text-xl py-5 px-5">나의 관심목록</h2>
        <div className="mb-5">
          {likeProductList?.map((product: Product) => (
            <MypageWishlist
              key={product?.id}
              product={product}
              likeStatus={likeStatus}
              handleChangeLike={handleChangeLike}
            />
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
