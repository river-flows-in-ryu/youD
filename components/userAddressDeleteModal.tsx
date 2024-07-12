import React from "react";

import { commonFetch } from "@/utils/commonFetch";

interface Props {
  onClose: () => void;
  addressId: number;
  userId: number;
}

export default function UserAddressDeleteModal({
  onClose,
  addressId,
  userId,
}: Props) {
  async function handleClickDelete() {
    try {
      if (userId && addressId) {
        const res = await commonFetch(
          `${process.env.NEXT_PUBLIC_API_URL}/user/address/${userId}/${addressId}`,
          "delete"
        );
        if (res?.message === "SUCCESS") {
          window.location.href = "/mypage/delivery_address";
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      }
    }
  }

  return (
    <div className="w-[90%] h-[300px] p-6 sm:w-[450px] sm:h-[300px] sm:p-8  bg-white rounded text-center">
      <p className="mt-6 mb-11">주소를 삭제하시겠습니까?</p>
      <button
        className=" w-full h-12 border bg-primary text-white rounded weight-bold  mb-[30px]"
        onClick={handleClickDelete}
      >
        삭제하기
      </button>
      <button
        className="
        w-full h-12 border border-primary rounded text-primary weight-bold"
        onClick={onClose}
      >
        닫기
      </button>
    </div>
  );
}
