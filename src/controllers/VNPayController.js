// import { StatusCodes } from 'http-status-codes';
// import { userService } from '~/services/userService';
// const moment = require('moment');

// function sortObject(obj) {
//   let sorted = {};
//   let str = [];
//   let key;
//   for (key in obj) {
//     if (obj.hasOwnProperty(key)) {
//       str.push(encodeURIComponent(key));
//     }
//   }
//   str.sort();
//   for (key = 0; key < str.length; key++) {
//     sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, '+');
//   }
//   return sorted;
// }

// const create_payment_url = async (req, res) => {
//   // #swagger.tags = ['vnpay']
//   // #swagger.summary = 'add'
//   process.env.TZ = 'Asia/Ho_Chi_Minh';

//   let date = new Date();
//   let createDate = moment(date).format('YYYYMMDDHHmmss');

//   let ipAddr =
//     req.headers['x-forwarded-for'] ||
//     req.connection.remoteAddress ||
//     req.socket.remoteAddress ||
//     req.connection.socket.remoteAddress;

//   let tmnCode = process.env.VNP_TMN_CODE;
//   let secretKey = process.env.VNP_SECURE_SECRET;
//   let vnpUrl = process.env;
//   let returnUrl = process.env.VNP_RETURN_URL;

//   let orderId = req.body.orderId;
//   let amount = req.body.amount;

//   let bankCode = '';

//   let locale = '';
//   if (locale === null || locale === '') {
//     locale = 'vn';
//   }
//   let currCode = 'VND';
//   let vnp_Params = {};
//   vnp_Params['vnp_Version'] = '2.1.0';
//   vnp_Params['vnp_Command'] = 'pay';
//   vnp_Params['vnp_TmnCode'] = tmnCode;
//   vnp_Params['vnp_Locale'] = locale;
//   vnp_Params['vnp_CurrCode'] = currCode;
//   vnp_Params['vnp_TxnRef'] = orderId;
//   vnp_Params['vnp_OrderInfo'] = 'Thanh toan maGD:' + orderId;
//   vnp_Params['vnp_OrderType'] = 'Update Pro';
//   vnp_Params['vnp_Amount'] = amount * 100;
//   vnp_Params['vnp_ReturnUrl'] = returnUrl;
//   vnp_Params['vnp_IpAddr'] = ipAddr;
//   vnp_Params['vnp_CreateDate'] = createDate;
//   if (bankCode !== null && bankCode !== '') {
//     vnp_Params['vnp_BankCode'] = bankCode;
//   }
//   vnp_Params = sortObject(vnp_Params);
//   let querystring = require('qs');
//   let signData = querystring.stringify(vnp_Params, { encode: false });
//   let crypto = require('crypto');
//   let hmac = crypto.createHmac('sha512', secretKey);
//   let signed = hmac.update(new Buffer(signData, 'utf-8')).digest('hex');
//   vnp_Params['vnp_SecureHash'] = signed;
//   vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: false });
//   res.set('Content-Type', 'text/html');
//   res.send(JSON.stringify(vnpUrl));
// };

// const vnpay_return = async (req, res) => {
//   // #swagger.tags = ['vnpay']
//   // #swagger.summary = 'check'
//   let { day = 30 } = req.body;
//   let vnp_Params = req.query;

//   let secureHash = vnp_Params['vnp_SecureHash'];
//   let gia = vnp_Params['vnp_Amount'];
//   let hash = secureHash;

//   delete vnp_Params['vnp_SecureHash'];
//   delete vnp_Params['vnp_SecureHashType'];

//   vnp_Params = sortObject(vnp_Params);

//   let secretKey = 'DENHJRMJZSHXENEAWJVJWBBENOMZAXST';
//   let querystring = require('qs');
//   let signData = querystring.stringify(vnp_Params, { encode: false });
//   let crypto = require('crypto');
//   let hmac = crypto.createHmac('sha512', secretKey);
//   let signed = hmac.update(new Buffer(signData, 'utf-8')).digest('hex');

//   if (secureHash === signed) {
//     const responseCode = vnp_Params['vnp_ResponseCode'];
//     if (responseCode == '00') {
//       const user = await userService.getUserByIdCheckSecureHash(
//         req.userId || req.userIdPro,
//         hash
//       );
//       if (user === '00') {
//         if (gia == 50000000) {
//           day = 180;
//         }
//         if (gia == 100000000) {
//           day = 365;
//         }
//         const updatePro = await userService.updateUserPro(
//           req.userId || req.userIdPro,
//           Number(day)
//         );
//         res.send(
//           JSON.stringify({ success: true, mgs: 'Thanh toán thành công' })
//         );
//         return;
//       } else {
//         res.send(JSON.stringify({ success: false, code: '99' }));
//         return;
//       }
//     } else {
//       res.send(JSON.stringify({ success: false, code: responseCode }));
//     }
//   } else {
//     res.send(JSON.stringify({ success: false, code: '97' }));
//   }
// };
// export const vnpayController = {
//   create_payment_url,
//   vnpay_return,
// };