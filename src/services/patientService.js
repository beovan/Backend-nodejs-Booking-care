import { lang } from "moment";
import db from "../models/index";
require("dotenv").config();

let postBookAppointment = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.email ||
                 !data.doctorId ||
                  !data.timeType ||
                   !data.date ||
                    !data.fullName 
                ) {
                    resolve({
                        errCode: 1,
                        errMessage: "Missing required parameter",
                    });
                    console.log("data", data);
            } else {


                await emailservice.sendSimpleEmail({
                    reciverEmail: data.email,
                    patientName: data.fullName,
                    time: data.timeString,
                    doctorName: data.doctorName,
                    languge: data.languge,
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