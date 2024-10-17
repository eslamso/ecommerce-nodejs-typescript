export type cartProductParams = {
  productId?: string;
};

export interface addProductToCartBody {
  productId: string;
  quantity: number;
}

export interface cartCouponBody {
  coupon: string;
}
