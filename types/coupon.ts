export interface Coupon {
  id: number;
  active: boolean;
  allow_multiple_use: boolean;
  applicable_product: null | number;
  brand: number;
  code: string;
  created_at: string;
  discount_type: string;
  discount_value: string;
  issuer_type: string;
  max_discount: number;
  min_purchase: number;
  name: string;
  per_user_limit: number;
  updated_at: string;
  usage_limit: number;
  used_count: number;
  valid_from: string;
  valid_to: string;
}
