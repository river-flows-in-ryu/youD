import React from "react";

import Image from "next/image";

import emptyHeart from "../public/empty_heart.png";

interface Props {
  setIsOptionChoiceSection: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function GoodsDetailTabBar({ setIsOptionChoiceSection }: Props) {
  return (
    <div className="block sm:hidden pb-[72px] sm:pb-0 ">
      <div className="fixed bottom-0 w-full border z-10 bg-white">
        <div className=" w-full h-[70px] flex px-3 py-2">
          <button className="h-[52px] border border-[#dedede] w-[15%] mr-2 rounded ">
            <Image
              src={emptyHeart}
              alt="emptyHeart"
              width={30}
              height={30}
              className="m-auto"
            />
          </button>
          <button
            className="w-[85%] h-[52px] border border-[#dedede] bg-primary text-white font-bold	rounded "
            onClick={() => setIsOptionChoiceSection(true)}
          >
            구매하기
          </button>
        </div>
      </div>
    </div>
  );
}
