"use client";

import React from "react";

import { useForm, SubmitHandler } from "react-hook-form";
import { DatePicker, TimePicker } from "antd";

import Container from "@/components/container";
import FormInputArea from "@/components/formInputArea";

type Inputs = {
  code: string;
  name: string;
  discountType: string;
  discountvalue: number;
  minPurchase: number;
  maxDiscount: number;
  checkbox: boolean;
  usageLimit: number;
  perUserLimit: number;
};

export default function Page() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = (data) => console.log(data);

  const ErrorMessage = ({ children }: { children: string }) => {
    return (
      <span className="text-red-500 my-2.5 text-sm pl-4 leading-10">
        {children}
      </span>
    );
  };
  console.log(errors);

  return (
    <Container>
      <h2 className="text-center font-bold py-5 text-lg	">회원가입</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col px-5 ">
        <FormInputArea
          label="쿠폰 코드"
          stateName="code"
          register={register}
          required
          placeholder="6-10자 이내의 특수문자를 제외한 쿠폰 코드"
          pattern={/^[A-Za-z0-9]+$/}
          patternMessage="쿠폰 코드는 영문자와 숫자만 포함 가능"
          // maxLength={10}
          // minLength={6}
        />
        <div className="h-10">
          {errors.code && <ErrorMessage>* 필수 작성 필드입니다.</ErrorMessage>}
        </div>

        <FormInputArea
          label="쿠폰 이름"
          stateName="name"
          register={register}
          required
          placeholder="쿠폰 이름을 작성해주세요"
        />
        <div className="h-10">
          {errors.name && <ErrorMessage>* 필수 작성 필드입니다.</ErrorMessage>}
        </div>

        <label>할인 타입</label>
        <select {...register("discountType")}>
          <option value="fixed">금액</option>
          <option value="percent">퍼센트</option>
        </select>

        <label>할인 값</label>
        <input {...register("discountvalue", { required: true })} />
        {errors.discountvalue && <span>This field is required</span>}

        <FormInputArea
          label="최소 주문금액"
          stateName="minPurchase"
          register={register}
          placeholder="숫자만 허용"
        />
        {errors.minPurchase && (
          <ErrorMessage>* 필수 작성 필드입니다.</ErrorMessage>
        )}

        <FormInputArea
          label="최대 할인금액"
          register={register}
          stateName="maxDiscount"
          placeholder="숫자만 허용"
        />
        {errors.maxDiscount && (
          <ErrorMessage>* 필수 작성 필드입니다.</ErrorMessage>
        )}
        <label className="pt-4 pb-2">
          쿠폰 시작일<span className="text-red-500"> *</span>
        </label>
        <div className="flex gap-5 h-[45px]">
          <DatePicker className="w-[50%]" />
          <TimePicker className="w-[50%]" />
        </div>

        <label className="pt-4 pb-2">
          쿠폰 종료일<span className="text-red-500"> *</span>
        </label>
        <div className="flex gap-5 h-[45px]">
          <DatePicker className="w-[50%]" />
          <TimePicker className="w-[50%]" />
        </div>

        <div className="flex gap-1">
          <input {...register("checkbox")} type="checkbox" value="active" />
          <label>활성화 여부</label>
        </div>

        <FormInputArea
          label="쿠폰 최대 발급 수량"
          placeholder="숫자만 허용"
          stateName="usageLimit"
          register={register}
        />
        {errors.usageLimit && (
          <ErrorMessage>* 필수 작성 필드입니다.</ErrorMessage>
        )}

        <FormInputArea
          required
          label="유저 사용 가능 횟수"
          placeholder="숫자만 허용"
          stateName="perUserLimit"
          register={register}
        />
        {errors.perUserLimit && (
          <ErrorMessage>* 필수 작성 필드입니다.</ErrorMessage>
        )}

        <div className="flex gap-1">
          <input {...register("checkbox")} type="checkbox" value="active" />
          <label>중복 사용 가능 여부</label>
        </div>
        <input type="submit" />
      </form>
    </Container>
  );
}
