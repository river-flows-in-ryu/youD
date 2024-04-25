import React from "react";

interface Props {
  phone1: string;
  setPhone1: (phone1: string) => void;
  phone2: string;
  setPhone2: (phone2: string) => void;
  phone3: string;
  setPhone3: (phone3: string) => void;
  phoneErrorMessage: string;
}
export default function SignupPhoneArea({
  phone1,
  setPhone1,
  phone2,
  setPhone2,
  phone3,
  setPhone3,
  phoneErrorMessage,
}: Props) {
  return (
    <div>
      <div className="pt-4 pb-2 w-full">
        <label>
          휴대폰
          <span className="text-red-500"> *</span>
        </label>
      </div>
      <div className="w-full flex h-[45px] gap-3">
        <div className="grow border border-[#dedede] w-1/3">
          <input
            className="w-full h-[43px] text-center"
            type="number"
            placeholder="010"
            value={phone1}
            onChange={(e) => setPhone1(e.target.value)}
          />
        </div>
        <div className="grow border border-[#dedede] w-1/3">
          <input
            className="w-full h-[43px] text-center"
            type="number"
            placeholder="1234"
            value={phone2}
            onChange={(e) => setPhone2(e.target.value)}
          />
        </div>
        <div className="grow border border-[#dedede] w-1/3">
          <input
            className="w-full h-[43px] text-center"
            type="number"
            placeholder="5678"
            value={phone3}
            onChange={(e) => setPhone3(e.target.value)}
          />
        </div>
      </div>
      <div className="py-2.5">
        {phoneErrorMessage && (
          <p className="text-red-500 text-sm">{phoneErrorMessage}</p>
        )}
      </div>
    </div>
  );
}
