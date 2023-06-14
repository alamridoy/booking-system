const express = require("express");
const isEmpty = require("is-empty");
const router = express.Router();
const commonObject = require("../common/common");
const { routeAccessChecker } = require('../middlewares/routeAccess');
const roomForFoodAndDrinkModel = require("../models/roomForFoodAndDrink");
const FoodAndDrinkModel = require("../models/foodDrinks");
const roomModel = require("../models/room");

// add room_for_business_facilities_types
router.post('/add-foodAndDrink',async(req,res)=>{

let reqData={
    "food_and_drink_types_id":req.body.food_and_drink_types_id,
    "room_id":req.body.room_id 
}

reqData.created_by = 1;
reqData.updated_by = 1;

reqData.created_at = await commonObject.getGMT();
reqData.updated_at = await commonObject.getGMT();

// validate business_facilities_id

    let validateFoodandDrinkFacilitiesId = await commonObject.checkItsNumber(reqData.food_and_drink_types_id);
    if (validateFoodandDrinkFacilitiesId.success == false) {


        return res.status(400).send({
            "success": false,
            "status": 400,
            "message": "Value should be integer.",
            "id": reqData.id

        });
    } else {
        req.body.food_and_drink_types_id = validateFoodandDrinkFacilitiesId.data;
        reqData.food_and_drink_types_id = validateFoodandDrinkFacilitiesId.data;

    }


    let existingFoodandDrinkFacilitiesId = await FoodAndDrinkModel.getById(reqData.food_and_drink_types_id)
  if (isEmpty(existingFoodandDrinkFacilitiesId)) {
    return res.status(404).send({
      success: false,
      status: 404,
      message: "Food And Drink Type data not found",
    });
  }


  // validate room_id

  let validateRoomId = await commonObject.checkItsNumber(reqData.room_id);
  if (validateRoomId.success == false) {

      return res.status(400).send({
          "success": false,
          "status": 400,
          "message": "Value should be integer.",
          "id": reqData.id

      });
  } else {
      req.body.room_id = validateRoomId.data;
      reqData.room_id = validateRoomId.data;

  }

  let existingRoomId = await roomModel.getById(reqData.room_id)
if (isEmpty(existingRoomId)) {
  return res.status(404).send({
    success: false,
    status: 404,
    message: "Room data not found",
  });
}


  let result = await roomForFoodAndDrinkModel.addNew(reqData);

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
      "message": " room For Food And Drink  Added Successfully."
  }); 

});

// list
router.get('/list',async (req, res) => {

    let result = await roomForFoodAndDrinkModel.getList();

    return res.status(200).send({
        "success": true,
        "status": 200,
        "message": "room For Food And Drink  List.",
        "count": result.length,
        "data": result
    });
});

//active list
router.get('/activeList',async (req, res) => {

    let result = await roomForFoodAndDrinkModel.getActiveList();

    return res.status(200).send({
        "success": true,
        "status": 200,
        "message": "room For Food And Drink  List Active List.",
        "count": result.length,
        "data": result
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

    let existingDataById = await roomForFoodAndDrinkModel.getById(reqData.id);
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

     let result = await roomForFoodAndDrinkModel.updateById(reqData.id,data);


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
         "message": "room For Food And Drink  Model successfully deleted."
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

      let existingDataById = await roomForFoodAndDrinkModel.getById(reqData.id);
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

    let result = await roomForFoodAndDrinkModel.updateById(reqData.id,data);


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
        "message": "room For Food And Drink  Model status has successfully changed."
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

    let result = await roomForFoodAndDrinkModel.getById(id);

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
        message: "room For Food And Drink  Model Details.",
        data: result[0],
      });
      
    }

  }
);

// update
router.put('/update',async(req,res)=>{
    let reqData={
        "id":req.body.id,
        "food_and_drink_types_id":req.body.food_and_drink_types_id,
        "room_id":req.body.room_id  
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

    let existingDataById = await roomForFoodAndDrinkModel.getById(reqData.id);
    if (isEmpty(existingDataById)) {

        return res.status(404).send({
            "success": false,
            "status": 404,
            "message": "No data found",

        });
    } 

    let updateData = {};
    let willWeUpdate = 0;

    // validate business_facilities_id
    
        let validateFoodAndDrinkFacilitiesId = await commonObject.checkItsNumber(reqData.food_and_drink_types_id);
        if (validateFoodAndDrinkFacilitiesId.success == false) {

    
            return res.status(400).send({
                "success": false,
                "status": 400,
                "message": "Value should be integer.",
                "id": reqData.id
    
            });
        } else {
            req.body.food_and_drink_types_id = validateFoodAndDrinkFacilitiesId.data;
            reqData.food_and_drink_types_id = validateFoodAndDrinkFacilitiesId.data;
    
        }
    
    
        let existingFoodAndDrinkFacilitiesId = await FoodAndDrinkModel.getById(reqData.food_and_drink_types_id)
      if (isEmpty(existingFoodAndDrinkFacilitiesId)) {
        return res.status(404).send({
          success: false,
          status: 404,
          message: "Food And Drink Facilities Type data not found",
        });
      }
     if (existingDataById[0].food_and_drink_types_id != reqData.food_and_drink_types_id){
    willWeUpdate = 1;
    updateData.food_and_drink_types_id = reqData.food_and_drink_types_id;
    }
    
      // validate room_id
    
      let validateRoomId = await commonObject.checkItsNumber(reqData.room_id);
      if (validateRoomId.success == false) {
    
          return res.status(400).send({
              "success": false,
              "status": 400,
              "message": "Value should be integer.",
              "id": reqData.id
    
          });
      } else {
          req.body.room_id = validateRoomId.data;
          reqData.room_id = validateRoomId.data;
    
      }
    
      let existingRoomId = await roomModel.getById(reqData.room_id)
    if (isEmpty(existingRoomId)) {
      return res.status(404).send({
        success: false,
        status: 404,
        message: "Room data not found",
      });
    }
    if (existingDataById[0].room_id != reqData.room_id){
        willWeUpdate = 1;
        updateData.room_id = reqData.room_id;
        } 
    
        if (willWeUpdate == 1) {
            updateData.updated_by = 1;
            updateData.updated_at = await commonObject.getGMT();
              
          
            let result = await roomForFoodAndDrinkModel.updateById(reqData.id, updateData);
        
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
              message: "room For Food And Drink  updated.",
            });
          } else {
            return res.status(200).send({
              success: true,
              status: 200,
              message: "Nothing to update.",
            });
          }

})

module.exports = router;