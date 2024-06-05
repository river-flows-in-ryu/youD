"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { CookiesProvider } from "react-cookie";

import Container from "@/components/container";

import Loding from "./loading";
import { mainCarouelList } from "@/utils/mainCarouselList";

import { commonFetch } from "@/utils/commonFetch";
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
    const res = await commonFetch(
      `${process.env.NEXT_PUBLIC_API_URL}/product_list`,
      "get"
    );
    console.log(res);
    setProductData(res);
  }

  async function fetchBannerData() {
    const res = await commonFetch(
      `${process.env.NEXT_PUBLIC_API_URL}/banner`,
      "get"
    );
    setBannerData(res);
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
            {/* <Image src={testBanner} alt="image" className="w-full h-full" /> */}
            <div className="w-full h-full bg-black"></div>
          </div>

          <div className=" flex overflow-x-auto scrollbar-hide gap-2.5 my-[10px] px-3">
            {mainCarouelList?.map((item) => (
              <Link href={item?.link} key={item?.id}>
                <div>
                  <button className="bg-[#F2F4F6] rounded-[50%] w-16 h-16 flex justify-center items-center ">
                    <Image
                      src={item?.image}
                      alt={`Flaticon_image_${item?.title}`}
                      width={45}
                      height={45}
                    />
                  </button>
                  <span className="flex justify-center">{item?.title}</span>
                </div>
              </Link>
            ))}
          </div>

          <div className="my-5 px-[10px]">MD pick!</div>
          <div className="flex  gap-[10px] overflow-x-auto scrollbar-hide px-[10px] sm:w-[1280px] sm:mx-auto">
            {productData?.map((product: Product) => (
              <Link href={`/goods/${product?.id}`} key={product?.id}>
                <div className="w-[150px] h-[180px] rounded sm:w-[250px] sm:h-[300px]">
                  <Image
                    src={product?.image_url}
                    alt="image"
                    width={150}
                    height={180}
                    className="rounded w-[150px] h-[180px] sm:w-[250px] sm:h-[300px]"
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
