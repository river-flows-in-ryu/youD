import Image from "next/image";
import Link from "next/link";

import Container from "@/components/container";
import CookiesWrapper from "@/components/cookiesProvider";

import { commonFetch } from "@/utils/commonFetch";

import carouselCategory from "../public/carouselCategory.png";
interface Product {
  id: number;
  image_url: string;
  user: {
    brandName: string;
  };
  brandName: string;
  productName: string;
  OriginPrice: number;
  discountRate: number;
  discountPrice: number;
}

interface Category {
  id: number;
  name: string;
  image: string;
  children: CategoryChildren[];
}
interface CategoryChildren {
  id: number;
  name: string;
  image: string;
}

export default async function Home() {
  async function getProductData() {
    try {
      const res = await commonFetch(
        `${process.env.NEXT_PUBLIC_API_URL}/product_list`,
        "get"
      );
      return res;
    } catch (error) {
      if (error instanceof Error) {
        alert(error?.message);
      }
    }
  }

  async function getBannertData() {
    try {
      const res = await commonFetch(
        `${process.env.NEXT_PUBLIC_API_URL}/banner`,
        "get"
      );
      return res;
    } catch (error) {
      if (error instanceof Error) {
        alert(error?.message);
      }
    }
  }

  async function getCategoriesData() {
    try {
      const res = await commonFetch(
        `${process.env.NEXT_PUBLIC_API_URL}/top-categories`,
        "get"
      );
      return res;
    } catch (error) {
      if (error instanceof Error) {
        alert(error?.message);
      }
    }
  }

  const productData = await getProductData();
  const bannerData = await getBannertData();
  const categoriesData = await getCategoriesData();

  const allCategory = {
    id: 0,
    name: "카테고리",
    image: carouselCategory,
  };

  if (categoriesData.results)
    categoriesData.results = [allCategory, ...categoriesData.results];

  return (
    <CookiesWrapper>
      <Container>
        <main className="flex flex-1 f-full flex-col w-screen">
          <div className="w-full h-[300px]">
            {/* <Image src={testBanner} alt="image" className="w-full h-full" /> */}
            <div className="w-full h-full bg-black"></div>
          </div>

          <div className=" flex overflow-x-auto no-scrollbar gap-2.5 my-5 px-3 sm:mx-auto sm:w-full  sm:justify-center">
            {categoriesData?.results?.map((category: Category) => (
              <Link
                href={
                  category?.id !== 0
                    ? `/categories?mainCategory=${category?.name}`
                    : "/overview"
                }
                key={category?.id}
              >
                <div>
                  <button className="bg-[#F2F4F6] rounded-[50%] w-16 h-16 flex justify-center items-center">
                    <Image
                      src={category?.image}
                      alt={`Flaticon_image_${category?.name}`}
                      width={45}
                      height={45}
                      className=""
                    />
                  </button>
                  <span className="flex justify-center">{category?.name}</span>
                </div>
              </Link>
            ))}
          </div>

          <div className="my-5 px-[10px] w-full xl:w-[1050px] xl:mx-auto">
            <span className="font-bold text-xl">MD pick!</span>
          </div>
          <div className="flex  gap-[10px] overflow-x-auto no-scrollbar px-[10px] xl:mx-auto">
            {productData?.map((product: Product) => (
              <Link href={`/goods/${product?.id}`} key={product?.id}>
                <div className="w-[150px] h-[180px] rounded sm:w-[250px] sm:h-[300px]">
                  <Image
                    src={product?.image_url}
                    alt="image"
                    width={150}
                    height={180}
                    className="rounded w-[150px] h-[180px] sm:w-[250px] sm:h-[300px]"
                  />
                </div>
                <div className="w-[150px]  flex flex-col mt-2">
                  <span className="line-clamp-1 break-all	">
                    {product?.brandName || ""}
                  </span>
                </div>
                <div className="leading-[1.3] overflow-hidden text-ellipsis line-clamp-2 break-all">
                  <span>{product?.productName} </span>
                </div>
                <span className="line-through	text-xs text-secondary">
                  {(product?.OriginPrice || 0).toLocaleString()}원
                </span>
                <div className="flex">
                  <span className="text-red-500 mr-1">
                    {product?.discountRate || 0}%
                  </span>
                  <span>
                    {(product?.discountPrice).toLocaleString() || 0}원
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </main>
      </Container>
    </CookiesWrapper>
  );
}
