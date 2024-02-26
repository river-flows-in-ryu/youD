"use client";
import React, { useState, useMemo } from "react";

import Image from "next/image";

import search from "../public/search.png";
import home from "../public/home.png";
import person from "../public/person.png";
import Link from "next/link";

export default function TabBar() {
  const windowWidth = typeof window !== "undefined" ? window.innerWidth : 0;
  return (
    <div className="block sm:hidden ">
      <div className="fixed bottom-0 w-full border z-10 bg-white">
        <div className=" w-full h-[45px] flex ">
          <Link
            href="/search"
            className="flex-1 items-center justify-center flex "
          >
            <Image src={search} alt="search" />
          </Link>
          <button className="flex-1 items-center justify-center flex ">
            <Image src={home} alt="home" />
          </button>
          <button className="flex-1 items-center justify-center flex ">
            <Image src={person} alt="person" />
          </button>
        </div>
      </div>
    </div>
  );
}
