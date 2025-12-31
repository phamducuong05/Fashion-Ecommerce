import { env } from "../config/env";
import crypto from "crypto";
import QueryString from "qs";
import { format } from "date-fns";

export const createPaymentUrl = (req: any, orderId: number, amount: number) => {
  const date = new Date();
  const createDate = format(date, "yyyyMMddHHmmss");

  const ipAddr =
    req.headers["x-forwarded-for"] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;

  const tmnCode = env.VNP_TMNCODE;
  const secretKey = env.VNP_HASHSECRET;
  let vnpUrl = env.VNP_URL;
  const returnUrl = env.VNP_RETURN_URL;

  if (!tmnCode || !secretKey) {
      throw new Error("Missing VNPay Configuration");
  }

  // Use defined type for vnp_Params
  let vnp_Params: Record<string, any> = {};
  vnp_Params["vnp_Version"] = "2.1.0";
  vnp_Params["vnp_Command"] = "pay";
  vnp_Params["vnp_TmnCode"] = tmnCode;
  vnp_Params["vnp_Locale"] = "vn";
  vnp_Params["vnp_CurrCode"] = "VND";
  vnp_Params["vnp_TxnRef"] = orderId;
  vnp_Params["vnp_OrderInfo"] = `Thanh toan don hang #${orderId}`;
  vnp_Params["vnp_OrderType"] = "other";
  vnp_Params["vnp_Amount"] = amount * 100; // VNPay amount is in smallest unit
  vnp_Params["vnp_ReturnUrl"] = returnUrl;
  vnp_Params["vnp_IpAddr"] = ipAddr;
  vnp_Params["vnp_CreateDate"] = createDate;

  vnp_Params = sortObject(vnp_Params);

  const signData = QueryString.stringify(vnp_Params, { encode: false });
  const hmac = crypto.createHmac("sha512", secretKey);
  const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");
  vnp_Params["vnp_SecureHash"] = signed;
  vnpUrl += "?" + QueryString.stringify(vnp_Params, { encode: false });

  return vnpUrl;
};

export const verifyReturnUrl = (vnp_Params: any) => {
  let secureHash = vnp_Params["vnp_SecureHash"];

  delete vnp_Params["vnp_SecureHash"];
  delete vnp_Params["vnp_SecureHashType"];

  vnp_Params = sortObject(vnp_Params);

  const secretKey = env.VNP_HASHSECRET;
  if (!secretKey) throw new Error("Missing VNPay Secret");

  const signData = QueryString.stringify(vnp_Params, { encode: false });
  const hmac = crypto.createHmac("sha512", secretKey);
  const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

  if (secureHash === signed) {
    return {
        isSuccess: vnp_Params["vnp_ResponseCode"] === "00",
        orderId: vnp_Params["vnp_TxnRef"]
    };
  } else {
    return { isSuccess: false, orderId: null };
  }
};

function sortObject(obj: any) {
  let sorted: any = {};
  let str = [];
  let key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      str.push(encodeURIComponent(key));
    }
  }
  str.sort();
  for (key = 0; key < str.length; key++) {
    sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
  }
  return sorted;
}
