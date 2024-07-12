"use client";

import React, { useEffect, useState } from "react";

import { useRouter } from "next/navigation";
import { Checkbox } from "antd";

import InputArea from "./inputArea";
import SignupPhoneArea from "./signupPhoneArea";
import SignupAddressArea from "./signupAddressArea";

import { useUserIdStore } from "@/app/store";

import { commonFetch } from "@/utils/commonFetch";

interface UserAddress {
  id: number;
  address_label: null | string;
  recipient_name: string;
  address: string;
  address_detail: string;
  phone: string;
  is_default: boolean;
  user: number;
}

export default function DeliveryAddressSlugClinetPage({
  slug,
  data,
  addressId,
}: {
  slug: string;
  data: UserAddress;
  addressId: number;
}) {
  const router = useRouter();

  useEffect(() => {
    if (slug === "change" || slug === "add") return;
    else {
      alert("잘못된 경로입니다.");
      router?.back();
    }
  }, []);

  const SLUG_STSATUS = slug === "change" ? "주소 수정" : "주소 추가";

  const [first, second, third] = data?.phone.split("-") || ["", "", ""];

  const [name, setName] = useState<string>(data?.recipient_name || "");
  const [label, setLabel] = useState(data?.address_label || "");
  const [phone1, setPhone1] = useState(first || "");
  const [phone2, setPhone2] = useState(second || "");
  const [phone3, setPhone3] = useState(third || "");
  const [address, setAddress] = useState(data?.address || "");
  const [addressDetail, setAddressDetail] = useState(
    data?.address_detail || ""
  );
  const [isDefaultAddress, setIsDefaultAddress] = useState<boolean>(
    data?.is_default || false
  );

  const [nameErrorMessage, setNameErrorMessage] = useState("");
  const [phone1ErrorMessage, setPhone1ErrorMessage] = useState("");
  const [phone2ErrorMessage, setPhone2ErrorMessage] = useState("");
  const [phone3ErrorMessage, setPhone3ErrorMessage] = useState("");
  const [phoneErrorMessage, setPhoneErrorMessage] = useState("");

  const { userId } = useUserIdStore();

  useEffect(() => {
    if (name === "") setNameErrorMessage("");
    else {
      const validPattern = /^[가-힣a-zA-Z0-9]+$/;
      if (!validPattern.test(name)) {
        setNameErrorMessage("이름을 확인해주세요");
      } else setNameErrorMessage("");
    }

    if (phone1 === "") {
      setPhone1ErrorMessage("");
    } else {
      const firstPartPattern = /^01[0-9]{1,2}$/;
      if (!firstPartPattern.test(phone1)) {
        setPhone1ErrorMessage("전화번호를 확인해주세요");
      } else {
        setPhone1ErrorMessage("");
      }
    }

    if (phone2 === "") {
      setPhone2ErrorMessage("");
    } else {
      const secondPartPattern = /^[0-9]{3,4}$/;
      if (!secondPartPattern.test(phone2)) {
        setPhone2ErrorMessage("전화번호를 확인해주세요");
      } else {
        setPhone2ErrorMessage("");
      }
    }

    if (phone3 === "") {
      setPhone3ErrorMessage("");
    } else {
      const thirdPartPattern = /^[0-9]{4}$/;
      if (!thirdPartPattern.test(phone3)) {
        setPhone3ErrorMessage("전화번호를 확인해주세요");
      } else {
        setPhone3ErrorMessage("");
      }
    }

    if (
      phone1ErrorMessage !== "" ||
      phone2ErrorMessage !== "" ||
      phone3ErrorMessage !== ""
    ) {
      setPhoneErrorMessage("전화번호를 확인해주세요");
    } else {
      setPhoneErrorMessage("");
    }
  }, [
    name,
    nameErrorMessage,
    phone1,
    phone2,
    phone3,
    phone1ErrorMessage,
    phone2ErrorMessage,
    phone3ErrorMessage,
  ]);

  const payload = {
    name,
    label,
    phone: `${phone1}-${phone2}-${phone3}`,
    address,
    addressDetail,
    isDefault: isDefaultAddress,
    userId,
  };

  async function handleSubmit() {
    if (
      !(
        name !== "" &&
        nameErrorMessage === "" &&
        phone1 !== "" &&
        phone2 !== "" &&
        phone3 !== "" &&
        phoneErrorMessage === "" &&
        address !== ""
      )
    ) {
      alert("값을 확인해주세요");
      return;
    }
    if (slug === "add") {
      try {
        const res = await commonFetch(
          `${process.env.NEXT_PUBLIC_API_URL}/user/address`,
          "post",
          payload
        );
        if (res?.message === "SUCCESS") {
          window.location.href = "/mypage/delivery_address";
        } else {
          alert("값을 다시 확인해주세요");
        }
      } catch (error) {
        if (error instanceof Error) {
          alert(error?.message);
        }
      }
    } else {
      const res = await commonFetch(
        `${process.env.NEXT_PUBLIC_API_URL}/user/address/${userId}/${addressId}`,
        "put",
        payload
      );
      if (res?.message === "SUCCESS") {
        // window.location.href = "/mypage/delivery_address";
      } else {
        alert("값을 다시 확인해주세요");
      }
    }
  }

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
        errorMessage={nameErrorMessage}
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
      {!data?.is_default && (
        <Checkbox onChange={() => setIsDefaultAddress(!isDefaultAddress)}>
          기본 주소로 등록하기
        </Checkbox>
      )}
      <button
        className="w-full h-10 bg-primary text-white rounded my-[30px]"
        onClick={handleSubmit}
      >
        완료
      </button>
    </div>
  );
}
