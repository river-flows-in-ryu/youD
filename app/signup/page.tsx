"use client";
import React, { useEffect, useState } from "react";

import InputArea from "@/components/inputArea";
import SignupSexArea from "@/components/\bsignupSexArea";
import SignupUniversityArea from "@/components/\bsignupUniversityArea";
import SignupAddressArea from "@/components/signupAddressArea";
import SignupPhoneArea from "@/components/signupPhoneArea";
import SignupBirthArea from "@/components/signupBirthArea";

import Container from "@/components/container";

export default function Page() {
  const [ID, setID] = useState("");
  const [PW, setPW] = useState("");
  const [checkPW, setCheckPW] = useState("");
  const [name, setName] = useState("");
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");
  const [email, setEmail] = useState("");
  const [phone1, setPhone1] = useState("");
  const [phone2, setPhone2] = useState("");
  const [phone3, setPhone3] = useState("");
  const [address, setAddress] = useState("");
  const [addressDetail, setAddressDetail] = useState("");
  const [selectedSexOption, setSelectedSexOption] = useState("");
  const [university, setUniversity] = useState(0);
  const [major, setMajor] = useState(0);

  const [isNotIdDuplicated, setIsNotIdDuplicated] = useState(false);
  const [isNotEmailDuplicated, setIsNotEmailDuplicated] = useState(false);

  const [idErrorMessage, setIdErrorMessage] = useState("");
  const [pwErrorMessage, setPwErrorMessage] = useState("");
  const [checkPwErrorMessage, setCheckPwErrorMessage] = useState("");
  const [yearErrorMessage, setYearErrorMessage] = useState("");
  const [monthErrorMessage, setMonthErrorMessage] = useState("");
  const [dayErrorMessage, setDayErrorMessage] = useState("");
  const [birthErrorMessage, setBirthErrorMessage] = useState("");
  const [emailErrorMessage, setEmailErrorMessage] = useState("");
  const [phone1ErrorMessage, setPhone1ErrorMessage] = useState("");
  const [phone2ErrorMessage, setPhone2ErrorMessage] = useState("");
  const [phone3ErrorMessage, setPhone3ErrorMessage] = useState("");
  const [phoneErrorMessage, setPhoneErrorMessage] = useState("");

  const [universityOptions, setUniversityOptions] = useState([]);
  const [majorOptions, setMajorOptions] = useState([]);

  useEffect(() => {
    async function optionFetch() {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/university_list`
      );
      const jsonRes = await res.json();
      const university_list = jsonRes?.universities?.map(
        (data: { id: number; name: string }) => ({
          id: data.id,
          value: data.name,
          label: data.name,
        })
      );
      const major_list = jsonRes?.majors?.map(
        (data: { id: number; name: string }) => ({
          id: data.id,
          value: data.name,
          label: data.name,
        })
      );
      setUniversityOptions(university_list);
      setMajorOptions(major_list);
    }
    optionFetch();
  }, []);

  useEffect(() => {
    //id validation
    if (ID === "") {
      setIdErrorMessage("");
    } else {
      const idRegex = /^[a-zA-Z0-9]{6,16}$/;
      if (!idRegex.test(ID)) {
        setIdErrorMessage("6자 이상 16자 이하의 영문 혹은 영문과 숫자를 조합");
      } else {
        setIdErrorMessage("");
      }
    }
    //pw validation
    if (PW === "") {
      setPwErrorMessage("");
    } else {
      const pwReg =
        /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()-=_+[\]{};':"\\|,.<>?])(?!.*\s).{10,}$/;
      if (!pwReg.test(PW)) {
        setPwErrorMessage(
          "10글자 이상 영문/숫자/특수문자(공백 제외)만 허용하며, 2개 이상 조합"
        );
      } else {
        setPwErrorMessage("");
      }
    }
    //check pw validation
    if (checkPW === "") {
      setCheckPwErrorMessage("");
    } else {
      if (PW?.trim().toLowerCase() !== checkPW?.trim().toLowerCase()) {
        setCheckPwErrorMessage("동일한 비밀번호를 입력");
      } else {
        setCheckPwErrorMessage("");
      }
    }

    //birth validation
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    if (year === "") {
      setYearErrorMessage("");
    } else {
      if (/^\d{1,4}$/.test(year)) {
        if (Number(year) > currentYear) {
          setYearErrorMessage("미래로 입력되었습니다.");
        } else if (Number(year) < currentYear - 100) {
          setYearErrorMessage("생년월일을 다시 확인해주세요.");
        } else setYearErrorMessage("");
      } else {
        setYearErrorMessage("4글자 이하로 입력해주세요.");
      }
    }

    // Month validation
    if (month === "") {
      setMonthErrorMessage("");
    } else {
      if (/^(0[1-9]|1[0-2])$/.test(month)) {
        // 유효한 월 값인 경우 아래와 같이 설정
        setMonthErrorMessage("");
      } else {
        setMonthErrorMessage("올바른 월을 입력하세요.");
      }
    }

    // Day validation
    if (day === "") {
      setDayErrorMessage("");
    } else {
      if (/^([0-2][1-9]|3[0-1])$/.test(day)) {
        // 유효한 일 값인 경우 아래와 같이 설정
        setDayErrorMessage("");
      } else {
        setDayErrorMessage("올바른 일을 입력하세요.");
      }
    }

    if (yearErrorMessage !== "") {
      setBirthErrorMessage(yearErrorMessage); // yearErrorMessage가 있으면 errorMessage에 업데이트
    } else if (monthErrorMessage !== "") {
      setBirthErrorMessage(monthErrorMessage); // yearErrorMessage가 없고 monthErrorMessage가 있으면 errorMessage에 업데이트
    } else {
      setBirthErrorMessage(dayErrorMessage); // yearErrorMessage와 monthErrorMessage가 없고 dayErrorMessage가 있으면 errorMessage에 업데이트
    }

    if (email === "") {
      setEmailErrorMessage("");
    } else {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(email)) {
        setEmailErrorMessage("Email을 확인해주세요.");
      } else setEmailErrorMessage("");
    }

    if (phone1 === "") {
      setPhone1ErrorMessage("");
    } else {
      const firstPartPattern = /^01[0-9]{1,2}$/;
      if (!firstPartPattern.test(phone1)) {
        setPhone1ErrorMessage("전화번호를 확인해주세요");
      } else {
        setPhone1ErrorMessage("");
      }
    }

    if (phone2 === "") {
      setPhone2ErrorMessage("");
    } else {
      const secondPartPattern = /^[0-9]{3,4}$/;
      if (!secondPartPattern.test(phone2)) {
        setPhone2ErrorMessage("전화번호를 확인해주세요");
      } else {
        setPhone2ErrorMessage("");
      }
    }

    if (phone3 === "") {
      setPhone3ErrorMessage("");
    } else {
      const thirdPartPattern = /^[0-9]{4}$/;
      if (!thirdPartPattern.test(phone3)) {
        setPhone3ErrorMessage("전화번호를 확인해주세요");
      } else {
        setPhone3ErrorMessage("");
      }
    }

    if (phone1ErrorMessage !== "") {
      setPhoneErrorMessage(phone1ErrorMessage);
    } else if (phone2ErrorMessage !== "") {
      setPhoneErrorMessage(phone2ErrorMessage);
    } else setPhoneErrorMessage(phone3ErrorMessage);
  }, [
    ID,
    PW,
    checkPW,
    year,
    month,
    day,
    yearErrorMessage,
    monthErrorMessage,
    dayErrorMessage,
    email,
    phone1,
    phone1ErrorMessage,
    phone2,
    phone2ErrorMessage,
    phone3,
    phone3ErrorMessage,
  ]);

  const payload = {
    username: ID,
    email: email,
    password: PW,
    name: name,
    address: address,
    address_detail: addressDetail,
    gender: selectedSexOption,
    birth: `${year}-${month}-${day}`,
    phone: `${phone1}-${phone2}-${phone3}`,
    university: university,
    major: major,
  };

  async function handleClickSubmit() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/signup`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (data.message === "SUCCESS") {
      console.log("SUCCESS");
    }
  }

  async function handleClickIsDuplicate(buttonId: string) {
    try {
      const url = buttonId === "ID" ? "check_userId" : "check_userEmail";
      const payload = buttonId === "ID" ? { username: ID } : { email: email };
      if (buttonId === "ID" && ID === "") {
        alert("ID를 입력해주세요.");
        return;
      }
      if (buttonId === "ID" && idErrorMessage !== "") {
        alert(idErrorMessage);
        return;
      }
      if (buttonId === "email" && email === "") {
        alert("Email를 입력해주세요.");
        return;
      }
      if (buttonId === "email" && emailErrorMessage !== "") {
        alert(emailErrorMessage);
        return;
      }
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/${url}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );
      const data = await response.json();
      if (data.message === "OK") {
        const message =
          buttonId === "ID"
            ? "사용가능한 ID입니다."
            : "사용가능한 Email입니다.";
        if (buttonId === "ID") setIsNotIdDuplicated(true);
        else setIsNotEmailDuplicated(true);
        alert(message);
      }
      if (data.message === "DUPLICATE") {
        const message =
          buttonId === "ID"
            ? "ID가 이미 존재합니다."
            : "Email이 이미 존재합니다.";
        alert(message);
      }
    } catch (error) {
      console.log(error);
    }
  }
  const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedSexOption(event.target.value);
  };

  return (
    <Container>
      <div className="w-full h-full px-5 pb-primary sm:w-[450px] sm:mx-auto xl:w-[650px]">
        <h2 className="text-center font-bold py-5 text-lg	">회원가입</h2>
        <InputArea
          text="아이디"
          placeholder="아이디를 입력해주세요"
          isRequired={true}
          isButton={true}
          type="text"
          state={ID}
          setState={setID}
          buttonId="ID"
          onClick={handleClickIsDuplicate}
          errorMessage={idErrorMessage}
        />
        <InputArea
          text="비밀번호"
          placeholder="비밀번호를 입력해주세요"
          isRequired={true}
          type="password"
          state={PW}
          setState={setPW}
          errorMessage={pwErrorMessage}
        />
        <InputArea
          text="비밀번호 확인"
          placeholder="비밀번호를 한번 더 입력해주세요"
          isRequired={true}
          type="password"
          state={checkPW}
          setState={setCheckPW}
          errorMessage={checkPwErrorMessage}
        />
        <InputArea
          text="이름"
          placeholder="이름을 입력해주세요"
          isRequired={true}
          type="text"
          state={name}
          setState={setName}
        />
        <SignupBirthArea
          year={year}
          month={month}
          day={day}
          setYear={setYear}
          setMonth={setMonth}
          setDay={setDay}
          birthErrorMessage={birthErrorMessage}
        />

        <InputArea
          text="이메일"
          placeholder="이메일을 입력해주세요"
          isRequired={true}
          type="email"
          state={email}
          setState={setEmail}
          isButton={true}
          buttonId="email"
          onClick={handleClickIsDuplicate}
          errorMessage={emailErrorMessage}
        />
        <SignupPhoneArea
          phone1={phone1}
          phone2={phone2}
          phone3={phone3}
          setPhone1={setPhone1}
          setPhone2={setPhone2}
          setPhone3={setPhone3}
          phoneErrorMessage={phoneErrorMessage}
        />
        <SignupAddressArea address={address} setAddress={setAddress} />
        <InputArea
          text="상세 주소"
          placeholder="상세주소를 입력해세요"
          type="text"
          state={addressDetail}
          setState={setAddressDetail}
        />
        <SignupSexArea
          selectedSexOption={selectedSexOption}
          handleOptionChange={handleOptionChange}
        />
        <SignupUniversityArea
          university={university}
          major={major}
          universityOptions={universityOptions}
          majorOptions={majorOptions}
          setUniversity={setUniversity}
          setMajor={setMajor}
        />
        <div className="py-5">
          <button
            className="w-full h-[45px] border border-primary rounded text-white bg-primary font-bold"
            onClick={handleClickSubmit}
          >
            가입하기
          </button>
        </div>
      </div>
    </Container>
  );
}
