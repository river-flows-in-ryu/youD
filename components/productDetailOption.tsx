import React from "react";

import Image from "next/image";

import minus from "../public/minus.png";
import add from "../public/add.png";
import close from "../public/close.png";

export default function ProductDetailOption({
  option,
  onDelete,
  onAdd,
  onMinus,
}) {
  const { id, value, count, price } = option;
  return (
    <div className="w-full flex justify-between h-[50px]  p-2 bg-white leading-[48px] m-[0.5px]">
      <span className="w-[100px] break-all leading-[35px] ">{value}</span>
      <div className="flex m-auto border border-[#cecece] ">
        <button
          onClick={() => onMinus(id)}
          className="w-[24px] h-[24px] m-auto"
        >
          <Image src={minus} alt="minus" />
        </button>
        <span className="w-[30px] h-[30px] leading-[30px] text-center ">
          {count}
        </span>
        <button onClick={() => onAdd(id)} className="w-[24px] h-[24px] m-auto">
          <Image src={add} alt="add" />
        </button>
      </div>
      <div className="flex">
        <span className="text-xs m-auto">{price.toLocaleString()}원</span>
        <button onClick={() => onDelete(id)}>
          <Image src={close} alt="close" />
        </button>
      </div>
    </div>
  );
}
