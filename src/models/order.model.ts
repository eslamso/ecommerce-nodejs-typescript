import mongoose, { Types } from "mongoose";
import { CartItems } from "./cart.model";
import { Address } from "./user.model";
export interface IOrder {
  user: Types.ObjectId;
  cartItems: CartItems[];
  tax?: number;
  shippingPrice?: number;
  totalOrderPrice: number;
  isPaid?: boolean;
  PaidAt?: Date;
  isDelivered?: boolean;
  deliverAt?: Date;
  shippingAddress: Address;
  deliveryDate?: Date;
}

const orderSchema = new mongoose.Schema<IOrder>(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
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
        color: String,
      },
    ],
    tax: { type: Number, default: 0 },
    shippingPrice: { type: Number, default: 0 },
    shippingAddress: {
      details: String,
      city: String,
      state: String,
      postalCode: String,
    },
    totalOrderPrice: Number,
    isPaid: {
      type: Boolean,
      default: false,
    },
    PaidAt: Date,
    isDelivered: { type: Boolean, default: false },
    deliverAt: Date,
    deliveryDate: {
      type: Number,
      default: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days from now
    },
  },
  { timestamps: true }
);
export interface User {
  email: string;
  name: string;
}

export default mongoose.model<IOrder>("Order", orderSchema);
