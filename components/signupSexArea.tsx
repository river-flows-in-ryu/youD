import React from "react";

interface Props {
  selectedSexOption: string;
  handleOptionChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function SignupSexArea({
  selectedSexOption,
  handleOptionChange,
}: Props) {
  return (
    <>
      <div className="pt-4 pb-2">
        <label className="">성별</label>
      </div>
      <div className="flex w-full">
        <div className="w-1/2 text-center">
          <input
            type="radio"
            value="M"
            checked={selectedSexOption === "M"}
            onChange={handleOptionChange}
            className=" checked:bg-primary"
          />
          <label>남자</label>
        </div>
        <div className="w-1/2 text-center">
          <input
            type="radio"
            value="F"
            checked={selectedSexOption === "F"}
            onChange={handleOptionChange}
          />
          <label>여자</label>
        </div>
      </div>
    </>
  );
}
