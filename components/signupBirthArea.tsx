import React from "react";

interface Props {
  year: string;
  setYear: (year: string) => void;
  month: string;
  setMonth: (month: string) => void;
  day: string;
  setDay: (day: string) => void;
  birthErrorMessage: string;
}
export default function SignupBirthArea({
  year,
  setYear,
  month,
  setMonth,
  day,
  setDay,
  birthErrorMessage,
}: Props) {
  return (
    <div>
      <div className="pt-4 pb-2">
        <label>
          생년월일
          <span className="text-red-500"> *</span>
        </label>
      </div>
      <div className="border border-[#cecece] h-[45px] w-full rounded">
        <div className="w-full flex px-5 h-[43px]">
          <div className="grow">
            <input
              className="w-full h-full text-center"
              placeholder="YYYY"
              type="number"
              value={year}
              onChange={(event) => setYear(event?.target?.value)}
            ></input>
          </div>
          <span className="leading-[43px]">년</span>
          <div className="grow">
            <input
              className="w-full h-full text-center"
              placeholder="MM"
              type="number"
              value={month}
              onChange={(event) => setMonth(event?.target?.value)}
            ></input>
          </div>
          <span className="leading-[43px]">월</span>
          <div className="grow">
            <input
              className="w-full h-full text-center"
              placeholder="DD"
              type="number"
              value={day}
              onChange={(event) => setDay(event?.target?.value)}
            ></input>
          </div>
          <span className="leading-[43px]">일</span>
        </div>
      </div>
      <div className="py-2.5">
        {birthErrorMessage && (
          <p className="text-red-500 text-sm">{birthErrorMessage}</p>
        )}
      </div>
    </div>
  );
}
