"use client";

import React, { useEffect, useState } from "react";

import Link from "next/link";
import Image from "next/image";

import Pagination from "@/utils/pagination";

import { commonFetch } from "@/utils/commonFetch";

import HorizontalLine from "@/components/horizontalLine";
import Container from "@/components/container";

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

interface UserData {
  brand_info: {
    id: number;
    name: string;
    description: string;
    image: string;
    bg_image: string;
  };
  is_exist: boolean;
}

interface Props {
  userData: UserData;
  slug: string;
}

export default function Client({ userData, slug }: Props) {
  const [brandProductList, setBrandProductList] = useState([]);

  const [page, setPage] = useState(1);
  const [brandProductTotalCount, setBrandProductTotalCount] = useState(0);

  const { name, description, image, bg_image } = userData?.brand_info;

  useEffect(() => {
    async function brandsProductData() {
      const res = await commonFetch(
        `${process.env.NEXT_PUBLIC_API_URL}/brands/${slug}`,
        "get"
      );
      setBrandProductList(res.results);
      setBrandProductTotalCount(res.totalCount);
    }
    if (slug) {
      brandsProductData();
    }
  }, [slug]);

  return (
    <Container>
      <div className="w-full h-full sm:w-[650px] sm:mx-auto">
        <div
          className="w-full h-[250px] bg-white flex justify-center items-center text-center mb-[10px]"
          style={{
            backgroundImage: `${bg_image ? `url(${bg_image})` : "none"} `,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="flex flex-col items-center">
            <div
              className={`w-20 h-20 rounded-[50%] relative ${
                image ? "" : "bg-black"
              }`}
            >
              {image && (
                <Image
                  src={image}
                  alt="유저 이미지"
                  fill
                  style={{ objectFit: "contain", borderRadius: "50%" }}
                />
              )}
            </div>
            <h2 className="mt-3 text-xl	text-black font-bold">
              {name || "브랜드 네임"}
            </h2>
            <span className="text-black text-sm mt-2">
              {description || "간략한 설명글"}
            </span>
          </div>
        </div>

        <HorizontalLine />
        <div className="flex flex-wrap px-[10px] justify-between mt-[10px]">
          {brandProductList?.map((product: Product) => (
            <div key={product?.id} className="w-[49%] h-full flex-shrink-0">
              <Link href={`/goods/${product?.id}`}>
                <Image
                  src={product?.image_url}
                  alt={product?.productName}
                  width={150}
                  height={150}
                  className="w-full h-[250px] sm:h-[350px]"
                />
                <div className="mt-5 px-4">
                  <p className="text-xs line-clamp-1 break-all ">
                    {product?.user?.brandName}
                  </p>
                  <p className="text-sm	line-clamp-2 break-all font-bold">
                    {product?.productName}
                  </p>
                  {product?.OriginPrice === product?.discountPrice ||
                  product?.discountRate === 0 ? (
                    <span className="line-through text-[#b5b5b5]	mb-5">
                      {(product?.OriginPrice).toLocaleString()}원
                    </span>
                  ) : (
                    <div className="flex justify-between text-xs mt-1 mb-5">
                      <div className="flex flex-col">
                        <span className="text-base font-medium">
                          {(product?.discountPrice).toLocaleString()}원
                        </span>
                        <span className="line-through text-[#b5b5b5]	">
                          {(product?.OriginPrice).toLocaleString()}원
                        </span>
                      </div>
                      <strong className="text-red-400 text-base	">
                        {product?.discountRate}%
                      </strong>
                    </div>
                  )}
                </div>
              </Link>
            </div>
          ))}
        </div>
        <Pagination
          page={page}
          totalCount={brandProductTotalCount}
          pageSize={10}
          onChange={setPage}
        />
      </div>
    </Container>
  );
}
