"use client";
import React, { useState, useEffect, useMemo } from "react";

import Image from "next/image";
import { usePathname } from "next/navigation";
import Link from "next/link";

import search from "../public/search.png";
import home from "../public/home.png";
import person from "../public/person.png";
import plus from "../public/plus.png";

export default function TabBar() {
  const pathname = usePathname();
  const [isNumericPath, setIsNumericPath] = useState(false);

  useEffect(() => {
    if (
      pathname?.startsWith("/goods/") ||
      pathname?.startsWith("/cart") ||
      pathname?.startsWith("/checkout")
    ) {
      setIsNumericPath(true);
    } else setIsNumericPath(false);
  }, [pathname, setIsNumericPath, isNumericPath]);

  return isNumericPath ? null : (
    <div className="block sm:hidden  ">
      <div className="fixed bottom-0 w-full border z-10 bg-white">
        <div className=" w-full h-[45px] flex ">
          <Link
            href="/search"
            className="flex-1 items-center justify-center flex "
          >
            <Image src={search} alt="search" />
          </Link>
          <Link href="/" className="flex-1 items-center justify-center flex ">
            <Image src={home} alt="home" />
          </Link>
          <Link
            href="/products/add"
            className="flex-1 items-center justify-center flex "
          >
            <Image src={plus} alt="plus" className="w-5 h-5" />
          </Link>
          <Link
            href="/mypage"
            className="flex-1 items-center justify-center flex "
          >
            <Image src={person} alt="person" />
          </Link>
        </div>
      </div>
    </div>
  );
}
