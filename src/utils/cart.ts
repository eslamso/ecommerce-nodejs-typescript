import { cartDocument } from "../types/documentTypes";

export const calCartPrice = async (cart: cartDocument) => {
  let total = 0;
  cart.cartItems.forEach((item) => {
    total += item.quantity! * item.price;
  });
  cart.totalCartPrice = Number(total.toFixed(2));
  // when the coupon is removed
  cart.totalCartPriceAfterDiscount = undefined;

  await cart.save();
};
