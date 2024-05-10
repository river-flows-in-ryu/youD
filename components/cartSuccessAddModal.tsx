import React from "react";

import Link from "next/link";

interface Props {
  onClose: () => void;
}
export default function CartSuccessAddModal({ onClose }: Props) {
  return (
    <div className="w-[90%] h-[300px] p-6 sm:w-[450px] sm:h-[300px] sm:p-8  bg-white rounded text-center">
      <p className="mt-6 mb-11">선택한 상품이 장바구니에 담겼습니다.</p>
      <button
        className="w-full h-12 border border-primary rounded mb-[30px] text-primary weight-bold"
        onClick={onClose}
      >
        계속 쇼핑하기
      </button>
      <Link href="/cart">
        <button className="w-full h-12 border bg-primary text-white rounded weight-bold">
          장바구니 확인
        </button>
      </Link>
    </div>
  );
}
