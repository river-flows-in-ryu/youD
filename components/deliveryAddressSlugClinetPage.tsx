"use client";

import React, { useState } from "react";

import InputArea from "./inputArea";
import SignupPhoneArea from "./signupPhoneArea";
import SignupAddressArea from "./signupAddressArea";

export default function DeliveryAddressSlugClinetPage({
  slug,
}: {
  slug: string;
}) {
  const SLUG_STSATUS = slug === "change" ? "주소 수정" : "주소 추가";

  const [name, setName] = useState("");
  const [label, setLabel] = useState("");
  const [phone1, setPhone1] = useState("");
  const [phone2, setPhone2] = useState("");
  const [phone3, setPhone3] = useState("");
  const [address, setAddress] = useState("");
  const [addressDetail, setAddressDetail] = useState("");

  const [phoneErrorMessage, setPhoneErrorMessage] = useState("");
  return (
    <div className="px-5 sm:w-[650px] sm:mx-auto">
      <h2 className=" font-bold text-xl py-5 ">{SLUG_STSATUS}</h2>
      <InputArea
        text="이름"
        placeholder="수령인"
        isRequired={true}
        type="text"
        state={name}
        setState={setName}
      />
      <InputArea
        text="배송지명"
        placeholder="배송지명"
        isRequired={false}
        type="text"
        state={label}
        setState={setLabel}
      />
      <SignupPhoneArea
        phone1={phone1}
        phone2={phone2}
        phone3={phone3}
        setPhone1={setPhone1}
        setPhone2={setPhone2}
        setPhone3={setPhone3}
        phoneErrorMessage={phoneErrorMessage}
      />
      <SignupAddressArea address={address} setAddress={setAddress} />
      <InputArea
        text="상세 주소"
        placeholder="상세주소를 입력해세요"
        type="text"
        state={addressDetail}
        setState={setAddressDetail}
      />
      <button className="w-full h-10 bg-primary text-white rounded my-[30px]">
        완료
      </button>
    </div>
  );
}
