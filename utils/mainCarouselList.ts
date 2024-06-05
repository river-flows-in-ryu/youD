import carouselCategory from "../public/carouselCategory.png";
import carouselTop from "../public/carouselTop.png";
import carouselJacket from "../public/carouselJacket.png";
import carouselPants from "../public/carouselPants.png";
import carouselOnepiece from "../public/carouselOnepiece.png";
import carouselSkirt from "../public/carouselSkirt.png";
import carouselBag from "../public/carouselBag.png";
import carouselHat from "../public/carouselHat.png";

export const mainCarouelList = [
  {
    id: 1,
    title: "카테고리",
    image: carouselCategory,
    link: "/overview",
  },
  {
    id: 2,
    title: "상의",
    image: carouselTop,
    link: "/categories?mainCategory=상의",
  },
  {
    id: 3,
    title: "아우터",
    image: carouselJacket,
    link: "/categories?mainCategory=아우터",
  },
  {
    id: 4,
    title: "바지",
    image: carouselPants,
    link: "/categories?mainCategory=바지",
  },
  {
    id: 5,
    title: "원피스",
    image: carouselOnepiece,
    link: "/categories?mainCategory=원피스",
  },
  {
    id: 6,
    title: "스커트",
    image: carouselSkirt,
    link: "/categories?mainCategory=스커트",
  },
  {
    id: 7,
    title: "가방",
    image: carouselBag,
    link: "/categories?mainCategory=가방",
  },
  {
    id: 8,
    title: "모자",
    image: carouselHat,
    link: "/categories?mainCategory=모자",
  },
];
