import db from "../models/index";
require("dotenv").config();

let postBookAppointment = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.email ||
                 !data.doctorId ||
                  !data.timeType ||
                   !data.date) {
                    resolve({
                        errCode: 1,
                        errMessage: "Missing required parameter",
                    });
                    console.log("data", data);
            } else {


                await emailservice.sendSimpleEmail({
                    reciverEmail: data.email,
                    patientName: 'Hỏi Dân IT patient name',
                    time: '8:00-9:00 Chủ nhật 1/8/2021',
                    doctorName: "ERIC",
                    redirectLink: 'https://www.youtube.com/channel/UCVkBcokjObNZiXavfAE1-fA'
                    })

                //upsert patient
                let user = await db.User.findOne({
                    where: { email: data.email },
                    default: {
                        email: data.email,
                        roleId: "R3",
                    },
                });

                // console.log("user", user[0]);
                //create a bookking record
                if (user && user[0]) {
                    await db.Booking.findOrCreate({
                    where: {
                        patientId: user[0].id,
                        default: {
                            statusId: "S1",
                            doctorId: data.doctorId,
                            patientId: user[0].id,
                            date: data.date,
                            timeType: data.timeType,
                        },
                        }
                    })      
                }
                resolve({
                    errCode: 0,
                    errMessage: "Save infor patient success",
                });
            }
        } catch (e) {
            reject(e);
        }
    })
}
module.exports = {
    postBookAppointment: postBookAppointment,
}