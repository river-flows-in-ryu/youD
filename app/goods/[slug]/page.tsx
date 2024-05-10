"use client";

import React, { Suspense, useEffect, useState } from "react";
import Image from "next/image";

import Loading from "@/app/loading";

import { serverFetch } from "@/components/serverFetch";
import { useUserIdStore } from "@/app/store";

import GoodsDetailTabBar from "@/components/goodsDetailTabBar";
import GoodsOptionTabBar from "@/components/goodsOptionTabBar";
import Modal from "@/components/modal";
import CartSuccessAddModal from "@/components/cartSuccessAddModal";
import { commonFetch } from "@/utils/commonFetch";

export default function Page({
  params: { slug },
}: {
  params: { slug: string };
}) {
  const { userId } = useUserIdStore();
  const [isOptionChoiceSection, setIsOptionChoiceSection] = useState(false);
  const [optionArray, setOptionArray] = useState([]);
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [productDetailData, setProductDetailData] = useState([]);
  const [options, setOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  console.log(optionArray);

  useEffect(() => {
    setTotalQuantity(
      optionArray.reduce((acc, option) => acc + option?.quantity, 0)
    );
  }, [optionArray]);

  useEffect(() => {
    const fetchAsync = async () => {
      setIsLoading(true);
      // if (userId) {
      const res = await fetchData();
      console.log(res);
      const like = await fetchLikeData();
      setProductDetailData(res);
      // fetchLikeData();
      setIsLoading(false);
      const optionArray = res?.product?.size_attributes?.map(
        (option: { id: number; size: { name: string } }) => ({
          id: option.id,
          value: option?.size?.name,
          label: option?.size?.name,
        })
      );
      setOptions(optionArray);
      // }
    };
    fetchAsync();
  }, [userId]);

  const payload = {
    user_id: userId,
    product_id: slug,
  };

  async function fetchData() {
    const res = await commonFetch(
      `${process.env.NEXT_PUBLIC_API_URL}/product_list/${slug}`,
      "get"
    );
    return res;
  }

  async function fetchLikeData() {
    const res = await serverFetch(
      `${process.env.NEXT_PUBLIC_API_URL}/product/is_like`,
      "post",
      payload
    );
    return res;
  }

  const handleLikeClick = async () => {
    const res = await serverFetch(
      `${process.env.NEXT_PUBLIC_API_URL}/product/like`,
      "post",
      payload
    );
    // console.log(res);
  };

  const handleChange = (value: string) => {
    const optionIndex = optionArray.findIndex(
      (option) => option.value === value
    );
    if (optionIndex !== -1) {
      alert("이미 선택한 옵션입니다.");
    } else {
      const selectedOption = options.find((option) => option.value === value);
      setOptionArray([
        ...optionArray,
        {
          productId: slug,
          optionId: selectedOption?.id,
          value,
          quantity: 1,
        },
      ]);
    }
  };

  const onDelete = (id: number) => {
    console.log(optionArray);
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
          option.id === id
            ? { ...option, quantity: option.quantity - 1 }
            : option
        )
      );
    } else {
      onDelete(id);
    }
  };

  if (isLoading) return <Loading />;
  // console.log(productDetailData);
  return (
    <div className="sm:mx-auto w-full">
      <Modal
        isOpen={isModalOpen}
        onClose={setIsModalOpen}
        children={<CartSuccessAddModal />}
      />
      <div className="sm:w-[1050px] sm:mt-[30px] sm:mx-auto sm:flex justify-between h-full">
        <>
          {productDetailData?.product?.image_url && (
            <Image
              src={productDetailData?.product?.image_url}
              alt="zzz"
              width={300}
              height={300}
              priority
              className="w-full sm:w-[500px] sm:h-[600px]"
            />
          )}
        </>
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
          <p>하단은 정보</p>
          <div className="w-full h-[30px] bg-[#b5b5b5] flex justify-around ">
            <div>정보</div>
            <div>리뷰</div>
          </div>
          <div
            dangerouslySetInnerHTML={{
              __html: productDetailData?.product?.info,
            }}
          />
        </div>

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
