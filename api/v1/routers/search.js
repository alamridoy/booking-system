const express = require("express");
const router = express.Router();
const commonObject = require("../common/common");
const { routeAccessChecker } = require("../middlewares/routeAccess");
const isEmpty = require("is-empty");
const roomModel = require("../models/room");
const bedTypeModel = require("../models/bedType");


router.post("/get-data", async (req, res) => {
     
      let reqData = {
        "bed_type_id": req.body.bed_type_id,
      };
  
      let searchdata = {
        "status": 1,
        "id": reqData.bed_type_id
      };
  
      if (isEmpty(reqData.bed_type_id)) {
  
        return res.status(400).send({
            "success": false,
            "status": 400,
            "message": "Please give a bed type id",

        });
    }
      // Check if bed_type_id is a number
      let validateBedTypesId = await commonObject.checkItsNumber(reqData.bed_type_id);
      if (!validateBedTypesId.success) {
        return res.status(400).send({
          "success": false,
          "status": 400,
          "message": `Invalid.Bed Types Id should be integer.`
        });
      }
      reqData.bed_type_id = validateBedTypesId.data;
  
      // Get bed type details by search 
      let bedTypesDetails = await bedTypeModel.getDataByWhereCondition(searchdata);
      
      if (isEmpty(bedTypesDetails)) {

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
          data: bedTypesDetails[0],
        });
        
      }
    
  });
  
 
router.post("/test",(req,res)=>{
  reqData = {
    "name":req.body.name,
    "roll":req.body.roll
  }

  return res.status(400).send({
    "success": false,
    "status": 400,
    "message": reqData

});

});
  
  module.exports = router;