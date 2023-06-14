// const express = require("express");
// const isEmpty = require("is-empty");
// const router = express.Router();
// const commonObject = require("../common/common");
// const organizationModel = require("../models/organization");


// // add organization
// router.post('/add-organization',async(req,res)=>{
 
//     let reqData = {
//         "organizationName":req.body.organizationName,
//         "details":req.body.details,
//         "contactInfo": req.body.contactInfo
//      }

//     //  reqData.created_by = req.decoded.userInfo.id;
//     //  reqData.updated_by = req.decoded.userInfo.id;
//      reqData.created_by = 1;
//      reqData.updated_by = 1;
 
//      reqData.created_at = await commonObject.getGMT();
//      reqData.updated_at = await commonObject.getGMT();
 
     
//     let validateOrganizationName = await commonObject.characterLimitCheck(reqData.organizationName, "Organization Name");

//     if (validateOrganizationName.success == false) {
//         return res.status(400).send({
//             "success": false,
//             "status": 400,
//             "message": validateOrganizationName.message,

//         });
//     }

//     reqData.organizationName = validateOrganizationName.data;

//     let existingData = await organizationModel.getByOrganizationName(reqData.organizationName);


//     if (!isEmpty(existingData)) {
//         return res.status(409).send({
//             "success": false,
//             "status": 409,
//             "message": existingData[0].status == "1" ? "This Organization Name Already Exists." : "This Organization Name Already Exists but Deactivate, You can activate it."
//         });

//     }


//     //details
//     if (typeof reqData.details === "string") {
//         reqData.details = reqData.details.trim();
//       } else {
//         return res.status(400).send({
//           success: false,
//           status: 400,
//           message: "Details should be string",
//         });
//       }

    
//     //contact_info
//     if (typeof reqData.contactInfo === "string") {
//         reqData.contactInfo = reqData.contactInfo.trim();
//       } else {
//         return res.status(400).send({
//           success: false,
//           status: 400,
//           message: "Contact Info should be string",
//         });
//       }
     
      
//     let result = await organizationModel.addNew(reqData);


//     if (result.affectedRows == undefined || result.affectedRows < 1) {
//         return res.status(500).send({
//         success: false,
//         status: 500,
//         message: "Something Wrong in system database.",
//         });
//     }

//     return res.status(201).send({
//         success: true,
//         status: 201,
//         message: "Organization added Successfully.",
//     });
    
// });


// //list
// router.get('/list',async (req, res) => {

//     let result = await organizationModel.getList();

//     return res.status(200).send({
//         "success": true,
//         "status": 200,
//         "message": "Organization List.",
//         "count": result.length,
//         "data": result
//     });
// });


// //active list
// router.get('/activeList',async (req, res) => {

//     let result = await organizationModel.getActiveList();

//     return res.status(200).send({
//         "success": true,
//         "status": 200,
//         "message": "Organization Active List.",
//         "count": result.length,
//         "data": result
//     });
// });


// // delete
// router.delete('/delete', async (req, res) => {

//     let reqData = {
//         "id": req.body.id
//     }

//     reqData.updated_by = 1;

//     let validateId = await commonObject.checkItsNumber(reqData.id);


//     if (validateId.success == false) {

//         return res.status(400).send({
//             "success": false,
//             "status": 400,
//             "message": "Value should be integer."

//         });
//     } else {
//         req.body.id = validateId.data;
//         reqData.id = validateId.data;
        
//     }

//     let existingDataById = await organizationModel.getById(reqData.id);
//     if (isEmpty(existingDataById)) {

//         return res.status(404).send({
//             "success": false,
//             "status": 404,
//             "message": "No data found",

//         });
//     }

//      let data = {
//       status : 0,
//       updated_by : reqData.updated_by,
//       updated_at :await commonObject.getGMT()
//      }

//      let result = await organizationModel.updateById(reqData.id,data);


//      if (result.affectedRows == undefined || result.affectedRows < 1) {
//          return res.status(500).send({
//              "success": true,
//              "status": 500,
//              "message": "Something Wrong in system database."
//          });
//      }
   
   
//      return res.status(200).send({
//          "success": true,
//          "status": 200,
//          "message": "Organization successfully deleted."
//      });

// });


// // change status
// router.put('/changeStatus', async (req, res) => {

//         let reqData = {
//           "id": req.body.id
//       }

//       reqData.updated_by =1;

//       let validateId = await commonObject.checkItsNumber(reqData.id);


//       if (validateId.success == false) {

//           return res.status(400).send({
//               "success": false,
//               "status": 400,
//               "message": "Value should be integer."

//           });
//       } else {
//           req.body.id = validateId.data;
//           reqData.id = validateId.data;
          
//       }

//       let existingDataById = await organizationModel.getById(reqData.id);
//       if (isEmpty(existingDataById)) {

//           return res.status(404).send({
//               "success": false,
//               "status": 404,
//               "message": "No data found",

//           });
//       }

//       let data = {
//         status: existingDataById[0].status == 1 ? 2 : 1,
//         updated_by : reqData.updated_by,
//         updated_at :await commonObject.getGMT()
//     }

//     let result = await organizationModel.updateById(reqData.id,data);


//     if (result.affectedRows == undefined || result.affectedRows < 1) {
//         return res.status(500).send({
//             "success": true,
//             "status": 500,
//             "message": "Something Wrong in system database."
//         });
//     }
  
  
//     return res.status(200).send({
//         "success": true,
//         "status": 200,
//         "message": "Organization status has successfully changed."
//     });

// });

// //details
// router.get("/details/:id",async (req, res) => {


//     let id = req.params.id;

//     let validateId = await commonObject.checkItsNumber(id);


//     if (validateId.success == false) {
//       return res.status(400).send({
//         "success": false,
//         "status": 400,
//         "message": "Value should be integer."
//       });
//     } else {
//       id = validateId.data;
//     }

//     let result = await organizationModel.getById(id);

//     if (isEmpty(result)) {

//       return res.status(404).send({
//         success: false,
//         status: 404,
//         message: "No data found",
//       });

//     } else {

//       return res.status(200).send({
//         success: true,
//         status: 200,
//         message: "Organization Details.",
//         data: result[0],
//       });
      
//     }

//   }
// );

// //update
// router.put('/update',async(req,res)=>{
//     let reqData = {
//         "id":req.body.id,
//         "organizationName":req.body.organizationName,
//         "details":req.body.details,
//         "contactInfo": req.body.contactInfo
//      }

//     reqData.updated_by = 1;

//     let validateId = await commonObject.checkItsNumber(reqData.id);
//     if (validateId.success == false) {

//         return res.status(400).send({
//             "success": false,
//             "status": 400,
//             "message": "Value should be integer.",
//             "id": reqData.id

//         });
//     } else {
//         req.body.id = validateId.data;
//         reqData.id = validateId.data;
        
//     }

//     let existingDataById = await organizationModel.getById(reqData.id);
//     if (isEmpty(existingDataById)) {

//         return res.status(404).send({
//             "success": false,
//             "status": 404,
//             "message": "No data found",

//         });
//     } 
//     let updateData = {};
//     let willWeUpdate = 0; 

    
//     if(existingDataById[0].organizationName !== reqData.organizationName){
//         let validateOrganizationName = await commonObject.characterLimitCheck(reqData.organizationName, "organizationName");

//         if (validateOrganizationName.success == false) {
//             return res.status(400).send({
//                 "success": false,
//                 "status": 400,
//                 "message": validateOrganizationName.message,
    
//             });
//         }
    
//         reqData.organizationName = validateOrganizationName.data;
    
//         willWeUpdate = 1;
//         updateData.organizationName = reqData.organizationName;
    
//     }




//     //details
//    if(existingDataById[0].details !== reqData.details){
//         if (typeof reqData.details === "string") {
//             reqData.details = reqData.details.trim();
//           } else {
//             return res.status(400).send({
//               success: false,
//               status: 400,
//               message: "Details should be string",
//             });
//           }
//           willWeUpdate = 1;
//           updateData.details = reqData.details;
//     }
  
    
//   //contact_info
//     if(existingDataById[0].contactInfo !== reqData.contactInfo){
    
//     if (typeof reqData.contactInfo === "string") {
//         reqData.contactInfo = reqData.contactInfo.trim();
//       } else {
//         return res.status(400).send({
//           success: false,
//           status: 400,
//           message: "Contact Info should be string",
//         });
//       }
//       willWeUpdate = 1;
//       updateData.contactInfo = reqData.contactInfo;
//     } 
  


//     if (willWeUpdate == 1) {

//         updateData.updated_by = 1;
//         updateData.updated_at = await commonObject.getGMT();
      
       

//         let result = await organizationModel.updateById(reqData.id,updateData);
      
      
//         if (result.affectedRows == undefined || result.affectedRows < 1) {
//             return res.status(500).send({
//                 "success": true,
//                 "status": 500,
//                 "message": "Something Wrong in system database."
//             });
//         }
      
      
//         return res.status(200).send({
//             "success": true,
//             "status": 200,
//             "message": "Organization successfully updated."
//         });
      
      
//       } else {
//         return res.status(200).send({
//             "success": true,
//             "status": 200,
//             "message": "Nothing to update."
//         });
//       }
      

// });

// module.exports = router;









