import db from "../models/index";
import CRUDservice from "../services/CRUDservice";

let getHomePage = async (req, res) => {
  try {
    let data = await db.user.findAll();
    console.log(data);
    return res.render("homePage.ejs", {
      data: JSON.stringify(data),
    });
  } catch (e) {
    console.log(e);
  }
};

let getCRUD = async (req, res) => {
  try {
    let data = await db.user.findAll();
    console.log(data);
    return res.render("pageCRUD.ejs", {
      data: JSON.stringify(data),
    });
  } catch (e) {
    console.log(e);
  }
};

let postCRUD = async (req, res) => {
  let message = await CRUDservice.createNewUser(req.body);
  console.log(message);
  return res.send("post crud from server");
};

let displayGetCRUD = async (req, res) => {
  let data = await CRUDservice.getAllUser();
  console.log(data);
  return res.render("displayCRUD.ejs", {
    dataTable: data,
  });
};

let getEditCrud = async (req, res) => {
  let userId = req.query.id;
  if (userId) {
    let userData = await CRUDservice.getUserInfoById(userId);
    console.log(userData);
    return res.render("editCURD.ejs", {
      user: userData,
    });
  } else {
    return res.send("User not found !!!");
  }
};

let putCRUD = async (req, res) => {
  let data = req.body;
  let allNewUsers = await CRUDservice.updateUserData(data);
  return res.render("displayCRUD.ejs", {
    dataTable: allNewUsers,
  });
};

let deleteCRUD = async (req, res) => {
  let id = req.query.id;
  if (id) {
    await CRUDservice.deleteUserById(id);
    return res.send("Delete done !!!");
  } else {
    return res.send("Not found User");
  }
};

module.exports = {
  getHomePage: getHomePage,
  getCRUD: getCRUD,
  postCRUD: postCRUD,
  displayGetCRUD: displayGetCRUD,
  getEditCrud: getEditCrud,
  putCRUD: putCRUD,
  deleteCRUD: deleteCRUD,
};
