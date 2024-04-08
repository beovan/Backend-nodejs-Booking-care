require("dotenv").config();
import nodemailer from "nodemailer";

let sendSimpleEmail = async (dataSend) => {
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  let info = await transporter.sendMail({
    from: '"beovan" <beovan204@gmail.com>',
    to: dataSend.reciverEmail,
    subject: "Thông tin đặt lịch khám bệnh",
    html: getBodyHTMLEmail(dataSend),
  });
};

let getBodyHTMLEmail = (dataSend) => {
  let result = "";
  if (dataSend.languge === "vi") {
    result = `
    <h3>Xin chào ${dataSend.patientName}!</h3>
<p>Bạn nhận được email này vì đã đặt lịch khám bệnh online từ website của chúng tôi medical society.</p>
<p>Thông tin đặt lịch khám bệnh:</p>
<div><b>Thời gian: ${dataSend.time}</b></div>
<div><b>Bác sĩ: ${dataSend.doctorName}</b></div>
<p>Nếu các thông tin trên là đúng sự thật, vui lòng click vào đường link bên dưới để xác nhận và hoàn tất thủ tục đặt lịch khám bệnh.
</p>
<div>
<a href=${dataSend.redirectLink} target="_blank" >Click here</a>
<div>Xin cảm ơn</div>
    `;
  }
  if (dataSend.languge === "en") {
    result = `
    <h3>Dear ${dataSend.patientName}</h3>
    <p>You are receiving this email because you have booked an online medical appointment from our medical society website.</p>
    <p>Information to schedule an appointment:</p>
    <div><b>Time: ${dataSend.time}</b></div>
    <div><b>Doctor: ${dataSend.doctorName}</b></div>
    <p>If the above information is true, please click on the link below to confirm and complete the medical appointment booking procedure.
    </p>
    <div>
    <a href=${dataSend.redirectLink} target="_blank" </div>
    <div> Sincerely thank!</div>
    `
  }
  return result;
};
module.exports = {
  sendSimpleEmail: sendSimpleEmail,
}
