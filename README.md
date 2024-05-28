## YouD

🧑‍🎨 패션디자인 학생을 위한  오뜨 꾸뛰르 판매 및 플랫폼을 개발중입니다. <br/>
   오뜨 꾸뛰르는 실용성 보다는 예술성에 중점인 맞춤복으로 대학생의 프로젝트성 제작이 완료되면 폐기로 진행되는 모습이 아쉬워 작성하게되었습니다.


## 개요

- 프로젝트 이름 : YouD (Your Designer)
- 프로젝트 기간 : 2024.03~


## 개발환경
- Front : React , Typescript , tailwindcss , zustand
- Back  : DRF (Django-Rest-Framework)


## 채택한 개발 기술

### React , Typescript

- React
  - 가상 돔의 사용으로 렌더링 비용 절감
  - 컴포넌트 단위로 구성하여 조합,분해가 쉽다
  - vue , angular 보다 주로 사용해본 언어

- tailwind
  - 컴포넌트 이름으로 변수명을 짓던 styled 와는 다르게 css로 작성 (신속성)
  - 스타일을 빠르게 적용할수 있어 코드 길이가 줄고 작성시간이 절약됨

### zustand

- zustand
  - 작은 번들 사이즈
  - 빠르게 성장하는 커뮤니티 => 버그 수정 , 기능 추가가 빠름
  - 불필요한 렌더링 최소화


## 기록한 기술 사항
[zustand persist](https://github.com/river-flows-in-ryu/yourD/wiki/zustand%EB%A5%BC-%ED%99%9C%EC%9A%A9%ED%95%9C-%EC%83%88%EB%A1%9C%EA%B3%A0%EC%B9%A8%EC%8B%9C%EC%97%90%EB%8F%84-%EB%82%A8%EC%95%84%EC%9E%88%EB%8A%94-%EC%A0%84%EC%97%AD%EC%83%81%ED%83%9C) 
<br/>
[zustand async action](https://github.com/river-flows-in-ryu/yourD/wiki/zustand%EB%A5%BC-%ED%99%9C%EC%9A%A9%ED%95%9C-Async-actions) <br/>
[Next.js middleware JWT](https://ryugaram.tistory.com/165)


## 코드 컨벤션
- 값이 변하지 않는 변수는 const를, 값이 변하는 변수는 let을 사용하여 선언한다. var는 절대로 사용하지 않도록 한다.
- 카멜 케이스를 사용한다.
- boolean 타입은 is라는 접두사 사용
- import 순서 정렬
```
import React from "react";  // default

import Image from "next/image"; //외부 라이브러리 사용 1순위

import ProductDetail from "./productDetail"; // 작성한 컴포넌트 2순위

import { commonFetch } from "@/utils/commonFetch"; // util 사용값 3순위

import arrowDown from "../public/arrow_down.png"; // 이미지 등 파일 4순위

import { useCartCountStore, useUserIdStore } from "@/app/store"; 함수, 값 등 불러오는 파일 5순위

```

## 프론트 화면

<img width="250" alt="스크린샷 2024-05-27 오후 2 00 31" src="https://github.com/river-flows-in-ryu/yourD/assets/100814863/11b3da4e-329f-40d2-8f5a-d9ed0b5784ee">  
<img width="250" alt="스크린샷 2024-05-27 오후 1 56 16" src="https://github.com/river-flows-in-ryu/yourD/assets/100814863/c47afd23-b6c5-44e2-af05-375ebd14f226">
