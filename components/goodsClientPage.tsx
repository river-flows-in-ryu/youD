"use client";

import React, { Suspense, useEffect, useState } from "react";
import Image from "next/image";

import Loading from "@/app/loading";

import { useUserIdStore } from "@/app/store";

import GoodsDetailTabBar from "@/components/goodsDetailTabBar";
import GoodsOptionTabBar from "@/components/goodsOptionTabBar";
import CartSuccessAddModal from "@/components/cartSuccessAddModal";
import dynamic from "next/dynamic";

interface Props {
  data: Products;
  slug: string;
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

export default function GoodsClientPage({ data, slug }: Props) {
  const Modal = dynamic(() => import("@/components/modal"));
  const { userId } = useUserIdStore();
  const [isOptionChoiceSection, setIsOptionChoiceSection] = useState(false);
  const [optionArray, setOptionArray] = useState<Option[]>([]);
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [productDetailData, setProductDetailData] = useState<Products>(
    initialProductDetailData
  );
  const [options, setOptions] = useState<SelectedOption[]>([]);

  useEffect(() => {
    if (data) {
      setProductDetailData(data);
      const optionData = data?.product?.size_attributes?.map(
        (option: SizeAttributes) => ({
          id: option.id,
          value: option?.size?.name,
          label: option?.size?.name,
        })
      );
      setOptions(optionData);
    }
  }, [data]);

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

  if (!data) return <Loading />;
  return (
    <div className="sm:mx-auto w-full">
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <CartSuccessAddModal onClose={() => setIsModalOpen(false)} />
      </Modal>
      <div className="sm:w-[1050px] sm:mt-[30px] sm:mx-auto sm:flex justify-between h-full">
        <div className="w-full h-[560px] relative">
          {productDetailData?.product?.image_url && (
            <Image
              src={productDetailData?.product?.image_url}
              alt={productDetailData?.product?.productName}
              fill
              style={{ objectFit: "contain" }}
              loading="eager"
              priority={true}
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
          <p>하단은 정보</p>
          <div className="w-full h-[30px] bg-[#b5b5b5] flex justify-around ">
            <div>정보</div>
            <div>리뷰</div>
          </div>
          <Suspense>
            <div
              className="w-full "
              dangerouslySetInnerHTML={{
                __html: productDetailData?.product?.info,
              }}
            />
          </Suspense>
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
