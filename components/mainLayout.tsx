"use client";
import React, { useRef, useState, useEffect } from "react";

import Image from "next/image";

import cart from "../public/cart.png";
import hamburger from "../public/hamburger.png";

import Drawer from "./drawer";

import { useMainHamburgerToggleStore } from "@/app/store";
import HamburgerDropdown from "./hamburgerDropdown";
import Link from "next/link";

export default function MainLayout() {
  const { toggle, setToggle } = useMainHamburgerToggleStore();

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

  const PCLayout = () => (
    <div className="">
      <div className="fixed w-full py-5 h-[130px] border-[#dedede] border-b">
        <div className="flex flex-col w-[1280px] m-auto">
          <div className="flex justify-between px-5">
            <button onClick={setToggle} className="relative">
              <Image src={hamburger} alt="hamburgerImage" />
            </button>
            <div className="">
              <input
                className="mr-[15px] rounded-md px-3 py-[9px] placeholder:text-base h-10 border "
                placeholder="검색어를 입력해주세요"
              ></input>
              <button className="rounded-md border px-4 py-2">검색하기</button>
            </div>
          </div>
          <div
            className={`
${toggle ? "block" : "hidden"}
w-[150px] h-[450px] bg-primary absolute top-20
`}
            ref={dropdownRef}
          >
            <HamburgerDropdown />
          </div>
          <div className="block mt-2">
            <div className="w-full flex justify-center">
              <div className="w-[1280px] flex justify-end pr-5 gap-9">
                <Link href="/">
                  <span className="text-primary">회원가입</span>
                </Link>
                <Link href="/login">
                  <span>로그인</span>
                </Link>
                <Link href="/cart">
                  <span>장바구니</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const MobileLayout = () => (
    <div className="">
      <div className="w-full h-[64px] px-5 py-3 fixed  border-[#dedede] border-b  bg-white z-10">
        <div className="flex justify-between px-5 pt-2">
          <button onClick={setToggle}>
            <Image src={hamburger} alt="hamburgerImage" />
          </button>
          <button className="sm:hidden">
            <Image src={cart} alt="searchImage" />
          </button>
        </div>
      </div>
      <div
        className={`${
          toggle ? "block" : "hidden"
        } absolute left-0 top-0 bg-primary w-[80%] h-full `}
        ref={slidedownRef}
      >
        <Drawer />
      </div>
    </div>
  );

  return (
    <header className="h-[64px] sm:h-[130px] ">
      <div className="hidden sm:block">
        <PCLayout />
      </div>
      <div className="block sm:hidden">
        <MobileLayout />
      </div>
    </header>
  );
}
