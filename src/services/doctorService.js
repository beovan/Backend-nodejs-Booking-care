import db from "../models/index";

let getTopDoctorHome = (limitInput) => {
  return new Promise(async (resolve, reject) => {
    try {
      let users = await db.User.findAll({
        limit: limitInput,
        where: { roleId: "R2" },
        order: [["createdAt", "DESC"]],
        attrFibutes: {
          exclude: ["password"],
        },
        include: [
          {
            model: db.Allcode,
            as: "positionData",
            attributes: ["valueVi", "valueEn"],
          },
          {
            model: db.Allcode,
            as: "genderData",
            attributes: ["valueVi", "valueEn"],
          },
        ],
        raw: true,
        nest: true,
      });

      resolve({
        errCode: 0,
        data: users,
      });
    } catch (e) {
        reject(e);
    }
  });
};
let getAllDoctors = () => {
  return new Promise(async(resolve, reject) => {
    try {
        let doctors = await db.User.findAll({
            where: { roleId: "R2" },
            attributes: {
                exclude: ["password", "image"]
              },
        });
        resolve({
            errCode: 0,
            data: doctors
        });
    } catch (e) {
        reject(e);
    }
})
}

let saveDetailInfoDoctor = (inputData) => {
  return new Promise(async(resolve,reject)=> {
    try {
      if (!inputData.doctorId || !inputData.contentHTML || !inputData.contentMarkdown) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameters",
        });
        console.log
      }
      else{

        await db.Markdown.create({
            contentHTML: inputData.contentHTML,
            contentMarkdown: inputData.contentMarkdown,
            description: inputData.description,
            doctorId: inputData.doctorId,
        })
        resolve({
          errCode: 0,
          errMessage: "Save info doctor succeed",
        })
      }
    } catch (e) {
        reject(e);
    }
  })
}
module.exports = {
    getTopDoctorHome: getTopDoctorHome,
    getAllDoctors: getAllDoctors,
    saveDetailInfoDoctor : saveDetailInfoDoctor
}
