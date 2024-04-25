import React from "react";

import Image from "next/image";

import { useDaumPostcodePopup } from "react-daum-postcode";

import search from "../public/search.png";

interface Props {
  address: string;
  setAddress: (address: string) => void;
}

export default function SignupAddressArea({ address, setAddress }: Props) {
  const CURRENT_URL =
    "https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
  const open = useDaumPostcodePopup(CURRENT_URL);

  const handleComplete = (data: any) => {
    let fullAddress = data.address;
    let extraAddress = "";

    if (data.addressType === "R") {
      if (data.bname !== "") {
        extraAddress += data.bname;
      }
      if (data.buildingName !== "") {
        extraAddress +=
          extraAddress !== "" ? `, ${data.buildingName}` : data.buildingName;
      }
      fullAddress += extraAddress !== "" ? ` (${extraAddress})` : "";
    }

    setAddress(fullAddress);
  };

  const handleClick = () => {
    open({ onComplete: handleComplete });
  };

  return (
    //
    <div>
      <div className="pt-4 pb-2">
        <label>
          주소
          <span className="text-red-500"> *</span>
        </label>
      </div>
      <div className="flex w-full relative">
        <input
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          onClick={handleClick}
          className="h-[45px] w-full flex-1 border border-[#dedede] rounded pl-4 pr-10 relative"
          placeholder="도로명,지번,건물명 검색"
        ></input>
        <Image
          src={search}
          alt="검색"
          className="absolute right-3 top-3 w-5 h-5 leading-[45px]"
          onClick={handleClick}
        />
      </div>
    </div>
  );
}
