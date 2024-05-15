import React from "react";

import Image from "next/image";

import minus from "../public/minus.png";
import add from "../public/add.png";
import close from "../public/close.png";

interface Props {
  option: {
    productId: string;
    optionId: number;
    value: string;
    quantity: number;
  };
  onDelete: (id: number) => void;
  onAdd: (id: number) => void;
  onMinus: (id: number) => void;
  price: number;
}

export default function ProductDetailOption({
  option,
  onDelete,
  onAdd,
  onMinus,
  price,
}: Props) {
  const { optionId, value, quantity } = option;
  return (
    <div className="w-full flex justify-between h-[50px]  p-2 bg-white leading-[48px] m-[0.5px]">
      <span className="min-w-[100px] break-all leading-[35px] ">{value}</span>
      <div className="flex m-auto border border-[#cecece] ">
        <button
          onClick={() => onMinus(optionId)}
          className="w-[24px] h-[24px] m-auto"
        >
          <Image src={minus} alt="minus" />
        </button>
        <span className="w-[30px] h-[30px] leading-[30px] text-center ">
          {quantity}
        </span>
        <button
          onClick={() => onAdd(optionId)}
          className="w-[24px] h-[24px] m-auto"
        >
          <Image src={add} alt="add" />
        </button>
      </div>
      <div className="flex ">
        <span className="text-xs leading-[34px]">
          {price || 0 * quantity || 0}원
        </span>
        <button onClick={() => onDelete(optionId)}>
          <Image src={close} alt="close" />
        </button>
      </div>
    </div>
  );
}
