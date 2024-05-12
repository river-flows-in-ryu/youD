"use client";
import React, { useEffect, useState } from "react";

import Container from "@/components/container";

import { useUserIdStore } from "@/app/store";
import { commonFetch } from "@/utils/commonFetch";

import Modal from "@/components/modal";
import CartDeleteModal from "@/components/cartDeleteModal";

import CartProductItem from "@/components/cartProductItem";

export default function Page() {
  const { userId } = useUserIdStore();

  const [totalCount, setTotalCount] = useState(0);
  const [cartItems, setCartItems] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(0);

  const [checkedItems, setCheckedItems] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      if (userId) {
        try {
          const res = await commonFetch(
            `${process.env.NEXT_PUBLIC_API_URL}/cart/${userId}`,
            "get"
          );
          if (res.Message === "SUCCESS") {
            setTotalCount(res.totalCount);
            const copyArray = structuredClone(res?.data);
            const addCheckedArray = copyArray?.map((item) => ({
              ...item,
              index: `${item?.product?.id}` + `${item?.size_attribute?.id}`,
            }));
            console.log(addCheckedArray);
            setCheckedItems(addCheckedArray?.map((item) => item?.index));
            setCartItems(addCheckedArray);
          }
        } catch (e) {
          console.log(e);
        }
      }
    };
    fetchData();
  }, [userId]);

  const handleClickDelete = (productId: number) => {
    setIsModalOpen(true);
    setSelectedProductId(productId);
  };

  const handleCheckboxChange = (index: string) => {
    setCheckedItems((checkedItems) => {
      if (checkedItems.includes(index)) {
        return checkedItems.filter((item) => item !== index);
      } else {
        return [...checkedItems, index];
      }
    });
  };

  const handleClickAllCheck = () => {
    if (checkedItems.length === totalCount) {
      setCheckedItems([]);
    } else {
      setCheckedItems(
        cartItems?.map(
          (item) => `${item?.product?.id}` + `${item?.size_attribute?.id}`
        )
      );
    }
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
        <input
          type="checkbox"
          className={`w-5 h-5 checked:bg-primary border border-[#ccc] checked:border-primary bg-[#fff] rounded-full mr-2.5 appearance-none checked:bg-checkedWhite 	`}
          onChange={handleClickAllCheck}
          checked={checkedItems.length === totalCount}
          style={{
            backgroundImage: "url('/check_white.png')",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            backgroundSize: "contain",
          }}
        />
        총 장바구니 갯수 <span className="text-primary">{totalCount}</span> 개
      </div>
      <div className="w-full h-2.5 bg-[#f2f2f2] " />
      <div className="w-full">
        <div className="w-full h-full px-[15px] pt-6 pb-5">
          {cartItems.map((item) => (
            <div key={`${item?.product?.id + item?.size_attribute?.id}`}>
              <CartProductItem
                item={item}
                handleClickDelete={handleClickDelete}
                checkedItems={checkedItems}
                handleCheckboxChange={handleCheckboxChange}
              />
            </div>
          ))}
        </div>
        <div className="w-full h-2.5 bg-[#f2f2f2] " />
      </div>
    </Container>
  );
}
