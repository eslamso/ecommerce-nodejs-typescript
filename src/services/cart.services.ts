import { Request, Response, NextFunction } from "express";
import Cart from "../models/cart.model";
import Product from "../models/product.model";
import Coupon from "../models/coupon.model";

import AppError from "../utils/appError";
import catchAsync from "express-async-handler";
import { addProductToCartBody, cartCouponBody } from "../dtos/cart.dto";
import { calCartPrice } from "../utils/cart";
import { Types } from "mongoose";

export const addProductToMyCart = catchAsync(
  async (
    req: Request<{}, {}, addProductToCartBody>,
    res: Response,
    next: NextFunction
  ) => {
    const { productId } = req.body;
    const product = await Product.findById(productId);
    if (!product) {
      return next(new AppError("No product found with that ID", 404));
    }
    if (product.quantity < 1) {
      return next(new AppError("This product is out of stock", 400));
    }
    let cart = await Cart.findOne({ user: req.user?._id });
    if (!cart) {
      cart = await Cart.create({
        cartItems: [{ product: productId, price: product.price }],
        user: req.user?._id,
      });
    } else {
      //2- if user has already cart and check if the product found on the cart or not
      // console.log("element added here");
      const productIndex = cart.cartItems.findIndex(
        (item) => item.product.toString() === productId.toString()
      );

      if (productIndex > -1) {
        const item = cart.cartItems[productIndex];
        item.quantity! += 1;
        cart.cartItems[productIndex] = item;
      } else {
        // element not found in the cart

        cart.cartItems.push({
          product: productId as unknown as Types.ObjectId,
          price: product.price,
          quantity: 1,
        });
      }
    }
    await calCartPrice(cart);

    res.status(201).json({
      success: true,
      message: "product added to cart",
      cart,
    });
  }
);

export const removeProductFromMyCart = catchAsync(
  async (
    req: Request<{}, {}, addProductToCartBody>,
    res: Response,
    next: NextFunction
  ) => {
    const { productId } = req.body;
    const cart = await Cart.findOneAndUpdate(
      { user: req.user?.id },
      {
        //addToSet if id founded in set before added it not added again
        $pull: { cartItems: { _id: productId } },
      },
      { new: true }
    );
    if (!cart) {
      return next(new AppError("no cart found", 404));
    }
    await calCartPrice(cart);
    res.status(200).json({
      success: true,
      cart,
    });
  }
);

export const removeMyCart = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const cart = await Cart.findOneAndDelete({ user: req.user?.id });
    if (!cart) {
      return next(new AppError("no cart found", 404));
    }
    res.status(204).json({
      success: true,
    });
  }
);

export const getMyCart = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const cart = await Cart.findOne({ user: req.user?.id });
    if (!cart) {
      return next(new AppError("you don't have cart", 404));
    }
    res.status(200).json({
      success: true,
      cart,
    });
  }
);

export const updateCartProductQuantity = catchAsync(
  async (
    req: Request<{}, {}, addProductToCartBody>,
    res: Response,
    next: NextFunction
  ) => {
    const { productId, quantity } = req.body;
    const cart = await Cart.findOne({ user: req.user?.id });
    if (!cart) {
      return next(new AppError("no cart found", 404));
    }
    const productIndex = cart.cartItems.findIndex(
      (item) => item._id?.toString() === productId.toString()
    );
    if (productIndex === -1) {
      return next(new AppError("item not found in cart", 404));
    }
    const item = cart.cartItems[productIndex];
    const product = await Product.findById(item.product);
    if (!product) {
      return next(new AppError("product not found", 404));
    }
    if (quantity > product.quantity) {
      return next(
        new AppError("quantity should not exceed the product's quantity", 400)
      );
    }
    item.quantity = quantity;
    cart.cartItems[productIndex] = item;
    await calCartPrice(cart);
    res.status(200).json({
      success: true,
      cart,
    });
  }
);

export const applyCoupon = catchAsync(
  async (
    req: Request<{}, {}, cartCouponBody>,
    res: Response,
    next: NextFunction
  ) => {
    const coupon = await Coupon.findOne({
      name: req.body.coupon,
      expiresIn: { $gt: Date.now() },
    });
    //check if coupon is valid
    if (!coupon) {
      return next(new AppError("coupon is not found or expired", 400));
    }
    const cart = await Cart.findOne({ user: req.user?.id });
    if (!cart) {
      return next(new AppError("no cart found", 404));
    }
    const totalAfterDiscount = (
      cart.totalCartPrice! -
      (cart.totalCartPrice! * coupon.discount) / 100
    ).toFixed(2);
    cart.totalCartPriceAfterDiscount = Number(totalAfterDiscount);
    await cart.save();
    res.status(200).json({
      success: true,
      message: "coupon applied successfully",
      cart,
    });
  }
);

export const removeCouponFromCart = catchAsync(
  async (
    req: Request<{}, {}, cartCouponBody>,
    res: Response,
    next: NextFunction
  ) => {
    const coupon = await Coupon.findOne({
      name: req.body.coupon,
    });
    //check if coupon is valid
    if (!coupon) {
      return next(new AppError("the coupon is not found or expired", 400));
    }
    const cart = await Cart.findOneAndUpdate(
      { user: req.user?.id },
      { $unset: { totalCartPriceAfterDiscount: undefined } },
      { new: true }
    );
    if (!cart) {
      return next(new AppError("no cart found", 404));
    }
    res.status(200).json({
      success: true,
      message: "coupon is remove successfully",
      cart,
    });
  }
);
