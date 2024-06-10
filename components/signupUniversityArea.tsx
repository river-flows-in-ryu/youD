import React from "react";

import Select from "react-select";

interface Props {
  universityOptions: { id: number; value: string; label: string }[];
  majorOptions: { id: number; value: string; label: string }[];
  university: number | null;
  major: number | null;
  setUniversity: (university: number) => void;
  setMajor: (major: number) => void;
}

interface SelectOption {
  id: number;
  label: string;
  value: string;
}

export default function SignupUniversityArea({
  universityOptions,
  majorOptions,
  university,
  major,
  setUniversity,
  setMajor,
}: Props) {
  console.log(university);
  return (
    <div>
      <div className="pt-4 pb-2">
        <label className="">대학교</label>
      </div>
      <div className={`mb-${university !== 0 ? "0" : "[30px]"}`}>
        <Select
          options={universityOptions}
          isClearable={true}
          placeholder="입력 혹은 선택해주세요"
          onChange={(target: SelectOption | null) => {
            if (target) {
              console.log(typeof target?.id);
              setUniversity(target?.id);
            }
          }}
          styles={{
            menu: (base) => ({ ...base, height: "100px", overflow: "auto" }),
          }}
        />
      </div>
      {university !== 0 ? (
        <div className="">
          <div className="pt-4 pb-2">
            <label className="">학과</label>
          </div>
          <div className="mb-[30px]">
            <Select
              options={majorOptions}
              isClearable={true}
              placeholder="입력 혹은 선택해주세요"
              onChange={(target: SelectOption | null) => {
                if (target) {
                  setMajor(target?.id);
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
