const express = require("express");
const isEmpty = require("is-empty");
const router = express.Router();
const commonObject = require("../common/common");
const { routeAccessChecker } = require('../middlewares/routeAccess');
const generalModel = require("../models/general");




// add general_types
router.post('/add-general',async(req,res)=>{
    let reqData = {
        "title": req.body.title
    }

    reqData.created_by = 1;
    reqData.updated_by = 1;

    reqData.created_at = await commonObject.getGMT();
    reqData.updated_at = await commonObject.getGMT();


    let validateTitle = await commonObject.characterLimitCheck(reqData.title, "general");

    if (validateTitle.success == false) {
        return res.status(400).send({
            "success": false,
            "status": 400,
            "message": validateTitle.message,
 
        });
    }

    reqData.title = validateTitle.data;

    let existingData = await generalModel.getByTitle(reqData.title);


    if (!isEmpty(existingData)) {
        return res.status(409).send({
            "success": false,
            "status": 409,
            "message": existingData[0].status == "1" ? "This General Already Exists." : "This General Already Exists but Deactivate, You can activate it."
        });

    }

    let result = await generalModel.addNew(reqData);

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
        "message": "General Added Successfully."
    }); 



});

//list
router.get('/list',async (req, res) => {

    let result = await generalModel.getList();

    return res.status(200).send({
        "success": true,
        "status": 200,
        "message": "General Active List.",
        "count": result.length,
        "data": result
    });
});

//active list
router.get('/activeList',async (req, res) => {

    let result = await generalModel.getActiveList();

    return res.status(200).send({
        "success": true,
        "status": 200,
        "message": "General List.",
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

    let existingDataById = await generalModel.getById(reqData.id);
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

      let validateTitle = await commonObject.characterLimitCheck(reqData.title, "general");

      if (validateTitle.success == false) {
          isError = 1;
          errorMessage += validateTitle.message;
      } else {

        let existingDataByTitle = await generalModel.getByTitle(reqData.title);

        if (!isEmpty(existingDataByTitle) && existingDataByTitle[0].id != reqData.id) {
          
          isError = 1;
          errorMessage += existingDataByTitle[0].status == "1" ? "This General Already Exist." : "This General Already Exist but Deactivate, You can activate it."
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


  let result = await generalModel.updateById(reqData.id,updateData);


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
      "message": "General successfully updated."
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

    let existingDataById = await generalModel.getById(reqData.id);
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

     let result = await generalModel.updateById(reqData.id,data);


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
         "message": "General successfully deleted."
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

      let existingDataById = await generalModel.getById(reqData.id);
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

    let result = await generalModel.updateById(reqData.id,data);


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
        "message": "General status has successfully changed."
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

    let result = await generalModel.getById(id);

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
        message: "General Details.",
        data: result[0],
      });
      
    }

  }
);



module.exports = router;