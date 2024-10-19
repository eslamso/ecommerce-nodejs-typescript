import { Types } from "mongoose";

export type payTabs_PaymentMethods = string[];
export type payTabs_Transaction = {
  type: string;
  class: string;
};
export type payTabs_Cart = {
  id: string;
  currency: "EGP";
  amount: number;
  description: string;
};

export type payTabs_Cart_details = (string | number)[];
export type payTabs_Customer = {
  name: string;
  email: string;
  phone: string;
  street1?: string;
  city?: string;
  state?: string;
  country?: "EG";
  zip?: string;
  ip?: string;
};
export type payTabs_Transaction_details = [string, string];
export type payTabs_Customer_details = (string | undefined)[];
export type payTabs_Shipping_address = (string | undefined)[];
export type payTabs_Urls = { callback: string; response: string };
export type payTabs_Response_Urls = [string, string];

export type payTabs_lang = "ar" | "en";
export type payTabs_frame_mode = boolean;
export interface payTabsInitResult {
  tran_ref: string;
  tran_type: string;
  cart_id: Types.ObjectId;
  cart_description: string;
  cart_currency: string;
  cart_amount: string;
  tran_total: string;
  callback: string;
  return: string;
  redirect_url: string;
  customer_details: payTabs_Customer;
  shipping_details: payTabs_Customer;
  serviceId: number;
  profileId: number;
  merchantId: number;
  trace: string;
}

export interface PaymentResultBody {
  tran_ref: string;
  merchant_id: number;
  profile_id: number;
  cart_id: Types.ObjectId;
  cart_description: string;
  cart_currency: string;
  cart_amount: string;
  tran_currency: string;
  tran_total: string;
  tran_type: string;
  tran_class: string;
  customer_details: payTabs_Customer;
  shipping_details: payTabs_Customer;
  payment_result: PaymentResultDetails;
  payment_info: PaymentInfo;
  ipn_trace: string;
}

interface PaymentResultDetails {
  response_status: string;
  response_code: string;
  response_message: string;
  acquirer_ref: string;
  cvv_result: string;
  avs_result: string;
  transaction_time: string | Date;
}

interface PaymentInfo {
  payment_method: string;
  card_type: string;
  card_scheme: string;
  payment_description: string;
  expiryMonth: number;
  expiryYear: number;
}
