"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

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
  const subCategoryRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [currentTargetNumber, setCurrentTargetNumber] = useState(1);

  const scrollToCategory = (categoryId: number) => {
    const categoryElement = subCategoryRefs.current[categoryId];
    if (categoryElement) {
      categoryElement.scrollIntoView();
      setCurrentTargetNumber(categoryId);
    }
  };

  const handleScroll = () => {
    let closestCategory = null;
    let closestOffset = Number.MAX_SAFE_INTEGER;

    subCategoryRefs.current.forEach((categoryElement, index) => {
      if (categoryElement) {
        const offset = Math.abs(categoryElement.getBoundingClientRect().top);
        if (offset < closestOffset) {
          closestOffset = offset;
          closestCategory = index;
        }
      }
    });

    if (closestCategory !== null) {
      setCurrentTargetNumber(closestCategory);
    }
  };

  useEffect(() => {
    const container = document.querySelector(".right-panel");
    if (container) {
      container.addEventListener("scroll", handleScroll);
    }
    return () => {
      if (container) {
        container.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  return (
    <Container>
      <div className="flex h-[calc(-109px+100vh)] ">
        <div className="w-[100px] sm:w-[300px] bg-[#f2f2f2] overflow-y-scroll xl:hidden">
          <ul>
            {categoriesData.map((category) => (
              <li key={category.id} className="h-16">
                <button
                  className={`w-full h-full ${
                    currentTargetNumber === category?.id
                      ? "bg-white font-bold"
                      : ""
                  }`}
                  onClick={() => scrollToCategory(category.id)}
                >
                  {category.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex-1 overflow-y-scroll sm:pt-10 right-panel	">
          {categoriesData?.map((category: Category) => (
            <div
              key={category.id}
              className="pl-5 pr-3 pb-5 pt-5 xl:w-[750px] xl:mx-auto"
              ref={(el) => {
                if (el) {
                  subCategoryRefs.current[category.id] = el;
                } else {
                  subCategoryRefs.current[category.id] = null;
                }
              }}
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
                    <div key={child.id} className="w-[50%] py-2 xl:w-[25%]">
                      {child?.image && (
                        <Link
                          href={`/categories?mainCategory=${category?.name}&subCategory=${child?.id}`}
                        >
                          <div className="flex flex-col items-center gap-2 ">
                            <Image
                              src={child?.image}
                              alt={`Flaticon_image_${child?.name}`}
                              width={50}
                              height={50}
                            />
                            <span className="text-sm">{child?.name}</span>
                          </div>
                        </Link>
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
