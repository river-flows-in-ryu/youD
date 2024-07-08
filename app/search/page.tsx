"use client";
import React, { useEffect, useState, useRef } from "react";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Tabs } from "antd";

import Container from "@/components/container";
import SearchProductResultList from "@/components/searchProductResultList";
import HorizontalLine from "@/components/horizontalLine";
import dynamic from "next/dynamic";

import { commonFetch } from "@/utils/commonFetch";

import search from "../../public/search.png";
import cancel from "../../public/cancel.png";
import SearchUserResultList from "@/components/searchUserResultList";

import type { TabsProps } from "antd";

const SearchProductList = dynamic(
  () => import("../../components/searchProductList")
);
const SearchBrandList = dynamic(
  () => import("../../components/searchBrandList")
);

export default function Page() {
  const params = useSearchParams();
  const router = useRouter();

  const tabYype = params?.get("type");
  const keyword = params?.get("keyword");

  const [searchText, setSearchText] = useState(keyword || "");
  const [tabKey, setTabKey] = useState("");

  const [searchProductResults, setSearchProductResults] = useState([]);
  const [searchProductResultsCount, setSearchProductResultsCount] = useState(0);
  const [searchUserResults, setSearchUserResults] = useState([]);
  const [searchUserResultsCount, setSearchUserResultsCount] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "통합",
      children: (
        <>
          {keyword === null ? null : (
            <>
              <SearchProductResultList
                searchProductResultsCount={searchProductResultsCount}
                keyword={keyword}
                searchProductResults={searchProductResults}
              />
              <HorizontalLine />

              <SearchUserResultList
                searchUserResultsCount={searchUserResultsCount}
                keyword={keyword}
                searchUserResults={searchUserResults}
              />
              <HorizontalLine />
            </>
          )}
        </>
      ),
    },
    {
      key: "2",
      label: "상품",
      children: <SearchProductList searchText={searchText} />,
      disabled: searchProductResultsCount === 0,
    },
    {
      key: "3",
      label: "브랜드",
      children: <SearchBrandList searchText={searchText} />,
      disabled: searchUserResultsCount === 0,
    },
  ];

  useEffect(() => {
    if (tabYype === "integration") setTabKey("1");
    if (tabYype === "products") setTabKey("2");
    if (tabYype === "brands") setTabKey("3");
  }, [tabYype]);

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
            }/search/integration?keyword=${encodeURIComponent(searchText?.trim())}&offset=0&limit=6`,
            "get"
          );
          setSearchProductResults(searchData?.products);
          setSearchProductResultsCount(searchData?.productsCount);

          setSearchUserResults(searchData?.brands);
          setSearchUserResultsCount(searchData?.brandsCount);
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
    if (searchText === "") {
      alert("검색어를 입력해주세요");
      return;
    }
    router?.push(`/search?type=integration&keyword=${searchText}`);
  }

  function handleSearchInputClear() {
    setSearchText("");
    if (inputRef?.current) {
      inputRef?.current?.focus();
    }
  }

  const handleChageTab = (key: string) => {
    if (key === "1")
      router?.push(`/search?type=integration&keyword=${searchText}`);
    if (key === "2")
      router?.push(`/search?type=products&keyword=${searchText}`);
    if (key === "3") router?.push(`/search?type=brands&keyword=${searchText}`);
  };

  return (
    <Container>
      <div className="pb-10 w-screen sm:w-[650px] sm:mx-auto">
        <div className="flex flex-col">
          <div className="flex justify-center mb-5">
            <div className="sticky top-[150px] z-20 w-[250px] h-10 border border-[#dadce0] rounded mt-5">
              <Image
                src={search}
                alt="search"
                className="absolute top-0 left-0 mt-[10px] ml-2 z-10 cursor-pointer"
                width={20}
                height={20}
                onClick={handleSubmit}
              />
              <input
                className="w-full h-full pl-10 rounded bg-[#f4f4f4]"
                value={searchText || ""}
                placeholder="검색어를 입력해주세요"
                onChange={(event) => setSearchText(event.target?.value)}
                onKeyDown={handleKeyDown}
                ref={inputRef}
              />
              {(searchText !== "" && (
                <Image
                  src={cancel}
                  alt="cancel"
                  width={20}
                  height={20}
                  className="top-0 right-0 z-10 absolute mt-[10px] mr-2"
                  onClick={handleSearchInputClear}
                />
              )) ||
                null}
            </div>
          </div>
          {keyword && (
            <>
              <HorizontalLine />
              <Tabs
                defaultActiveKey="1"
                items={items}
                tabBarStyle={{ paddingLeft: "10px" }}
                onChange={handleChageTab}
                activeKey={tabKey}
              />
            </>
          )}
        </div>
      </div>
    </Container>
  );
}
