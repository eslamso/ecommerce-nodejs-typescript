import mongoose, { Date } from "mongoose";
export interface ICoupon {
  name: string;
  expiresIn: Date;
  discount: number;
}

const couponSchema = new mongoose.Schema<ICoupon>(
  {
    name: {
      type: String,
      required: [true, "a coupon must have name"],
      unique: true,
      trim: true,
    },
    expiresIn: {
      type: Date,
      required: [true, "a coupon must have an expiration date"],
    },
    discount: {
      type: Number,
      required: [true, "a coupon must have a discount percentage"],
    },
  },
  { timestamps: true }
);

export default mongoose.model<ICoupon>("Coupon", couponSchema);
