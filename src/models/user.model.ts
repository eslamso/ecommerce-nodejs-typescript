import mongoose, { Types } from "mongoose";
export interface Address {
  id: Types.ObjectId;
  alias: string;
  details: string;
  city: string;
  postalCode: string;
}
export interface IUser {
  name: string;
  slug?: string;
  email: string;
  // for email activation
  activationCode?: string;
  activationCodeExpiresIn?: Date;
  activationToken?: string;
  password: string;
  passwordChangedAt?: Date;
  passwordResetCode?: string;
  passwordResetCodeExpires?: Date;
  passwordResetVerificationToken?: string;
  passwordResetToken?: string;
  role?: string;
  profileImg?: string;
  phoneNumber?: string;
  active?: boolean;
  expireAt?: boolean;
  isActivated?: boolean;
  myFavorites?: Types.ObjectId[];
  addresses?: Address[];
}
const userSchema = new mongoose.Schema<IUser>(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "user must have a name"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    email: {
      type: String,
      required: [true, "user must have a email"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "user must have a password"],
      minlength: [6, "password must have at least 8 characters"],
    },
    passwordChangedAt: Date,
    passwordResetCode: String,
    passwordResetCodeExpires: Date,
    passwordResetVerificationToken: String,
    passwordResetToken: String,
    role: {
      type: String,
      default: "user",
      enum: ["user", "admin", "manager"],
    },

    profileImg: String,
    phoneNumber: String,
    active: {
      type: Boolean,
      default: true,
    },
    expireAt: {
      type: Date,
      index: { expireAfterSeconds: 10 },
    },
    isActivated: {
      type: Boolean,
      default: false,
    },
    activationCode: String,
    activationCodeExpiresIn: Date,
    activationToken: String,
    myFavorites: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    addresses: [
      {
        id: { type: mongoose.Schema.Types.ObjectId },
        alias: String,
        details: String,
        city: String,
        postalCode: String,
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model<IUser>("User", userSchema);
