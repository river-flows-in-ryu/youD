import React from "react";

interface Props {
  label: string;
  stateName: string;
  register: any;
  placeholder: string;
  required?: boolean;
  pattern?: RegExp;
  patternMessage?: string;
  minLength?: number;
  maxLength?: number;
}

export default function FormInputArea({
  label,
  stateName,
  register,
  required,
  placeholder,
  pattern,
  patternMessage,
  minLength,
  maxLength,
}: Props) {
  return (
    <div>
      <div className=" pb-2">
        <label>
          {label}
          {required ? <span className="text-red-500"> *</span> : null}
        </label>
      </div>
      <div className="flex w-full">
        <input
          {...register(stateName, {
            required,
            ...(pattern && {
              pattern: { value: pattern, message: patternMessage },
            }),
            maxLength,
            minLength,
          })}
          placeholder={placeholder}
          className="h-[45px] w-full flex-1 border border-[#dedede] rounded px-4"
        />
      </div>
    </div>
  );
}
