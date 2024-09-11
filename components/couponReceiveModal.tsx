import React from "react";

import Image from "next/image";

import close from "@/public/close.png";

interface ProductCoupon {
  id: number;
  is_redeemed: boolean;
  name: string;
  discount_type: string;
  discount_value: string;
  min_purchase: number;
  max_discount: number;
  valid_from: string;
  valid_to: string;
}

interface Props {
  onClose: () => void;
  productCouponsdata: ProductCoupon[];
  discountPrice: number;
}
export default function CouponReceiveModal({
  onClose,
  productCouponsdata,
  discountPrice,
}: Props) {
  console.log(productCouponsdata[0]?.valid_from);
  return (
    <div className="w-[90%] h-[60%] p-6 sm:w-[450px] sm:h-[50%] sm:p-8  bg-white rounded text-center">
      <div className="text-center mb-5 text-xl font-bold relative ">
        <Image
          src={close}
          width={20}
          height={20}
          alt="close_img"
          className="absolute right-0 mt-1 cursor-pointer"
          onClick={onClose}
        />
        쿠폰 받기
      </div>
      {productCouponsdata?.map((coupon) => {
        const { id, name, discount_type, discount_value, max_discount } =
          coupon;
        return (
          <ul key={id}>
            <li>
              <div className="flex-coll text-left border border-secondary pl-2.5 py-[15px] relative">
                <p className="text-red-500">
                  {discount_type === "fixed"
                    ? max_discount !== null &&
                      Number(discount_value) > max_discount
                      ? max_discount.toLocaleString()
                      : Number(discount_value).toLocaleString()
                    : max_discount !== null &&
                        discountPrice * (100 - Number(discount_value)) >
                          max_discount
                      ? max_discount.toLocaleString()
                      : (
                          discountPrice *
                          (100 - Number(discount_value))
                        ).toLocaleString()}
                  원
                </p>
                <p>{name}</p>
                {<p></p>}
                <div className="absolute top-0 right-0 h-full">zz</div>
              </div>
            </li>
          </ul>
        );
      })}
    </div>
  );
}
