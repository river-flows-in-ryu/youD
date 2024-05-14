import React from "react";

import Link from "next/link";

interface Props {
  onClose: () => void;
  productId: number;
  optionId: number;
}
export default function CartDeleteModal({
  onClose,
  productId,
  optionId,
}: Props) {
  const handleClickDelete = () => {
    console.log(productId, optionId);
  };

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
