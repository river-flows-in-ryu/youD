import React, { useEffect, useState } from "react";

import Image from "next/image";
import Link from "next/link";

import { commonFetch } from "@/utils/commonFetch";

import { Product } from "@/types/product";
import Pagination from "@/utils/pagination";

export default function SearchProductList({
  searchText,
}: {
  searchText: string;
}) {
  const [page, setPage] = useState(1);
  const [productData, setProductData] = useState([]);
  const [totalCount, setTotalCount] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await commonFetch(
          `${process.env.NEXT_PUBLIC_API_URL}/search/products?keyword=${encodeURIComponent(searchText?.trim())}&offset=${(page - 1) * 10}&limit=30`,
          "get"
        );
        console.log(res);
        setTotalCount(res?.productsCount);
        setProductData(res?.products);
      } catch (error) {
        if (error instanceof Error) {
          alert(error?.message);
        }
      }
    };
    fetchData();
  }, []);

  return (
    <>
      <div className="w-full ">
        <div className=" flex flex-wrap ">
          {productData?.map((product: Product) => (
            <div key={product?.id} className="w-[33%]">
              <Link href={`/goods/${product?.id}`}>
                <Image
                  src={product?.image_url}
                  width={125}
                  height={125}
                  alt={product?.productName}
                  className="w-full"
                />
                <div className="pt-3 mx-2.5">
                  <p className="text-xs line-clamp-1 break-all ">
                    {product?.brandName}
                  </p>
                  <p className="text-sm	line-clamp-2 break-all font-bold">
                    {product?.productName}
                  </p>
                  {/* no discount */}
                  {product?.OriginPrice === product?.discountPrice ||
                  product?.discountRate === 0 ? (
                    <span className="line-through text-[#b5b5b5]	mb-5">
                      {(product?.OriginPrice).toLocaleString()}원
                    </span>
                  ) : (
                    <div className="flex justify-between text-xs mt-1 mb-5">
                      <div className="flex flex-col">
                        <span>
                          {(product?.discountPrice).toLocaleString()}원
                        </span>
                        <span className="line-through text-[#b5b5b5]	">
                          {(product?.OriginPrice).toLocaleString()}원
                        </span>
                      </div>
                      <strong className="text-red-400">
                        {product?.discountRate}%
                      </strong>
                    </div>
                  )}
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
      <Pagination
        page={page}
        onChange={setPage}
        totalCount={totalCount}
        pageSize={30}
      />
    </>
  );
}
