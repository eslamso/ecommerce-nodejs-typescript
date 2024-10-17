import { Request, Response, NextFunction } from "express";
import User, { IUser } from "../models/user.model";
import catchAsync from "express-async-handler";
//import * as a from "../types/types";
import sharp from "sharp";

import { uploadSingleImage } from "../middlewares/uploadImage.middleWare";
import {
  createOne,
  deleteOne,
  getAll,
  getOne,
  updateOne,
} from "../utils/handlerFactory";
import {
  addMyAddressBody,
  changeMyPasswordBody,
  changeUserPasswordBody,
  createUserBody,
  getAllUserQuery,
  MyAddressParams,
  myFavoritesProductParams,
  updateMeBody,
} from "../dtos/user.dto";
import { hashingPassword } from "../utils/password";
import { PublicParams } from "../types/types";
import AppError from "../utils/appError";
export const uploadUserImage = uploadSingleImage("profileImg");
export const resizeUserImage = catchAsync(
  async (
    req: Request<{}, {}, createUserBody>,
    res: Response,
    next: NextFunction
  ) => {
    if (req.file?.buffer) {
      // console.log("req.files", req.files.imageCover[0]);
      const userImageName = `user-${Math.round(
        Math.random() * 1e9
      )}-${Date.now()}.jpeg`;
      const imageDbUrl = `${process.env.BASE_URL}/uploads/users/${userImageName}`;
      await sharp(req.file.buffer)
        .resize(800, 600)
        .toFormat("jpeg")
        .jpeg({ quality: 90 })
        .toFile(`src/uploads/users/${userImageName}`);
      req.body.profileImg = imageDbUrl;
    }
    next();
  }
);

export const createUser = catchAsync(
  async (
    req: Request<{}, {}, createUserBody>,
    res: Response,
    next: NextFunction
  ) => {
    const { name, password, email, profileImg } = req.body;
    const hashedPassword = await hashingPassword(password);
    const user = await User.create({
      name,
      password: hashedPassword,
      email,
      profileImg,
    });
    res.status(201).json({
      success: true,
      user,
    });
  }
);

export const getAllUsers = getAll<{}, {}, getAllUserQuery, IUser>(User, "User");

export const getUser = getOne<{}, {}, {}, IUser>(User, "User", {
  path: "myFavorites",
});

export const updateUser = updateOne<{}, {}, {}, IUser>(User, "User");

export const deleteUser = deleteOne<{}, {}, {}, IUser>(User, "User");
export const changeUserPassword = catchAsync(
  async (
    req: Request<PublicParams, {}, changeUserPasswordBody>,
    res: Response,
    next: NextFunction
  ) => {
    const { id } = req.params;
    const { password } = req.body;
    const user = await User.findByIdAndUpdate(
      id,
      { password: await hashingPassword(password) },
      { new: true }
    );
    if (!user) {
      return next(new AppError("User not found", 404));
    }
    res.status(200).json({
      success: true,
      message: "password updated successfully",
    });
  }
);

export const changeMyPassword = catchAsync(
  async (
    req: Request<PublicParams, {}, changeMyPasswordBody>,
    res: Response,
    next: NextFunction
  ) => {
    const { newPassword } = req.body;
    const user = await User.findOneAndUpdate(
      { _id: req.user?.id },
      {
        password: await hashingPassword(newPassword),
        passwordChangedAt: Date.now(),
      },
      {
        new: true,
      }
    );
    res.status(200).json({
      success: true,
      message: "password updated successfully, please login again",
    });
  }
);

export const updateMe = catchAsync(
  async (
    req: Request<PublicParams, {}, updateMeBody>,
    res: Response,
    next: NextFunction
  ) => {
    const { name, email, phoneNumber, profileImg } = req.body;
    const user = await User.findOneAndUpdate(
      { _id: req.user?.id },
      {
        name,
        email,
        phoneNumber,
        profileImg,
      },
      {
        new: true,
      }
    );
    res.status(200).json({
      success: true,
      user,
    });
  }
);

export const getMe = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await req.user?.populate({ path: "myFavorites" });
    res.status(200).json({
      success: true,
      user,
    });
  }
);

export const addProductToMyFavorites = catchAsync(
  async (
    req: Request<myFavoritesProductParams>,
    res: Response,
    next: NextFunction
  ) => {
    const { productId } = req.params;
    const user = await User.findByIdAndUpdate(
      req.user?.id,
      { $addToSet: { myFavorites: productId } },
      { new: true }
    );
    res.status(200).json({
      success: true,
      message: "Product added successfully to my favorites",
      user,
    });
  }
);

export const removeProductToMyFavorites = catchAsync(
  async (
    req: Request<myFavoritesProductParams>,
    res: Response,
    next: NextFunction
  ) => {
    const { productId } = req.params;
    const user = await User.findByIdAndUpdate(
      req.user?.id,
      { $pull: { myFavorites: productId } },
      { new: true }
    );
    res.status(200).json({
      success: true,
      message: "Product removed successfully from my favorites",
      user,
    });
  }
);

export const addMyAddress = catchAsync(
  async (
    req: Request<{}, {}, addMyAddressBody>,
    res: Response,
    next: NextFunction
  ) => {
    const address = req.body;
    const user = await User.findByIdAndUpdate(
      req.user?.id,
      {
        //addToSet if id founded in set before added it not added again
        $addToSet: { addresses: address },
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      addresses: user?.addresses,
    });
  }
);

export const updateMyAddress = catchAsync(
  async (req: Request<MyAddressParams>, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const data = req.body;
    // to transform req.body into "address.$.bodyAttribute" to fit with $set
    const transformedObject = Object.fromEntries(
      Object.entries(data).map(([key, value]) => {
        // Transform the key as needed
        const newKey = `addresses.$.${key}`;
        return [newKey, value];
      })
    );
    const user = await User.findOneAndUpdate(
      { _id: req.user?.id, "addresses._id": id },
      {
        //addToSet if id founded in set before added it not added again
        $set: transformedObject,
      },
      { new: true }
    );
    console.log(req.body);
    res.status(200).json({
      success: true,
      message: "address is deleted successfully",
      addresses: user?.addresses,
    });
  }
);

export const removeMyAddress = catchAsync(
  async (req: Request<MyAddressParams>, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const user = await User.findByIdAndUpdate(
      req.user?.id,
      {
        //addToSet if id founded in set before added it not added again
        $pull: { addresses: { _id: id } },
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      addresses: user?.addresses,
    });
  }
);

export const getMyAddresses = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    res.status(200).json({
      success: true,
      addresses: req.user?.addresses,
    });
  }
);
