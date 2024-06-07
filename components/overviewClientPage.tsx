"use client";

import React, { useEffect, useRef, useState } from "react";

import Image from "next/image";
import Link from "next/link";

import Container from "@/components/container";

import arrowBlack from "../public/arrow_forward_balck.png";

interface Props {
  categoriesData: Category[];
}

interface Category {
  id: number;
  name: string;
  image: string;
  children: CategoryChildren[];
}

interface CategoryChildren {
  id: number;
  name: string;
  image: string;
}

export default function OverviewClientpage({ categoriesData }: Props) {
  const subCategoryRefs = useRef<(HTMLElement | null)[]>([]);

  const [currentTargetNumber, setCurrentTargetNumber] = useState(1);

  // 대분류 클릭 시 소분류로 스크롤하는 함수
  const scrollToCategory = (categoryId: number) => {
    setCurrentTargetNumber(categoryId);
    const subCategoryRef = subCategoryRefs.current[categoryId];
    if (subCategoryRef) {
      subCategoryRef.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <Container>
      <div className="flex h-[calc(-109px+100vh)] ">
        <div className="w-[115px] bg-[#f2f2f2] overflow-y-scroll">
          <ul>
            {categoriesData.map((category, index) => (
              <li key={category.id} className="h-16">
                <button
                  className={`w-full h-full ${
                    currentTargetNumber === category?.id
                      ? "font-bold"
                      : "text-[#aaa]"
                  }`}
                  onClick={() => scrollToCategory(category.id)}
                >
                  {category.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex-1 overflow-y-scroll 	">
          {categoriesData?.map((category: Category) => (
            <div
              key={category.id}
              className="pl-5 pr-3 pb-5 pt-5"
              ref={(el) => (subCategoryRefs.current[category.id] = el)}
            >
              <Link href={`/categories?mainCategory=${category?.name}`}>
                <div className="h-12 text-xl font-bold flex justify-between">
                  <span>{category?.name}</span>
                  <Image src={arrowBlack} alt=">이미지" className="w-5 h-5" />
                </div>
              </Link>
              {category.children && category.children.length > 0 && (
                <div className="flex flex-wrap">
                  {category.children.map((child) => (
                    <div key={child.id} className="w-[50%] py-2">
                      {child?.image && (
                        <div className="flex flex-col items-center gap-2">
                          <Image
                            src={child?.image}
                            alt={`Flaticon_image_${child?.name}`}
                            width={50}
                            height={50}
                          />
                          <span className="text-sm">{child?.name}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </Container>
  );
}
