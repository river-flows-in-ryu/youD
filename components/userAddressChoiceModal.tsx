"use client";
import React, { useState } from "react";

import Link from "next/link";
import Image from "next/image";

import { nameMasking } from "@/utils/masking";
import { commonFetch } from "@/utils/commonFetch";

import close from "../public/close.png";

import { useUserIdStore } from "@/app/store";
interface Address {
  address: string;
  address_detail: string;
  address_label: string | null;
  id: number;
  is_default: boolean;
  phone: string;
  recipient_name: string;
}

interface DeliveryDetails {
  deliveryName: string;
  deliveryPhone: string;
  deliveryAddress: string;
  deliveryAddressDetail: string;
  deliveryMemoType: string;
  deliveryMemo: string;
}

interface Props {
  onClose: () => void;
  userAddressData: Address[];
  setDeliveryDetails: React.Dispatch<React.SetStateAction<DeliveryDetails>>;
  setRefreshFlag: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function UserAddressChoiceModal({
  onClose,
  userAddressData,
  setDeliveryDetails,
  setRefreshFlag,
}: Props) {
  function handleClickAddressChoice(
    name: string,
    phone: string,
    address: string,
    addressDetail: string
  ) {
    setDeliveryDetails((prev: any) => ({
      ...prev,
      deliveryName: name,
      deliveryPhone: phone,
      deliveryAddress: address,
      deliveryAddressDetail: addressDetail,
    }));
    onClose();
  }

  const { userId } = useUserIdStore();

  async function handleClickDelete(addressId: number) {
    if (confirm("제출하시겠습니까?")) {
      try {
        if (userId && addressId) {
          const res = await commonFetch(
            `${process.env.NEXT_PUBLIC_API_URL}/user/address/${userId}/${addressId}`,
            "delete"
          );
          if (res?.message === "SUCCESS") {
            setRefreshFlag((prev) => !prev);
          }
        }
      } catch (error) {
        if (error instanceof Error) {
          alert(error.message);
        }
      }
    } else {
      return;
    }
  }

  return (
    <div className="w-[90%] h-[60%] p-6 sm:w-[500px] sm:h-[70%] sm:p-8  bg-white rounded overflow-scroll">
      <div className="text-center mb-5 text-xl font-bold relative ">
        <Image
          src={close}
          width={20}
          height={20}
          alt="close_img"
          className="absolute right-0 mt-1 cursor-pointer"
          onClick={onClose}
        />
        주소지 선택
      </div>
      <Link href="/mypage/delivery_address/add?redirectTo=/checkout">
        <button className="w-full py-2.5 border border-secondary mb-2.5">
          + 주소 추가하기
        </button>
      </Link>
      <div className="">
        {userAddressData?.map((address) => (
          <div key={address?.id} className=" py-[15px]">
            <div className="flex gap-1 font-bold mb-1.5">
              <span>{nameMasking(address?.recipient_name)}</span>
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
                href={`/mypage/delivery_address/change?addressId=${address?.id}&redirectTo=/checkout`}
              >
                <button className="w-[60px] h-[30px] px-2.5 border border-secondary rounded">
                  수정
                </button>
              </Link>
              {!address?.is_default && (
                <button
                  className="w-[60px] h-[30px] px-2.5 border border-secondary rounded"
                  onClick={() => handleClickDelete(address?.id)}
                >
                  삭제
                </button>
              )}
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
    </div>
  );
}
