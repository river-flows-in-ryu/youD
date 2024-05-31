import React, { useEffect, useState } from "react";

import Image from "next/image";

import { Rate } from "antd";

import { commonFetch } from "@/utils/commonFetch";

import changeDateType from "@/utils/changeDateType";

interface Props {
  slug: string;
  imageReviewCount: number;
  nomalReviewCount: number;
  productImageUrl: string;
}

interface ReviewItems {
  id: number;
  created_at: string;
  updated_at: string;
  user_name: string;
  product_name: string;
  size_attribute_name: string;
  rating: number;
  comment: string;
  images: ReviewImages[];
}
interface ReviewImages {
  id: number;
  image: string;
}

export default function ReviewListDetail({
  slug,
  imageReviewCount,
  nomalReviewCount,
  productImageUrl,
}: Props) {
  const [reviewType, setReviewType] = useState("image");
  const [reviewArray, setReivewArray] = useState([]);

  useEffect(() => {
    async function fecthReviewData() {
      try {
        const res = await commonFetch(
          `${process.env.NEXT_PUBLIC_API_URL}/reviews/${slug}/?type=${reviewType}&offset=0&limit=10`,
          "get"
        );
        setReivewArray(res.reviews);
      } catch (error) {
        if (error instanceof Error) {
          alert(error);
        }
      }
    }
    fecthReviewData();
  }, [reviewType, slug]);
  console.log(reviewArray);
  return (
    <div>
      <div className="px-[15px] mt-5 ">
        <div className="w-full h-10 flex  bg-white z-10 ">
          <button
            className={`grow  border  border-[#f2f2f2] rounded ${
              reviewType === "image" ? "" : "bg-[#f2f2f2]"
            }`}
            onClick={() => setReviewType("image")}
          >
            상품 사진{" "}
            <span className="text-primary">{imageReviewCount || 0}</span>
          </button>
          <button
            className={`grow  border  border-[#f2f2f2] rounded ${
              reviewType === "nomal" ? "" : "bg-[#f2f2f2]"
            }`}
            onClick={() => setReviewType("nomal")}
          >
            일반 <span className="text-primary">{nomalReviewCount || 0}</span>
          </button>
        </div>
        <div className="pt-5">
          <div className="w-full">
            {reviewArray?.map((review: ReviewItems) => {
              return (
                <div key={review?.id}>
                  <div className="flex justify-between">
                    <div className="font-bold">{review?.user_name}</div>
                    <div className="text-xs text-[#cecece]">
                      {changeDateType(review?.created_at)}
                    </div>
                  </div>
                  <div className="flex gap-2.5 pl-10">
                    <Image
                      src={productImageUrl}
                      alt={productImageUrl}
                      width={45}
                      height={50}
                    />
                    <div className="flex flex-col">
                      <span>{review?.product_name}</span>
                      <span>{review?.size_attribute_name}</span>
                      <Rate
                        defaultValue={5}
                        value={review?.rating}
                        style={{ color: "#77C497", fontSize: "14px" }}
                        className=""
                      />
                    </div>
                  </div>
                  <div className="pl-10 max-h-auto overflow-hidden	">
                    {review?.comment}
                  </div>
                  <div className="pl-10">
                    <div className="flex justify-center gap-5">
                      {review.images &&
                        review?.images?.map((reviewIamge) => {
                          return (
                            <div
                              key={reviewIamge?.id}
                              className="rounded w-[50%] h-[175px] relative"
                            >
                              <Image
                                src={reviewIamge?.image}
                                fill
                                style={{
                                  objectFit: "cover",
                                  borderRadius: "15px",
                                }}
                                alt={reviewIamge?.image}
                              ></Image>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
