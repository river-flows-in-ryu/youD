import React, { useEffect, useState, ChangeEvent } from "react";

import Image from "next/image";
import { Select } from "antd";

import HorizontalLine from "./horizontalLine";
import Modal from "./modal";

import UseHandleClickDrawer from "@/hooks/useHandleClickDrawer";

import arrowUp from "../public/arrow_up.png";
import arrowDown from "../public/arrow_down_bold.png";
import { commonFetch } from "@/utils/commonFetch";

import { useUserIdStore } from "@/app/store";
import UserAddressChoiceModal from "./userAddressChoiceModal";

interface Address {
  address: string;
  address_detail: string;
  address_label: string | null;
  id: number;
  is_default: boolean;
  phone: string;
  recipient_name: string;
}

export default function CheckoutAddressSections() {
  const { isOpen, handleClickDrawerChange } = UseHandleClickDrawer();

  const [userAddressData, setUserAddressData] = useState<Address[]>([]);

  const [isTextareaOpen, setIsTextareaOpen] = useState(false);

  const [deliveryMemoType, setDeliveryMemoType] = useState<string | null>(null);
  const [deliveryMemo, setDeliveryMemo] = useState<string | null>(null);

  const [deliveryName, setDeliveryName] = useState<string>();
  const [deliveryPhone, setDeliveryPhone] = useState<string>();
  const [deliveryAddress, setDeliveryAddress] = useState<string>();
  const [deliveryAddressDetail, setDeliveryAddressDetail] = useState<string>();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const { userId } = useUserIdStore();

  useEffect(() => {
    const fetchData = async () => {
      if (userId) {
        const res = await commonFetch(
          `${process.env.NEXT_PUBLIC_API_URL}/user/address/${userId}`,
          "get"
        );
        setUserAddressData(res?.userAddress);
      }
    };
    fetchData();
  }, [userId]);

  useEffect(() => {
    setDeliveryName(userAddressData[0]?.recipient_name);
    setDeliveryPhone(userAddressData[0]?.phone);
    setDeliveryAddress(userAddressData[0]?.address);
    setDeliveryAddressDetail(userAddressData[0]?.address_detail);
  }, [userAddressData]);

  function handleSelectChange(value: string) {
    if (value !== "직접 입력") {
      setIsTextareaOpen(false);
      setDeliveryMemo(value);
      setDeliveryMemoType(value);
    } else {
      setDeliveryMemo("");
      setIsTextareaOpen(true);
      setDeliveryMemoType("직접 입력");
    }
  }

  const options = [
    {
      value: "부재 시 경비실에 맡겨주세요",
      label: "부재 시 경비실에 맡겨주세요",
    },
    {
      value: "부재 시 택배함에 넣어주세요",
      label: "부재 시 택배함에 넣어주세요",
    },
    { value: "부재 시 입 앞에 놔주세요", label: "부재 시 입 앞에 놔주세요" },
    { value: "배송 전 연락 바랍니다.", label: "배송 전 연락 바랍니다." },
    {
      value: "파손의 위험이 있는 상품입니다. 주의 부탁드립니다.",
      label: "파손의 위험이 있는 상품입니다. 주의 부탁드립니다.",
    },
    { value: "직접 입력", label: "직접 입력" },
  ];

  function handleTextareaChange(event: ChangeEvent<HTMLTextAreaElement>) {
    setDeliveryMemo(event?.target?.value);
  }

  return (
    <div className="">
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <UserAddressChoiceModal
          onClose={() => setIsModalOpen(false)}
          userAddressData={userAddressData}
          setDeliveryName={setDeliveryName}
          setDeliveryPhone={setDeliveryPhone}
          setDeliveryAddress={setDeliveryAddress}
          setDeliveryAddressDetail={setDeliveryAddressDetail}
        />
      </Modal>
      {isOpen ? (
        <div
          className="flex w-full px-5 justify-between"
          onClick={handleClickDrawerChange}
        >
          <div className=" font-bold text-xl py-5 ">배송지</div>
          <div className="flex gap-5">
            <div className="leading-[68px] text-sm flex">
              <span className="">{deliveryName} |</span> &nbsp;
              <span className="max-w-[175px] truncate">{deliveryAddress}</span>
            </div>
            <div className="relative w-5 h-5 mt-[25px] cursor-pointer">
              <Image
                src={arrowDown}
                alt="drawerOpen"
                fill
                style={{ objectFit: "contain" }}
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="mb-5">
          <div
            className="flex w-full px-5 justify-between"
            onClick={handleClickDrawerChange}
          >
            <div className=" font-bold text-xl py-5 ">배송지</div>
            <div className="relative w-5 h-5 mt-[25px] cursor-pointer">
              <Image
                src={arrowUp}
                alt="drawerClose"
                fill
                style={{ objectFit: "contain" }}
              />
            </div>
          </div>
          <div className="px-5 flex flex-col mb-[10px]">
            <div className="flex justify-end">
              <button
                className="text-primary underline underline-offset-1 text-sm font-bold"
                onClick={() => setIsModalOpen(true)}
              >
                주소지 변경
              </button>
            </div>
            <span>{deliveryName}</span>
            <span>{deliveryPhone}</span>
            <span>
              {deliveryAddress}
              {deliveryAddressDetail}
            </span>
          </div>
          <div className="px-5 ">
            <Select
              placeholder="배송 요청사항을 선택해주세요"
              className="w-full h-10 mb-2.5"
              onChange={handleSelectChange}
              options={options}
              value={deliveryMemoType}
            />
            {isTextareaOpen && (
              <textarea
                onChange={handleTextareaChange}
                className="resize-none	border border-secondary w-full px-2.5 py-3 h-[180px]"
                value={deliveryMemo || ""}
              />
            )}
          </div>
        </div>
      )}
      <HorizontalLine />
    </div>
  );
}
