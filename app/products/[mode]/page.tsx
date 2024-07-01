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

interface Option {
  id: number;
  name: string;
}

interface Options {
  id: number;
  size: Option;
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

  const [selectedParentId, setSelcetedParentId] = useState<number>();
  const [selectedChildId, setSelcetedChildId] = useState<number | null>(null);

  const [quillValue, setQuillValue] = useState("");

  const [targetKeys, setTargetKeys] = useState<TransferProps["targetKeys"]>([]);
  const [selectedKeys, setSelectedKeys] = useState<TransferProps["targetKeys"]>(
    []
  );

  const [productNameErrorMessage, setProductNameErrorMessage] = useState("");
  const [productShortNameErrorMessage, setProductShortNameErrorMessage] =
    useState("");
  const [originPriceErrorMessage, setOriginPriceErrorMessage] = useState("");
  const [discountPriceErrorMessage, setDiscountPriceErrorMessage] =
    useState("");
  const [productStockErrorMessage, setProductStockErrorMessage] = useState("");
  const [thumbnailImageErrorMessage, setThumbnailImageErrorMessage] =
    useState("");
  const [quillValueErrorMessage, setQuillValueErrorMessage] = useState("");
  const [categoryErrorMessage, setCategoryErrorMessage] = useState("");
  const [optionErrorMessage, setOptionErrorMessage] = useState("");

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
    const fetchData = async () => {
      const res = await commonFetch(
        `${process.env.NEXT_PUBLIC_API_URL}/check-brand?userId=${userId}`,
        "get"
      );
      if (!res?.results) {
        alert("브랜드가 등록되지 않아 브랜드 등록 페이지로 이동합니다.");
        router?.push("/mypage/brand");
      }
    };
    fetchData();
  }, [userId]);

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

  useEffect(() => {
    if (productName === "") setProductNameErrorMessage("");
    else {
      const idRegx = /^[\w\dㄱ-힣!@#$%^&*()\-_=+[{\]}\\|;:\'",<.>/? ]{2,30}$/;
      if (!idRegx.test(productName)) {
        setProductNameErrorMessage("2자 이상 30자 이하의 영문 한글 숫자 조합");
      } else {
        setProductNameErrorMessage("");
      }
    }

    if (productShortName === "") setProductShortNameErrorMessage("");
    else {
      const idRegx = /^[\w\dㄱ-힣!@#$%^&*()\-_=+[{\]}\\|;:\'",<.>/? ]{2,30}$/;
      if (!idRegx.test(productShortName)) {
        setProductShortNameErrorMessage(
          "2자 이상 30자 이하의 영문 한글 숫자 조합"
        );
      } else {
        setProductShortNameErrorMessage("");
      }
    }

    if (OriginPrice === null || OriginPrice === undefined) {
      setOriginPriceErrorMessage("");
    } else {
      const idRegx = /^\d{3,}$/;
      const originPriceStr = OriginPrice.toString();
      if (!idRegx.test(originPriceStr)) {
        setOriginPriceErrorMessage(
          "숫자로 이루어져 있으며, 최소 100원 이상이어야 합니다."
        );
      } else {
        setOriginPriceErrorMessage("");
      }
    }

    if (discountPrice === null || discountPrice === undefined) {
      setDiscountPriceErrorMessage("");
    } else {
      const idRegx = /^\d{3,}$/;
      const discountPriceStr = discountPrice.toString();
      if (!idRegx.test(discountPriceStr)) {
        setDiscountPriceErrorMessage(
          "숫자로 이루어져 있으며, 최소 100원 이상이어야 합니다."
        );
      } else {
        setDiscountPriceErrorMessage("");
      }
    }

    if (productStock === null || productStock === undefined) {
      setProductStockErrorMessage("");
    } else {
      const idRegx = /^[1-9]\d*$/;
      const productStockStr = productStock.toString();
      if (!idRegx.test(productStockStr)) {
        setProductStockErrorMessage(
          "숫자로 이루어져 있으며, 최소 1개 이상이어야 합니다."
        );
      } else {
        setProductStockErrorMessage("");
      }
    }
  }, [productName, productShortName, OriginPrice, discountPrice, productStock]);

  useEffect(() => {
    if (productId && childCategoryArray) {
      const fetchData = async () => {
        const res = await commonFetch(
          `${process.env.NEXT_PUBLIC_API_URL}/product_list/${productId}`,
          "get"
        );
        const {
          productName,
          productShortName,
          OriginPrice,
          discountPrice,
          stock,
          image_url,
          info,
        } = res?.product;
        const { id, parent } = res?.product?.category;
        setProductName(productName);
        setProductShortName(productShortName);
        setOriginPrice(OriginPrice);
        setDiscountPrice(discountPrice);
        setProductStock(stock);
        setThumbnailImage(image_url);
        setQuillValue(info);
        updateChildCategories(parent);
        setSelcetedParentId(parent);
        setSelcetedChildId(id);
        changeSelectedOption(res?.product?.size_attributes);
      };
      fetchData();
    }
  }, [childCategoryArray]);

  function changeSelectedOption(options: Options) {
    if (Array.isArray(options)) {
      const newTargetKeys = options?.map((option) => option?.size?.id);
      setTargetKeys(newTargetKeys);
    } else {
      console.error("options is not an array");
    }
  }
  const updateChildCategories = (parentId: number) => {
    const childFilterArray = childCategoryArray?.filter(
      (child: { parent: number }) => parentId == child?.parent
    );
    setSelectedChildCategoryArray(childFilterArray);
  };
  function handleChangeSelectCategory(value: number, type: string) {
    if (type === "parent") {
      const childFilterArray = childCategoryArray?.filter(
        (child: { parent: number }) => {
          return value == child?.parent;
        }
      );
      setSelectedChildCategoryArray(childFilterArray);
      setSelcetedParentId(value);
      setSelcetedChildId(null);
    } else {
      setSelcetedChildId(value);
    }
  }

  const initialOption = allOption?.map((option: Option) => ({
    key: option?.id,
    title: option?.name,
    description: option?.name,
  }));

  // to-do 미리 있는 옵션
  // const initialTargetKeys = mockData
  //   .filter((item) => Number(item.key) > 10)
  //   .map((item) => item.key);

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
      }
      formData.append("info", quillValue);
      if (selectedChildId !== null) {
        formData.append("category", selectedChildId.toString());
      }
      formData.append("size", JSON.stringify(targetKeys));
      if (userId !== undefined) {
        formData.append("user", userId.toString());
      }

      const post_url = `${process.env.NEXT_PUBLIC_API_URL}/products/`;
      const put_url = `${process.env.NEXT_PUBLIC_API_URL}/product_list/${productId}`;

      let url = method === "put" ? put_url : post_url;

      const res = await fetch(url, {
        method: method,
        body: formData,
      });
      if (res.status === 200) {
        alert("성공적으로 추가/변경되었습니다.");
        router?.push("/");
      }
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
          errorMessage={productNameErrorMessage}
        />
        <InputArea
          text="상품 짧은 이름"
          placeholder="상품 설명글을 작성해주세요"
          isRequired={true}
          type="text"
          state={productShortName}
          setState={setProductShortName}
          errorMessage={productShortNameErrorMessage}
        />
        <InputArea
          text="상품 원가"
          placeholder="상품 원가를 작성해주세요"
          isRequired={true}
          type="number"
          state={OriginPrice}
          setState={setOriginPrice}
          errorMessage={originPriceErrorMessage}
        />
        <InputArea
          text="상품 판매가"
          placeholder="상품 판매가를 작성해주세요"
          isRequired={true}
          type="number"
          state={discountPrice}
          setState={setDiscountPrice}
          errorMessage={discountPriceErrorMessage}
        />
        <InputArea
          text="상품 재고"
          placeholder="상품 재고를 작성해주세요"
          isRequired={true}
          type="number"
          state={productStock}
          setState={setProductStock}
          errorMessage={productStockErrorMessage}
        />
        <div className="pt-4 pb-2">
          <label className="">썸네일 이미지</label>
        </div>
        <div className="flex gap-10 pb-5">
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
        <div className="py-2.5">
          {thumbnailImageErrorMessage && (
            <p className="text-red-500 text-sm">{thumbnailImageErrorMessage}</p>
          )}
        </div>

        <div className="pt-4 pb-2">
          <label className="">상세 페이지</label>
        </div>
        <div className="h-[450px] sm:h-[600px]">
          <CustomQuill value={quillValue} onChange={setQuillValue} />
        </div>

        <div className="pt-4 pb-2">
          <label className="">카테고리</label>
        </div>
        <div className="flex justify-around pb-5">
          <Select
            placeholder="대분류"
            options={parentCategoryArray}
            onChange={(selected) =>
              handleChangeSelectCategory(selected, "parent")
            }
            className="w-[45%] h-[45px]"
            value={selectedParentId}
          />
          <Select
            placeholder="소분류"
            options={selectedChildCategoryArray}
            onChange={(selected) =>
              handleChangeSelectCategory(selected, "child")
            }
            className="w-[45%] h-[45px]"
            value={selectedChildId}
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
            {TITLE}
          </button>
        </div>
      </div>
    </Container>
  );
}
