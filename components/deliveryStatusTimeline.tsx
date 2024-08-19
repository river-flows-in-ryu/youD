import React from "react";

import Image from "next/image";

import waitDelivery from "@/public/wait_delivery.png";
import waitDeliveryColor from "@/public/wait_delivery_color.png";

import progressDelivery from "@/public/progress_delivery.png";
import progressDeliveryColor from "@/public/progress_delivery_color.png";

import completeDelivery from "@/public/complete_delivery.png";
import completeDeliveryColor from "@/public/complete_delivery_color.png";

export default function DeliveryStatusTimeline({
  arrayLength,
  status,
}: {
  arrayLength: number;
  status: string;
}) {
  return (
    <div className="flex text-center my-5">
      <div className="w-[20%]">
        <div className="flex justify-center">
          {arrayLength === 0 ? (
            <Image
              src={waitDeliveryColor}
              alt="배송대기이미지"
              width={30}
              height={30}
            />
          ) : (
            <Image
              src={waitDelivery}
              alt="배송대기이미지"
              width={30}
              height={30}
            />
          )}
        </div>
        <p
          className={`${arrayLength === 0 ? "text-primary" : "text-secondary"} font-bold mt-[10px]`}
        >
          배송 대기
        </p>
      </div>
      <div className="w-[20%] flex items-center justify-center">
        <hr className="border-1 w-full" />
      </div>
      <div className="w-[20%]">
        <div className="flex justify-center">
          {arrayLength !== 0 && status !== "DELIVERED" ? (
            <Image
              src={progressDeliveryColor}
              alt="배송대기이미지"
              width={30}
              height={30}
            />
          ) : (
            <Image
              src={progressDelivery}
              alt="배송대기이미지"
              width={30}
              height={30}
            />
          )}
        </div>
        <p
          className={`${arrayLength !== 0 && status !== "DELIVERED" ? "text-primary" : "text-secondary"} font-bold mt-[10px]`}
        >
          배송 중
        </p>
      </div>
      <div className="w-[20%] flex items-center justify-center">
        <hr className="border-1 w-full" />
      </div>
      <div className="w-[20%]">
        <div className="flex justify-center">
          <Image
            src={completeDeliveryColor}
            alt="배송대기이미지"
            width={30}
            height={30}
          />
        </div>
        <p
          className={`${status === "DELIVERED" ? "text-primary" : "text-secondary"} font-bold mt-[10px]`}
        >
          배송 완료
        </p>
      </div>
    </div>
  );
}
