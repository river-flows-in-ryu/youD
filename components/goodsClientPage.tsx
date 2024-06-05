"use client";

import React, { Suspense, useEffect, useState } from "react";
import Image from "next/image";

import dynamic from "next/dynamic";
import { notFound } from "next/navigation";

import GoodsDetailTabBar from "@/components/goodsDetailTabBar";
import GoodsOptionTabBar from "@/components/goodsOptionTabBar";
import CartSuccessAddModal from "@/components/cartSuccessAddModal";

import { useUserIdStore } from "@/app/store";
import ReviewListDetail from "./reviewListDetail";

interface Props {
  productData: Products;
  slug: string;
  reviewData: {
    reviewTotalCount: number;
    imageReviewCount: number;
    nomalReviewCount: number;
  };
}

interface Option {
  optionId: number;
  productId: string;
  quantity: number;
  value: string;
  name?: string;
  count?: number;
}
interface SelectedOption {
  id: number;
  label: string;
  value: string;
  quantity?: number;
  price?: number;
}

interface Products {
  product: {
    image_url: string;
    productName: string;
    productShortName: string;
    discountRate: number;
    discountPrice: number;
    info: string;
    OriginPrice: number;
    user: {
      username: string;
    };
    size_attributes: SizeAttributes[];
  };
}

interface SizeAttributes {
  id: number;
  size: {
    name: string;
  };
}

const initialProductDetailData: Products = {
  product: {
    image_url: "",
    productName: "",
    productShortName: "",
    discountRate: 0,
    discountPrice: 0,
    info: "",
    OriginPrice: 0,
    user: {
      username: "",
    },
    size_attributes: [],
  },
};

export default function GoodsClientPage({
  productData,
  slug,
  reviewData,
}: Props) {
  const Modal = dynamic(() => import("@/components/modal"));
  const { userId } = useUserIdStore();
  const [isOptionChoiceSection, setIsOptionChoiceSection] = useState(false);
  const [optionArray, setOptionArray] = useState<Option[]>([]);
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("info");

  const [productDetailData, setProductDetailData] = useState<Products>(
    initialProductDetailData
  );
  const [options, setOptions] = useState<SelectedOption[]>([]);

  const { reviewTotalCount, imageReviewCount, nomalReviewCount } = reviewData;

  useEffect(() => {
    if (productData) {
      setProductDetailData(productData);
      const optionData = productData?.product?.size_attributes?.map(
        (option: SizeAttributes) => ({
          id: option.id,
          value: option?.size?.name,
          label: option?.size?.name,
        })
      );
      setOptions(optionData);
    }
  }, [productData]);

  useEffect(() => {
    setTotalQuantity(
      optionArray.reduce((acc, option: Option) => acc + option?.quantity, 0)
    );
  }, [optionArray]);

  const payload = {
    user_id: userId,
    product_id: slug,
  };

  // async function fetchLikeData() {
  //   const res = await serverFetch(
  //     `${process.env.NEXT_PUBLIC_API_URL}/product/is_like`,
  //     "post",
  //     payload
  //   );
  //   return res;
  // }

  // const handleLikeClick = async () => {
  //   const res = await serverFetch(
  //     `${process.env.NEXT_PUBLIC_API_URL}/product/like`,
  //     "post",
  //     payload
  //   );
  //   // console.log(res);
  // };

  const handleChange = (value: string) => {
    const optionIndex = optionArray.findIndex((option: Option) => {
      option.value === value;
    });
    if (optionIndex !== -1) {
      alert("이미 선택한 옵션입니다.");
    } else {
      const selectedOption: any = options.find(
        (option: SelectedOption) => option.value === value
      );

      if (selectedOption) {
        setOptionArray([
          ...optionArray,
          {
            productId: slug,
            optionId: selectedOption.id,
            value,
            quantity: 1,
          },
        ]);
      }
    }
  };

  const onDelete = (id: number) => {
    setOptionArray(optionArray.filter((option) => option.optionId !== id));
  };
  const onAdd = (id: number) => {
    setOptionArray(
      optionArray.map((option) =>
        option.optionId === id
          ? { ...option, quantity: option.quantity + 1 }
          : option
      )
    );
  };

  const onMinus = (id: number) => {
    const selectedOption = optionArray.find((option) => option.optionId === id);
    // console.log(selectedOption);
    if (selectedOption && selectedOption.quantity > 1) {
      setOptionArray(
        optionArray.map((option) =>
          option.optionId === id
            ? { ...option, quantity: option.quantity - 1 }
            : option
        )
      );
    } else {
      onDelete(id);
    }
  };

  if (productData === undefined) notFound();
  // if (!productData) return <Loading />;
  return (
    <div className="sm:mx-auto w-full">
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <CartSuccessAddModal onClose={() => setIsModalOpen(false)} />
      </Modal>
      <div className="sm:w-full xl:w-[1050px] sm:mt-[30px] sm:mx-auto justify-between ">
        <div className="sm:flex sm:w-full">
          <div className="w-full sm:w-[450px] h-[560px] relative">
            {productDetailData?.product?.image_url && (
              <Image
                src={productDetailData?.product?.image_url}
                alt={productDetailData?.product?.productName}
                fill
                style={{ objectFit: "contain" }}
                loading="eager"
                priority={true}
                sizes=""
              />
            )}
          </div>
          <div className="px-4 py-5 text-xl	">
            <div className="flex flex-col mb-3">
              <span className="text-sm">
                {productDetailData?.product?.user?.username}
              </span>
              <h2 className="font-extrabold overflow-hidden text-ellipsis ">
                {productDetailData?.product?.productName}
              </h2>
              <p className="text-sm	text-[#b5b5b5]">
                {productDetailData?.product?.productShortName}
              </p>
            </div>
            <div className="flex ">
              <span className="text-primary font-medium mr-2">
                {productDetailData?.product?.discountRate}%
              </span>
              <span className="font-medium mr-2">
                {productDetailData?.product?.discountPrice.toLocaleString()}원
              </span>
              <span className="line-through	text-base leading-7 text-[#b5b5b5]	">
                {productDetailData?.product?.OriginPrice.toLocaleString()}원
              </span>
            </div>

            {/* <button className="w-10 h-10" onClick={handleLikeClick}>
            1
          </button>
          <button
            className="w-10 h-10"
            onClick={() => {
              setIsModalOpen(!isModalOpen);
            }}
          >
            1
          </button> */}
          </div>
        </div>
        <div className="w-full h-[50px] flex justify-center">
          <div
            className={`${
              activeTab === "info" ? "border-primary" : "border-[#f2f2f2]"
            } border-b-2 grow text-center leading-[50px]`}
            onClick={() => setActiveTab("info")}
          >
            <button className="	">상품정보</button>
          </div>
          <div
            className={`${
              activeTab === "review" ? "border-primary" : "border-[#f2f2f2]"
            } border-b-2 grow text-center leading-[50px]`}
            onClick={() => setActiveTab("review")}
          >
            <button className="grow	">리뷰 {reviewTotalCount || 0}</button>
          </div>
        </div>

        {activeTab === "info" ? (
          <div
            className="w-full sm:w-[600px] px-[15px] mx-auto "
            dangerouslySetInnerHTML={{
              __html: productDetailData?.product?.info,
            }}
          />
        ) : (
          <>
            <ReviewListDetail
              slug={slug}
              imageReviewCount={imageReviewCount}
              nomalReviewCount={nomalReviewCount}
              productImageUrl={productDetailData?.product?.image_url}
            />
          </>
        )}

        {!isOptionChoiceSection ? (
          <GoodsDetailTabBar
            setIsOptionChoiceSection={setIsOptionChoiceSection}
          />
        ) : (
          <GoodsOptionTabBar
            setIsOptionChoiceSection={setIsOptionChoiceSection}
            handleChange={handleChange}
            options={options}
            optionArray={optionArray}
            onDelete={onDelete}
            onAdd={onAdd}
            onMinus={onMinus}
            totalQuantity={totalQuantity}
            price={productDetailData?.product?.discountPrice}
            setIsModalOpen={setIsModalOpen}
          />
        )}
      </div>
    </div>
  );
}
