"use client";
import React, { useState } from "react";

import Link from "next/link";
import Image from "next/image";

import masking from "@/utils/masking";

import close from "../public/close.png";
interface Address {
  address: string;
  address_detail: string;
  address_label: string | null;
  id: number;
  is_default: boolean;
  phone: string;
  recipient_name: string;
}

interface Props {
  onClose: () => void;
  userAddressData: Address[];
  setDeliveryName: React.Dispatch<React.SetStateAction<string | undefined>>;
  setDeliveryPhone: React.Dispatch<React.SetStateAction<string | undefined>>;
  setDeliveryAddress: React.Dispatch<React.SetStateAction<string | undefined>>;
  setDeliveryAddressDetail: React.Dispatch<
    React.SetStateAction<string | undefined>
  >;
}

export default function UserAddressChoiceModal({
  onClose,
  userAddressData,
  setDeliveryName,
  setDeliveryPhone,
  setDeliveryAddress,
  setDeliveryAddressDetail,
}: Props) {
  function handleClickAddressChoice(
    name: string,
    phone: string,
    address: string,
    addressDetail: string
  ) {
    setDeliveryName(name);
    setDeliveryPhone(phone);
    setDeliveryAddress(address);
    setDeliveryAddressDetail(addressDetail);
    onClose();
  }

  const [currentView, setCurrentView] = useState<"list" | "edit" | "add">(
    "list"
  );

  const AddAddress = () => {
    return (
      <>
        <div className="text-center mb-5 text-xl font-bold relative ">
          <Image
            src={close}
            width={20}
            height={20}
            alt="close_img"
            className="absolute right-0 mt-1"
            onClick={onClose}
          />
          주소지 추가
        </div>
      </>
    );
  };

  const EditAddress = () => {
    return (
      <>
        <div className="text-center mb-5 text-xl font-bold relative ">
          <Image
            src={close}
            width={20}
            height={20}
            alt="close_img"
            className="absolute right-0 mt-1"
            onClick={onClose}
          />
          주소지 수정
        </div>
      </>
    );
  };

  const ListAddress = () => {
    return (
      <>
        <div className="text-center mb-5 text-xl font-bold relative ">
          <Image
            src={close}
            width={20}
            height={20}
            alt="close_img"
            className="absolute right-0 mt-1"
            onClick={onClose}
          />
          주소지 선택
        </div>
        <button
          className="w-full py-2.5 border border-secondary mb-2.5"
          onClick={() => setCurrentView("add")}
        >
          + 주소 추가하기
        </button>
        <div className="">
          {userAddressData?.map((address) => (
            <div key={address?.id} className=" py-[15px]">
              <div className="flex gap-1 font-bold mb-1.5">
                <span>{masking(address?.recipient_name)}</span>
                <span>
                  {address?.address_label
                    ? address?.address_label
                    : `(${address?.recipient_name}님의 배송지)`}
                </span>
                {address?.is_default && (
                  <button className="border border-primary px-1 rounded-full text-xs font-normal text-primary">
                    기본배송지
                  </button>
                )}
              </div>
              <div className="flex flex-col text-sm gap-1 mb-5">
                <span>{address?.phone}</span>
                <span>{`${address?.address} ${address?.address_detail}`}</span>
              </div>
              <div className=" flex gap-2.5">
                <Link
                  href={`/mypage/delivery_address/change?addressId=${address?.id}`}
                >
                  <button className="w-[60px] h-[30px] px-2.5 border border-secondary rounded">
                    수정
                  </button>
                </Link>
                <button
                  className="w-[60px] h-[30px] px-2.5 border border-secondary rounded"
                  //   onClick={() => handleClickDelete(address?.id)}
                >
                  삭제
                </button>
                <button
                  className="w-[60px] h-[30px] px-2.5 border border-secondary rounded"
                  onClick={() =>
                    handleClickAddressChoice(
                      address?.recipient_name,
                      address?.phone,
                      address?.address,
                      address?.address_detail
                    )
                  }
                >
                  선택
                </button>
              </div>
            </div>
          ))}
        </div>
      </>
    );
  };

  return (
    <div className="w-[90%] h-[60%] p-6 sm:w-[500px] sm:h-[70%] sm:p-8  bg-white rounded overflow-scroll">
      {currentView === "list" && <ListAddress />}
      {currentView === "edit" && <EditAddress />}
      {currentView === "add" && <AddAddress />}
    </div>
  );
}
