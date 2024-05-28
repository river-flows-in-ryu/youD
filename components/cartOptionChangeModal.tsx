import React, { useEffect, useState } from "react";

import Image from "next/image";
import { Select } from "antd";

import close from "../public/close.png";
import { commonFetch } from "@/utils/commonFetch";
import { useUserIdStore } from "@/app/store";

interface Props {
  onClose: () => void;
  previousProductId: number;
  previousOptionId: number;
  previousQuantiry: number;
  setRefreshFlag: (value: boolean) => void;
  refreshFlag: boolean;
}

interface Option {
  id: number;
  size: {
    name: string;
  };
}

interface SizeOption {
  id: number;
  label: string;
  value: string;
}

export default function CartOptionChangeModal({
  onClose,
  previousProductId,
  previousOptionId,
  previousQuantiry,
  setRefreshFlag,
  refreshFlag,
}: Props) {
  const { userId } = useUserIdStore();

  const [currentOptionId, setCurrentOptionId] = useState(previousOptionId);
  const [currentQuantity, setCurrentQuantity] = useState(previousQuantiry);

  const [option, setOption] = useState([]);

  const payload = {
    userId: userId,
    productId: previousProductId,
    previousOptionId: previousOptionId,
    previousQuantiry: previousQuantiry,
    currentOptionId: currentOptionId,
    currentQuantity: currentQuantity,
  };

  useEffect(() => {
    async function fetchData() {
      if (previousProductId) {
        try {
          const res = await commonFetch(
            `${process.env.NEXT_PUBLIC_API_URL}/option_list/${previousProductId}`,
            "get"
          );
          const optionData = res.map((option: Option) => ({
            id: option.id,
            value: option?.size?.name,
            label: option?.size?.name,
          }));
          setOption(optionData);
        } catch (error) {
          if (error instanceof Error) {
            alert(error.message);
          }
        }
      }
    }
    fetchData();
  }, [previousProductId]);

  const initialValue: SizeOption[] = option?.filter(
    (option: SizeOption) => option?.id === previousOptionId
  );

  function handleChange(value: string) {
    const changeOption: SizeOption[] = option?.filter(
      (option: SizeOption) => option?.label === value
    );
    setCurrentOptionId(changeOption[0]?.id);
  }

  async function handleSubmit() {
    try {
      const res = await commonFetch(
        `${process.env.NEXT_PUBLIC_API_URL}/cart`,
        "PATCH",
        payload
      );
      if (res.Message === "SUCCESS") {
        onClose();
        setRefreshFlag(!refreshFlag);
      }
    } catch (error) {
      if (error instanceof Error) {
        alert(error);
      }
    }
  }

  return (
    <div className="w-[90%] h-[300px] p-6 sm:w-[450px] sm:h-[300px] sm:p-8  bg-white rounded text-center">
      <div className="flex justify-end">
        <Image src={close} alt="closeButton" onClick={onClose} />
      </div>
      <p className="mt-6 mb-5 text-xl font-bold">옵션 변경페이지</p>
      <div className="mb-4">
        {initialValue[0]?.label ? (
          <Select
            options={option}
            defaultValue={initialValue[0]?.label || ""}
            className="w-full h-[50px]"
            onChange={handleChange}
          />
        ) : null}
      </div>

      <div className="flex w-full justify-center mb-5">
        <button
          className="w-[25px] h-[25px] bg-[#f2f2f2] "
          onClick={() => setCurrentQuantity(currentQuantity - 1)}
          disabled={currentQuantity === 1}
        >
          -
        </button>
        <div className="w-10 h-[25px]">{currentQuantity}</div>
        <button
          className="w-[25px] h-[25px] bg-[#f2f2f2]"
          onClick={() => setCurrentQuantity(currentQuantity + 1)}
        >
          +
        </button>
      </div>
      <div className="flex w-full justify-center gap-3">
        <button
          onClick={onClose}
          className="w-[135px] h-10 border border-[#f2f2f2] rounded bg-[#f2f2f2]"
        >
          취소
        </button>
        <button
          onClick={handleSubmit}
          className="w-[135px] h-10 border border-primary rounded bg-primary text-white"
        >
          변경
        </button>
      </div>
    </div>
  );
}
