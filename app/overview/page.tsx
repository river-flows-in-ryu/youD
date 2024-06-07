import React from "react";

import Image from "next/image";
import Link from "next/link";

import { commonFetch } from "@/utils/commonFetch";

import Container from "@/components/container";

import arrowBlack from "../../public/arrow_forward_balck.png";

interface Category {
  id: number;
  name: string;
  children: CategoryChildren[];
}

interface CategoryChildren {
  id: number;
  name: string;
  image: string;
}

export default async function Page() {
  async function fetchData() {
    const res = await commonFetch(
      `${process.env.NEXT_PUBLIC_API_URL}/top-categories`,
      "get"
    );
    return res;
  }
  const categoriesData = await fetchData();
  return (
    //
    <Container>
      <div className="flex h-[calc(-109px+100vh)] ">
        <div className="w-[115px] bg-secondary overflow-y-scroll">
          <ul>
            {categoriesData?.results?.map((category: Category) => (
              <li key={category?.id} className="w-full h-16 ">
                <button className="w-full h-full ">{category?.name}</button>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex-1 overflow-y-scroll 	">
          {categoriesData?.results?.map((category: Category) => (
            <div key={category.id} className="pl-5 pr-3 pb-5 pt-5">
              <Link href={`/categories?mainCategory=${category?.name}`}>
                <div className="h-12 text-xl font-bold flex justify-between">
                  <span>{category?.name}</span>
                  <Image src={arrowBlack} alt=">이미지" className="w-5 h-5" />
                </div>
              </Link>
              {category.children && category.children.length > 0 && (
                <div className="flex flex-wrap ">
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
