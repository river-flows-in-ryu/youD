"use client";

import React, { useEffect, useState } from "react";

import Image from "next/image";

import close from "../public/close.png";

import { useMainHamburgerToggleStore } from "@/app/store";

export default function Slide() {
  const { toggle, setToggle } = useMainHamburgerToggleStore();

  return (
    <div className="relative">
      <button className="absolute right-[10px] top-[20px]" onClick={setToggle}>
        <Image src={close} alt="몰라" />
      </button>
    </div>
  );
}
