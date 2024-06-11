"use client";
import React, { useEffect, useState, useRef } from "react";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";

import Container from "@/components/container";
import SearchProductResultList from "@/components/searchProductResultList";
import HorizontalLine from "@/components/horizontalLine";

import { commonFetch } from "@/utils/commonFetch";

import search from "../../public/search.png";
import cancel from "../../public/cancel.png";
import SearchUserResultList from "@/components/searchUserResultList";

export default function Page() {
  const params = useSearchParams();
  const router = useRouter();

  const keyword = params?.get("keyword");

  const [searchText, setSearchText] = useState(keyword || "");

  const [searchProductResults, setSearchProductResults] = useState([]);
  const [searchProductResultsCount, setSearchProductResultsCount] = useState(0);
  const [searchUserResults, setSearchUserResults] = useState([]);
  const [searchUserResultsCount, setSearchUserResultsCount] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);

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
          setSearchProductResultsCount(searchData?.productsCount);

          setSearchUserResults(searchData?.users);
          setSearchUserResultsCount(searchData?.usersCount);
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
    router?.push(`/search?keyword=${searchText}`);
  }

  function handleSearchInputClear() {
    setSearchText("");
    if (inputRef?.current) {
      inputRef?.current?.focus();
    }
  }

  return (
    <Container>
      <div className="pb-10 w-screen sm:w-[650px] sm:mx-auto">
        <div className="flex flex-col">
          <div className="flex justify-center ">
            <div className="sticky top-[150px] z-20 w-[250px] h-10 border border-[#dadce0] rounded mt-[50px]">
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
        </div>
      </div>
    </Container>
  );
}
