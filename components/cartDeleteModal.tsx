import React, { SetStateAction } from "react";

import Link from "next/link";
import { commonFetch } from "@/utils/commonFetch";

import { useCartCountStore } from "@/app/store";

interface Props {
  onClose: () => void;
  productId: number;
  optionId: number;
  userId: number;
  setRefreshFlag: (value: boolean) => void;
  refreshFlag: boolean;
}
export default function CartDeleteModal({
  onClose,
  productId,
  optionId,
  userId,
  setRefreshFlag,
  refreshFlag,
}: Props) {
  const { fetchCartItemCount } = useCartCountStore();
  const payload = {
    productId,
    optionId,
    userId,
  };
  async function handleClickDelete() {
    try {
      const res = await commonFetch(
        `${process.env.NEXT_PUBLIC_API_URL}/cart`,
        "DELETE",
        payload
      );
      if (res.message === "SUCCESS") {
        await fetchCartItemCount(userId);
        setRefreshFlag(!refreshFlag);
      }
    } catch (error) {
      if (error instanceof Error) {
        alert(error?.message);
      }
    }
  }

  return (
    <div className="w-[90%] h-[300px] p-6 sm:w-[450px] sm:h-[300px] sm:p-8  bg-white rounded text-center">
      <p className="mt-6 mb-11">상품을 삭제하시겠습니까?</p>
      <button
        className=" w-full h-12 border bg-primary text-white rounded weight-bold  mb-[30px]"
        onClick={handleClickDelete}
      >
        삭제하기
      </button>
      <Link href="/cart">
        <button
          className="
        w-full h-12 border border-primary rounded text-primary weight-bold"
          onClick={onClose}
        >
          닫기
        </button>
      </Link>
    </div>
  );
}
