"use client";

import React from "react";

import dayjs from "dayjs";
import "dayjs/locale/ko";
dayjs.locale("ko");

import Container from "@/components/container";

export default function Page() {
  const weekDays = ["일", "월", "화", "수", "목", "금", "토"];

  // 지난주 시작일
  const startOfLastWeek = dayjs().startOf("week").subtract(1, "week");
  // 이번달 마지막일 계산
  const endOfThisMonth = dayjs().endOf("month");

  // 지난주 시작일을 기점으로 마지막일까지의 날짜
  const ThisMonthRemainderDays =
    endOfThisMonth.diff(startOfLastWeek, "day") + 1;

  // 다음달 시작일
  const startOfNextMonth = dayjs().add(1, "month").startOf("month");

  // 다음달의 요일
  const nextMonthStartDay = startOfNextMonth.day();

  // 다음날 일자
  const nextMonthRemainderDays = 35 - ThisMonthRemainderDays;

  const thisMonthDays = Array.from(
    { length: ThisMonthRemainderDays },
    (_, index) => startOfLastWeek.add(index, "day")
  );

  const nextMonthDays = Array.from(
    { length: 35 - ThisMonthRemainderDays },
    (_, index) => {
      // 첫 번째 날보다 앞에 있는 경우 null로 채움
      return index < nextMonthStartDay
        ? null
        : startOfNextMonth.add(index - nextMonthStartDay, "day");
    }
  );

  const currentMonth = dayjs().month();

  const emptyDays = Array.from({ length: nextMonthStartDay }, () => null);

  function colorDate(day: dayjs.Dayjs | null) {
    const dayOfWeek = dayjs(day).format("ddd");
    if (dayOfWeek === "일") {
      return "text-red-500";
    } else if (dayOfWeek === "토") {
      return "text-blue-500";
    }
    return "text-black";
  }

  return (
    <Container>
      <div className="w-full h-full sm:w-[650px] sm:mx-auto">
        <p>{currentMonth + 1}월</p>
        <table className="w-full text-center">
          <thead>
            <tr>
              {weekDays.map((day) => (
                <th
                  key={day}
                  className={`${
                    day === "토"
                      ? "text-blue-500"
                      : day === "일"
                        ? "text-red-500"
                        : "text-black"
                  }`}
                >
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from(
              { length: Math.ceil(ThisMonthRemainderDays / 7) },
              (_, weekIndex) => (
                <tr key={weekIndex} className="h-10">
                  {thisMonthDays
                    .slice(weekIndex * 7, weekIndex * 7 + 7)
                    .map((day) => {
                      return (
                        <td
                          key={day.format("YYYY-MM-DD")}
                          className={`${
                            day.month() === currentMonth ? "" : "other-month"
                          } ${colorDate(day)} cursor-pointer`}
                        >
                          {day.date()}
                        </td>
                      );
                    })}
                </tr>
              )
            )}
          </tbody>
        </table>

        <p>{currentMonth + 2}월</p>
        <table className="w-full text-center">
          <tbody>
            {Array.from(
              { length: Math.ceil(nextMonthRemainderDays / 7) },
              (_, weekIndex) => (
                <tr key={weekIndex}>
                  {emptyDays.map((_, index) => null)}
                  {nextMonthDays
                    .slice(weekIndex * 7, weekIndex * 7 + 7)
                    .map((day, index) => {
                      return (
                        <td
                          key={index}
                          className={` ${colorDate(day)} h-10 cursor-pointer`}
                        >
                          {day ? day.date() : null}
                        </td>
                      );
                    })}
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    </Container>
  );
}
