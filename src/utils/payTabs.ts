import crypto from "crypto";
import { Request } from "express";
import PayTabs from "paytabs_pt2";
import {
  payTabs_Cart_details,
  payTabs_Customer_details,
  payTabs_frame_mode,
  payTabs_lang,
  payTabs_PaymentMethods,
  payTabs_Response_Urls,
  payTabs_Shipping_address,
  payTabs_Transaction_details,
  payTabsInitResult,
} from "../types/payTabs";
export const PayTabsSettings = () => {
  let profileID = process.env.PROFILE_ID,
    serverKey = process.env.SERVER_KEY,
    region = process.env.REGION;

  PayTabs.setConfig(profileID, serverKey, region);
};

export const createPayTabsPaymentPage = (
  paymentMethods: payTabs_PaymentMethods,
  transaction_details: payTabs_Transaction_details,
  cart_details: payTabs_Cart_details,
  customer_details: payTabs_Customer_details,
  shipping_address: payTabs_Shipping_address,
  response_URLs: payTabs_Response_Urls,
  lang: payTabs_lang,
  frameMode: payTabs_frame_mode
) =>
  new Promise((resolve, reject) => {
    PayTabs.createPaymentPage(
      paymentMethods,
      transaction_details,
      cart_details,
      customer_details,
      shipping_address,
      response_URLs,
      lang,
      function (results: payTabsInitResult) {
        if (results.redirect_url) {
          resolve(results);
        } else {
          reject(new Error("Payment page creation failed"));
        }
      },
      frameMode
    );
  });

export const verifyPayTabsWebHookSignature = (req: Request) => {
  const signature = req.headers.signature;
  const data = req.body;
  const hash = crypto
    .createHmac("sha256", process.env.SERVER_KEY!)
    .update(JSON.stringify(data))
    .digest("hex");
  return hash === signature;
};

export const verifyReturnUrlBody = (req: Request) => {
  const serverKey = "SWJ9NMMG69-JK22K96Z9J-W2DJJGHJTL";

  // Mocked raw content received from PayTabs
  const rawData = req.body;

  // Step 1: Remove 'signature' from the data
  const { signature, ...dataWithoutSignature } = rawData;

  // Step 2: Remove empty parameters
  const filteredData = Object.fromEntries(
    Object.entries(dataWithoutSignature).filter(([_, value]) => value !== "")
  );

  // Step 3: Sort parameters by keys
  const sortedData = Object.keys(filteredData)
    .sort()
    .reduce((acc, key) => {
      acc[key] = filteredData[key];
      return acc;
    }, {});

  // Step 4: Convert sorted parameters to query string format
  const queryString = Object.entries(sortedData)
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(value as string)}`
    )
    .join("&");

  // Step 5: Generate the HMAC SHA256 hash using the server key
  const hash = crypto
    .createHmac("sha256", serverKey)
    .update(queryString)
    .digest("hex");

  // Step 6: Compare the generated hash with the received signature
  return hash === signature;
};
