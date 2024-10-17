import { Request, Response, NextFunction } from "express";
import catchAsync from "express-async-handler";
import PayTabs from "paytabs_pt2";
import { PaymentParams } from "../dtos/order.dto";
import Cart from "../models/cart.model";
import AppError from "../utils/appError";
export const intiPayTabs = catchAsync(
  async (req: Request<PaymentParams>, res: Response, next: NextFunction) => {
    // 1- Setting paytabs configuration
    let profileID = process.env.PROFILE_ID,
      serverKey = process.env.SERVER_KEY,
      region = process.env.REGION;

    PayTabs.setConfig(profileID, serverKey, region);

    // 2- Initiating paytabs payments
    let paymentMethods = ["all"];
    let transaction = {
      type: "sale",
      class: "ecom",
    };
    //1- get cart with cart Id
    //app settings
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

    let cart = {
      id: req.params.cartId,
      currency: "EGP",
      amount: totalCartPrice,
      description: "description perfecto",
    };
    let customer = {
      name: req.user?.name,
      email: req.user?.email,
      phone: req.user?.phoneNumber,
      street1: req.user?.addresses![0].alias,
      city: req.user?.addresses![0].city,
      state: req.user?.addresses![0].details,
      country: "EG",
      zip: req.user?.addresses![0].postalCode,
    };
    let transaction_details = [transaction.type, transaction.class];
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

    let url = {
      callback: "https://webhook.site/44a2a603-0dbc-48cd-a01b-15b8529cc098",
      response: "https://webhook.site/44a2a603-0dbc-48cd-a01b-15b8529cc098",
    };

    let response_URLs = [url.callback, url.response];

    let lang = "ar";
    let frameMode = true;

    // Wrap createPaymentPage in a Promise
    const createPaymentPageAsync = () =>
      new Promise((resolve, reject) => {
        PayTabs.createPaymentPage(
          paymentMethods,
          transaction_details,
          cart_details,
          customer_details,
          shipping_address,
          response_URLs,
          lang,
          function (results) {
            if (results.redirect_url) {
              resolve(results);
            } else {
              reject(new Error("Payment page creation failed"));
            }
          },
          frameMode
        );
      });

    try {
      // Wait for payment page creation
      const result = await createPaymentPageAsync();

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
  async (req: Request<PaymentParams>, res: Response, next: NextFunction) => {
    console.log(req.body);
    res.status(200).json({
      success: true,
      message: "webhook received",
    });
  }
);
