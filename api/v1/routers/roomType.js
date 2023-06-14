const express = require("express");
const isEmpty = require("is-empty");
const router = express.Router();
const commonObject = require("../common/common");
const { routeAccessChecker } = require('../middlewares/routeAccess');
const roomTypeModel = require("../models/roomType");




// add room_types
router.post('/add-room-type',async(req,res)=>{
    let reqData = {
        "room_type": req.body.room_type
    }

    reqData.created_by = 1;
    reqData.updated_by = 1;

    reqData.created_at = await commonObject.getGMT();
    reqData.updated_at = await commonObject.getGMT();


    let validateRoomType = await commonObject.characterLimitCheck(reqData.room_type, "room_type");

    if (validateRoomType.success == false) {
        return res.status(400).send({
            "success": false,
            "status": 400,
            "message": validateRoomType.message,
 
        });
    }

    reqData.room_type = validateRoomType.data;

    let existingData = await roomTypeModel.getByRoomType(reqData.room_type);


    if (!isEmpty(existingData)) {
        return res.status(409).send({
            "success": false,
            "status": 409,
            "message": existingData[0].status == "1" ? "This Room Type Already Exists." : "This Room Type Already Exists but Deactivate, You can activate it."
        });

    }

    let result = await roomTypeModel.addNew(reqData);

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
        "message": "Room Type Added Successfully."
    }); 



});


//list
router.get('/list',async (req, res) => {

    let result = await roomTypeModel.getList();

    return res.status(200).send({
        "success": true,
        "status": 200,
        "message": "Room Type List.",
        "count": result.length,
        "data": result
    });
});


//active list
router.get('/activeList',async (req, res) => {

    let result = await roomTypeModel.getActiveList();

    return res.status(200).send({
        "success": true,
        "status": 200,
        "message": "Room Type Active List.",
        "count": result.length,
        "data": result
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

    let result = await roomTypeModel.getById(id);

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
        message: "Room Type Details.",
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

  let existingDataById = await roomTypeModel.getById(reqData.id);
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

let result = await roomTypeModel.updateById(reqData.id,data);


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
    "message": "Room Type status has successfully changed."
});

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

    let existingDataById = await roomTypeModel.getById(reqData.id);
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

     let result = await roomTypeModel.updateById(reqData.id,data);


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
         "message": "Room Type successfully deleted."
     });

});

// update
router.put('/update',async (req, res) => {

    let reqData = {
        "id": req.body.id,
        "room_type": req.body.room_type
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

    let existingDataById = await roomTypeModel.getById(reqData.id);
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
    if (existingDataById[0].room_type !== reqData.room_type) {

        let validateRoomType = await commonObject.characterLimitCheck(reqData.room_type, "room_type");

      if (validateRoomType.success == false) {
          isError = 1;
          errorMessage += validateRoomType.message;
      } else {

        let existingDataByRoomType = await roomTypeModel.getByRoomType(reqData.room_type);

        if (!isEmpty(existingDataByRoomType) && existingDataByRoomType[0].id != reqData.id) {
          
          isError = 1;
          errorMessage += existingDataByRoomType[0].status == "1" ? "This Room Type Already Exist." : "This Room Type Already Exist but Deactivate, You can activate it."
        }

          reqData.room_type = validateRoomType.data;
          willWeUpdate = 1;
          updateData.room_type = reqData.room_type;

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


  let result = await roomTypeModel.updateById(reqData.id,updateData);


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
      "message": "Room Type successfully updated."
  });


} else {
  return res.status(200).send({
      "success": true,
      "status": 200,
      "message": "Nothing to update."
  });
}

});

module.exports = router;