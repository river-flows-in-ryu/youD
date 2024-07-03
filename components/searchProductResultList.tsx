import React from "react";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

import arrowBlack from "../public/arrow_forward_balck.png";

interface Product {
  id: number;
  OriginPrice: number;
  discountPrice: number;
  discountRate: number;
  image_url: string;
  productName: string;
  user: {
    id: number;
    brandName: string;
  };
}

interface Props {
  searchProductResultsCount: number;
  keyword: string | null;
  searchProductResults: Product[];
}

export default function SearchProductResultList({
  searchProductResultsCount,
  keyword,
  searchProductResults,
}: Props) {
  const router = useRouter();

  function handleClickAllProductList() {
    router?.push(`/search?type=products&keyword=${keyword}`);
  }
  return (
    <div className="">
      <div className="w-full flex justify-between mb-[30px] px-3">
        <div className=" flex">
          <h2 className="font-bold mr-1">상품</h2>
          <span className="">{searchProductResultsCount}</span>
        </div>

        {searchProductResultsCount === 0 ? null : (
          <Link href={`/search?type=products&keyword=${keyword}`}>
            <Image src={arrowBlack} alt="전체보기" width={20} height={20} />
          </Link>
        )}
      </div>
      {searchProductResultsCount === 0 ? (
        <div className="flex text-center justify-center ">
          <div className="flex flex-col text-[#919191] h-[150px]">
            <span>판매중인 상품이 없습니다.</span>
            <span>검색어를 정확히 입력해주세요</span>
          </div>
        </div>
      ) : (
        <div className="w-full ">
          <div className=" flex flex-wrap ">
            {searchProductResults?.map((product: Product) => (
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
                      {product?.user?.brandName}
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
          <div className="w-full flex justify-center mb-10">
            <button
              className="w-full mx-5 border border-[#f2f2f2] bg-[#f2f2f2] h-[50px] rounded "
              onClick={handleClickAllProductList}
            >
              상품 전체보기
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
