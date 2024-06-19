"use client";
import React, { useEffect, useState } from "react";

import { useSearchParams, useParams, useRouter } from "next/navigation";
import "react-quill/dist/quill.snow.css";
import dynamic from "next/dynamic";

import Container from "@/components/container";
import InputArea from "@/components/inputArea";

export default function Page() {
  const searchParams = useSearchParams();
  const params = useParams();
  const router = useRouter();

  const [productName, setProductName] = useState("");
  const [productShortName, setProductShortName] = useState("");

  const [OriginPrice, setOriginPrice] = useState<number>();
  const [discountPrice, setDiscountPrice] = useState<number>();

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

  const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

  const formats = [
    "header",
    "font",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "align",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "background",
    "color",
    "link",
    "image",
    "video",
    "width",
  ];

  const modules = {
    toolbar: {
      container: [
        ["link", "image", "video"],
        [{ header: [1, 2, 3, false] }],
        ["bold", "italic", "underline", "strike"],
        ["blockquote"],
        [{ list: "ordered" }, { list: "bullet" }],
      ],
    },
  };
  //할인율 자동적용 코드 필요
  return (
    <Container>
      <div className="sm:w-[650px] sm:mx-auto px-5">
        <h2 className=" font-bold text-xl py-5 ">{TITLE}</h2>
        <InputArea
          text="상품이름"
          placeholder="상품이름을 입력해주세요"
          isRequired={true}
          type="text"
          state={productName}
          setState={setProductName}
        />
        <InputArea
          text="상품 짧은 이름"
          placeholder="상품 설명글을 작성해주세요"
          isRequired={true}
          type="text"
          state={productShortName}
          setState={setProductShortName}
        />
        <InputArea
          text="상품 원가"
          placeholder="상품 원가를 작성해주세요"
          isRequired={true}
          type="number"
          state={OriginPrice}
          setState={setOriginPrice}
        />
        <InputArea
          text="상품 판매가"
          placeholder="상품 판매가를 작성해주세요"
          isRequired={true}
          type="number"
          state={discountPrice}
          setState={setDiscountPrice}
        />
        <ReactQuill formats={formats} modules={modules} />
      </div>
    </Container>
  );
}
