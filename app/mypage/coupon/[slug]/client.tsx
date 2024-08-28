"use client";

import React, { useEffect, useState } from "react";

import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { DatePicker, TimePicker } from "antd";

import FormInputArea from "@/components/formInputArea";
import { commonFetch } from "@/utils/commonFetch";

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
}: {
  userProductNames: { id: number; productName: string }[];
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
    watch,
    setValue,
    formState: { errors },
    control,
  } = useForm<Inputs>();
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
      discountType,
      discountvalue,
      minPurchase,
      maxDiscount,
      fromDate: fromDateTime,
      toDate: toDateTime,
      active,
      usageLimit,
      usedCount: 0,
      perUserLimit,
      issuerType: "seller",
      duplication,
      applicableProduct,
    };

    const res = await commonFetch(
      `${process.env.NEXT_PUBLIC_API_URL}/coupons/`,
      "post",
      payload
    );
  };

  const ErrorMessage = ({ name, text }: { name: string; text: string }) => {
    return (
      <div className="h-10">
        {errors.name && (
          <span className="text-red-500 text-sm leading-10">{text}</span>
        )}
      </div>
    );
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
          patternMessage="쿠폰 코드는 영문자와 숫자만 포함 가능"
        />
        <ErrorMessage name="code" text="필수 작성입니다" />

        <FormInputArea
          label="쿠폰 이름"
          stateName="name"
          register={register}
          required
          placeholder="쿠폰 이름을 작성해주세요"
        />
        <ErrorMessage name="name" text="필수 작성입니다" />

        <label className="pb-2">할인 타입</label>
        <select
          {...register("discountType", { required: true })}
          className="h-[45px] mb-10 border border-secondary px-5"
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
        />
        <ErrorMessage name="discountvalue" text="필수 작성입니다." />

        <FormInputArea
          label="최소 주문금액"
          stateName="minPurchase"
          register={register}
          placeholder="숫자만 허용"
        />
        <ErrorMessage name="minPurchase" text="정수의 값만 허용됩니다." />

        <FormInputArea
          label="최대 할인금액"
          register={register}
          stateName="maxDiscount"
          placeholder="숫자만 허용"
        />
        <ErrorMessage name="maxDiscount" text="정수의 값만 허용됩니다." />
        <label className="pt-4 pb-2">
          쿠폰 시작일<span className="text-red-500"> *</span>
        </label>
        <div className="flex gap-5 h-[45px] mb-5">
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

        <label className="pt-4 pb-2">
          쿠폰 종료일<span className="text-red-500"> *</span>
        </label>
        <div className="flex gap-5 h-[45px] mb-5">
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

        <div className="flex gap-2 mb-10">
          <input {...register("active")} type="checkbox" />
          <label>활성화 여부</label>
        </div>

        <FormInputArea
          label="쿠폰 최대 발급 수량"
          placeholder="숫자만 허용"
          stateName="usageLimit"
          register={register}
        />
        <ErrorMessage name="usageLimit" text="정수의 숫자만 허용" />

        <FormInputArea
          required
          label="유저 사용 가능 횟수"
          placeholder="숫자만 허용"
          stateName="perUserLimit"
          register={register}
        />
        <ErrorMessage name="perUserLimit" text="정수의 숫자만 허용" />

        <div className="flex gap-2 mb-10">
          <input {...register("duplication")} type="checkbox" />
          <label>중복 사용 가능 여부</label>
        </div>

        <label className="pb-2">상품 적용</label>
        <select
          {...register("applicableProduct", { required: true })}
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
