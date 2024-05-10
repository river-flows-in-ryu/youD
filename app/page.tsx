"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { CookiesProvider } from "react-cookie";

import Container from "@/components/container";

import Loding from "./loading";

import testBanner from "../public/testBanner.jpeg";
interface Product {
  id: number;
  image_url: string;
  user: {
    username: string;
  };
  productName: string;
  OriginPrice: number;
  discountRate: number;
  discountPrice: number;
}

export default function Home() {
  const [productData, setProductData] = useState([]);
  const [bannerData, setBannerData] = useState([]);

  useEffect(() => {
    async function fetch() {
      await fetchProductData();
      await fetchBannerData();
    }
    fetch();
  }, []);

  async function fetchProductData() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/product_list`);
    const jsonRes = await res.json();
    setProductData(jsonRes);
  }

  async function fetchBannerData() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/banner`);
    const jsonRes = await res.json();
    setBannerData(jsonRes);
  }

  if (!productData) {
    return <Loding />;
  }
  console.log(productData);
  return (
    <CookiesProvider>
      <Container>
        <main className="flex flex-1 f-full flex-col w-screen">
          <div className="w-full h-[300px]">
            <Image src={testBanner} alt="image" className="w-full h-full" />
          </div>
          <div className="my-5 px-[10px]">MD pick!</div>
          <div className="flex gap-[10px] overflow-x-auto scrollbar-hide px-[10px]">
            {productData?.map((product: Product) => (
              <Link href={`/goods/${product?.id}`} key={product?.id}>
                <div className="w-[150px] h-[180px] rounded">
                  <Image
                    src={product?.image_url}
                    alt="image"
                    width={150}
                    height={180}
                    className="rounded w-[150px] h-[180px]"
                  />
                </div>
                <div className="w-[150px]  flex flex-col mt-2">
                  <span>{product?.user?.username}</span>
                </div>
                <div className="leading-[1.3] overflow-hidden text-ellipsis line-clamp-2 ">
                  <span>{product?.productName}</span>
                </div>
                <span className="line-through	text-xs text-secondary">
                  {(product?.OriginPrice || 0).toLocaleString()}원
                </span>
                <div className="flex">
                  <span className="text-red-500 mr-1">
                    {product?.discountRate || 0}%
                  </span>
                  <span>
                    {(product?.discountPrice).toLocaleString() || 0}원
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </main>
      </Container>
    </CookiesProvider>
  );
}
