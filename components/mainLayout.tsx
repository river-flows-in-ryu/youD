"use client";
import React, { useRef, useEffect, useState } from "react";

import Image from "next/image";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useCookies } from "react-cookie";
import { Badge } from "antd";

import Drawer from "./drawer";
import HamburgerDropdown from "./hamburgerDropdown";

import { useCartCountStore, useMainHamburgerToggleStore } from "@/app/store";
import { useUserIdStore } from "@/app/store";

import cart from "../public/cart.png";
import hamburger from "../public/hamburger.png";
import arrowBack from "../public/arrow_back.png";
import home from "../public/home.png";
import search from "../public/search.png";

export default function MainLayout() {
  const { toggle, setToggle } = useMainHamburgerToggleStore();
  const [scrollPosition, setScrollPosition] = useState(0);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const slidedownRef = useRef<HTMLDivElement>(null);

  const { userId, setUserId } = useUserIdStore();
  const { fetchCartItemCount, itemCount } = useCartCountStore();

  const pathname = usePathname();
  useEffect(() => {
    setIsNumericPath(
      pathname.startsWith("/goods/") &&
        /^\d+$/.test(pathname?.split("/").pop() as string)
    );
  }, [pathname]);

  useEffect(() => {
    async function fetchData() {
      try {
        await fetchCartItemCount(userId);
      } catch (error) {
        if (error instanceof Error) {
          alert(error?.message);
        }
      }
    }
    if (userId !== 0) fetchData();
  }, [fetchCartItemCount, userId]);

  useEffect(() => {
    if (toggle) {
      setScrollPosition(window?.scrollY);
    }
  }, [toggle]);

  const [isNumericPath, setIsNumericPath] = useState(false);
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

  const router = useRouter();
  const [, , removeCookie] = useCookies(["access_token"]);

  async function handleLogout() {
    setUserId(0);
    useUserIdStore?.persist?.clearStorage();
    removeCookie("access_token");
    sessionStorage.removeItem("selectedProducts");
    router.refresh();
    router.push("/login");
  }
  const primaryColor = "#77C497";
  const PCLayout = () => (
    <div className="">
      <div className="fixed w-full py-5 h-[130px] border-[#dedede] border-b bg-white z-10">
        <div className="flex flex-col  m-auto">
          <div className="flex justify-between px-5 sm:w-full xl:w-[1280px] m-auto ">
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
                {!userId ? (
                  <>
                    <Link href="/">
                      <span className="text-primary">회원가입</span>
                    </Link>
                    <Link href="/login">
                      <span>로그인</span>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link href="/mypage">
                      <span>마이페이지</span>
                    </Link>
                    <button onClick={handleLogout}>
                      <span>로그아웃</span>
                    </button>
                  </>
                )}
                <Link href="/cart">
                  <span className="mr-[3px]">장바구니</span>
                  {userId ? (
                    <Badge
                      count={itemCount}
                      color={primaryColor}
                      styles={{ root: { margin: "0 0 3px 0" } }}
                    ></Badge>
                  ) : null}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const GoodsDetailLayout = () => (
    <div className="">
      <div className="w-full h-[64px] px-5 py-3 fixed  border-[#dedede] border-b  bg-white z-10 ">
        <div className="flex justify-between px-5 pt-2 ">
          <div>
            <button onClick={() => router.back()} className="mr-[15px]">
              <Image
                src={arrowBack}
                alt="arrowBack"
                width={20}
                height={20}
                priority={true}
              />
            </button>
            <button onClick={setToggle}>
              <Image src={hamburger} alt="hamburgerImage" />
            </button>
          </div>
          <div>
            <Link href={"/"}>
              <button className="sm:hidden mr-[15px]">
                <Image src={home} alt="home" />
              </button>
            </Link>
            <Link href={"/search"}>
              <button className="sm:hidden mr-[15px]">
                <Image src={search} alt="searchImage" />
              </button>
            </Link>
            <Link href="/cart">
              <Badge count={itemCount} color={primaryColor}>
                <button className="sm:hidden">
                  <Image src={cart} alt="cart" />
                </button>
              </Badge>
            </Link>
          </div>
        </div>
      </div>
      <div
        className={`${
          toggle ? "block" : "hidden"
        } absolute left-0 top-[${scrollPosition}px] bg-primary w-[80%] h-full z-10 mt-[64px]`}
        ref={slidedownRef}
      >
        <Drawer />
      </div>
    </div>
  );

  const MobileBasicLayout = () => (
    <div className="">
      <div className="w-full h-[64px] px-5 py-3 fixed  border-[#dedede] border-b  bg-white z-10">
        <div className="flex justify-between px-5 pt-2">
          <button onClick={setToggle}>
            <Image src={hamburger} alt="hamburgerImage" priority />
          </button>
          <Link href={"/cart"}>
            <Badge count={itemCount} color={primaryColor}>
              <button className="sm:hidden">
                <Image src={cart} alt="searchImage" />
              </button>
            </Badge>
          </Link>
        </div>
      </div>
      <div
        className={`${
          toggle ? "block" : "hidden"
        } absolute left-0 top-[${scrollPosition}px] mt-[64px] bg-primary w-[80%] h-full `}
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
        {isNumericPath ? <GoodsDetailLayout /> : <MobileBasicLayout />}
      </div>
    </header>
  );
}
