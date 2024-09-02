"use client";

import React, { useEffect, useState } from "react";

import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { DatePicker, TimePicker } from "antd";
import dayjs from "dayjs";

import { commonFetch } from "@/utils/commonFetch";

import FormInputArea from "@/components/formInputArea";

type Inputs = {
  code: string;
  name: string;
  discountType: string;
  discountvalue: number;
  minPurchase: number;
  maxDiscount: number;
  fromDate: string;
  fromTime: string;
  toDate: string;
  toTime: string;
  active: boolean;
  usageLimit: number;
  perUserLimit: number;
  duplication: boolean;
  applicableProduct: number;
};

export default function Client({
  userProductNames,
  userId,
}: {
  userProductNames: { id: number; productName: string }[];
  userId: number;
}) {
  const [products, setProducts] = useState<
    { id: number; productName: string }[]
  >([]);

  useEffect(() => {
    if (userProductNames && userProductNames.length > 0) {
      const newProductList = [{ id: 0, productName: "-" }, ...userProductNames];
      setProducts(newProductList);
    } else {
      setProducts([{ id: 0, productName: "-" }]);
    }
  }, [userProductNames]);

  const {
    register,
    handleSubmit,
    formState: { errors, isLoading },
    control,
  } = useForm<Inputs>({
    defaultValues: {
      active: true,
    },
  });

  const REQUIRED_MESSAGE = "필수 작성입니다.";

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    const {
      code,
      name,
      discountType,
      discountvalue,
      minPurchase,
      maxDiscount,
      fromDate,
      fromTime,
      toDate,
      toTime,
      active,
      usageLimit,
      perUserLimit,
      duplication,
      applicableProduct,
    } = data;

    const fromDateTime = fromDate && fromTime ? `${fromDate} ${fromTime}` : "";
    const toDateTime = toDate && toTime ? `${toDate} ${toTime}` : "";

    const payload = {
      code,
      name,
      discount_type: discountType,
      discount_value: Number(discountvalue),
      min_purchase: Number(minPurchase),
      max_discount: Number(maxDiscount),
      valid_from: dayjs(fromDateTime).toISOString(),
      valid_to: dayjs(toDateTime).toISOString(),
      active,
      usage_limit: Number(usageLimit),
      used_count: 0,
      per_user_limit: Number(perUserLimit),
      issuer_type: "seller",
      allow_multiple_use: duplication,
      applicable_product:
        Number(applicableProduct) === 0 ? null : Number(applicableProduct),
      userId,
    };

    try {
      const res = await commonFetch(
        `${process.env.NEXT_PUBLIC_API_URL}/coupons/`,
        "post",
        payload
      );
      if (res?.result === "SUCCESS") {
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <h2 className="text-center font-bold py-5 text-lg	">쿠폰</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col px-5 ">
        <FormInputArea
          label="쿠폰 코드"
          stateName="code"
          register={register}
          required
          placeholder="6-10자 영문+숫자"
          pattern={/^[A-Za-z0-9]+$/}
          requiredMessage={REQUIRED_MESSAGE}
          patternMessage="쿠폰 코드는 영문자와 숫자만 포함 가능"
          errors={errors}
        />

        <FormInputArea
          label="쿠폰 이름"
          stateName="name"
          register={register}
          required
          placeholder="쿠폰 이름을 작성해주세요"
          errors={errors}
          requiredMessage={REQUIRED_MESSAGE}
        />

        <label className="pb-2">할인 타입</label>
        <select
          {...register("discountType", { required: true })}
          className="h-[45px] mb-10 border border-secondary pl-4"
        >
          <option value="fixed">금액</option>
          <option value="percent">퍼센트</option>
        </select>

        <FormInputArea
          label="할인 값"
          register={register}
          stateName="discountvalue"
          required
          placeholder="정수의 값만 가능합니다."
          pattern={/^\d+$/}
          patternMessage="정수의 값만 입력해주세요"
          errors={errors}
          requiredMessage={REQUIRED_MESSAGE}
        />

        <FormInputArea
          label="최소 주문금액"
          stateName="minPurchase"
          register={register}
          placeholder="숫자만 허용"
          pattern={/^\d+$/}
          patternMessage="정수의 값만 입력해주세요"
          errors={errors}
        />

        <FormInputArea
          label="최대 할인금액"
          register={register}
          stateName="maxDiscount"
          placeholder="숫자만 허용"
          pattern={/^\d+$/}
          patternMessage="정수의 값만 입력해주세요"
          errors={errors}
        />

        <label className="pt-4 pb-2">
          쿠폰 시작일<span className="text-red-500"> *</span>
        </label>
        <div className="flex gap-5 h-[45px] ">
          <Controller
            control={control}
            name="fromDate"
            rules={{ required: true }}
            render={({ field }) => (
              <DatePicker
                className="w-[50%]"
                onChange={(date, dateString) => field.onChange(dateString)}
              />
            )}
          />
          <Controller
            control={control}
            name="fromTime"
            rules={{ required: true }}
            render={({ field }) => (
              <TimePicker
                className="w-[50%]"
                onChange={(time, timeString) => field.onChange(timeString)}
              />
            )}
          />
        </div>
        <div className="h-10 pl-4">
          {errors.fromDate || errors.fromTime ? (
            <span className="text-red-500 text-sm leading-10">
              날짜와 시간 모두 선택해주세요
            </span>
          ) : null}
        </div>

        <label className="pt-4 pb-2">
          쿠폰 종료일<span className="text-red-500"> *</span>
        </label>
        <div className="flex gap-5 h-[45px]">
          <Controller
            control={control}
            name="toDate"
            rules={{ required: true }}
            render={({ field }) => (
              <DatePicker
                className="w-[50%]"
                onChange={(date, dateString) => field.onChange(dateString)}
              />
            )}
          />
          <Controller
            control={control}
            name="toTime"
            rules={{ required: true }}
            render={({ field }) => (
              <TimePicker
                className="w-[50%]"
                onChange={(time, timeString) => field.onChange(timeString)}
              />
            )}
          />
        </div>
        <div className="h-10 pl-4">
          {errors.toDate || errors.toTime ? (
            <span className="text-red-500 text-sm leading-10">
              날짜와 시간 모두 선택해주세요
            </span>
          ) : null}
        </div>

        <div className="flex gap-2 mb-10">
          <input {...register("active")} type="checkbox" />
          <label>활성화 여부</label>
        </div>

        <FormInputArea
          errors={errors}
          label="쿠폰 최대 발급 수량"
          placeholder="숫자만 허용"
          stateName="usageLimit"
          register={register}
          pattern={/^\d+$/}
          patternMessage="정수의 값만 입력해주세요"
        />

        <FormInputArea
          errors={errors}
          required
          label="유저 사용 가능 횟수"
          placeholder="숫자만 허용"
          stateName="perUserLimit"
          register={register}
          pattern={/^\d+$/}
          patternMessage="정수의 값만 입력해주세요"
          requiredMessage={REQUIRED_MESSAGE}
        />

        <div className="flex gap-2 mb-10">
          <input {...register("duplication")} type="checkbox" />
          <label>중복 사용 가능 여부</label>
        </div>

        <label className="pb-2">상품 적용</label>
        <select
          {...register("applicableProduct")}
          className="h-[45px] mb-10 border border-secondary px-5"
        >
          {products?.map((product) => (
            <option value={product?.id} key={product?.id}>
              {product?.productName}
            </option>
          ))}
        </select>

        <input
          type="submit"
          className="w-full h-[45px] border border-primary bg-primary text-white rounded cursor-pointer"
        />
      </form>
    </>
  );
}
