import userService from "../services/userService";

let handleLogin = async (req, res) => {
  let email = req.body.email;
  let password = req.body.password;

  if (!email || !password) {
    return res.status(500).json({
      errCode: 1,
      message: "Missing inputs parameter!",
    });
  }

  let userData = await userService.handleUserLogin(email, password);
  //check email exist
  //password nhap vao ko dung
  //return userInfor
  // access_token :JWT json web token

  return res.status(200).json({
    errCode: userData.errCode,
    message: userData.errMessage,
    user: userData.user ? userData.user : {},
  });
};

let handleGetAllUser = async (req, res) => {
  let id = req.query.id; //ALL, id

  if (!id) {
    return res.status(200).json({
      errCode: 1,
      errMessage: "Missing required parameter",
      users: [],
    });
  }

  let users = await userService.getAllUser(id);

  return res.status(200).json({
    errCode: 0,
    errMessage: "OK",
    users,
  });
};

let handleCreateNewUser = async(req, res) => {
  let message = await userService.createNewUser(req.body);
  return res.status(200).json(message);
}

let handleDeleteUser = async(req, res) => {
  if(!req.body.id) {
    return res.status(200).josn({
      errCode: 1,
      message: "Missing required parameter !!!"
    })
  }
  let message = await userService.deleteUser(req.body.id);
  return res.status(200).json(message);
}

let handleEditUser = async(req, res) => {
  let message = await userService.updateUserData(req.body);
  return res.status(200).json(message)
}

let getAllCode = async(req, res) => {
  try {
    setTimeout(async() => {
      let data = await userService.getAllCodeService(req.query.type);
    return res.status(200).json(data);
    }, 1000)
  } catch (e) {
    console.log('Get AllCode Server', e)
    return res.status(200).json({
      errCode: -1,
      errMessage: 'Error Fromm Server'
    })
  }
}

module.exports = {
  handleLogin: handleLogin,
  handleGetAllUser: handleGetAllUser,
  handleCreateNewUser: handleCreateNewUser,
  handleEditUser: handleEditUser,
  handleDeleteUser: handleDeleteUser,
  getAllCode: getAllCode
};
