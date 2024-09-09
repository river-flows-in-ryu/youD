"use client";

import React, { useState } from "react";

import InputArea from "@/components/inputArea";
import { Secondary } from "@/stories/Button.stories";
import { commonFetch } from "@/utils/commonFetch";

export default function Client() {
  const [couponCode, setCouponCode] = useState("");

  const handleClickSubmit = () => {
    try {
      const res = commonFetch(``, "post");
    } catch {}
  };

  return (
    <div className="px-5 ">
      <div>
        <h2 className=" font-bold text-xl py-5 ">쿠폰 등록</h2>
        <InputArea
          text="쿠폰을 등록해주세요."
          placeholder="쿠폰 코드를 작성해주세요"
          type="text"
          state={couponCode}
          setState={setCouponCode}
        />
        <button
          className={`w-full h-[45px] rounded text-white ${couponCode === "" ? "bg-secondary border border-secondary" : "bg-primary border-primary"} `}
          onClick={handleClickSubmit}
          disabled={couponCode === ""}
        >
          등록하기
        </button>
      </div>
      <div className=" mt-[50px]">
        <span className="font-bold ">주의사항</span>
        <ul className="text-[#aaa] list-disc leading-7 text-sm">
          <li>쿠폰 등록은 페이지 내에서만 가능합니다.</li>
          <li>쿠폰은 중복 등록이 불가합니다.</li>
          <li>등록된 쿠폰은 마이페이지 &gt; 쿠폰 에서 확인이 가능합니다.</li>
          <li>
            쿠폰은 상품 구매 시에만 사용 가능하며, 현금이나 적립금으로의 환불은
            불가합니다.
          </li>
          <li>
            쿠폰은 반드시 유효기간 내에 사용하셔야 하며, 유효기간이 지난 쿠폰은
            소멸됩니다.
          </li>
          <li>
            쿠폰에 따라 할인이 적용되는 상품이 다를 수 있으며 , 당사 사정에 의해
            쿠폰 사용 조건이 변경될 수 있습니다.
          </li>
        </ul>
      </div>
    </div>
  );
}
