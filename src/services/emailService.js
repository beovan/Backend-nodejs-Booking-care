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
    html: `
    <h3>Xin chào ${dataSend.patientName}!</h3>
<p>Bạn nhận được email này vì đã đặt lịch khám bệnh online trên Hỏi Dân IT channe
<p>Thông tin đặt lịch khám bệnh:</p>
<div><b>Thời gian: ${dataSend.time}</b></div>
<div><b>Bác sĩ: ${dataSend.doctorName}</b></div>
<p>Nếu các thông tin trên là đúng sự thật, vui lòng click vào đường link bên dướ để xác nhận và hoàn tất thủ tục đặt lịch khám bệnh.
</p>
<div>
<a href=${dataSend.redirectLink} target="_blank" >Click here</a>
<div>Xin cảm ơn</div>
    `
  })
};
