
const moment = require('moment');
import crypto from 'crypto';
import qs from 'qs';

function sortObject(obj) {
  let sorted = {};
  let str = [];
  let key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      str.push(encodeURIComponent(key));
    }
  }
  str.sort();
  for (key = 0; key < str.length; key++) {
    sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, '+');
  }
  return sorted;
}

const create_payment_url = async (req, res) => {
  process.env.TZ = 'Asia/Ho_Chi_Minh';

  const date = new Date();
  const createDate = moment(date).format('YYYYMMDDHHmmss');

  const ipAddr = req.headers['x-forwarded-for'] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      req.connection.socket.remoteAddress;

  const tmnCode = process.env.VNP_TMN_CODE;
  const secretKey = process.env.VNP_SECURE_SECRET;
  let vnpUrl = process.env.VNPAY_URL;
  const returnUrl = process.env.VNP_RETURN_URL;

  const orderId = moment(date).format('DDHHmmss');
  const amount = req.body.amount;

  let locale = req.body.language || 'vn';
  const currCode = 'VND';
  let vnp_Params = {
    'vnp_Version': '2.1.0',
    'vnp_Command': 'pay',
    'vnp_TmnCode': tmnCode,
    'vnp_Locale': locale,
    'vnp_CurrCode': currCode,
    'vnp_TxnRef': orderId,
    'vnp_OrderInfo': `Thanh toan maGD:${orderId}`,
    'vnp_OrderType': 'Update Pro',
    'vnp_Amount': amount * 100,
    'vnp_ReturnUrl': returnUrl,
    'vnp_IpAddr': ipAddr,
    'vnp_CreateDate': createDate
  };

  if (req.body.bankCode) {
    vnp_Params['vnp_BankCode'] = req.body.bankCode;
  }

  vnp_Params = sortObject(vnp_Params);
  const signData = qs.stringify(vnp_Params, { encode: false });
  const hmac = crypto.createHmac('sha512', secretKey);
  const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');
  vnp_Params['vnp_SecureHash'] = signed;
  vnpUrl += `?${qs.stringify(vnp_Params, { encode: false })}`;
  res.set('Content-Type', 'text/html');
  res.send(JSON.stringify(vnpUrl));
};


const vnpay_return = async (req, res) => {
  // #swagger.tags = ['vnpay']
  // #swagger.summary = 'check'
  let { day = 30 } = req.body;
  let vnp_Params = req.query;

  let secureHash = vnp_Params['vnp_SecureHash'];
  let gia = vnp_Params['vnp_Amount'];
  let hash = secureHash;

  delete vnp_Params['vnp_SecureHash'];
  delete vnp_Params['vnp_SecureHashType'];

  vnp_Params = sortObject(vnp_Params);

  let secretKey = 'DENHJRMJZSHXENEAWJVJWBBENOMZAXST';
  let querystring = require('qs');
  let signData = querystring.stringify(vnp_Params, { encode: false });
  let crypto = require('crypto');
  let hmac = crypto.createHmac('sha512', secretKey);
  let signed = hmac.update(new Buffer(signData, 'utf-8')).digest('hex');

  if (secureHash === signed) {
    const responseCode = vnp_Params['vnp_ResponseCode'];
    if (responseCode == '00') {

      if (user === '00') {
        if (gia == 50000000) {
          day = 180;
        }
        if (gia == 100000000) {
          day = 365;
        }

        res.send(
          JSON.stringify({ success: true, mgs: 'Thanh toán thành công' })
        );
        return;
      } else {
        res.send(JSON.stringify({ success: false, code: '99' }));
        return;
      }
    } else {
      res.send(JSON.stringify({ success: false, code: responseCode }));
    }
  } else {
    res.send(JSON.stringify({ success: false, code: '97' }));
  }
};
export const vnpayController = {
  create_payment_url,
  vnpay_return,
};