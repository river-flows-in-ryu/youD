import React from "react";

import Image from "next/image";
import Link from "next/link";

import close from "../public/close.png";

interface Props {
  item: PropsItems;
  handleClickDelete: (productId: number, optionId: number) => void;
  checkedItems: string[];
  handleCheckboxChange: (index: string) => void;
}

interface PropsItems {
  product: {
    id: number;
    image_url: string;
    productName: string;
    OriginPrice: number;
    discountPrice: number;
    user: {
      username: string;
    };
  };
  size_attribute: {
    id: number;
    size: {
      name: string;
    };
  };
  quantity: number;
  index: string;
}

export default function CartProductItem({
  item,
  handleClickDelete,
  checkedItems,
  handleCheckboxChange,
}: Props) {
  return (
    <div className="flex mb-5 ">
      <input
        type="checkbox"
        className={`w-5 h-5   checked:bg-primary border border-[#ccc] checked:border-primary bg-[#fff] rounded-full mr-2.5 appearance-none checked:bg-checkedWhite 	`}
        checked={checkedItems.includes(item?.index)}
        onChange={() => handleCheckboxChange(item?.index)}
        style={{
          backgroundImage: "url('/check_white.png')",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          backgroundSize: "contain",
        }}
      />
      <div className="w-[70px] ">
        <Link href={`/goods/${item?.product?.id}`}>
          <Image
            src={item?.product?.image_url}
            alt={item?.product?.productName}
            width={70}
            height={70}
          />
        </Link>
      </div>
      <div className="ml-2.5 w-[calc(100%-110px)]">
        <div className="flex justify-between">
          <div className="flex flex-col leading-[18px]  w-[calc(100%-20px)]">
            {/* todo */}
            <Link href={`/goods/${item?.product?.id}`}>
              <span className="text-xs">{item?.product?.user?.username}</span>
            </Link>
            <Link href={`/goods/${item?.product?.id}`}>
              <span className=" font-bold text-xs line-clamp-1	">
                {item?.product?.productName}
              </span>
            </Link>
          </div>
          <button
            className="w-5 h-5"
            onClick={() =>
              handleClickDelete(item?.product?.id, item?.size_attribute?.id)
            }
          >
            <Image src={close} alt="close" width={20} height={20} />
          </button>
        </div>
        <div className="flex justify-between text-xs text-[#6e6e6e]">
          <span>
            수량 {item?.quantity} | {item?.size_attribute?.size?.name}
          </span>
          <span className="line-through">
            {item?.product?.OriginPrice?.toLocaleString()}원
          </span>
        </div>
        <div className="flex justify-between mt-1 ">
          <button className="border border-secondary text-sm px-2.5">
            옵션/수량
          </button>
          <span className="text-bold text-black">
            {item?.product?.discountPrice?.toLocaleString()}원
          </span>
        </div>
      </div>
    </div>
  );
}
