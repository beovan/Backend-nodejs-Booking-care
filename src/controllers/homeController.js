import db from "../models/index.js";
let getHomePage = async (req, res) => {
  try{
    let data = await db.User.findAll();
    return res.render("homepage.ejs", {
      data: JSON.stringify(data)
    });
  }
  catch(err){
    console.log(err);
  }

};

let getAboutPage = (req, res) => {
  return res.render("test/about.ejs");
}

// object: {
//     name: "Beovan",
//     age: 20,
//     address: "HCM",
//     };
// }

module.exports = {
  getHomePage: getHomePage,
  getAboutPage: getAboutPage
};
