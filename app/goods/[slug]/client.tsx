"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";

import dynamic from "next/dynamic";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Select } from "antd";
import { useRouter } from "next/navigation";

import GoodsDetailTabBar from "@/components/goodsDetailTabBar";
import GoodsOptionTabBar from "@/components/goodsOptionTabBar";
import CartSuccessAddModal from "@/components/cartSuccessAddModal";

import { useCartCountStore, useUserIdStore } from "@/app/store";
import ReviewListDetail from "@/components/reviewListDetail";
import { commonFetch } from "@/utils/commonFetch";

import arrowFoward from "@/public/arrow_forward_balck.png";
import ProductDetailOption from "@/components/productDetailOption";

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
    brandName: string;
    user: {
      id: number;
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
    brandName: "",
    user: {
      id: 0,
      username: "",
    },
    size_attributes: [],
  },
};

export default function Client({ productData, slug, reviewData }: Props) {
  const Modal = dynamic(() => import("@/components/modal"));
  const { userId } = useUserIdStore();
  const [isOptionChoiceSection, setIsOptionChoiceSection] = useState(false);
  const [optionArray, setOptionArray] = useState<Option[]>([]);
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("info");

  const [isLike, setIsLike] = useState<boolean>(false);

  const [productDetailData, setProductDetailData] = useState<Products>(
    initialProductDetailData
  );
  const [options, setOptions] = useState<SelectedOption[]>([]);

  const { reviewTotalCount, imageReviewCount, nomalReviewCount } = reviewData;

  const { fetchCartItemCount } = useCartCountStore();

  const router = useRouter();

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

  useEffect(() => {
    async function fetchLikeData() {
      if (userId) {
        const res = await commonFetch(
          `${process.env.NEXT_PUBLIC_API_URL}/product/is_like`,
          "post",
          payload
        );
        setIsLike(res?.liked);
      }
    }
    fetchLikeData();
  }, [userId]);

  const handleLikeClick = async () => {
    const res = await commonFetch(
      `${process.env.NEXT_PUBLIC_API_URL}/product/like`,
      "post",
      payload
    );
    setIsLike(res?.liked);
  };

  const cartPayload = {
    userId: userId,
    optionArray: optionArray,
  };
  async function handleClickSubmit() {
    if (userId === 0) {
      alert("로그인해주세요");
      router.push("/login");
      return;
    }

    if (optionArray.length === 0) {
      alert("옵션를 선택하십시오.");
      return;
    }
    try {
      const res = await commonFetch(
        `${process.env.NEXT_PUBLIC_API_URL}/cart`,
        "post",
        cartPayload
      );
      if (res) {
        await fetchCartItemCount(userId);
        setIsModalOpen(true);
      }
    } catch (error) {
      if (error instanceof Error) {
        alert(error?.message);
      }
    }
  }

  const handleChange = (value: string) => {
    const optionIndex = optionArray.findIndex((option: Option) => {
      return option.value === value;
    });
    if (optionIndex !== -1) {
      const newOptionArray = optionArray.map((option) => {
        if (option.value === value) {
          return {
            ...option,
            quantity: option.quantity + 1,
          };
        }
        return option;
      });
      setOptionArray(newOptionArray);
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
  return (
    <div className="sm:mx-auto w-full pb-[70px]">
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <CartSuccessAddModal onClose={() => setIsModalOpen(false)} />
      </Modal>
      <div className="sm:w-full xl:w-[1050px] sm:mt-2.5 sm:mx-auto justify-between ">
        <div className="sm:flex sm:w-full">
          <div className="w-full sm:w-[600px] h-[600px] relative flex-shrink-0">
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
          <div className="w-full px-4 py-5 text-xl	">
            <div className="flex flex-col mb-3">
              <Link href={`/brands/${productDetailData?.product?.user?.id}`}>
                <div className="flex gap-[10px]">
                  <span className="text-sm">
                    {productDetailData?.product?.brandName || ""}
                  </span>
                  <div className="my-auto">
                    <Image
                      src={arrowFoward}
                      alt="arrowFoward"
                      width={15}
                      height={15}
                      className="w-3 h-3 "
                    />
                  </div>
                </div>
              </Link>
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
            <div className="hidden sm:block w-[400px] mt-[50px]">
              <div className="w-full">
                <Select
                  onChange={handleChange}
                  defaultValue="옵션 선택"
                  className="h-[50px] mb-5 w-full"
                  options={options}
                />
              </div>
              {optionArray?.length !== 0 && (
                <div className="bg-[#dedede] sm:bg-white min-h-[55px] mb-5 max-h-[200px] overflow-auto p-[10px]	">
                  <div className="flex flex-col">
                    {optionArray
                      ?.slice()
                      ?.reverse()
                      .map((option: Option, index) => {
                        return (
                          <ProductDetailOption
                            option={option}
                            onDelete={onDelete}
                            onAdd={onAdd}
                            onMinus={onMinus}
                            price={productDetailData?.product?.discountPrice}
                            key={index}
                          />
                        );
                      })}
                  </div>
                </div>
              )}
              <div className="flex justify-between pl-5 mb-5">
                <span className="text-base leading-8">총 금액</span>
                <span className="text-2xl	font-bold">
                  {(
                    productDetailData?.product?.discountPrice * totalQuantity
                  ).toLocaleString() || 0}
                  원
                </span>
              </div>
              <div className="flex justify-end">
                <div className="flex flex-col">
                  <button
                    className="w-[175px] h-[60px] bg-primary text-white rounded"
                    onClick={handleClickSubmit}
                  >
                    장바구니 담기
                  </button>
                </div>
              </div>
            </div>
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
            handleLikeClick={handleLikeClick}
            isLike={isLike}
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
