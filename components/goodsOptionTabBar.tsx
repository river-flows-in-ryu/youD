import React from "react";

import Image from "next/image";
import { Select } from "antd";
import { useRouter } from "next/navigation";

import ProductDetailOption from "./productDetailOption";

import { commonFetch } from "@/utils/commonFetch";

import arrowDown from "../public/arrow_down.png";

import { useCartCountStore, useUserIdStore } from "@/app/store";

interface Props {
  setIsOptionChoiceSection: React.Dispatch<React.SetStateAction<boolean>>;
  handleChange: (value: string) => void;
  options: { value: string; label: string; id: number; price?: number }[];
  optionArray: {
    productId: string;
    optionId: number;
    value: string;
    quantity: number;
  }[];
  onDelete: (id: number) => void;
  onAdd: (id: number) => void;
  onMinus: (id: number) => void;
  totalQuantity: number;
  price: number;
  setIsModalOpen: (value: boolean) => void;
}

interface Option {
  productId: string;
  optionId: number;
  value: string;
  quantity: number;
}

export default function GoodsOptionTabBar({
  setIsOptionChoiceSection,
  handleChange,
  options = [],
  optionArray = [],
  onDelete,
  onAdd,
  onMinus,
  totalQuantity,
  price,
  setIsModalOpen,
}: Props) {
  const { userId } = useUserIdStore();
  const { fetchCartItemCount } = useCartCountStore();
  const router = useRouter();

  const payload = {
    userId: userId,
    optionArray: optionArray,
  };

  const handleClickSubmit = async () => {
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
        payload
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
  };

  return (
    <div className="block sm:hidden pb-[240px] sm:pb-0">
      <div className="fixed bottom-0 w-full border z-10 bg-white">
        <div className=" w-full min-h-[240px] max-h-[450px] flex flex-col px-[10px] ">
          <button
            className="mx-auto h-[30px] w-[30px]"
            onClick={() => setIsOptionChoiceSection(false)}
          >
            <Image src={arrowDown} alt="toggleButton" />
          </button>
          <>
            <Select
              onChange={handleChange}
              defaultValue="옵션 선택"
              className="h-[50px] mb-5"
              options={options}
            />
          </>
          <div className="bg-[#dedede] min-h-[55px] mb-5 max-h-[200px] overflow-auto p-[10px]	">
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
                      price={price}
                      key={index}
                    />
                  );
                })}
            </div>
          </div>
          <div className="w-full h-[50px]">
            <div className="flex justify-between">
              <span>상품 갯수 {totalQuantity}개</span>
              <span>총 금액 {(price * totalQuantity).toLocaleString()}원</span>
            </div>
          </div>
          <button
            className="h-[50px] w-full bg-primary text-white font-bold	rounded"
            onClick={handleClickSubmit}
          >
            장바구니 담기
          </button>
        </div>
      </div>
    </div>
  );
}
