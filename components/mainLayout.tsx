"use client";
import React, { useRef, useState, useEffect } from "react";

import Image from "next/image";

import cart from "../public/cart.png";
import hamburger from "../public/hamburger.png";

import Slide from "./slide";

import { useMainHamburgerToggleStore } from "@/app/store";
import HamburgerDropdown from "./hamburgerDropdown";

export default function MainLayout() {
  const { toggle, setToggle } = useMainHamburgerToggleStore();

  const windowWidth = typeof window !== "undefined" ? window.innerWidth : 0;

  const dropdownRef = useRef<HTMLDivElement>(null);
  const slidedownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const isInsideDropdown = dropdownRef?.current?.contains(
        event.target as Node
      );
      const isInsideSlide = slidedownRef?.current?.contains(
        event.target as Node
      );
      if (toggle) {
        if (
          !isInsideDropdown &&
          dropdownRef &&
          slidedownRef &&
          !isInsideSlide
        ) {
          setToggle();
        }
      }
    }
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [dropdownRef, setToggle, toggle, slidedownRef]);

  return (
    <header className="w-full  flex justify-center ">
      <div className="w-[1280px] px-5 pt-3 sm:pt-5 pb-3 flex justify-between relative">
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
          <Image src={cart} alt="searchImage" />
        </button>
        <div
          className={`
          ${windowWidth >= 640 && toggle ? "block" : "hidden"}
          absolute w-[150px] h-[450px] bg-[#77C497] top-[100%] xl:left-[-40px] left-0
          `}
          ref={dropdownRef}
        >
          <HamburgerDropdown />
        </div>
      </div>
      <div
        className={`${
          windowWidth < 640 && toggle ? "block" : "hidden"
        } absolute left-0 top-0 bg-[#77C497] w-[80%] h-full`}
        ref={slidedownRef}
      >
        <Slide />
      </div>
    </header>
  );
}
