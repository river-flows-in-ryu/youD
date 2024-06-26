"use client";
import React, { useEffect, useRef, useState } from "react";

import { useSearchParams, useParams, useRouter } from "next/navigation";
import { Select, Transfer } from "antd";
import type { TransferProps } from "antd";
import Image from "next/image";
import { v4 as uuidv4 } from "uuid";

import Container from "@/components/container";
import InputArea from "@/components/inputArea";
import { commonFetch } from "@/utils/commonFetch";
import CustomQuill from "@/components/customQuill";

import { useUserIdStore } from "@/app/store";

import image from "../../../public/image.png";

interface Category {
  id: number;
  name: string;
  image: string;
  parent: null | number;
}

interface RecordType {
  key: string;
  title: string;
  description: string;
}

interface Option {
  id: number;
  name: string;
}

interface FileInfo {
  file: File;
  url: string | undefined;
}

export default function Page() {
  const searchParams = useSearchParams();
  const params = useParams();
  const router = useRouter();

  const thumbnailRef = useRef<HTMLInputElement>(null);
  const [thumbnailImage, setThumbnailImage] = useState("");
  const [thumbnailImageFile, setThumbnailImageFile] = useState<File | null>(
    null
  );

  const [productName, setProductName] = useState("");
  const [productShortName, setProductShortName] = useState("");
  const [productStock, setProductStock] = useState<Number>();
  const [OriginPrice, setOriginPrice] = useState<number>();
  const [discountPrice, setDiscountPrice] = useState<number>();
  const [discountRate, setDiscountRate] = useState<number>();

  const [allOption, setAllOption] = useState([]);

  const [parentCategoryArray, setParentCategoryArray] = useState([]);
  const [childCategoryArray, setChildCategoryArray] = useState([]);
  const [selectedChildCategoryArray, setSelectedChildCategoryArray] = useState(
    []
  );
  const [selectedChildId, setSelcetedChildId] = useState<number>();

  const [quillValue, setQuillValue] = useState("");

  const method = params?.mode === "add" ? "post" : "put";
  const productId = searchParams?.get("productId");

  const TITLE = method === "post" ? "상품 추가하기" : "상품 수정하기";

  const { userId } = useUserIdStore();

  useEffect(() => {
    if (params.mode !== "add" && params.mode !== "change") {
      alert("잘못된 접근입니다.");
      router.back();
    }
  }, [params.mode]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await commonFetch(
        `${process.env.NEXT_PUBLIC_API_URL}/all-option`,
        "get"
      );
      setAllOption(res?.data);
    };
    fetchData();
  }, []);

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

  const initialOption = allOption?.map((option: Option) => ({
    key: option?.id,
    title: option?.name,
    description: option?.name,
  }));

  // to-do 미리 있는 옵션
  // const initialTargetKeys = mockData
  //   .filter((item) => Number(item.key) > 10)
  //   .map((item) => item.key);

  const [targetKeys, setTargetKeys] = useState<TransferProps["targetKeys"]>();
  const [selectedKeys, setSelectedKeys] = useState<TransferProps["targetKeys"]>(
    []
  );

  const onChange: TransferProps["onChange"] = (nextTargetKeys) => {
    setTargetKeys(nextTargetKeys);
  };

  const onSelectChange: TransferProps["onSelectChange"] = (
    sourceSelectedKeys,
    targetSelectedKeys
  ) => {
    setSelectedKeys([...sourceSelectedKeys, ...targetSelectedKeys]);
  };

  function handleChangeImage() {
    if (thumbnailRef.current && thumbnailRef.current.files) {
      const img = thumbnailRef.current.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        setThumbnailImage(reader.result as string);
        setThumbnailImageFile(img);
      };
      reader.readAsDataURL(img);
    }
  }

  async function handleSubmit() {
    try {
      const formData = new FormData();
      formData.append("productName", productName);
      formData.append("productShortName", productShortName);
      if (OriginPrice !== undefined) {
        formData.append("OriginPrice", OriginPrice.toString());
      }
      if (discountPrice !== undefined) {
        formData.append("discountPrice", discountPrice.toString());
      }
      if (productStock !== undefined) {
        formData.append("stock", productStock.toString());
      }
      if (discountRate !== undefined) {
        formData.append("discountRate", discountRate.toString());
      }
      let renamedFile = null;

      if (thumbnailImageFile instanceof File) {
        const fileExtension = thumbnailImageFile.name.split(".").pop();
        const newName = `${uuidv4()}.${fileExtension}`;
        renamedFile = new File([thumbnailImageFile], newName, {
          type: thumbnailImageFile.type,
        });
      } else {
        console.error(
          "Thumbnail image file is null or not an instance of File."
        );
      }

      if (renamedFile) {
        formData.append("image_url", renamedFile);
      } else {
        console.error("Failed to rename file.");
      }
      formData.append("info", quillValue);
      if (selectedChildId !== undefined) {
        formData.append("category", selectedChildId.toString());
      }
      formData.append("size", JSON.stringify(targetKeys));
      if (userId !== undefined) {
        formData.append("user", userId.toString());
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/`, {
        method: "post",
        body: formData,
      });
      console.log(res);
    } catch (error) {
      if (error instanceof Error) {
        alert(error?.message);
      }
    }
  }

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
        <div className="flex gap-10">
          <div className="w-[125px] h-[125px] flex justify-center items-center border border-[#cecece] rounded">
            <label
              htmlFor="brandImage"
              className="cursor-pointer flex flex-col items-center justify-center w-full h-full"
            >
              <div className="btn-upload w-5 h-5">
                <Image src={image} alt="add" />
              </div>
              <input
                type="file"
                id="brandImage"
                className="hidden"
                ref={thumbnailRef}
                onChange={handleChangeImage}
              />
            </label>
          </div>
          {thumbnailImage ? (
            <div className="w-[125px] h-[125px] relative">
              <Image
                src={thumbnailImage}
                alt="썸네일 이미지"
                fill
                style={{ objectFit: "contain" }}
              />
            </div>
          ) : (
            <div className="w-[125px] h-[125px] bg-[#aaa] rounded" />
          )}
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
            placeholder="대분류"
            options={parentCategoryArray}
            onChange={(selected) => handleChange(selected, "parent")}
            className="w-[45%] h-[45px]"
          />
          <Select
            placeholder="소분류"
            options={selectedChildCategoryArray}
            onChange={(selected) => handleChange(selected, "child")}
            className="w-[45%] h-[45px]"
          />
        </div>

        <div className="pt-4 pb-2">
          <label className="">상품 옵션 선택</label>
        </div>
        <Transfer
          dataSource={initialOption}
          titles={["전체", "선택"]}
          targetKeys={targetKeys}
          selectedKeys={selectedKeys}
          onChange={onChange}
          onSelectChange={onSelectChange}
          render={(item) => item.title}
          style={{ width: "100%" }}
        />
        <div className="flex justify-center mt-5">
          <button
            className="w-[150px] h-10 border border-primary bg-primary rounded text-white"
            onClick={handleSubmit}
          >
            제출하기
          </button>
        </div>
      </div>
    </Container>
  );
}
