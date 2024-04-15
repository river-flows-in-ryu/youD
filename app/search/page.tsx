"use client";
import React, { useState } from "react";
import Image from "next/image";

import { serverFetch } from "@/components/serverFetch";

import search from "../../public/search.png";
import cancel from "../../public/cancel.png";

export default function Page() {
  const [searchText, setSearchText] = useState("");

  const payload = {
    keyword: searchText,
  };

  async function handleSubmit() {
    const res = await serverFetch(
      `${process.env.NEXT_PUBLIC_API_URL}/search?keyword=${encodeURIComponent(
        searchText
      )}`,
      "get"
    );
    console.log(res);
  }

  return (
    <div className="w-full min-h-full flex flex-col justify-center items-center sm:hidden ">
      <div className="relative ">
        <input
          className="w-[250px] h-[40px] border border-[#dadce0] relative px-[35px] rounded-2xl bg-[#f4f4f4]"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <Image
          src={search}
          alt="search"
          className=" top-0 left-0 z-10 absolute mt-[10px] ml-2"
          width={20}
          height={20}
          onClick={handleSubmit}
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
  );
}
