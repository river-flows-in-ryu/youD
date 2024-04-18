"use client";
import React, { useState, useEffect } from "react";

import Image from "next/image";

import search from "../public/search.png";
import home from "../public/home.png";
import person from "../public/person.png";
import Link from "next/link";

import { Select } from "antd";

import { usePathname } from "next/navigation";

import emptyHeart from "../public/empty_heart.png";
import arrowDown from "../public/arrow_down.png";
import ProductDetailOption from "./productDetailOption";

export default function TabBar() {
  const pathname = usePathname();
  useEffect(() => {
    setIsNumericPath(
      pathname.startsWith("/goods/") && /^\d+$/.test(pathname?.split("/").pop())
    );
  }, [pathname]);

  const [isNumericPath, setIsNumericPath] = useState(false);

  const [optionArray, setOptionArray] = useState([]);

  const onDelete = (id: number) => {
    setOptionArray(optionArray.filter((option) => option.id !== id));
  };
  const onAdd = (id: number) => {
    setOptionArray(
      optionArray.map((option) =>
        option.id === id ? { ...option, count: option.count + 1 } : option
      )
    );
  };

  const onMinus = (id: number) => {
    const selectedOption = optionArray.find((option) => option.id === id);
    if (selectedOption && selectedOption.count > 1) {
      setOptionArray(
        optionArray.map((option) =>
          option.id === id ? { ...option, count: option.count - 1 } : option
        )
      );
    } else {
      onDelete(id);
    }
  };

  const handleChange = (value: string) => {
    const optionIndex = optionArray.findIndex(
      (option) => option.value === value
    );
    if (optionIndex !== -1) {
      alert("이미 선택한 옵션입니다.");
    } else {
      const selectedOption = options.find((option) => option.value === value);
      setOptionArray([
        ...optionArray,
        {
          id: selectedOption?.id,
          value,
          count: 1,
          price: selectedOption?.price,
        },
      ]);
    }
  };

  console.log(optionArray);

  const options = [
    { id: 1, value: "s", label: "s", price: 1000 },
    { id: 2, value: "m", label: "m", price: 2000 },
    { id: 3, value: "l", label: "l", price: 3000 },
    { id: 4, value: "xl", label: "xl", price: 4000 },
    { id: 5, value: "xxl", label: "xxl", price: 5000 },
    { id: 6, value: "xxxl", label: "xxxl", price: 6000 },
  ];

  return isNumericPath ? (
    // <div className="block sm:hidden  ">
    //   <div className="fixed bottom-0 w-full border z-10 bg-white">
    //     <div className=" w-full h-[70px] flex px-3 py-2">
    //       <button className="h-[52px] border border-[#dedede] w-[15%] mr-2 rounded ">
    //         <Image
    //           src={emptyHeart}
    //           alt="emptyHeart"
    //           width={30}
    //           height={30}
    //           className="m-auto"
    //         />
    //       </button>
    //       <button className="w-[85%] h-[52px] border border-[#dedede] bg-primary text-white font-bold	rounded">
    //         구매하기
    //       </button>
    //     </div>
    //   </div>
    // </div>
    <div className="block sm:hidden  ">
      <div className="fixed bottom-0 w-full border z-10 bg-white">
        <div className=" w-full min-h-[240px] max-h-[450px] flex flex-col px-[10px] ">
          <button className="mx-auto h-[30px] w-[30px]">
            <Image src={arrowDown} alt="toggleButton" />
          </button>
          <Select
            onChange={handleChange}
            defaultValue="옵션 선택"
            className="h-[50px] mb-5"
            options={options}
          />
          <div className="bg-[#dedede] min-h-[55px] mb-5 max-h-[250px] overflow-auto p-[10px]	">
            <div className="flex flex-col">
              {optionArray
                ?.slice()
                ?.reverse()
                .map((option, index) => (
                  <ProductDetailOption
                    option={option}
                    onDelete={onDelete}
                    onAdd={onAdd}
                    onMinus={onMinus}
                  />
                ))}
            </div>
          </div>
          <button className="h-[50px] w-full bg-primary text-white font-bold	rounded">
            장바구니 담기
          </button>
        </div>
      </div>
    </div>
  ) : (
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
