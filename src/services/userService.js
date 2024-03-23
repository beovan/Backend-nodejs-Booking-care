import db from "../models/index";
import bcrypt from "bcryptjs";
let handleUserLogin = (email, password) => {
  return new Promise(async (resolve, reject) => {
    try {
      let userData = {};

      let isExist = await checkUserEmail(email);
      if (isExist) {
        let user = await db.User.findOne({
            attributes: ['email','roleId','password'],
          where: { email: email },
          raw: true
        });
        if (user) {
          let check = await bcrypt.compareSync(password, user.password);
        // let check = true;
          if (check) {
            userData.errCode = 0;
            userData.errMessage = "Ok";
            console.log(user);
            delete user.password;
            userData.user = user;
          } else {
            userData.errCode = 3;
            userData.errMessage = `Your password isnt correct. Please try again`;
          }
        } else {
          userData.errCode = 2;
          userData.errMessage = `User isnt found in the system`;
        }
      } else {
        userData.errCode = 1;
        userData.errMessage =
          "Your email isnt exist in the system. Please try again";
      }
      resolve(userData);
    } catch (e) {
      reject(e);
    }
  });
};
let checkUserEmail = (userEmail) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await db.User.findOne({
        where: { email: userEmail },
      });
      if (user) {
        resolve(true);
      } else {
        resolve(false);
      }
    } catch (e) {
      reject(e);
    }
  });
};
module.exports = {
  handleUserLogin: handleUserLogin,
};
