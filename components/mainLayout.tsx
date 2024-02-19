"use client";
import React from "react";

import Image from "next/image";

import search from "../public/search.png";
import hamburger from "../public/hamburger.png";

import Slide from "./slide";

import { useMainHamburgerToggleStore } from "@/app/store";

export default function MainLayout() {
  const { toggle, setToggle } = useMainHamburgerToggleStore();
  return (
    <header className="w-full  h-16 flex justify-center ">
      <div className="w-[1200px] px-5 py-3 flex justify-between relative">
        <div className="pt-2">
          <button onClick={setToggle}>
            <Image src={hamburger} alt="hamburgerImage" />
          </button>
        </div>
        <div className=" hidden sm:block">
          <input
            className="mr-[15px] rounded-md px-3 py-[9px] placeholder:text-base h-10 border "
            placeholder="검색어를 입력해주세요"
          ></input>
          <button className="rounded-md border px-4 py-2">검색하기</button>
        </div>
        <button className="sm:hidden">
          <Image src={search} alt="searchImage" />
        </button>
      </div>
      <div
        className={`${
          toggle ? "block" : "hidden"
        } absolute left-0 top-0 bg-[#77C497] w-[80%] h-full`}
      >
        <Slide />
      </div>
    </header>
  );
}
