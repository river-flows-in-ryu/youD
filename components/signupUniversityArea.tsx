import React from "react";

import Select from "react-select";

interface Props {
  universityOptions: { value: string; label: string }[];
  majorOptions: { value: string; label: string }[];
  university: string;
  major: string;
  setUniversity: (university: string) => void;
  setMajor: (major: string) => void;
}

export default function SignupUniversityArea({
  universityOptions,
  majorOptions,
  university,
  major,
  setUniversity,
  setMajor,
}: Props) {
  return (
    <div>
      <div className="pt-4 pb-2">
        <label className="">대학교</label>
      </div>
      <div className={`mb-${university !== "" ? "0" : "[30px]"}`}>
        <Select
          options={universityOptions}
          isClearable={true}
          placeholder="입력 혹은 선택해주세요"
          onChange={(value) => {
            if (value) {
              setUniversity(value?.id);
            }
          }}
          styles={{
            menu: (base) => ({ ...base, height: "100px", overflow: "auto" }),
          }}
        />
      </div>
      {university !== "" ? (
        <div className="">
          <div className="pt-4 pb-2">
            <label className="">학과</label>
          </div>
          <div className="mb-[30px]">
            <Select
              options={majorOptions}
              isClearable={true}
              placeholder="입력 혹은 선택해주세요"
              onChange={(value) => {
                if (value) {
                  setMajor(value?.id);
                }
              }}
              styles={{
                menu: (base) => ({
                  ...base,
                  height: "100px",
                  overflow: "auto",
                }),
              }}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}
