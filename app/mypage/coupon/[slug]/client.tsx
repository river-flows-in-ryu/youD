"use client";

import React, { useEffect, useState } from "react";

import { useForm, SubmitHandler, Controller, useWatch } from "react-hook-form";
import { DatePicker, TimePicker } from "antd";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { useRouter } from "next/navigation";

import { commonFetch } from "@/utils/commonFetch";

import FormInputArea from "@/components/formInputArea";

type Inputs = {
  code: string;
  name: string;
  discountType: string;
  discountvalue: number;
  minPurchase: number | "";
  maxDiscount: number | "";
  fromDate: string;
  fromTime: string;
  toDate: string;
  toTime: string;
  active: boolean;
  usageLimit: number | "";
  perUserLimit: number;
  duplication: boolean;
  applicableProduct: number;
};

export default function Client({
  userProductNames,
  userId,
  couponData,
  slug,
  couponId,
}: {
  userProductNames: { id: number; productName: string }[];
  userId: number;
  couponData: any;
  slug: "add" | "modify";
  couponId: string;
}) {
  dayjs.extend(utc);
  dayjs.extend(timezone);

  const router = useRouter();

  const [products, setProducts] = useState<
    { id: number; productName: string }[]
  >([]);
  const [isCodeCheck, setIsCodeCheck] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isLoading },
    control,
    reset,
    getValues,
    setFocus,
  } = useForm<Inputs>({
    defaultValues: {
      active: true,
    },
  });

  useEffect(() => {
    if (slug === "modify") {
      setIsCodeCheck(true);
    }
  }, []);

  const watchedCode = useWatch({ control, name: "code" });

  useEffect(() => {
    if (couponData?.data?.code === watchedCode) {
      setIsCodeCheck(true);
    } else {
      setIsCodeCheck(false);
    }
  }, [watchedCode]);

  useEffect(() => {
    if (userProductNames && userProductNames.length > 0) {
      const newProductList = [{ id: 0, productName: "-" }, ...userProductNames];
      setProducts(newProductList);
    } else {
      setProducts([{ id: 0, productName: "-" }]);
    }
  }, [userProductNames]);

  useEffect(() => {
    if (couponData) {
      const {
        code,
        name,
        discount_type,
        discount_value,
        min_purchase,
        max_discount,
        valid_from,
        valid_to,
        active,
        usage_limit,
        per_user_limit,
        allow_multiple_use,
        applicable_product,
      } = couponData?.data || {};
      if (code === undefined) {
        alert("잘못된 경로입니다. 이전페이지로 돌아갑니다.");
        router?.back();
        return;
      }
      reset({
        code,
        name,
        discountType: discount_type,
        discountvalue: Number(discount_value),
        minPurchase: min_purchase,
        maxDiscount: max_discount,
        fromDate: dayjs.utc(valid_from).tz("Asia/Seoul").format("YYYY-MM-DD"),
        fromTime: dayjs.utc(valid_from).tz("Asia/Seoul").format("HH:mm:ss"),
        toDate: dayjs.utc(valid_to).tz("Asia/Seoul").format("YYYY-MM-DD"),
        toTime: dayjs.utc(valid_to).tz("Asia/Seoul").format("HH:mm:ss"),
        active: active,
        usageLimit: usage_limit,
        perUserLimit: per_user_limit,
        duplication: allow_multiple_use,
        applicableProduct: applicable_product === null ? 0 : applicable_product,
      });
    }
  }, [couponData]);

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
      min_purchase: minPurchase !== "" ? Number(minPurchase) : null,
      max_discount: maxDiscount !== "" ? Number(maxDiscount) : null,
      valid_from: dayjs(fromDateTime).toISOString(),
      valid_to: dayjs(toDateTime).toISOString(),
      active,
      usage_limit: usageLimit !== "" ? Number(usageLimit) : null,
      used_count: 0,
      per_user_limit: Number(perUserLimit),
      issuer_type: "seller",
      allow_multiple_use: duplication,
      applicable_product:
        Number(applicableProduct) === 0 ? null : Number(applicableProduct),
      userId,
    };

    if (isCodeCheck) {
      if (slug === "add") {
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
      } else {
        try {
          const res = await commonFetch(
            `${process.env.NEXT_PUBLIC_API_URL}/coupons/${couponId}/`,
            "PUT",
            payload
          );
          console.log(res);
        } catch (error) {
          console.log(error);
        }
      }
    } else {
      alert("코드 중복 확인 필요!");
      setFocus("code");
    }
  };

  // useEffect(() => {
  //   if (getValues("code")) {
  //     setIsCodeCheck(false);
  //   }
  // }, [getValues("code")]);

  const handleClickDuplicateCheck = async (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
    const code = getValues("code");

    const payload = {
      code,
      userId,
    };
    if (code === "" || !/^[A-Za-z0-9]+$/.test(code)) {
      return alert("코드가 비어있거나 유효하지 않습니다.");
    }
    const res = await commonFetch(
      `${process.env.NEXT_PUBLIC_API_URL}/coupons/coupon/check-code`,
      "post",
      payload
    );
    if (res?.message === "SUCCESS") {
      alert("사용 가능한 쿠폰 코드입니다.");
      setIsCodeCheck(true);
    } else {
      alert("이미 등록된 쿠폰입니다.");
    }
  };

  return (
    <>
      <h2 className="text-center font-bold py-5 text-lg	">쿠폰</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col px-5 ">
        <div className="flex items-center gap-[10px]">
          <div className="w-[80%]">
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
          </div>
          <button
            className={`w-[20%] h-[45px] border rounded mb-2 text-sm ${isCodeCheck ? "border-secondary text-secondary" : " border-primary text-primary "}`}
            onClick={handleClickDuplicateCheck}
            disabled={isCodeCheck}
          >
            {!isCodeCheck ? "중복확인" : "확인완료"}
          </button>
        </div>

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
                value={field.value ? dayjs(field.value) : null}
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
                value={field.value ? dayjs(field.value, "HH:mm:ss") : null}
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
                value={field.value ? dayjs(field.value) : null}
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
                value={field.value ? dayjs(field.value, "HH:mm:ss") : null}
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
