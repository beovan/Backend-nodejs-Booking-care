import moment from "moment";
import { createHmac } from "crypto";
import qs from "qs";
import querystring from "querystring";

const sortObject = (obj) => {
  const sorted = {};
  const str = Object.keys(obj).map(encodeURIComponent).sort();
  str.forEach((key) => {
    sorted[key] = encodeURIComponent(obj[key]).replace(/%20/g, "+");
  });
  return sorted;
};

const create_payment_url = (req, res) => {
  const { amount, bankCode, language = "vn" } = req.body;
  const tmnCode = process.env.VNP_TMN_CODE;
  const secretKey = process.env.VNP_SECURE_SECRET;
  const vnpUrl = process.env.VNPAY_URL;
  const returnUrl = process.env.VNP_RETURN_URL;
  const createDate = moment().format("YYYYMMDDHHmmss");
  const orderId = moment().format("DDHHmmss");
  const ipAddr = req.headers["x-forwarded-for"] || req.connection.remoteAddress;

  const vnp_Params = {
    vnp_Version: "2.1.0",
    vnp_Command: "pay",
    vnp_TmnCode: tmnCode,
    vnp_Locale: language,
    vnp_CurrCode: "VND",
    vnp_TxnRef: orderId,
    vnp_OrderInfo: `Thanh toan maGD:${orderId}`,
    vnp_OrderType: "Update Pro",
    vnp_Amount: amount * 100,
    vnp_ReturnUrl: returnUrl,
    vnp_IpAddr: ipAddr,
    vnp_CreateDate: createDate,
    ...(bankCode && { vnp_BankCode: bankCode }),
  };

  const sortedParams = sortObject(vnp_Params);
  const signData = qs.stringify(sortedParams, { encode: false });
  const hmac = createHmac("sha512", secretKey);
  const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");
  sortedParams.vnp_SecureHash = signed;

  res.set("Content-Type", "text/html");
  res.send(
    JSON.stringify({
      errCode: 0,
      data: `${vnpUrl}?${qs.stringify(sortedParams, { encode: false })}`,
    })
  );
};

const vnpay_return = (req, res) => {
  const { day: defaultDay = 30 } = req.body;
  const vnp_Params = req.query;
  const secureHash = vnp_Params.vnp_SecureHash;
  const gia = vnp_Params.vnp_Amount;

  delete vnp_Params.vnp_SecureHash;
  delete vnp_Params.vnp_SecureHashType;

  const sortedParams = sortObject(vnp_Params);

  const secretKey = process.env.VNP_SECURE_SECRET;
  const signData = querystring.stringify(sortedParams, { encode: false });

  const hmac = createHmac("sha512", secretKey);
  const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");
  console.log("secureHash", secureHash === signed);
  if (secureHash === signed) {
    const responseCode = sortedParams.vnp_ResponseCode;
    if (responseCode === "00") {
      const daysMap = {
        50000000: 180,
        100000000: 365,
      };

      const day = daysMap[gia] || defaultDay;

      res.send(JSON.stringify({ success: true, mgs: "Thanh toán thành công" }));
    } else {
      res.send(
        JSON.stringify({
          success: false,
          code: responseCode,
          redirectUrl: URL_REACT,
        })
      );
    }
  } else {
    res.redirect(process.env.URL_REACT)
    // res.send(
    //   JSON.stringify({ success: false, code: "97", redirectUrl: process.env.URL_REACT })
    // );
    
  }
};

export const vnpayController = {
  create_payment_url,
  vnpay_return,
};
