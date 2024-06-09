"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

import { serverFetch } from "@/components/serverFetch";

import search from "../../public/search.png";
import cancel from "../../public/cancel.png";

import Container from "@/components/container";
import { commonFetch } from "@/utils/commonFetch";

interface Product {
  id: number;
  OriginPrice: number;
  discountPrice: number;
  discountRate: number;
  image_url: string;
  productName: string;
  user: {
    id: number;
    username: string;
  };
}

export default function Page() {
  const params = useSearchParams();
  const router = useRouter();

  const keyword = params?.get("keyword");

  const [searchText, setSearchText] = useState(keyword || "");

  const [searchProductResults, setSearchProductResults] = useState([]);
  const [searchUserResults, setSearchUserResults] = useState([]);

  useEffect(() => {
    setSearchText(keyword ?? "");
  }, [keyword]);

  useEffect(() => {
    if (searchText === "") return;
    if (searchText !== "") {
      const fetchData = async () => {
        try {
          const searchData = await commonFetch(
            `${
              process.env.NEXT_PUBLIC_API_URL
            }/search?keyword=${encodeURIComponent(searchText?.trim())}`,
            "get"
          );
          console.log(searchData);
          setSearchProductResults(searchData?.products);
          setSearchUserResults(searchData?.users);
        } catch (error) {
          if (error instanceof Error) {
            alert(error?.message);
          }
        }
      };
      fetchData();
    }
  }, [keyword]);

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    event.stopPropagation();
    if (event.key === "Enter") {
      event.preventDefault();
      handleSubmit();
    }
  }

  async function handleSubmit() {
    router?.push(`/search?keyword=${searchText}`);
  }

  return (
    <Container>
      <div className="flex justify-center">
        <div className=" relative w-[250px] h-10 border border-[#dadce0] rounded-2xl mt-[30px]">
          <Image
            src={search}
            alt="search"
            className="absolute top-0 left-0 mt-[10px] ml-2 z-10 cursor-pointer"
            width={20}
            height={20}
            onClick={handleSubmit}
          />
          <input
            className="w-full h-full pl-10 rounded-2xl bg-[#f4f4f4]"
            value={searchText || ""}
            placeholder="검색어를 입력해주세요"
            onChange={(event) => setSearchText(event.target?.value)}
            onKeyDown={handleKeyDown}
          />
          {(searchText !== "" && (
            <Image
              src={cancel}
              alt="cancel"
              width={20}
              height={20}
              className="top-0 right-0 z-10 absolute mt-[10px] mr-2"
              onClick={() => setSearchText("")}
            />
          )) ||
            null}
        </div>
      </div>
      {searchProductResults?.length === 0 ? null : (
        <div>
          <p> 상품</p>
          <div className="flex flex-1 f-full flex-col w-screen">
            <div className=" flex overflow-x-auto ">
              {searchProductResults?.map((product: Product) => (
                <div key={product?.id} className="">
                  <Link href={`/goods/${product?.id}`}>
                    <Image
                      src={product?.image_url}
                      width={125}
                      height={125}
                      alt={product?.productName}
                    />
                    <p>{product?.user?.username}</p>
                    <p>{product?.productName}</p>
                    <div className="flex">
                      <>{(product?.OriginPrice).toLocaleString()}원</>
                      <>{product?.discountRate}%</>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
            <button className=""> 상품 전체보기</button>
          </div>
        </div>
      )}
    </Container>
  );
}
