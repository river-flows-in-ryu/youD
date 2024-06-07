"use client";

import React, { useEffect, useState } from "react";

import Image from "next/image";
import { useRouter } from "next/navigation";

import Container from "@/components/container";

import { commonFetch } from "@/utils/commonFetch";
import { useSearchParams } from "next/navigation";

import arrowDown from "../../public/down.png";

interface Category {
  id: number;
  name: string;
  children: CategoryChildren[];
}
interface CategoryChildren {
  id: number;
  name: string;
}

type Parmas =
  | "전체"
  | "상의"
  | "아우터"
  | "바지"
  | "원피스"
  | "스커트"
  | "가방"
  | "모자";

export default function Page() {
  const [categoryList, setCategoryList] = useState<Category[]>([]);
  const [mainCategory, setMainCategory] = useState<Parmas>("전체");
  const [isOpen, setIsOpen] = useState(false);
  const parmas = useSearchParams();

  const router = useRouter();

  useEffect(() => {
    setMainCategory(parmas?.get("mainCategory") as Parmas);
    if (
      ![
        "전체",
        "상의",
        "아우터",
        "바지",
        "원피스",
        "스커트",
        "가방",
        "모자",
      ].includes(mainCategory)
    ) {
      alert("잘못된 접근입니다.");
      router?.push("/");
    }
  }, [mainCategory, parmas, router]);

  useEffect(() => {
    async function fetchData() {
      const res = await commonFetch(
        `${process.env.NEXT_PUBLIC_API_URL}/top-categories`,
        "get"
      );
      setCategoryList([{ id: 0, name: "전체" }, ...res?.results]);
    }
    fetchData();
  }, []);

  function handleCategoryClick(name: string) {
    const queryParams = new URLSearchParams();
    queryParams.set("mainCategory", name);
    const newUrl = `${window.location.pathname}?${queryParams.toString()}`;
    window.history.pushState({}, "", newUrl);
    setIsOpen(false);
  }
  return (
    <Container>
      <div className="w-full flex flex-col">
        <div
          className="flex py-2.5 justify-center z-10 bg-white"
          onClick={() => setIsOpen(true)}
        >
          <span className="font-bold">{mainCategory || "전체"}</span>
          <Image src={arrowDown} alt="arrow_down" width={20} height={20} />
        </div>
        {!isOpen ? null : (
          <>
            <div className="w-full h-full fixed top-0 left-0 bg-backDrop flex z-9" />
            <div className="w-full h-[370px] z-10 bg-white p-5">
              <div className="flex flex-col gap-5">
                {categoryList?.map((category) => (
                  <button
                    className={`${
                      category?.name === mainCategory
                        ? "font-bold"
                        : "text-[#aaa]"
                    }`}
                    key={category?.id}
                    onClick={() => handleCategoryClick(category?.name)}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </Container>
  );
}
