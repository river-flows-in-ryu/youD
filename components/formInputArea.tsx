import { stat } from "fs";
import React from "react";

import { FieldErrors } from "react-hook-form";

interface Props {
  label: string;
  stateName: string;
  register: any;
  placeholder: string;
  required?: boolean;
  pattern?: RegExp;
  requiredMessage?: string;
  patternMessage?: string;
  minLength?: number;
  maxLength?: number;
  errors: FieldErrors;
}

interface ErrorMessageProps {
  name: string;
  errors: FieldErrors;
  requiredMessage: string | undefined;
  patternMessage: string | undefined;
}

const ErrorMessage = ({
  name,
  errors,
  requiredMessage,
  patternMessage,
}: ErrorMessageProps) => {
  const error = errors[name];
  if (error) {
    if (error?.type === "required") {
      return (
        <span className="text-red-500 text-sm leading-10">
          {requiredMessage}
        </span>
      );
    }
    if (error?.type === "pattern") {
      return (
        <span className="text-red-500 text-sm leading-10">
          {patternMessage}
        </span>
      );
    }
  }
  return null;
};

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
  errors,
  requiredMessage,
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
            required: required ? requiredMessage : false,
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
      <div className="h-10 pl-4">
        <ErrorMessage
          name={stateName}
          errors={errors}
          requiredMessage={requiredMessage}
          patternMessage={patternMessage}
        />
      </div>
    </div>
  );
}
