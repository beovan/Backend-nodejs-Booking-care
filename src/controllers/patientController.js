import patientService from "../services/patientService";

let postBookAppointment = async (req, res) => {
  try {
    let infor = await patientService.postBookAppointment(req.body);
    return res.status(200).json(infor);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from server",
    });
  }
};

let postVerifyBookAppointment =async (req, res) => {
  try {
    let infor = await patientService.postVerifyBookAppointment(req.body);
    return res.status(200).json(infor);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from server",
    });
  }
}

let handleCreateNewPatient = async (req, res) => {
  try {
    let message = await patientService.createNewPatient(req.body);
    return res.status(200).json(message);   
  } catch (error) {
    console.log(error);
    return res.status(200).json({
      errCode: -1,
      errMessage: error.errMessage
    });
  }
}
let handleForgotPassword = async (req, res) => {
  try {
    let message = await patientService.forgotPassword(req.body);
    return res.status(200).json(message);
  } catch (error) {
    console.log(error);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from server",
    });
  }
}
let handleResetPassword = async (req, res) => {
  try {
    let message = await patientService.resetPassword(req.body);
    return res.status(200).json(message);
  } catch (error) {
    console.log(error);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from server",
    });
  }
}
let getBookingByUserId = async (req, res) => {
  try {
    let message = await patientService.getBookingByUserId({ userId: req.query.userId });
    console.log('message:', message);
    return res.status(200).json(message);
  } catch (error) {
    console.log(error);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from server",
    });
  }
}
module.exports = {
    postBookAppointment: postBookAppointment,
    postVerifyBookAppointment: postVerifyBookAppointment,
    handleCreateNewPatient: handleCreateNewPatient,
    handleForgotPassword: handleForgotPassword,
    handleResetPassword: handleResetPassword,
    getBookingByUserId: getBookingByUserId
}