"use client";
import React, { useEffect, useMemo, useRef, useState, forwardRef } from "react";

import { useSearchParams, useParams, useRouter } from "next/navigation";
import { Select } from "antd";

import Container from "@/components/container";
import InputArea from "@/components/inputArea";
import { commonFetch } from "@/utils/commonFetch";
import CustomQuill from "@/components/customQuill";

interface Category {
  id: number;
  name: string;
  image: string;
  parent: null | number;
}

export default function Page() {
  const searchParams = useSearchParams();
  const params = useParams();
  const router = useRouter();

  const [productName, setProductName] = useState("");
  const [productShortName, setProductShortName] = useState("");
  const [productStock, setProductStock] = useState<Number>();
  const [OriginPrice, setOriginPrice] = useState<number>();
  const [discountPrice, setDiscountPrice] = useState<number>();
  const [discountRate, setDiscountRate] = useState<number>();

  const [parentCategoryArray, setParentCategoryArray] = useState([]);
  const [childCategoryArray, setChildCategoryArray] = useState([]);
  const [selectedChildCategoryArray, setSelectedChildCategoryArray] = useState(
    []
  );
  const [selectedChildId, setSelcetedChildId] = useState<number>();

  const [fileInfo, setFileInfo] = useState([]);

  const quillRef = React.useRef(false);

  const [quillValue, setQuillValue] = useState("");

  const method = params?.mode === "add" ? "post" : "put";
  const productId = searchParams?.get("productId");

  const TITLE = method === "post" ? "상품 추가하기" : "상품 수정하기";

  useEffect(() => {
    if (params.mode !== "add" && params.mode !== "change") {
      alert("잘못된 접근입니다.");
      router.back();
    }
  }, [params.mode]);

  useEffect(() => {
    if (OriginPrice != null && discountPrice != null && OriginPrice !== 0) {
      const calculatedRate =
        ((OriginPrice - discountPrice) / OriginPrice) * 100;
      if (!isNaN(calculatedRate)) {
        setDiscountRate(Number(calculatedRate.toFixed(1)));
      } else {
        setDiscountRate(0);
      }
    } else {
      setDiscountRate(0);
    }
  }, [discountPrice, OriginPrice]);

  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        const res = await commonFetch(
          `${process.env.NEXT_PUBLIC_API_URL}/child-categories`,
          "get"
        );
        const parentOptionData = res.parentData?.map((category: Category) => ({
          id: category?.id,
          value: category?.id,
          label: category?.name,
        }));
        setParentCategoryArray(parentOptionData);

        const childOptionData = res.childData?.map((category: Category) => ({
          id: category?.id,
          value: category?.id,
          label: category?.name,
          parent: category?.parent,
        }));
        setChildCategoryArray(childOptionData);
      } catch (error) {
        if (error instanceof Error) {
          alert(error?.message);
        }
      }
    };
    fetchCategoryData();
  }, []);

  const handleChange = (value: number, type: string) => {
    if (type === "parent") {
      const childFilterArray = childCategoryArray?.filter(
        (child: { parent: number }) => {
          return value == child?.parent;
        }
      );
      setSelectedChildCategoryArray(childFilterArray);
    } else {
      setSelcetedChildId(value);
    }
  };

  //할인율 자동적용 코드 필요
  return (
    <Container>
      <div className="sm:w-[650px] sm:mx-auto px-5 pb-10">
        <h2 className=" font-bold text-xl py-5 ">{TITLE}</h2>
        <InputArea
          text="상품이름"
          placeholder="상품이름을 입력해주세요"
          isRequired={true}
          type="text"
          state={productName}
          setState={setProductName}
          errorMessage="최소 2글자 이상, 30글자 이하이어야 합니다."
        />
        <InputArea
          text="상품 짧은 이름"
          placeholder="상품 설명글을 작성해주세요"
          isRequired={true}
          type="text"
          state={productShortName}
          setState={setProductShortName}
          errorMessage="최소 2글자 이상, 30글자 이하이어야 합니다."
        />
        <InputArea
          text="상품 원가"
          placeholder="상품 원가를 작성해주세요"
          isRequired={true}
          type="number"
          state={OriginPrice}
          setState={setOriginPrice}
          errorMessage=" 1원 이상이여야합니다."
        />
        <InputArea
          text="상품 판매가"
          placeholder="상품 판매가를 작성해주세요"
          isRequired={true}
          type="number"
          state={discountPrice}
          setState={setDiscountPrice}
          errorMessage="1원 이상이여야합니다."
        />
        <InputArea
          text="상품 재고"
          placeholder="상품 재고를 작성해주세요"
          isRequired={true}
          type="number"
          state={productStock}
          setState={setProductStock}
          errorMessage=" 한개 이상이여야합니다."
        />
        <div className="pt-4 pb-2">
          <label className="">썸네일 이미지</label>
        </div>

        <div className="pt-4 pb-2">
          <label className="">상세 페이지</label>
        </div>
        <CustomQuill value={quillValue} onChange={setQuillValue} />
        <div className="pt-10 pb-2">
          <label className="">카테고리</label>
        </div>
        <div className="flex justify-around">
          <Select
            options={parentCategoryArray}
            onChange={(selected) => handleChange(selected, "parent")}
            className="w-[45%] h-[45px]"
          />
          <Select
            options={selectedChildCategoryArray}
            onChange={(selected) => handleChange(selected, "child")}
            className="w-[45%] h-[45px]"
          />
        </div>
      </div>
    </Container>
  );
}
