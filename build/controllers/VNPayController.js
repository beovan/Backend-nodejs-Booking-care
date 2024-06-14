"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.vnpayController = void 0;
var _moment = _interopRequireDefault(require("moment"));
var _crypto = require("crypto");
var _qs = _interopRequireDefault(require("qs"));
var _querystring = _interopRequireDefault(require("querystring"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var sortObject = function sortObject(obj) {
  var sorted = {};
  var str = Object.keys(obj).map(encodeURIComponent).sort();
  str.forEach(function (key) {
    sorted[key] = encodeURIComponent(obj[key]).replace(/%20/g, "+");
  });
  return sorted;
};
var create_payment_url = function create_payment_url(req, res) {
  var _req$body = req.body,
    amount = _req$body.amount,
    bankCode = _req$body.bankCode,
    _req$body$language = _req$body.language,
    language = _req$body$language === void 0 ? "vn" : _req$body$language;
  var tmnCode = process.env.VNP_TMN_CODE;
  var secretKey = process.env.VNP_SECURE_SECRET;
  var vnpUrl = process.env.VNPAY_URL;
  var returnUrl = process.env.VNP_RETURN_URL;
  var createDate = (0, _moment["default"])().format("YYYYMMDDHHmmss");
  var orderId = (0, _moment["default"])().format("DDHHmmss");
  var ipAddr = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  var vnp_Params = _objectSpread({
    vnp_Version: "2.1.0",
    vnp_Command: "pay",
    vnp_TmnCode: tmnCode,
    vnp_Locale: language,
    vnp_CurrCode: "VND",
    vnp_TxnRef: orderId,
    vnp_OrderInfo: "Thanh toan maGD:".concat(orderId),
    vnp_OrderType: "Update Pro",
    vnp_Amount: amount * 100,
    vnp_ReturnUrl: returnUrl,
    vnp_IpAddr: ipAddr,
    vnp_CreateDate: createDate
  }, bankCode && {
    vnp_BankCode: bankCode
  });
  var sortedParams = sortObject(vnp_Params);
  var signData = _qs["default"].stringify(sortedParams, {
    encode: false
  });
  var hmac = (0, _crypto.createHmac)("sha512", secretKey);
  var signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");
  sortedParams.vnp_SecureHash = signed;
  res.set("Content-Type", "text/html");
  res.send(JSON.stringify({
    errCode: 0,
    data: "".concat(vnpUrl, "?").concat(_qs["default"].stringify(sortedParams, {
      encode: false
    }))
  }));
};
var vnpay_return = function vnpay_return(req, res) {
  var _req$body$day = req.body.day,
    defaultDay = _req$body$day === void 0 ? 30 : _req$body$day;
  var vnp_Params = req.query;
  var secureHash = vnp_Params.vnp_SecureHash;
  var gia = vnp_Params.vnp_Amount;
  delete vnp_Params.vnp_SecureHash;
  delete vnp_Params.vnp_SecureHashType;
  var sortedParams = sortObject(vnp_Params);
  var secretKey = process.env.VNP_SECURE_SECRET;
  var signData = _querystring["default"].stringify(sortedParams, {
    encode: false
  });
  var hmac = (0, _crypto.createHmac)("sha512", secretKey);
  var signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");
  console.log("secureHash", secureHash === signed);
  if (secureHash === signed) {
    var responseCode = sortedParams.vnp_ResponseCode;
    if (responseCode === "00") {
      var daysMap = {
        50000000: 180,
        100000000: 365
      };
      var day = daysMap[gia] || defaultDay;
      res.send(JSON.stringify({
        success: true,
        mgs: "Thanh toán thành công"
      }));
    } else {
      res.send(JSON.stringify({
        success: false,
        code: responseCode,
        redirectUrl: URL_REACT
      }));
    }
  } else {
    res.redirect(process.env.URL_REACT);
    // res.send(
    //   JSON.stringify({ success: false, code: "97", redirectUrl: process.env.URL_REACT })
    // );
  }
};
var vnpayController = exports.vnpayController = {
  create_payment_url: create_payment_url,
  vnpay_return: vnpay_return
};