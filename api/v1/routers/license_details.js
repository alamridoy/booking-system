const express = require("express");
const isEmpty = require("is-empty");
const router = express.Router();
const commonObject = require("../common/common");
const { routeAccessChecker } = require('../middlewares/routeAccess');
const parkingModel = require("../models/parking");




// add Parking
router.post('/add-parking',async(req,res)=>{
    let reqData = {
        "paid_expiry": req.body.paid_expiry,
        "users_license_purchased": req.body.users_license_purchased,
        "trial_type": req.body.trial_type,
        "trial_expiry": req.body.trial_expiry,
        "paid": req.body.paid,
        "paid_type": req.body.paid_type,

    }


    reqData.created_at = await commonObject.getGMT();
    reqData.updated_at = await commonObject.getGMT();


    
 //paid_expiry
if (isEmpty(reqData.paid_expiry)) {
    return res.status(400).send({
      success: false,
      status: 400,
      message: "Invalid request data. 'Check In Time' is required and cannot be empty.",
    });
  }



    let result = await parkingModel.addNew(reqData);

    if (result.affectedRows == undefined || result.affectedRows < 1) {
        return res.status(500).send({
            "success": false,
            "status": 500,
            "message": "Something Wrong in system database."
        });
    }

    return res.status(201).send({
        "success": true,
        "status": 201,
        "message": "Parking Added Successfully."
    }); 



});

//list
router.get('/list',async (req, res) => {

    let result = await parkingModel.getList();

    return res.status(200).send({
        "success": true,
        "status": 200,
        "message": "Parking List.",
        "count": result.length,
        "data": result
    });
});

//active list
router.get('/activeList',async (req, res) => {

    let result = await parkingModel.getActiveList();

    return res.status(200).send({
        "success": true,
        "status": 200,
        "message": "Parking Active List.",
        "count": result.length,
        "data": result
    });
});

// update
router.put('/update',async (req, res) => {

    let reqData = {
        "id": req.body.id,
        "title": req.body.title
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

    let existingDataById = await parkingModel.getById(reqData.id);
    if (isEmpty(existingDataById)) {

        return res.status(404).send({
            "success": false,
            "status": 404,
            "message": "No data found",

        });
    } 

    let updateData = {};

    let errorMessage = "";
    let isError = 0; 
    let willWeUpdate = 0; 

    // title
    if (existingDataById[0].title !== reqData.title) {

      let validateTitle = await commonObject.characterLimitCheck(reqData.title, "parking");

      if (validateTitle.success == false) {
          isError = 1;
          errorMessage += validateTitle.message;
      } else {

        let existingDataByTitle = await parkingModel.getByTitle(reqData.title);

        if (!isEmpty(existingDataByTitle) && existingDataByTitle[0].id != reqData.id) {
          
          isError = 1;
          errorMessage += existingDataByTitle[0].status == "1" ? "This Parking Already Exist." : "This Parking Already Exist but Deactivate, You can activate it."
        }

          reqData.title = validateTitle.data;
          willWeUpdate = 1;
          updateData.title = reqData.title;

      }

  }


  if (isError == 1) {
    return res.status(400).send({
        "success": false,
        "status": 400,
        "message": errorMessage
    });
}

if (willWeUpdate == 1) {

  updateData.updated_by = 1;
  updateData.updated_at = await commonObject.getGMT();


  let result = await parkingModel.updateById(reqData.id,updateData);


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
      "message": "Parking successfully updated."
  });


} else {
  return res.status(200).send({
      "success": true,
      "status": 200,
      "message": "Nothing to update."
  });
}

});

// delete
router.delete('/delete', async (req, res) => {

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

    let existingDataById = await parkingModel.getById(reqData.id);
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

     let result = await parkingModel.updateById(reqData.id,data);


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
         "message": "Parking successfully deleted."
     });

});


// change status
router.put('/changeStatus', async (req, res) => {

        let reqData = {
          "id": req.body.id
      }

      reqData.updated_by =1;

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

      let existingDataById = await parkingModel.getById(reqData.id);
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

    let result = await parkingModel.updateById(reqData.id,data);


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
        "message": "Parking status has successfully changed."
    });

});

//details
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

    let result = await parkingModel.getById(id);

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
        message: "Parking Details.",
        data: result[0],
      });
      
    }

  }
);



module.exports = router;