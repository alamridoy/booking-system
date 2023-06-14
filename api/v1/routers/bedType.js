const express = require("express");
const isEmpty = require("is-empty");
const router = express.Router();
const commonObject = require("../common/common");
const { routeAccessChecker } = require('../middlewares/routeAccess');
const bedTypeModel = require("../models/bedType");




// add bed_types
router.post('/add-bedType',async(req,res)=>{
    let reqData = {
        "bed_type": req.body.bed_type
    }

    reqData.created_by = 1;
    reqData.updated_by = 1;

    reqData.created_at = await commonObject.getGMT();
    reqData.updated_at = await commonObject.getGMT();


    let validateBedType = await commonObject.characterLimitCheck(reqData.bed_type, "bed_type");

    if (validateBedType.success == false) {
        return res.status(400).send({
            "success": false,
            "status": 400,
            "message": validateBedType.message,
 
        });
    }

    reqData.bed_type = validateBedType.data;

    let existingData = await bedTypeModel.getByBedType(reqData.bed_type);


    if (!isEmpty(existingData)) {
        return res.status(409).send({
            "success": false,
            "status": 409,
            "message": existingData[0].status == "1" ? "This Bed Type Already Exists." : "This Bed Type Already Exists but Deactivate, You can activate it."
        });

    }
 
    let result = await bedTypeModel.addNew(reqData);

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
        "message": "Bed Type Added Successfully."
    }); 



});

//list
router.get('/list',async (req, res) => {

    let result = await bedTypeModel.getList();

    return res.status(200).send({
        "success": true,
        "status": 200,
        "message": "Bed Type List.",
        "count": result.length,
        "data": result
    });
});

//active list
router.get('/activeList',async (req, res) => {

    let result = await bedTypeModel.getActiveList();

    return res.status(200).send({
        "success": true,
        "status": 200,
        "message": "Bed Type Active List.",
        "count": result.length,
        "data": result
    });
});

// update
router.put('/update',async (req, res) => {

    let reqData = {
        "id": req.body.id,
        "bed_type": req.body.bed_type
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

    let existingDataById = await bedTypeModel.getById(reqData.id);
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
    if (existingDataById[0].bed_type !== reqData.bed_type) {

        let validateBedType = await commonObject.characterLimitCheck(reqData.bed_type, "bed_type");

      if (validateBedType.success == false) {
          isError = 1;
          errorMessage += validateBedType.message;
      } else {

        let existingDataByBedType = await bedTypeModel.getByBedType(reqData.bed_type);

        if (!isEmpty(existingDataByBedType) && existingDataByBedType[0].id != reqData.id) {
          
          isError = 1;
          errorMessage += existingDataByBedType[0].status == "1" ? "This Bed Type Already Exist." : "This Bed Type Already Exist but Deactivate, You can activate it."
        }

          reqData.bed_type = validateBedType.data;
          willWeUpdate = 1;
          updateData.bed_type = reqData.bed_type;

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


  let result = await bedTypeModel.updateById(reqData.id,updateData);


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
      "message": "Bed Type successfully updated."
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

    let existingDataById = await bedTypeModel.getById(reqData.id);
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

     let result = await bedTypeModel.updateById(reqData.id,data);


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
         "message": "Bed Type successfully deleted."
     });

});


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

      let existingDataById = await bedTypeModel.getById(reqData.id);
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

    let result = await bedTypeModel.updateById(reqData.id,data);


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
        "message": "Bed Type status has successfully changed."
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

    let result = await bedTypeModel.getById(id);

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
        message: "Bed Type Details.",
        data: result[0],
      });
      
    }

  }
);



module.exports = router;