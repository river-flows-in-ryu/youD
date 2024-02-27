"use client";

import React, { useEffect, useState } from "react";

import Image from "next/image";

import close from "../public/close.png";

import { useMainHamburgerToggleStore } from "@/app/store";

export default function Drawer() {
  const { toggle, setToggle } = useMainHamburgerToggleStore();

  return (
    <div className="w-[80%] h-[100%]">
      <button className="absolute right-[10px] top-[20px]" onClick={setToggle}>
        <Image src={close} alt="몰라" />
      </button>
    </div>
  );
}
