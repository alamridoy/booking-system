const express = require("express");
const router = express.Router();
const fileUpload = require('express-fileupload');
const app = express();
const photoModel = require("../models/image");
app.use(fileUpload());
const commonObject = require("../common/common");
const newCommonObject = require("../common/newCommon");
const isEmpty = require("is-empty");
const fs = require('fs');
const { updateById } = require("../queries/image");



// app.use(fileUpload());
// app.use(express.static(__dirname + '/public'));

// let imagePath = `${process.env.image_path}`;
let imagePath = `${process.env.image_path}`;
let imagePathForClient = `${process.env.backend_url}${process.env.image_path_name}/`;



//add
router.post('/upload', async (req, res) => {
    if (!req.files || Object.keys(req.files).length === 0) {
     return res.status(400).send({
        "success": false,
        "status": 400,
        "message": 'No files were uploaded.'
      });
    }
  
    const sampleFiles = req.files.sampleFile; 
    
    for (let i = 0; i < sampleFiles.length; i++) {
  
      let time = Date.now();
  
      const sampleFile = sampleFiles[i];
      sampleFile.name = `${time}_${sampleFile.name}`;
  
      const uploadPath = imagePath + sampleFile.name;
   
      // Validate file type
      
      const isValid = newCommonObject.validateFile(sampleFile, res);
      if (isValid !== true) {
        return res.status(400).send({
          "success": false,
          "status": 400,
          "message": "Invalid File"
        }); 
      }
    
      // Move the file to the specified upload path
      sampleFile.mv(uploadPath, function(err) {
        if (err) {
          return res.status(500).send({
            "success": false,
            "status": 500,
            "message": "Failed to file upload."
          });
        }
      });
  
  
      const fileObject = {
        name: sampleFile.name,
      };
      let result = await photoModel.addNew(fileObject);
  
  
      if (result.affectedRows === undefined || result.affectedRows < 1) {
        return res.status(500).send({
          "success": false,
          "status": 500,
          "message": "Something went wrong in the system database."
        });
      }
    }
  
    return res.status(201).send({
      "success": true,
      "status": 201,
      "message": "Images added successfully."
    });
  });
  





// router.post('/upload', async (req, res) => {
//     try {
//       if (!req.files || Object.keys(req.files).length === 0) {
//         return res.status(400).send({
//           success: false,
//           status: 400,
//           message: 'No files were uploaded.',
//         });
//       }
  
//       const sampleFiles = req.files.sampleFile;
  
//       if (!Array.isArray(sampleFiles)) {
//         return res.status(400).send({
//           success: false,
//           status: 400,
//           message: 'No sample file was uploaded.',
//         });
//       }
  
//       const fileObjects = [];
  
//       for (let i = 0; i < sampleFiles.length; i++) {
//         const sampleFile = sampleFiles[i];
//         const time = Date.now();
//         const fileName = `${time}_${sampleFile.name}`;
  
//         const uploadPath = imagePath + fileName;
  
//         // Validate file type
//         const isValid = newCommonObject.validateFile(sampleFile, res);
//         if (isValid !== true) {
//           return res.status(400).send({
//             success: false,
//             status: 400,
//             message: 'Invalid File',
//           });
//         }
  
//         // Move the file to the specified upload path
//         await sampleFile.mv(uploadPath);
  
//         const fileObject = {
//           name: fileName,
//         };
//         fileObjects.push(fileObject);
//       }
  
//       const result = await photoModel.addNew(fileObjects);
  
//       if (!result || result.affectedRows === undefined || result.affectedRows < 1) {
//         return res.status(500).send({
//           success: false,
//           status: 500,
//           message: 'Something went wrong in the system database.',
//         });
//       }
  
//       return res.status(201).send({
//         success: true,
//         status: 201,
//         message: 'Images added successfully.',
//       });
//     } catch (error) {
//       console.error('Error:', error);
//       return res.status(500).send({
//         success: false,
//         status: 500,
//         message: 'Failed to upload files.',
//       });
//     }
//   });
 

   


//image list
router.get('/list', async (req, res) => {
  let result = await photoModel.getList();

  const newResult = [];
  for (let i = 0; i < result.length; i++) {
    const item = result[i];
    newResult.push({
      id : item.id,
      name: item.name,
      uploadPath: imagePathForClient + item.name, 
    });
  }

  return res.status(200).send({
    "success": true,
    "status": 200,
    "message": "Images List.",
    "count": newResult.length,
    "data": newResult
  });
});



//delete
router.delete('/delete', async (req, res) => {
  let reqData = {
    id: req.body.id
  };

  reqData.updated_by = 1;

  if(isEmpty(reqData.id)){
    return res.status(400).send({
      success: false,
      status: 400,
      message: "Given Images Id"
    });
  }


  let validateId = await commonObject.checkItsNumber(reqData.id);

  if (validateId.success == false) {
    return res.status(400).send({
      success: false,
      status: 400,
      message: "Value should be an integer."
    });
  } else {
    req.body.id = validateId.data;
    reqData.id = validateId.data;
  }

  let existingDataById = await photoModel.getById(reqData.id);
  if (isEmpty(existingDataById)) {
    return res.status(404).send({ 
      success: false,
      status: 404,
      message: "No data found"
    });
  }
  const uploadPath = imagePath + existingDataById[0].name;
  fs.unlink(uploadPath, async (err) => {
    if (err) {
      return res.status(500).send({
        success: false,
        status: 500,
        message: "Failed to delete the file."
      });
    }
    
  
    let data = {
      status: 0,
      updated_by: reqData.updated_by,
      updated_at: await commonObject.getGMT()
    };

    let result = await photoModel.updateById(reqData.id, data);

    if (result.affectedRows == undefined || result.affectedRows < 1) {
      return res.status(500).send({
        success: true,
        status: 500,
        message: "Something went wrong in the system database."
      });
    }

    return res.status(200).send({
      success: true,
      status: 200,
      message: "Image successfully deleted."
    });
  });
});


//update
router.put('/updateImage', async (req, res) => {
  try {
    let reqData = {
      id: req.body.id
    };
  
    reqData.updated_by = 1;

    if(isEmpty(reqData.id)){
      return res.status(400).send({
        success: false,
        status: 400,
        message: "Given Images Id"
      });
    }
  
    let validateId = await commonObject.checkItsNumber(reqData.id);
  
    if (validateId.success == false) {
      return res.status(400).send({
        success: false,
        status: 400,
        message: "Value should be an integer."
      });
    } else {
      req.body.id = validateId.data;
      reqData.id = validateId.data;
    }

    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).send({
        success: false,
        status: 400,
        message:'No files were uploaded.'
      });
    }

    const sampleFile = req.files.sampleFile;
    const time = Date.now();
    const fileName = `${time}_${sampleFile.name}`;
    const uploadPath = imagePath + fileName;
   
    // Validate file type
    const isValid = newCommonObject.validateFile(sampleFile, res);
    if (isValid !== true) {
      return res.status(400).send({
        success: false,
        status: 400,
        message: 'Invalid File'
      });
    }

    let existingDataById = await photoModel.getById(reqData.id);
    if (isEmpty(existingDataById)) {
      return res.status(404).send({ 
        success: false,
        status: 404,
        message: "No data found" 
      });
    }

    // Delete previous old image
    const previousImagePath = imagePath + existingDataById[0].name;
    fs.unlink(previousImagePath, (err) => {
      if (err) {
        return res.status(400).send({ 
          success: false,
          status: 400,
          message: 'Error deleting previous image'
        });
        }
    });

    sampleFile.mv(uploadPath, async function(err) {
      if (err) {
        return res.status(500).send({ 
          success: false,
          status: 400,
          message: 'Field upload image' 
        });
      }

      const updateData = {
        name: fileName
      };

      try {
        const result = await photoModel.updateById(reqData.id, updateData);

        if (result.affectedRows === undefined || result.affectedRows < 1) {
          return res.status(500).send({
            success: false,
            status: 500,
            message: 'Something went wrong in the database.'
          });
        } else {
          return res.status(201).send({
            success: true,
            status: 201,
            message: 'Image updated successfully.'
          });
        }
      } catch (error) {
        return res.status(500).send({
          success: false,
          status: 500,
          message: 'Something went wrong in the database.'
        });
      }
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      status: 500,
      message: 'Internal server error.'
    });
  }
});



module.exports = router;