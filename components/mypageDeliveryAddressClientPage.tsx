"use client";
import React, { useState } from "react";

import masking from "@/utils/masking";
import Link from "next/link";

import Modal from "./modal";

import { useUserIdStore } from "@/app/store";
import UserAddressDeleteModal from "./userAddressDeleteModal";

interface Props {
  addressData: DeliveryAddress[];
}

interface DeliveryAddress {
  id: number;
  address_label: string;
  recipient_name: string;
  address: string;
  address_detail: string;
  phone: string;
  is_default: boolean;
  user: number;
}
export default function MypageDeliveryAddressClientPage({
  addressData,
}: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSelectedAddressId, setIsSelectedAddressId] = useState<number>(0);

  const { userId } = useUserIdStore();

  async function handleClickDelete(id: number) {
    setIsModalOpen(true);
    setIsSelectedAddressId(id);
  }

  return (
    <div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <UserAddressDeleteModal
          onClose={() => setIsModalOpen(false)}
          userId={userId}
          addressId={isSelectedAddressId}
        />
      </Modal>
      <div className="flex justify-between px-5 sm:px-0">
        <h2 className=" font-bold text-xl py-5 sm:px-5 ">주소관리</h2>
        <div className="sm:hidden my-auto">
          <Link href="/mypage/delivery_address/add">
            <button className=" border border-primary px-[10px] py-1 rounded text-primary">
              추가하기
            </button>
          </Link>
        </div>
      </div>
      {addressData?.map((address) => (
        <div key={address?.id} className="px-[25px] py-[15px]">
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
            {!address?.is_default && (
              <button
                className="w-[60px] h-[30px] px-2.5 border border-secondary rounded"
                onClick={() => handleClickDelete(address?.id)}
              >
                삭제
              </button>
            )}
          </div>
        </div>
      ))}
      <Link href="/mypage/delivery_address/add">
        <button className="w-full h-10 border border-secondary text-primary rounded mt-10 mx-5 hidden sm:block">
          + 배송지 추가하기
        </button>
      </Link>
    </div>
  );
}
