const express = require("express");
const isEmpty = require("is-empty");
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const commonObject = require("../common/common");
const adminModel = require("../models/admin")
const userModel = require("../models/user");
const roleModel = require("../models/role")
const customerModel = require("../models/customer")
const { v4: uuidv4 } = require("uuid");
const LoggingModel = require("../models/login-track")
const config = require("../jwt/config/config")

// registration
router.post('/registration', async(req, res) => {


  let reqData = {
    "email":req.body.email,
    "phone":req.body.phone,
    "password":req.body.password,
    "confirm_password":req.body.confirm_password
  }

 

    // email validation
    if (isEmpty(reqData.email)) {
        return res.status(400).send({
          success: false,
          status: 400,
          message: "Invalid request data. 'email' is required and cannot be empty.",
        });
      }
    
      let validateEmail = await commonObject.isValidEmail(reqData.email);
      if (validateEmail == false) {
        return res.status(400).send({
          success: false,
          status: 400,
          message: "Email is not valid",
        });
      }
    
      let existingUserByEmail = await userModel.getUserByEmail(reqData.email);
    
     
    
      if (!isEmpty(existingUserByEmail)) {
        return res.status(400).send({
          success: false,
          status: 400,
          message: "Email already in Use.",
        });
      }
    
      // phone validation
    
      if (isEmpty(reqData.phone)) {
        return res.status(400).send({
          success: false,
          status: 400,
          message: "Invalid request data. 'Phone' is required and cannot be empty.",
        });
      }
    
      let validatePhone = await commonObject.isValidPhoneNumberOfBD(reqData.phone);
      if (validatePhone == false) {
        return res.status(400).send({
          success: false,
          status: 400,
          message: "Phone is not valid",
        });
      }
      

    // // Check role id validation
    // let validateRoleId = await commonObject.checkItsNumber(reqData.user_type);
    // if (validateRoleId.success == false) {

    //     return res.status(400).send({
    //         "success": false,
    //         "status": 400,
    //         "message": "Role Id Value should be integer.",
    //         "id": reqData.user_type

    //     });
    // } else {
    //    reqData.user_type = validateRoleId.data;
          
    // }

    // if(reqData.user_type !== 1 && reqData.user_type !== 2){
    //     return res.status(404).send({
    //         success: false,
    //         status: 404,
    //         message: "User type should be 1 or 2",
    //     });
    // }



   
    // password check
    let validatePassword = await commonObject.characterLimitCheck(reqData.password,"password");

    if (validatePassword.success == false) {
      return res.status(400).send({
        success: false,
        status: 400,
        message: "Password is not valid",
      });
    }

    reqData.password = validatePassword.data;
    req.body.password = validatePassword.data;

    if(reqData.password !== reqData.confirm_password){
      return res.status(400).send({
        success: false,
        status: 400,
        message: "Password and Confirm Password should be same ",
      });
    }
   
    reqData.password = bcrypt.hashSync(reqData.password, 10);
   
  let users = {}
  let customers = {}


  users = {
    "email": reqData.email,
    "password": reqData.password,
    "role_id": 2,
    //  profile_id: 1,
    //"created_by": req.decoded.users.id,
    // "updated_by": req.decoded.users.id
};
    customers = {
      "email": reqData.email,
      "phone" : reqData.phone
      

  }



  let result = await userModel.addNewUser(users,customers);

  if (result.affectedRows == undefined || result.affectedRows < 1) {
    return res.status(500).send({
      success: false,
      status: 500,
      message: "Something Wrong in system database.",
    });
  }

  return res.status(201).send({
    success: true,
    status: 201,
    message: "User Registration Successfully Created.",
  });






});


//login
router.post("/login",async(req,res)=>{
 loginData = {
   "email":req.body.email,
   "password":req.body.password
 }

 let errorMessage = "";
 let isError = 0;

  // email validation
  if (isEmpty(loginData.email)) {
    isError = 1;
    errorMessage += "Email should not empty.";
}

let validateEmail = await commonObject.isValidEmail(loginData.email);
if (validateEmail == false) {
    isError = 1;
    errorMessage += "Email is not valid.";
}

    // Check Password Validation
    if (isEmpty(loginData.password)|| loginData.password.length < 6) {
      isError = 1;
      errorMessage += "Give valid password.";
    } else if(typeof loginData.password === "number") {
      loginData.password = loginData.password.toString();
    }

  if (isError == 1) {
      return res.status(400).send({
          success: false,
          status: 400,
          message: errorMessage,
      });
  }
      // Get User data from user table.
      let userData = await userModel.getDataByWhereCondition({
        email: loginData.email,
        status: 1
    });

    if (isEmpty(userData) || userData[0].status == 0 || !(userData[0].email == loginData.email)) {
        return res.status(404).send({
            success: false,
            status: 404,
            message: "No user found.",
        });
    }else if(userData[0].status == 2) {
        return res.status(404).send({
            success: false,
            status: 404,
            message: "You can't login as your account is disable now.",
        });
    }
 
  
    let profileData = {};
  // Check Password
    if (bcrypt.compareSync(loginData.password, userData[0].password)) {
       
      //Check Role
     let roleData = await roleModel.getRoleById(userData[0].role_id);
        if (isEmpty(roleData)) {
            return res.status(404).send({
                success: false,
                status: 404,
                message: "Unknown User role.",
            });
        }  
          
   }else{
    return res.status(400).send({
      success: false,
      status: 400,
      message: "Wrong password"
  });
}




if (userData[0].role_id == 1) {
   profileInfo = await adminModel.getDataByWhereCondition(
      {id: userData[0].profile_id}, undefined, undefined, undefined, ["id", "email", "status"]
  );

} else if (userData[0].role_id == 2) {
  profileInfo = await customerModel.getDataByWhereCondition(
      {id: userData[0].profile_id}, undefined, undefined, undefined, ["id", "name", "email", "phone", "nid","status"]
  );
} else {
  return res.status(404).send({
      success: false,
      status: 404,
      message: "No user found.",
  });
}     
if (isEmpty(profileInfo)) {
  return res.status(404).send({
      success: false,
      status: 404,
      message: "Unknown User.",
  });
} else {
  for (let index = 0; index < profileInfo.length; index++) {
      if(profileInfo[index].role_id == userData[0].role_id){
          profileInfo = [profileInfo[index]];
          delete profileInfo[0].role_id;
          break;
      }
  }
}

  // Generate profile data

  hashId = await commonObject.hashingUsingCrypto(userData[0].id.toString());

  profileData.api_token = hashId;
  profileData.email = userData[0].email;

  let roleData = await roleModel.getRoleById(userData[0].role_id);
  profileData.role = {
      role_id: roleData[0].id,
      role_name: roleData[0].title,
  };

  profileData.profile = profileInfo[0];
  profileData.time_period = Date.now() + 36000;
// console.log(profileData)



//"Generate Token"
  let token = jwt.sign(profileData,config.secretKey,{
      algorithm: config.algorithm,
      expiresIn: config.expiresIn 
  });



  delete profileData.api_token;
  delete profileData.time_period;
  profileData.token = token;


 
  // Save user identity in login-tracker
    let dateTimeToday = await commonObject.getGMT();
    let dateToday = await commonObject.getCustomDate(dateTimeToday);

   let loginTrackerData = {
        user_id: userData[0].id,
        jwt_token: token,
        created_at: dateTimeToday,
        updated_at: dateTimeToday,
        created_by: userData[0].id,
        updated_by: userData[0].id,
      };

   profileData.id = userData[0].id; 

  //  return res.status(200).send({
  //   success: true,
  //   message: "Welcome to the system.",
  //   data: profileData,
  // });
  
//  addNewLoggingModel.addNewLoggingTracker(loginTrackerData);

//   return res.status(400).send({
//     success: false,
//     status: 400,
//     message: loginData
// return res.status(200).send({
//   success: true,
//   message: "Welcome to the system.",
//   data: profileData,
// });

    
if (loginData) {
  LoggingModel.addNewLoggingTracker(loginTrackerData);

  return res.status(200).send({
    success: true,
    message: "Welcome to the system.",
    data: profileData,
  });
} else {
  return res.status(400).send({
    success: false,
    status: 400,
    message: "Login data is invalid.",
  });
}

});


 
// logout
router.get("/logout",async (req, res) => {
  let result = await LoggingModel.deleteLoggingTrackerDataByUUID(
      req.decoded.uuid
  );

  if (result.affectedRows == undefined || result.affectedRows < 1) {
      return res.status(500).send({
          success: true,
          status: 500,
          message: "Something Wrong in system. Please try again.",
      });
  }else{
    return res.status(200).send({
      success: true,
      status: 200,
      message: "Logout successfully.",
  });
  }
});








module.exports = router;