"use client";

import React from "react";

import dayjs from "dayjs";
import "dayjs/locale/ko";
dayjs.locale("ko");

import Container from "@/components/container";

export default function Page() {
  const weekDays = ["일", "월", "화", "수", "목", "금", "토"];

  const startOfWeek = dayjs().startOf("week").subtract(1, "week");
  const days = Array.from({ length: 35 }, (_, index) =>
    startOfWeek.add(index, "day")
  );
  const currentMonth = dayjs().month();
  const nextMonth = dayjs().add(1, "month").month();

  const colorDate = (day: dayjs.Dayjs) => {
    const dayOfWeek = dayjs(day).format("ddd");
    if (dayOfWeek === "일") {
      return "text-red-500";
    } else if (dayOfWeek === "토") {
      return "text-blue-500";
    }
    return "text-black";
  };
  return (
    <Container>
      <div className="w-full h-full sm:w-[650px] sm:mx-auto">
        <table className="w-full text-center">
          <thead>
            <tr>
              {weekDays.map((day) => (
                <th key={day}>{day}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 5 }, (_, weekIndex) => (
              <tr key={weekIndex}>
                {days.slice(weekIndex * 7, weekIndex * 7 + 7).map((day) => {
                  console.log(day);
                  return (
                    <td
                      key={day.format("YYYY-MM-DD")}
                      className={`day.month() === currentMonth ? "" : "other-month" ${colorDate(day)}`}
                    >
                      {day.month() === currentMonth ? day.date() : ""}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>

        {/* 다음 월 캘린더 */}
        <table className="w-full text-center">
          <tbody>
            {Array.from({ length: 5 }, (_, weekIndex) => (
              <tr key={weekIndex}>
                {days.slice(weekIndex * 7, weekIndex * 7 + 7).map((day) => (
                  <td
                    key={day.format("YYYY-MM-DD")}
                    className={day.month() === nextMonth ? "" : "other-month"}
                  >
                    {day.month() === nextMonth ? day.date() : ""}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Container>
  );
}
