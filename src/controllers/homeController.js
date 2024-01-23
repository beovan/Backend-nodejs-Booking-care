let getHomePage = (req, res) => {
  return res.render("homepage.ejs");
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
