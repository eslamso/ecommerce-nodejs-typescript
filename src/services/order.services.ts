import { Request, Response, NextFunction } from "express";
import catchAsync from "express-async-handler";
import { PaymentParams } from "../dtos/order.dto";
import Cart from "../models/cart.model";
import User from "../models/user.model";
import Order from "../models/order.model";
import Product from "../models/product.model";

import AppError from "../utils/appError";
import { getAll } from "../utils/handlerFactory";
import {
  createPayTabsPaymentPage,
  PayTabsSettings,
  verifyPayTabsWebHookSignature,
} from "../utils/payTabs";
import {
  PaymentResultBody,
  payTabs_Cart,
  payTabs_Customer,
  payTabs_lang,
  payTabs_PaymentMethods,
  payTabs_Response_Urls,
  payTabs_Transaction,
  payTabs_Transaction_details,
  payTabs_Urls,
} from "../types/payTabs";
import { PublicObject } from "../types/types";
export const createPayTabsPaymentLink = catchAsync(
  async (req: Request<PaymentParams>, res: Response, next: NextFunction) => {
    // 1- Setting paytabs configuration
    if (!req.user?.addresses) {
      return next(new AppError("User must have address", 400));
    }
    PayTabsSettings();
    //2- get cart with cart Id
    const taxPrice = 0;
    const shippingPrice = 0;
    const myCart = await Cart.findById(req.params.cartId);
    if (!myCart) {
      return next(new AppError("cart not found", 404));
    }
    //2-get price from cart and check if there is a coupon applied or not
    const cartPrice = myCart.totalCartPriceAfterDiscount
      ? myCart.totalCartPriceAfterDiscount
      : myCart.totalCartPrice;
    const totalCartPrice = cartPrice! + taxPrice + shippingPrice;

    // 2- Initiating paytabs payments
    let paymentMethods: payTabs_PaymentMethods = ["all"];
    let transaction: payTabs_Transaction = {
      type: "sale",
      class: "ecom",
    };
    let cart: payTabs_Cart = {
      id: req.params.cartId,
      currency: "EGP",
      amount: totalCartPrice,
      description: "description perfecto",
    };
    let customer: payTabs_Customer = {
      name: req.user?.name!,
      email: req.user?.email!,
      phone: req.user?.phoneNumber!,
      street1: req.user?.addresses![0].alias,
      city: req.user?.addresses![0].city,
      state: req.user?.addresses![0].details,
      country: "EG",
      zip: req.user?.addresses![0].postalCode,
    };
    let transaction_details: payTabs_Transaction_details = [
      transaction.type,
      transaction.class,
    ];
    let cart_details = [cart.id, cart.currency, cart.amount, cart.description];
    let customer_details = [
      customer.name,
      customer.email,
      customer.phone,
      customer.street1,
      customer.city,
      customer.state,
      customer.country,
      customer.zip,
    ];

    let shipping_address = customer_details;

    let url: payTabs_Urls = {
      callback: "https://natoursapp-lu63.onrender.com/payTabsWebhook",
      response: "https://webhook.site/44a2a603-0dbc-48cd-a01b-15b8529cc098",
    };

    let response_URLs: payTabs_Response_Urls = [url.callback, url.response];

    let lang: payTabs_lang = "ar";
    let frameMode = true;

    // Wrap createPaymentPage in a Promise
    const createPaymentPage = createPayTabsPaymentPage(
      paymentMethods,
      transaction_details,
      cart_details,
      customer_details,
      shipping_address,
      response_URLs,
      lang,
      frameMode
    );
    try {
      // Wait for payment page creation
      const result = await createPaymentPage;

      // Respond with the result
      res.status(200).json({
        success: true,
        result,
      });
    } catch (error) {
      next(error); // Pass any errors to error-handling middleware
    }
  }
);

export const payTabsWebHook = catchAsync(
  async (
    req: Request<{}, {}, PaymentResultBody>,
    res: Response,
    next: NextFunction
  ) => {
    // verify webhook signature
    const signatureVerification = verifyPayTabsWebHookSignature(req);
    if (!signatureVerification) {
      return next(new AppError("illegal attempt", 401));
    }
    console.log("hello from web hook");
    console.log(req.body);
    console.log("query:", req.query);
    console.log("params:", req.params);
    console.log("req.headers:", req.headers);

    const cart = await Cart.findById(req.body.cart_id);
    if (!cart) {
      return next(new AppError("cart not found", 404));
    }
    console.log("cart", cart);
    const user = await User.findOne({ email: req.body.customer_details.email });
    const status = req.body.payment_result.response_status;
    if (status === "A") {
      // Handle successful payment
      // logic here (e.g., update database)
      const price = req.body.cart_amount;
      const order = await Order.create({
        user: user!._id,
        cartItems: cart!.cartItems,
        totalOrderPrice: price,
        isPaid: true,
        PaidAt: Date.now(),
        paymentMethod: "online",
        shippingAddress: {
          city: req.body.shipping_details.city,
          details: req.body.shipping_details.street1,
          state: req.body.shipping_details.state,
          postalCode: req.body.shipping_details.zip,
        },
      });
      //console.log(cart, user, order);
      console.log("success payment".bgGreen);
      cart!.cartItems.forEach(async (item) => {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { quantity: -item.quantity!, sold: +item.quantity! },
        });
      });
      //5-remove cart
      await Cart.deleteOne({ _id: cart!._id });
      res.status(200).json({
        success: true,
        message: "payment is created successfully",
      });
    }
  }
);
export const getAllOrders = getAll(Order, "Order");
export const getOneOrder = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    let filter: PublicObject = {};
    if (req.user?.role === "user") {
      filter = { user: req.user._id };
    }
    filter._id = req.params.id;
    const order = await Order.findOne(filter);
    if (!order) {
      return next(
        new AppError(
          "no order found with that id or that order not be long to you",
          404
        )
      );
    }
    res.status(200).json({
      success: true,
      order,
    });
  }
);

export const updateOrderToDeliver = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return next(new AppError("no order found with that id", 404));
    }
    order.isDelivered = true;
    order.deliverAt = new Date();
    await order.save();
    res.status(200).json({
      success: true,
      order,
    });
  }
);
