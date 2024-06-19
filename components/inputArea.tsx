import React from "react";

interface Props {
  text: string;
  isRequired?: boolean;
  isButton?: boolean;
  type: string;
  placeholder: string;
  state: any;
  setState: (state: any) => void;
  buttonId?: string;
  onClick?: (buttonId: string) => void;
  errorMessage?: string;
}
export default function InputArea({
  text,
  isRequired = false,
  isButton = false,
  type,
  placeholder,
  state,
  setState,
  buttonId = "",
  onClick = (buttonId) => {},
  errorMessage = "",
}: Props) {
  return (
    <div>
      <div className="pt-4 pb-2">
        <label className="">
          {text}
          {isRequired ? <span className="text-red-500"> *</span> : null}
        </label>
      </div>
      <div className="flex w-full">
        <input
          type={type}
          value={state}
          onChange={(e) => {
            if (type === "number") {
              setState(parseInt(e.target.value));
            } else {
              setState(e.target.value);
            }
          }}
          className="h-[45px] w-full flex-1 border border-[#dedede] rounded px-4"
          placeholder={placeholder}
        ></input>
        {isButton ? (
          <button
            className="h-[45px] w-[80px] border border-primary ml-2 rounded text-primary"
            onClick={() => {
              onClick(buttonId);
            }}
          >
            중복확인
          </button>
        ) : null}
      </div>
      <div className="py-2.5">
        {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}
      </div>
    </div>
  );
}
