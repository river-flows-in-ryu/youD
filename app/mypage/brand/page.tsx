"use client";
import React, { useEffect, useRef, useState } from "react";

import Image from "next/image";
import { useRouter } from "next/navigation";

import Container from "@/components/container";
import { useUserIdStore } from "@/app/store";
import InputArea from "@/components/inputArea";

import image from "../../../public/image.png";
import { commonFetch } from "@/utils/commonFetch";
export default function Page() {
  const { userId } = useUserIdStore();

  const [brandName, setBrandName] = useState("");
  const [brandDescription, setBrandDescription] = useState("");

  const [brandImage, setBrandImage] = useState("");
  const [brandBGImage, setBrandBGImage] = useState("");

  const [isExist, setIsExist] = useState(false);

  const [brandImageFile, setBrandImageFile] = useState<File | null>(null);
  const [brandBGImageFile, setBrandBGImageFile] = useState<File | null>(null);

  const brandImageRef = useRef<HTMLInputElement>(null);
  const brandBGImageRef = useRef<HTMLInputElement>(null);

  const router = useRouter();

  useEffect(() => {
    async function fetchUserData() {
      const res = await commonFetch(
        `${process.env.NEXT_PUBLIC_API_URL}/brand_info/${userId}`,
        "get"
      );
      setIsExist(res?.is_exist);
      setBrandName(res?.brand_info?.name);
      setBrandDescription(res?.brand_info?.description);
      setBrandImage(res?.brand_info?.image);
      setBrandBGImage(res?.brand_info?.bg_image);
    }
    if (userId) {
      fetchUserData();
    }
  }, [userId]);

  function handleChangeImage(imageRef: React.RefObject<HTMLInputElement>) {
    if (imageRef.current && imageRef.current.files) {
      const img = imageRef.current.files[0];
      const reader = new FileReader();

      reader.onload = () => {
        if (imageRef === brandImageRef) {
          setBrandImage(reader.result as string);
          setBrandImageFile(img);
        } else {
          setBrandBGImage(reader.result as string);
          setBrandBGImageFile(img);
        }
      };
      reader.readAsDataURL(img);
    }
  }

  async function handleSubmit() {
    let method = "post";

    if (isExist) {
      method = "put";
    }

    {
      try {
        let url = `${process.env.NEXT_PUBLIC_API_URL}/brand_info`;
        if (isExist) {
          url += `/${userId}`;
        }

        const formData = new FormData();
        if (!isExist) {
          formData.append("user_id", String(userId));
        }
        formData.append("name", brandName);
        formData.append("description", brandDescription);

        if (brandImageFile instanceof File || brandImageFile === null) {
          formData.append("image", brandImageFile ?? "");
        } else {
          formData.append("image", brandImage);
        }

        if (brandBGImageFile instanceof File || brandBGImageFile === null) {
          formData.append("bg_image", brandBGImageFile ?? "");
        } else {
          formData.append("bg_image", brandBGImage);
        }

        const res = await fetch(url, {
          method: method,
          body: formData,
        });
        if (res.status === 200) {
          const response = await res.json();
          if (response.Message === "SUCCESS") {
            router?.push("/mypage");
          }
        }
      } catch (error) {
        if (error instanceof Error) {
          alert(error?.message);
        }
      }
    }
  }

  return (
    <Container>
      <div className="sm:w-[650px] sm:mx-auto">
        <h2 className="text-center font-bold py-5 text-lg	">브랜드 정보 변경</h2>
        <div className="px-5">
          <InputArea
            text="브랜드 이름"
            placeholder="브랜드 이름을 입력해주세요"
            isRequired={false}
            type="text"
            setState={setBrandName}
            state={brandName}
          />
          <InputArea
            text="브랜드 설명"
            placeholder="브랜드를 간략히 설명해주세요"
            isRequired={false}
            type="text"
            setState={setBrandDescription}
            state={brandDescription}
          />
          <div className="flex  justify-between mb-10">
            <label htmlFor="brandImage" className="cursor-pointer">
              <div className="btn-upload ">
                <div className="w-5 h-5">
                  <Image src={image} alt="add" />
                </div>
              </div>
              <input
                type="file"
                id="brandImage"
                className="hidden"
                ref={brandImageRef}
                onChange={() => handleChangeImage(brandImageRef)}
              />
            </label>
            <div className="w-[200px] h-[200px] rounded-[50%] relative">
              {brandImage && (
                <Image
                  src={brandImage}
                  alt="브랜드 이미지"
                  fill
                  style={{ objectFit: "contain", borderRadius: "50%" }}
                />
              )}
            </div>
          </div>
          <div className="flex justify-between mb-10">
            <label htmlFor="brandBGImage" className="cursor-pointer">
              <div className="btn-upload ">
                <div className="w-5 h-5">
                  <Image src={image} alt="add" />
                </div>
              </div>
              <input
                type="file"
                id="brandBGImage"
                className="hidden"
                ref={brandBGImageRef}
                onChange={() => handleChangeImage(brandBGImageRef)}
              />
            </label>
            <div className="w-[250px] h-[65px] relative">
              {brandBGImage && (
                <Image
                  src={brandBGImage}
                  alt="브랜드 이미지"
                  fill
                  style={{ objectFit: "contain" }}
                />
              )}
            </div>
          </div>
        </div>
        <div className="flex justify-center">
          <button
            className="bg-primary text-white w-[150px] h-[60px] rounded"
            onClick={handleSubmit}
          >
            등록하기
          </button>
        </div>
      </div>
    </Container>
  );
}
