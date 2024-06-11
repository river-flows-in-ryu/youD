"use client";

import React, { useEffect, useRef, useState } from "react";

import Image from "next/image";
import { useRouter } from "next/navigation";

import Container from "@/components/container";

import { commonFetch } from "@/utils/commonFetch";
import { useSearchParams } from "next/navigation";

import arrowDown from "../../public/down.png";
import HorizontalLine from "@/components/horizontalLine";
import Link from "next/link";
import Pagination from "@/utils/pagination";

interface Category {
  id: number;
  name: string;
  children: CategoryChildren[];
}
interface CategoryChildren {
  id: number;
  name: string;
}

interface Product {
  id: number;
  OriginPrice: number;
  discountPrice: number;
  discountRate: number;
  image_url: string;
  productName: string;
  user: {
    id: number;
    brandName: string;
  };
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
  const [subCategoryList, setSubCategoryList] = useState<CategoryChildren[]>(
    []
  );
  const [mainCategory, setMainCategory] = useState<Parmas>("상의");
  const [subCategory, setSubCategory] = useState<number | null>(null);

  const [categoryProductData, setCategoryProductData] = useState([]);
  const [categoryProductTotalCount, setCategoryProductTotalCount] = useState(0);

  const [page, setPage] = useState(1);

  const [isOpen, setIsOpen] = useState(false);

  const parmas = useSearchParams();

  const backdropRef = useRef(null);

  const router = useRouter();
  useEffect(() => {
    setMainCategory(parmas?.get("mainCategory") as Parmas);
    console.log(parmas?.get("subCategory"));
    const subCategoryParam =
      parmas?.get("subCategory") === "null"
        ? null
        : parmas?.get("subCategory") !== null
        ? Number(parmas?.get("subCategory"))
        : null;
    console.log(typeof subCategoryParam);
    setSubCategory(subCategoryParam);
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
      router?.push("/overview");
    }
  }, [mainCategory, parmas, router]);

  //카테고리 목적 useEffect
  useEffect(() => {
    async function fetchCategoryData() {
      const res = await commonFetch(
        `${process.env.NEXT_PUBLIC_API_URL}/top-categories`,
        "get"
      );
      setCategoryList(res?.results);

      const subCategoryArray = res?.results?.filter(
        (item: Category) => item?.name === mainCategory
      );
      setSubCategoryList([
        { id: null, name: "전체" },
        ...subCategoryArray[0]?.children,
      ]);
    }
    fetchCategoryData();
  }, [mainCategory]);

  //datafetch 목적 useEffect
  useEffect(() => {
    const mainCategoryId = categoryList?.filter(
      (item) => item?.name === mainCategory
    )[0]?.id;

    if (mainCategoryId) {
      const fetchData = async () => {
        let url = `categories?category=${mainCategoryId}`;
        let addUrl = `&offset=${(page - 1) * 10}&limit=10`;
        if (subCategory) {
          url += `&subcategory=${subCategory}${addUrl}`;
        } else {
          url += addUrl;
        }
        const res = await commonFetch(
          `${process.env.NEXT_PUBLIC_API_URL}/${url}`,
          "get"
        );
        setCategoryProductData(res.results);
        setCategoryProductTotalCount(res.totalCount);
      };
      fetchData();
    }
  }, [categoryList, mainCategory, subCategory, page]);

  function handleClickBackdrop(
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) {
    if (backdropRef.current === event.target) {
      setIsOpen(false);
    }
  }

  function handleCategoryClick(name: string) {
    const queryParams = new URLSearchParams();
    queryParams.set("mainCategory", name);
    const newUrl = `${window.location.pathname}?${queryParams.toString()}`;
    window.history.pushState({}, "", newUrl);
    setIsOpen(false);
  }

  return (
    <Container>
      <div className="w-full flex flex-col h-full">
        <div
          className="flex py-2.5 justify-center z-10 bg-white"
          onClick={() => setIsOpen(true)}
        >
          <span className="font-bold">{mainCategory || "전체"}</span>
          <Image src={arrowDown} alt="arrow_down" width={20} height={20} />
        </div>

        {!isOpen ? (
          <div className="w-full h-full">
            <ul className="flex w-full flex-wrap ">
              {subCategoryList?.map((item) => (
                <div
                  key={item?.id}
                  className="w-[33.3%] h-10 border border-[#f5f6f8]"
                >
                  <Link
                    href={`/categories?mainCategory=${mainCategory}&subCategory=${item?.id}`}
                  >
                    <li
                      className={`text-sm text-center leading-10 cursor-pointer ${
                        (subCategory === null && item?.id === null) ||
                        subCategory === item?.id
                          ? "font-bold"
                          : ""
                      }`}
                    >
                      {item?.name}
                    </li>
                  </Link>
                </div>
              ))}
            </ul>
            <HorizontalLine />
            <div className="flex flex-wrap px-[10px] justify-between ">
              {categoryProductData?.map((product: Product) => (
                <div key={product?.id} className="w-[49%] h-full flex-shrink-0">
                  <Link href={`goods/${product?.id}`}>
                    <Image
                      src={product?.image_url}
                      alt={product?.productName}
                      width={150}
                      height={150}
                      className="w-full h-[200px]"
                    />
                    <div className="mt-5 px-4">
                      <p className="text-xs line-clamp-1 break-all ">
                        {product?.user?.brandName}
                      </p>
                      <p className="text-sm	line-clamp-2 break-all font-bold">
                        {product?.productName}
                      </p>
                      {product?.OriginPrice === product?.discountPrice ||
                      product?.discountRate === 0 ? (
                        <span className="line-through text-[#b5b5b5]	mb-5">
                          {(product?.OriginPrice).toLocaleString()}원
                        </span>
                      ) : (
                        <div className="flex justify-between text-xs mt-1 mb-5">
                          <div className="flex flex-col">
                            <span className="text-base font-medium">
                              {(product?.discountPrice).toLocaleString()}원
                            </span>
                            <span className="line-through text-[#b5b5b5]	">
                              {(product?.OriginPrice).toLocaleString()}원
                            </span>
                          </div>
                          <strong className="text-red-400 text-base	">
                            {product?.discountRate}%
                          </strong>
                        </div>
                      )}
                    </div>
                  </Link>
                </div>
              ))}
            </div>
            <Pagination
              page={page}
              totalCount={categoryProductTotalCount}
              pageSize={10}
              onChange={setPage}
            />
          </div>
        ) : (
          <></>
        )}
      </div>
    </Container>
  );
}
