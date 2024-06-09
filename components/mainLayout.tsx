"use client";
import React, { useRef, useEffect, useState } from "react";

import Image from "next/image";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Badge } from "antd";

import Drawer from "./drawer";

import { useCartCountStore, useMainHamburgerToggleStore } from "@/app/store";
import { useUserIdStore } from "@/app/store";

import PcLayout from "./pcLayout";

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

  const primaryColor = "#77C497";

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
            <Link href="/overview">
              <button>
                <Image src={hamburger} alt="hamburgerImage" />
              </button>
            </Link>
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
              {userId ? (
                <Badge count={itemCount} color={primaryColor}>
                  <button className="sm:hidden">
                    <Image src={cart} alt="cart" />
                  </button>
                </Badge>
              ) : (
                <button className="sm:hidden">
                  <Image src={cart} alt="cart" />
                </button>
              )}
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
          <Link href="/overview">
            <button>
              <Image src={hamburger} alt="hamburgerImage" priority />
            </button>
          </Link>
          <Link href={"/cart"}>
            {userId ? (
              <Badge count={itemCount} color={primaryColor}>
                <button className="sm:hidden">
                  <Image src={cart} alt="cart" />
                </button>
              </Badge>
            ) : (
              <button className="sm:hidden">
                <Image src={cart} alt="cart" />
              </button>
            )}
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
        <PcLayout />
      </div>
      <div className="block sm:hidden">
        {isNumericPath ? <GoodsDetailLayout /> : <MobileBasicLayout />}
      </div>
    </header>
  );
}
