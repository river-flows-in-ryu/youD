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
    <div className="w-full flex min-h-[50px] justify-between p-2 bg-white leading-[48px]">
      <span className="w-5 break-all">{value}</span>
      <div className="flex">
        <button onClick={() => onMinus(id)}>
          <Image src={minus} alt="minus" />
        </button>
        <span>{count}</span>
        <button onClick={() => onAdd(id)}>
          <Image src={add} alt="add" />
        </button>
      </div>
      <div className="flex">
        <span className="">{price.toLocaleString()}원</span>
        <button onClick={() => onDelete(id)}>
          <Image src={close} alt="close" />
        </button>
      </div>
    </div>
  );
}
