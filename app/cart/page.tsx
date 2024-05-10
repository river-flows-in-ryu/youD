"use client";
import React, { useEffect, useState } from "react";

import Image from "next/image";

import Container from "@/components/container";

import { useUserIdStore } from "@/app/store";
import { commonFetch } from "@/utils/commonFetch";
import Link from "next/link";

import close from "../../public/close.png";
import Modal from "@/components/modal";
import CartDeleteModal from "@/components/cartDeleteModal";

export default function Page() {
  const { userId } = useUserIdStore();

  const [totalCount, setTotalCount] = useState(0);
  const [cartItems, setCartItems] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(0);

  console.log(cartItems);

  useEffect(() => {
    const fetchData = async () => {
      if (userId) {
        const res = await commonFetch(
          `${process.env.NEXT_PUBLIC_API_URL}/cart/${userId}`,
          "get"
        );
        if (res.Message === "SUCCESS") {
          setTotalCount(res.totalCount);
          setCartItems(res.data);
        }
      }
    };
    fetchData();
  }, [userId]);

  const handleClickDelete = (productId: number) => {
    setIsModalOpen(true);
    setSelectedProductId(productId);
  };

  return (
    <Container>
      <Modal
        isOpen={isModalOpen}
        onClose={setIsModalOpen}
        children={<CartDeleteModal productId={selectedProductId} />}
      />
      <div className="w-full h-2.5 bg-[#f2f2f2] " />
      <div className=" w-full h-10 bg-white text-center leading-10">
        총 장바구니 갯수 <span className="text-primary">{totalCount}</span> 개
      </div>
      <div className="w-full h-2.5 bg-[#f2f2f2] " />
      <div className="w-full">
        <div className="w-full h-full px-[15px] pt-6 pb-5">
          {cartItems.map((item, index) => (
            <div key={index} className="flex mb-5">
              <button className="w-5 h-5 mr-2.5">v</button>
              <div className="w-[70px] ">
                <Link href={`/goods/${item?.product?.id}`}>
                  <Image
                    src={item?.product?.image_url}
                    alt=""
                    width={100}
                    height={100}
                  />
                </Link>
              </div>
              <div className="ml-2.5 w-[calc(100%-110px)]">
                <div className="flex justify-between">
                  <div className="flex flex-col leading-[18px]  w-[calc(100%-20px)]">
                    {/* todo */}
                    <Link href={`/goods/${item?.product?.id}`}>
                      <span className="text-xs">
                        {item?.product?.user?.username}
                      </span>
                    </Link>
                    <Link href={`/goods/${item?.product?.id}`}>
                      <span className=" font-bold text-xs line-clamp-1	">
                        {item?.product?.productName}
                      </span>
                    </Link>
                  </div>
                  <button
                    className="w-5 h-5"
                    onClick={() => handleClickDelete(item?.product?.id)}
                  >
                    <Image src={close} alt="close" width={20} height={20} />
                  </button>
                </div>
                <div className="flex justify-between text-xs text-[#6e6e6e]">
                  <span>
                    수량 {item?.quantity} | {item?.size_attribute?.size?.name}
                  </span>
                  <span className="line-through">
                    {item?.product?.OriginPrice?.toLocaleString()}원
                  </span>
                </div>
                <div className="flex justify-between mt-1 ">
                  <button className="border border-secondary text-sm px-2.5">
                    옵션/수량
                  </button>
                  <span className="text-bold text-black">
                    {item?.product?.discountPrice?.toLocaleString()}원
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="w-full h-2.5 bg-[#f2f2f2] " />
      </div>
    </Container>
  );
}
