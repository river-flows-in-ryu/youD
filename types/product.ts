export interface Product {
  total_likes: number;
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
