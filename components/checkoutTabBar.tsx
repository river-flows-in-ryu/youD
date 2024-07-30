import React from "react";

interface Props {
  totalDiscountPrice: number;
  handleSubmit: () => Promise<void>;
}

export default function CheckoutTabBar({
  totalDiscountPrice,
  handleSubmit,
}: Props) {
  return (
    <div className="block sm:hidden">
      <div className="fixed bottom-0 w-full border z-10 bg-white">
        <div className=" w-full h-[70px] flex px-3 py-2">
          <button
            className="w-full h-[52px] border border-[#dedede] bg-primary text-white font-bold	rounded "
            onClick={handleSubmit}
          >
            {totalDiscountPrice.toLocaleString()}원 결제하기
          </button>
        </div>
      </div>
    </div>
  );
}
