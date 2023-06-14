const express = require("express");
const isEmpty = require("is-empty");
const router = express.Router();
const commonObject = require("../common/common");
const { routeAccessChecker } = require('../middlewares/routeAccess');
const policyModel = require("../models/policy");



// add policy
router.post('/add-policy',async(req,res)=>{

    let reqData={
        "check_in_time" : req.body.check_in_time,
        "check_out_time" : req.body.check_out_time,
        "child_policy": req.body.child_policy,
        "child_policy_description":req.body.child_policy_description,
        "pet_policy":req.body.pet_policy,
        "pet_policy_description":req.body.pet_policy_description,
        "instructions": req.body.instructions,
        "house_rules" : req.body.house_rules,

  }


reqData.created_by = 1;
reqData.updated_by = 1;

reqData.created_at = await commonObject.getGMT();
reqData.updated_at = await commonObject.getGMT();

// check in time valided
if (isEmpty(reqData.check_in_time)) {
    return res.status(400).send({
      success: false,
      status: 400,
      message: "Invalid request data. 'Check In Time' is required and cannot be empty.",
    });
  }

if (!(/^([01][0-9]|2[0-3]):([0-5][0-9])$/.test(reqData.check_in_time))) {
    return res.status(400).send({
      success: false,
      status: 400,
      message: "Invalid request data. 'Check In Time' must be a valid time in the format of 'hh:mm', between '00:00' and '23:59'.",
    });
  }


 // check out time validate 
 if (isEmpty(reqData.check_out_time)) {
    return res.status(400).send({
      success: false,
      status: 400,
      message: "Invalid request data. 'Check Out Time' is required and cannot be empty.",
    });
  }
  if (!(/^([01][0-9]|2[0-3]):([0-5][0-9])$/.test(reqData.check_out_time))) {
    return res.status(400).send({
      success: false,
      status: 400,
      message: "Invalid request data. 'Check Out Time' must be a valid time in the format of 'hh:mm', between '00:00' and '23:59'.",
    });
  }


// child  policy 
let validateChildPolicy = await commonObject.checkItsNumber(reqData.child_policy);

if (validateChildPolicy.success == false) {
    return res.status(400).send({
        "success": false,
        "status": 400,
        "message": "Invalid Child Policy "
    });
} else if (validateChildPolicy.data != 0 && validateChildPolicy.data != 1) {
    return res.status(400).send({
        "success": false,
        "status": 400,
        "message": "Invalid. Child Policy should be 1 or 0."
    });
} else {
    req.body.child_policy = validateChildPolicy.data;
    reqData.child_policy = validateChildPolicy.data;
}


    // check child policy description if child policy is 1
    if (validateChildPolicy.data === 1) {
        if (typeof reqData.child_policy_description === "string" && !isEmpty(reqData.child_policy_description)) {
            reqData.child_policy_description = reqData.child_policy_description.trim();
        } else {
            return res.status(400).send({
                success: false,
                status: 400,
                message: "Child Policy Description should be a string and non-empty when Child Policy is 1",
            });
        }
    } else {
      reqData.child_policy_description = "";
        
    }





// pet  policy 

let validatePetPolicy = await commonObject.checkItsNumber(reqData.pet_policy);

if (validatePetPolicy.success == false) {
    return res.status(400).send({
        "success": false,
        "status": 400,
        "message": "Invalid Pet Policy "
    });
} else if (validatePetPolicy.data != 0 && validatePetPolicy.data != 1) {
    return res.status(400).send({
        "success": false,
        "status": 400,
        "message": "Invalid. Pet Policy should be 1 or 0."
    });
} else {
    req.body.pet_policy = validatePetPolicy.data;
    reqData.pet_policy = validatePetPolicy.data;
}   
    // check child policy description if child policy is 1
    if (validatePetPolicy.data === 1) {
        if (typeof reqData.pet_policy_description === "string" && !isEmpty(reqData.pet_policy_description)) {
            reqData.pet_policy_description = reqData.pet_policy_description.trim();
        } else {
            return res.status(400).send({
                success: false,
                status: 400,
                message: "Pet Policy Description should be a string and non-empty when Child Policy is 1",
            });
        }
    }  else {
     
        reqData.pet_policy_description = "";
          
      
 }

// instructions 

    if (typeof reqData.instructions === "string") {
      reqData.instructions = reqData.instructions.trim();
    } else {
      return res.status(400).send({
        success: false,
        status: 400,
        message: "Instructions shouldbe string",
      });
    }
  


  // house rules 

    if (typeof reqData.house_rules === "string") {
      reqData.house_rules = reqData.house_rules.trim();
    } else {
      return res.status(400).send({
        success: false,
        status: 400,
        message: "House Rules should be string",
      });
    }
    
  
  let result = await policyModel.addNew(reqData);


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
    message: "Policy added Successfully.",
  });
});

// all list
router.get('/list',async(req,res)=>{
    let result = await policyModel.getList()
    
    return res.status(200).send({
        "success": true,
        "status": 200,
        "message": "Policy List.",
        "count": result.length,
        "data": result
    });
})


// get active list
router.get('/activeList',async (req, res) => {

    let result = await policyModel.getActiveList();

    return res.status(200).send({
        "success": true,
        "status": 200,
        "message": "Policy Active List.",
        "count": result.length,
        "data": result
    });
});


// update
router.put('/update',async(req,res)=>{
    let reqData={
        "id":req.body.id,
        "check_in_time" : req.body.check_in_time,
        "check_out_time" : req.body.check_out_time,
        "child_policy": req.body.child_policy,
        "child_policy_description":req.body.child_policy_description,
        "pet_policy":req.body.pet_policy,
        "pet_policy_description":req.body.pet_policy_description,
        "instructions": req.body.instructions,
        "house_rules" : req.body.house_rules,

  }

reqData.updated_by = 1;

let validateId = await commonObject.checkItsNumber(reqData.id);
if (validateId.success == false) {

    return res.status(400).send({
        "success": false,
        "status": 400,
        "message": "Value should be integer.",
        "id": reqData.id

    });
} else {
    req.body.id = validateId.data;
    reqData.id = validateId.data;
    
}
let existingDataById = await policyModel.getById(reqData.id);
if (isEmpty(existingDataById)) {

    return res.status(404).send({
        "success": false,
        "status": 404,
        "message": "No data found",

    });
} 

let updateData = {};
let willWeUpdate = 0; 



// check in time valided
if (isEmpty(reqData.check_in_time)) {
    return res.status(400).send({
      success: false,
      status: 400,
      message: "Invalid request data. 'Check In Time' is required and cannot be empty.",
    });
  }

if (!(/^([01][0-9]|2[0-3]):([0-5][0-9])$/.test(reqData.check_in_time))) {
    return res.status(400).send({
      success: false,
      status: 400,
      message: "Invalid request data. 'Check In Time' must be a valid time in the format of 'hh:mm', between '00:00' and '23:59'.",
    });
  } else{
    if (existingDataById[0].check_in_time != reqData.check_in_time){
    willWeUpdate = 1;
    updateData.check_in_time = reqData.check_in_time;
    }
  }


 // check out time validate 
 if (isEmpty(reqData.check_out_time)) {
    return res.status(400).send({
      success: false,
      status: 400,
      message: "Invalid request data. 'Check Out Time' is required and cannot be empty.",
    });
  }
  if (!(/^([01][0-9]|2[0-3]):([0-5][0-9])$/.test(reqData.check_out_time))) {
    return res.status(400).send({
      success: false,
      status: 400,
      message: "Invalid request data. 'Check Out Time' must be a valid time in the format of 'hh:mm', between '00:00' and '23:59'.",
    });
  }else{
    if (existingDataById[0].check_out_time != reqData.check_out_time){
    willWeUpdate = 1;
    updateData.check_out_time = reqData.check_out_time;
    }
  }



// child  policy 
let validateChildPolicy = await commonObject.checkItsNumber(reqData.child_policy);

if (validateChildPolicy.success == false) {
    return res.status(400).send({
        "success": false,
        "status": 400,
        "message": "Invalid Child Policy "
    });
} else if (validateChildPolicy.data != 0 && validateChildPolicy.data != 1) {
    return res.status(400).send({
        "success": false,
        "status": 400,
        "message": "Invalid. Child Policy should be 1 or 0."
    });
} else {
    req.body.child_policy = validateChildPolicy.data;
    reqData.child_policy = validateChildPolicy.data;
   
        
} 
if (existingDataById[0].child_policy != reqData.child_policy){
    willWeUpdate = 1;
    updateData.child_policy = reqData.child_policy;
    } 
   
    // check child policy description if child policy is 1
    if (validateChildPolicy.data === 1) {
        if (typeof reqData.child_policy_description === "string" && !isEmpty(reqData.child_policy_description)) {
            reqData.child_policy_description = reqData.child_policy_description.trim();
        } else {
            return res.status(400).send({
                success: false,
                status: 400,
                message: "Child Policy Description should be a string and non-empty when Child Policy is 1",
            });
        }
    } else {
      reqData.child_policy_description = "";
        
    }

    if (existingDataById[0].child_policy_description != reqData.child_policy_description){
        willWeUpdate = 1;
        updateData.child_policy_description = reqData.child_policy_description;
    }


// pet  policy 
let validatePetPolicy = await commonObject.checkItsNumber(reqData.pet_policy);

if (validatePetPolicy.success == false) {
    return res.status(400).send({
        "success": false,
        "status": 400,
        "message": "Invalid Pet Policy "
    });
} else if (validatePetPolicy.data != 0 && validatePetPolicy.data != 1) {
    return res.status(400).send({
        "success": false,
        "status": 400,
        "message": "Invalid. Pet Policy should be 1 or 0."
    });
} else {
    req.body.pet_policy = validatePetPolicy.data;
    reqData.pet_policy = validatePetPolicy.data;
   
    } 
    if (existingDataById[0].pet_policy != reqData.pet_policy){
        willWeUpdate = 1;
        updateData.pet_policy = reqData.pet_policy;
    }  
    // check child policy description if child policy is 1
    if (validatePetPolicy.data === 1) {
        if (typeof reqData.pet_policy_description === "string" && !isEmpty(reqData.pet_policy_description)) {
            reqData.pet_policy_description = reqData.pet_policy_description.trim();
        } else {
            return res.status(400).send({
                success: false,
                status: 400,
                message: "Pet Policy Description should be a string and non-empty when Pet Policy is 1",
            });
        }
    }  else {
      reqData.pet_policy_description = "";
        
    }

    if (existingDataById[0].pet_policy_description != reqData.pet_policy_description){
        willWeUpdate = 1;
        updateData.pet_policy_description = reqData.pet_policy_description;
    }

// instructions 

    if (typeof reqData.instructions === "string") {
      reqData.instructions = reqData.instructions.trim();
    } else {
      return res.status(400).send({
        success: false,
        status: 400,
        message: "Instructions shouldbe string",
      });
    }
    if (existingDataById[0].instructions != reqData.instructions){
        willWeUpdate = 1;
        updateData.instructions = reqData.instructions;
    }
  


  // house rules 

    if (typeof reqData.house_rules === "string") {
      reqData.house_rules = reqData.house_rules.trim();
    } else {
      return res.status(400).send({
        success: false,
        status: 400,
        message: "House Rules shouldbe string",
      });
    } 
    if (existingDataById[0].house_rules != reqData.house_rules){
        willWeUpdate = 1;
        updateData.house_rules = reqData.house_rules;
    }


    if (willWeUpdate == 1) {
        updateData.updated_by = 1;
        updateData.updated_at = await commonObject.getGMT();
                
        let result = await policyModel.updateById(reqData.id, updateData);
    
        if (result.affectedRows == undefined || result.affectedRows < 1) {
          return res.status(500).send({
            success: true,
            status: 500,
            message: "Something Wrong in system database.",
          });
        }
    
        return res.status(200).send({
          success: true,
          status: 200,
          message: "Policy successfully updated.",
        });
      } else {
        return res.status(200).send({
          success: true,
          status: 200,
          message: "Nothing to update.",
        });
      }



});

// details id
router.get("/details/:id",async (req, res) => {


    let id = req.params.id;

    let validateId = await commonObject.checkItsNumber(id);


    if (validateId.success == false) {
      return res.status(400).send({
        "success": false,
        "status": 400,
        "message": "Value should be integer."
      });
    } else {
      id = validateId.data;
    }

    let result = await policyModel.getById(id);

    if (isEmpty(result)) {

      return res.status(404).send({
        success: false,
        status: 404,
        message: "No data found",
      });

    } else {

      return res.status(200).send({
        success: true,
        status: 200,
        message: "Policy Details.",
        data: result[0],
      });
      
    }

  }
);


// change status
router.put('/changeStatus', async (req, res) => {

    let reqData = {
      "id": req.body.id
  }

  reqData.updated_by = 1;

  let validateId = await commonObject.checkItsNumber(reqData.id);


  if (validateId.success == false) {

      return res.status(400).send({
          "success": false,
          "status": 400,
          "message": "Value should be integer."

      });
  } else {
      req.body.id = validateId.data;
      reqData.id = validateId.data;
      
  }

  let existingDataById = await policyModel.getById(reqData.id);
  if (isEmpty(existingDataById)) {

      return res.status(404).send({
          "success": false,
          "status": 404,
          "message": "No data found",

      });
  }

  let data = {
    status: existingDataById[0].status == 1 ? 2 : 1,
    updated_by : reqData.updated_by,
    updated_at :await commonObject.getGMT()
}

let result = await policyModel.updateById(reqData.id,data);


if (result.affectedRows == undefined || result.affectedRows < 1) {
    return res.status(500).send({
        "success": true,
        "status": 500,
        "message": "Something Wrong in system database."
    });
}


return res.status(200).send({
    "success": true,
    "status": 200,
    "message": "Policy status has successfully changed."
});

});


// delete
router.delete('/delete',async (req, res) => {

    let reqData = {
        "id": req.body.id
    }

    reqData.updated_by = 1;

    let validateId = await commonObject.checkItsNumber(reqData.id);


    if (validateId.success == false) {

        return res.status(400).send({
            "success": false,
            "status": 400,
            "message": "Value should be integer."

        });
    } else {
        req.body.id = validateId.data;
        reqData.id = validateId.data;
        
    }

    let existingDataById = await policyModel.getById(reqData.id);
    if (isEmpty(existingDataById)) {

        return res.status(404).send({
            "success": false,
            "status": 404,
            "message": "No data found",

        });
    }

     let data = {
      status : 0,
      updated_by : reqData.updated_by,
      updated_at :await commonObject.getGMT()
     }

     let result = await policyModel.updateById(reqData.id,data);


     if (result.affectedRows == undefined || result.affectedRows < 1) {
         return res.status(500).send({
             "success": true,
             "status": 500,
             "message": "Something Wrong in system database."
         });
     }
   
   
     return res.status(200).send({
         "success": true,
         "status": 200,
         "message": "Policy successfully deleted."
     });

});

module.exports = router;