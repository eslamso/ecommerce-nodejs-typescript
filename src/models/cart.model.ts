import mongoose, { Types } from "mongoose";
export interface CartItems {
  _id?: Types.ObjectId;
  product: Types.ObjectId;
  quantity?: number;
  price: number;
}
export interface ICart {
  cartItems: CartItems[];
  totalCartPrice?: number;
  totalCartPriceAfterDiscount?: number;
  user: Types.ObjectId;
}
const cartSchema = new mongoose.Schema<ICart>(
  {
    cartItems: [
      {
        product: {
          type: mongoose.Schema.ObjectId,
          ref: "Product",
        },
        quantity: {
          type: Number,
          default: 1,
        },
        price: Number,
      },
    ],
    totalCartPrice: { type: Number, default: 0 },
    totalCartPriceAfterDiscount: { type: Number, default: 0 },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);
export default mongoose.model<ICart>("Cart", cartSchema);
