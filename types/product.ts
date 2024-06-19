export interface Product {
  id: number;
  OriginPrice: number;
  discountPrice: number;
  discountRate: number;
  image_url: string;
  productName: string;
  brandName: string;
  productShortName: string;
  user: {
    id: number;
  };
}
