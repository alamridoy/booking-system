const express = require("express");
const isEmpty = require("is-empty");
const router = express.Router();
const commonObject = require("../common/common");
const { routeAccessChecker } = require("../middlewares/routeAccess");
const roomModel = require("../models/room");
const policyModel = require("../models/policy");
const bedTypeModel = require("../models/bedType");
const businessFacilitiesModel = require("../models/businessFacilities");
const fitnessWellnessFacilitiesModel = require("../models/fitnessWellnessFacilities");
const foodAndDrinksFacilitiesModel = require("../models/foodDrinks");
const generalModel = require("../models/general");
const mediaAndTechnologyModel = require("../models/mediaTechnology");
const outdoorsAndActivitiesModel = require("../models/outdoors-activities");
const parkingModel = require("../models/parking");
const safetyAndSecurityModel = require("../models/safety-security");
const serviceAndExtrasModel = require("../models/services-extras");
const transportationModel = require("../models/transportation");
const roomTypeModel = require("../models/roomType");
const roomForBusinessModel = require("../models/roomForBusinessFacilities");
const imagesModel = require("../models/roomForImages");
//
const fileUpload = require('express-fileupload');
const app = express();
const photoModel = require("../models/image");
app.use(fileUpload());
const newCommonObject = require("../common/newCommon");
const fs = require('fs');
const { updateById } = require("../queries/image");
const { log } = require("console");
//



let imagePath = `${process.env.image_path}`;

// create room
router.post("/add-room", async (req, res) => {
  let reqData = {
    "room_type": req.body.room_type,
    "room_description": req.body.room_description,
    "image":req.body.image,
    "smoking_room": req.body.smoking_room,
    "policy_id": req.body.policy_id,
    "refundable": req.body.refundable,
    "price": req.body.price,
    "discount": req.body.discount,
    "vat": req.body.vat,
    "available": req.body.available,
    "total_adult_limit": req.body.total_adult_limit,
    "total_child_limit": req.body.total_child_limit,
    "bed_type": req.body.bed_type,
    "total_room": req.body.total_room,
    "out_door_view": req.body.out_door_view,
    "business_facilities_types_id": req.body.business_facilities_types_id,
    "fitness_and_wellness_facilities_types_id":req.body.fitness_and_wellness_facilities_types_id,
    "food_and_drink_types_id":req.body.food_and_drink_types_id,
    "general_types_id":req.body.general_types_id,
    "media_and_technology_types_id":req.body.media_and_technology_types_id,
    "outdoors_and_activities_types_id":req.body.outdoors_and_activities_types_id,
    "parking_types_id":req.body.parking_types_id,
    "safety_and_security_types_id":req.body.safety_and_security_types_id,
    "services_and_extras_types_id":req.body.services_and_extras_types_id,
    "transportation_types_id":req.body.transportation_types_id
  };
  



  reqData.created_by = 1;
  reqData.updated_by = 1;

  reqData.created_at = await commonObject.getGMT();
  reqData.updated_at = await commonObject.getGMT();



  // room_type
  let validateRoom = await commonObject.checkItsNumber(reqData.room_type);

  if (validateRoom.success == false) {
    return res.status(400).send({
      success: false,
      status: 400,
      message: "Invalid Room_type ID",
    });
  } else {
    req.body.room_type = validateRoom.data;
    reqData.room_type = validateRoom.data;
  }

  let existingRoomDataById = await roomTypeModel.getById(reqData.room_type);
  if (isEmpty(existingRoomDataById)) {
    return res.status(404).send({
      success: false,
      status: 404,
      message: "Room type data not found",
    });
  }
  
  let existingData = await roomModel.getByRoomType(reqData.room_type);

    if (!isEmpty(existingData)) {
        return res.status(409).send({
            "success": false,
            "status": 409,
            "message": existingData[0].status == "1" ? "This Room Type Already Exists." : "This Room Type Already Exists but Deactivate, You can activate it."
        });

    }



  // room descriptions
  if (typeof reqData.room_description === "string") {
    reqData.room_description = reqData.room_description.trim();
  } else {
    return res.status(400).send({
      success: false,
      status: 400,
      message: "Room description should be string",
    });
  }

  
//images
if (!req.files || Object.keys(req.files).length === 0) {
  return res.status(400).send({
    "success": false,
    "status": 400,
    "message": 'No files were uploaded.'
  });
}

let fileObject = [];

const sampleFiles = req.files.image;

for (let i = 0; i < sampleFiles.length; i++) {
  let time = Date.now();
  const image = sampleFiles[i];
  image.name = `${time}_${image.name}`;

  const uploadPath = imagePath + image.name;

  // Validate file type
  const isValid = newCommonObject.validateFile(image, res);
  if (isValid !== true) {
    return res.status(400).send({
      "success": false,
      "status": 400,
      "message": "Invalid File"
    });
  }

  // Move the file to the specified upload path
  image.mv(uploadPath, function(err) {
    if (err) {
      return res.status(500).send({
        "success": false,
        "status": 500,
        "message": "Failed to upload file."
      });
    }
  });

  fileObject.push({
    name: image.name,
  });

}

// Add the following code to send the modified fileObject as a response

//image end




  // smoking_room
  let validateSomkingRoom = await commonObject.checkItsNumber(
    reqData.smoking_room
  );

  if (validateSomkingRoom.success == false) {
    return res.status(400).send({
      success: false,
      status: 400,
      message: "Invalid Somking Room ",
    });
  }else if (validateSomkingRoom.data !== 0 && validateSomkingRoom.data !== 1) {
    return res.status(400).send({
      success: false,
      status: 400,
      message: "Invalid.Somking Room should be 1 or 0.",
    });
  }else {
    req.body.smoking_room = validateSomkingRoom.data;
    reqData.smoking_room = validateSomkingRoom.data;
  }

  // policy_id
  let validatePolicy = await commonObject.checkItsNumber(reqData.policy_id);

  if (validatePolicy.success == false) {
    return res.status(400).send({
      success: false,
      status: 400,
      message: "Invalid Policy ID",
    });
  } else {
    req.body.policy_id = validatePolicy.data;
    reqData.policy_id = validatePolicy.data;
  }

  let existingPolicyDataById = await policyModel.getById(reqData.policy_id);
  if (isEmpty(existingPolicyDataById)) {
    return res.status(404).send({
      success: false,
      status: 404,
      message: "Policy data no found",
    });
  }

  // refundable

  let validateRefundable = await commonObject.checkItsNumber(
    reqData.refundable
  );

  if (validateRefundable.success == false) {
    return res.status(400).send({
      success: false,
      status: 400,
      message: "Invalid Refundable ",
    });
  } else if (validateRefundable.data != 0 && validateRefundable.data != 1) {
    return res.status(400).send({
      success: false,
      status: 400,
      message: "Invalid.Refundable should be 1 or 0.",
    });
  } else {
    req.body.refundable = validateRefundable.data;
    reqData.refundable = validateRefundable.data;
  }

  // price

  let validatePrice = await commonObject.checkItsNumber(reqData.price);

  if (validatePrice.success == false) {
    return res.status(400).send({
      success: false,
      status: 400,
      message: "Invalid Price ",
    });
  }
  if (isEmpty(validatePrice) || validatePrice.data < 0) {
    return res.status(400).send({
      success: false,
      status: 400,
      message: "Invalid Price",
    });
  } else {
    req.body.price = validatePrice.data;
    reqData.price = validatePrice.data;
  }

  // discount

  if (isEmpty(req.body.discount)) {
    req.body.discount = 0;
    reqData.discount = 0;
  }

  let validateDiscount = await commonObject.checkItsNumber(reqData.discount);

  if (validateDiscount.success == false) {
    return res.status(400).send({
      success: false,
      status: 400,
      message: "Invalid Discount",
    });
  } else if (
    validateDiscount.data > validatePrice.data ||
    validateDiscount.data < 0
  ) {
    return res.status(400).send({
      success: false,
      status: 400,
      message: "Invalid Discount",
    });
  } else {
    req.body.discount = validateDiscount.data;
    reqData.discount = validateDiscount.data;
  }

 

  // vat
  if (isEmpty(req.body.vat)) {
    req.body.vat = 0;
    reqData.vat = 0;
  }
  let validateVat = await commonObject.checkItsNumber(reqData.vat);

  if (validateVat.success == false) {
    return res.status(400).send({
      success: false,
      status: 400,
      message: "Invalid Vat ",
    });
  }
  if (validateVat.data > 100 || validateVat.data < 0) {
    return res.status(400).send({
      success: false,
      status: 400,
      message: "Invalid Vat",
    });
  } else {
    req.body.vat = validateVat.data;
    reqData.vat = validateVat.data;
  }

  // total price

  const totalPrice =
    validatePrice.data -
    validateDiscount.data +
    validatePrice.data * (validateVat.data / 100);

  req.body.price = validatePrice.data;
  req.body.discount = validateDiscount.data;
  req.body.vat = validateVat.data;

  reqData.price = validatePrice.data;
  reqData.discount = validateDiscount.data;
  reqData.vat = validateVat.data;
  reqData.total_price = totalPrice;

  // avaiable
  let validateAvaiable = await commonObject.checkItsNumber(reqData.available);

  if (validateAvaiable.success == false) {
    return res.status(400).send({
      success: false,
      status: 400,
      message: "Invalid Avaiable ",
    });
  } else if (validateAvaiable.data != 0 && validateAvaiable.data != 1) {
    return res.status(400).send({
      success: false,
      status: 400,
      message: "Invalid.Avaiable should be 1 or 0.",
    });
  } else {
    req.body.available = validateAvaiable.data;
    reqData.available = validateAvaiable.data;
  }

  //total_adult_limit

  let validateAdultLimit = await commonObject.checkItsNumber(
    reqData.total_adult_limit
  );

  if (validateAdultLimit.success == false) {
    return res.status(400).send({
      success: false,
      status: 400,
      message: "Invalid Adult Limit ",
    });
  }else if(validateAdultLimit.data>6 || validateAdultLimit.data < 1){
    return res.status(400).send({
      success: false,
      status: 400,
      message: "Please Select total adult limit 1 to 6",
    });
   }else {
    req.body.total_adult_limit = validateAdultLimit.data;
    reqData.total_adult_limit = validateAdultLimit.data;
  }

  // total_clild_limit
  let validateChildLimit = await commonObject.checkItsNumber(
    reqData.total_child_limit
  );

  if (validateChildLimit.success == false) {
    return res.status(400).send({
      success: false,
      status: 400,
      message: "Invalid Child Limit ",
    });
  }else if(validateChildLimit.data>3 || validateChildLimit.data < 0){
    return res.status(400).send({
      success: false,
      status: 400,
      message: "Please Select total Child limit 0 to 3",
    });
   }else if(validateChildLimit.data > validateAdultLimit.data){
    return res.status(400).send({
      success: false,
      status: 400,
      message: "Please Select total Child limit less than total adult limit ",
    });
  } else {
    req.body.total_child_limit = validateChildLimit.data;
    reqData.total_child_limit = validateChildLimit.data;
  }

  // bed_type
  let validateBedType = await commonObject.checkItsNumber(reqData.bed_type);

  if (validateBedType.success == false) {
    return res.status(400).send({
      success: false,
      status: 400,
      message: "Invalid Bed Type ",
    });
  }else {
    req.body.bed_type = validateBedType.data;
    reqData.bed_type = validateBedType.data;
  }
  let existingBedTypeById = await bedTypeModel.getById(reqData.bed_type);
  if (isEmpty(existingBedTypeById)) {
    return res.status(404).send({
      success: false,
      status: 404,
      message: "Bed Type data no found",
    });
  }

  // total_room
  let validateRoomLimit = await commonObject.checkItsNumber(reqData.total_room);

  if (validateRoomLimit.success == false) {
    return res.status(400).send({
      success: false,
      status: 400,
      message: "Invalid Room Limit ",
    });
  } else {
    req.body.total_room = validateRoomLimit.data;
    reqData.total_room = validateRoomLimit.data;
  }
  // out_door_view
  let validateOutDoorView = await commonObject.checkItsNumber(
    reqData.out_door_view
  );

  if (validateOutDoorView.success == false) {
    return res.status(400).send({
      success: false,
      status: 400,
      message: "Invalid Out door view ",
    });
  } else if (validateOutDoorView.data != 0 && validateOutDoorView.data != 1) {
    return res.status(400).send({
      success: false,
      status: 400,
      message: "Invalid.Out door view should be 1 or 0.",
    });
  } else {
    req.body.out_door_view = validateOutDoorView.data;
    reqData.out_door_view = validateOutDoorView.data;
  }

  
// room for business type id

if (
  reqData.business_facilities_types_id !== undefined &&
  !isEmpty(reqData.business_facilities_types_id)
) {
  // Convert single value to array if necessary
  if (!Array.isArray(reqData.business_facilities_types_id)&& !isEmpty(reqData.business_facilities_types_id)) {
    reqData.business_facilities_types_id = [reqData.business_facilities_types_id];
  }

 

  if (reqData.business_facilities_types_id.length === 0) {
    return res.status(400).send({
      success: true,
      status: 400,
      message: "business Facilities Type should be an array or a single value.",
    });
  }

  // check duplicate array
  let duplicateCheckInArrayResult = await commonObject.duplicateCheckInArray(
    reqData.business_facilities_types_id
  );

  if (duplicateCheckInArrayResult.result) {
    return res.status(400).send({
      success: false,
      status: 400,
      message: "business facilities types contains duplicate values.",
    });
  }

  // Check and process each business facility type ID
  for (let i = 0; i < reqData.business_facilities_types_id.length; i++) {
    let validateBusinessFacilitiesTypesId = await commonObject.checkItsNumber(
      reqData.business_facilities_types_id[i]
    );

    if (!validateBusinessFacilitiesTypesId.success) {
      return res.status(400).send({
        success: false,
        status: 400,
        message: `business facilities types Value ${reqData.business_facilities_types_id[i]} should be an integer.`,
      });
    }

    reqData.business_facilities_types_id[i] =
      validateBusinessFacilitiesTypesId.data;

    let businessFacilitiesTypesDetails = await businessFacilitiesModel.getDataByWhereCondition(
      { status: 1, id: reqData.business_facilities_types_id[i] }
    );

    if (isEmpty(businessFacilitiesTypesDetails)) {
      return res.status(404).send({
        success: false,
        status: 404,
        message: "No business Facilities Type found.",
      });
    }
  }
} else {
  return res.status(400).send({
    success: true,
    status: 400,
    message: "Please select a business Facilities Type.",
  });
}


let roomForBusiness = [];

for (let index = 0; index < reqData.business_facilities_types_id.length; index++) {
roomForBusiness.push(
{
 "business_facilities_types_id": reqData.business_facilities_types_id[index],
 "created_by": 1,
 "updated_by": 1
}
)
}


// fitness and wellness facilities type
if (reqData.fitness_and_wellness_facilities_types_id !== undefined &&
  !isEmpty(reqData.fitness_and_wellness_facilities_types_id)
) {
  // Convert single value to array if necessary
  if (!Array.isArray(reqData.fitness_and_wellness_facilities_types_id)&& !isEmpty(reqData.fitness_and_wellness_facilities_types_id)) {
    reqData.fitness_and_wellness_facilities_types_id = [
      reqData.fitness_and_wellness_facilities_types_id
    ];
  }

  if (reqData.fitness_and_wellness_facilities_types_id.length === 0) {
    return res.status(400).send({
      success: true,
      status: 400,
      message: "Fitness and Wellness facilities Type should be an array or a single value.",
    });
  }

  // check duplicate array
  let duplicateCheckInArrayResult = await commonObject.duplicateCheckInArray(
    reqData.fitness_and_wellness_facilities_types_id
  );

  if (duplicateCheckInArrayResult.result) {
    return res.status(400).send({
      success: false,
      status: 400,
      message: "Fitness and Wellness facilities types contains duplicate values.",
    });
  }

  // Check and process each fitness and wellness facility type ID
  for (let i = 0; i < reqData.fitness_and_wellness_facilities_types_id.length; i++) {
    let validateFitnessWellnessFacilitiesTypesId = await commonObject.checkItsNumber(
      reqData.fitness_and_wellness_facilities_types_id[i]
    );

    if (!validateFitnessWellnessFacilitiesTypesId.success) {
      return res.status(400).send({
        success: false,
        status: 400,
        message: `Fitness and Wellness facilities types Value ${reqData.fitness_and_wellness_facilities_types_id[i]} should be an integer.`,
      });
    }

    reqData.fitness_and_wellness_facilities_types_id[i] =
      validateFitnessWellnessFacilitiesTypesId.data;

    let fitnessWellnessFacilitiesTypesDetails = await fitnessWellnessFacilitiesModel.getDataByWhereCondition(
      { status: 1, id: reqData.fitness_and_wellness_facilities_types_id[i] }
    );

    if (isEmpty(fitnessWellnessFacilitiesTypesDetails)) {
      return res.status(404).send({
        success: false,
        status: 404,
        message: "No Fitness and Wellness facilities Type found.",
      });
    }
  }
} else {
  return res.status(400).send({
    success: true,
    status: 400,
    message: "Please select a Fitness and Wellness facilities Type.",
  });
}


// food and drink type
if (
  reqData.food_and_drink_types_id !== undefined &&
  !isEmpty(reqData.food_and_drink_types_id)
) {
  // Convert single value to array if necessary
  if (!Array.isArray(reqData.food_and_drink_types_id) && !isEmpty(reqData.food_and_drink_types_id)) {
    reqData.food_and_drink_types_id = [reqData.food_and_drink_types_id];
  }

  if (reqData.food_and_drink_types_id.length === 0) {
    return res.status(400).send({
      success: false,
      status: 400,
      message: "Food and drink types should be an array or a single value.",
    });
  }

  // Check for duplicate values in the array
  let duplicateCheckInArrayResult = await commonObject.duplicateCheckInArray(reqData.food_and_drink_types_id);

  if (duplicateCheckInArrayResult.result) {
    return res.status(400).send({
      success: false,
      status: 400,
      message: "Food and drink types contain duplicate values.",
    });
  }

  // Check Food and Drink Types IDs from the database
  for (let i = 0; i < reqData.food_and_drink_types_id.length; i++) {
    let validateFoodAndDrinksFacilitiesTypesId = await commonObject.checkItsNumber(reqData.food_and_drink_types_id[i]);

    if (!validateFoodAndDrinksFacilitiesTypesId.success) {
      return res.status(400).send({
        success: false,
        status: 400,
        message: `Food and drink types value '${reqData.food_and_drink_types_id[i]}' should be an integer.`,
      });
    }

    reqData.food_and_drink_types_id[i] = validateFoodAndDrinksFacilitiesTypesId.data;

    let foodAndDrinksFacilitiesTypesDetails = await foodAndDrinksFacilitiesModel.getDataByWhereCondition({
      status: 1,
      id: reqData.food_and_drink_types_id[i],
    });

    if (isEmpty(foodAndDrinksFacilitiesTypesDetails)) {
      return res.status(404).send({
        success: false,
        status: 404,
        message: "No Food and drinks Type found.",
      });
    }
  }
} else {
  return res.status(400).send({
    success: false,
    status: 400,
    message: "Food and drinks Type should be an array.",
  });
}




// general type
if (
  reqData.general_types_id !== undefined &&
  !isEmpty(reqData.general_types_id)
) {
  // Convert single value to array if necessary
  if (!Array.isArray(reqData.general_types_id) && !isEmpty(reqData.general_types_id)) {
    reqData.general_types_id = [reqData.general_types_id];
  }

  if (reqData.general_types_id.length === 0) {
    return res.status(400).send({
      success: false,
      status: 400,
      message: "General types should be an array or a single value.",
    });
  }

  // Check for duplicate values in the array
  let duplicateCheckInArrayResult = await commonObject.duplicateCheckInArray(reqData.general_types_id);

  if (duplicateCheckInArrayResult.result) {
    return res.status(400).send({
      success: false,
      status: 400,
      message: "General types contain duplicate values.",
    });
  }

  // Check General Types IDs from the database
  for (let i = 0; i < reqData.general_types_id.length; i++) {
    let validateGeneralTypesId = await commonObject.checkItsNumber(reqData.general_types_id[i]);

    if (!validateGeneralTypesId.success) {
      return res.status(400).send({
        success: false,
        status: 400,
        message: `General types value '${reqData.general_types_id[i]}' should be an integer.`,
      });
    }

    reqData.general_types_id[i] = validateGeneralTypesId.data;

    let generalTypesDetails = await generalModel.getDataByWhereCondition({
      status: 1,
      id: reqData.general_types_id[i],
    });

    if (isEmpty(generalTypesDetails)) {
      return res.status(404).send({
        success: false,
        status: 404,
        message: "No General Type found.",
      });
    }
  }
} else {
  return res.status(400).send({
    success: false,
    status: 400,
    message: "General Type should be an array.",
  });
}


let roomForGeneral = [];

for (let index = 0; index < reqData.general_types_id.length; index++) {
  roomForGeneral.push(
   {
     "general_types_id": reqData.general_types_id[index],
     "created_by": 1,
     "updated_by": 1
    }
 )
}


// media and technology type
if (
  reqData.media_and_technology_types_id !== undefined &&
  !isEmpty(reqData.media_and_technology_types_id)
) {
  // Convert single value to array if necessary
  if (!Array.isArray(reqData.media_and_technology_types_id) && !isEmpty(reqData.media_and_technology_types_id)) {
    reqData.media_and_technology_types_id = [reqData.media_and_technology_types_id];
  }

  if (reqData.media_and_technology_types_id.length === 0) {
    return res.status(400).send({
      success: false,
      status: 400,
      message: "Media and technology types should be an array or a single value.",
    });
  }

  // Check for duplicate values in the array
  let duplicateCheckInArrayResult = await commonObject.duplicateCheckInArray(reqData.media_and_technology_types_id);

  if (duplicateCheckInArrayResult.result) {
    return res.status(400).send({
      success: false,
      status: 400,
      message: "Media and Technology types contain duplicate values.",
    });
  }

  // Check Media and Technology Types IDs from the database
  for (let i = 0; i < reqData.media_and_technology_types_id.length; i++) {
    let validateMediaAndTechnologyTypesId = await commonObject.checkItsNumber(reqData.media_and_technology_types_id[i]);

    if (!validateMediaAndTechnologyTypesId.success) {
      return res.status(400).send({
        success: false,
        status: 400,
        message: `Media and Technology types value '${reqData.media_and_technology_types_id[i]}' should be an integer.`,
      });
    }

    reqData.media_and_technology_types_id[i] = validateMediaAndTechnologyTypesId.data;

    let mediaAndTechnologyDetails = await mediaAndTechnologyModel.getDataByWhereCondition({
      status: 1,
      id: reqData.media_and_technology_types_id[i],
    });

    if (isEmpty(mediaAndTechnologyDetails)) {
      return res.status(404).send({
        success: false,
        status: 404,
        message: "No Media and Technology Type found.",
      });
    }
  }
} else {
  return res.status(400).send({
    success: false,
    status: 400,
    message: "Media and Technology Type should be an array.",
  });
}

let roomForMediaAndTechnology = [];

for (let index = 0; index < reqData.media_and_technology_types_id.length; index++) {
  roomForMediaAndTechnology.push(
   {
     "media_and_technology_types_id": reqData.media_and_technology_types_id[index],
     "created_by": 1,
     "updated_by": 1
    }
 )
}



// outdoors and activities type
if (
  reqData.outdoors_and_activities_types_id !== undefined &&
  !isEmpty(reqData.outdoors_and_activities_types_id)
) {
  // Convert single value to array if necessary
  if (!Array.isArray(reqData.outdoors_and_activities_types_id) && !isEmpty(reqData.outdoors_and_activities_types_id)) {
    reqData.outdoors_and_activities_types_id = [reqData.outdoors_and_activities_types_id];
  }

  if (reqData.outdoors_and_activities_types_id.length === 0) {
    return res.status(400).send({
      success: false,
      status: 400,
      message: "Outdoors and activities types should be an array or a single value.",
    });
  }

  // Check for duplicate values in the array
  let duplicateCheckInArrayResult = await commonObject.duplicateCheckInArray(reqData.outdoors_and_activities_types_id);

  if (duplicateCheckInArrayResult.result) {
    return res.status(400).send({
      success: false,
      status: 400,
      message: "Outdoors and Activities types contain duplicate values.",
    });
  }

  // Check outdoors and activities Types IDs from the database
  for (let i = 0; i < reqData.outdoors_and_activities_types_id.length; i++) {
    let validateOutdoorsAndActivitiesTypesId = await commonObject.checkItsNumber(reqData.outdoors_and_activities_types_id[i]);

    if (!validateOutdoorsAndActivitiesTypesId.success) {
      return res.status(400).send({
        success: false,
        status: 400,
        message: `Outdoors and Activities types value '${reqData.outdoors_and_activities_types_id[i]}' should be an integer.`,
      });
    }

    reqData.outdoors_and_activities_types_id[i] = validateOutdoorsAndActivitiesTypesId.data;

    let outdoorsAndActivitiesTypesIdDetails = await outdoorsAndActivitiesModel.getDataByWhereCondition({
      status: 1,
      id: reqData.outdoors_and_activities_types_id[i],
    });

    if (isEmpty(outdoorsAndActivitiesTypesIdDetails)) {
      return res.status(404).send({
        success: false,
        status: 404,
        message: "No Outdoors and Activities Type found.",
      });
    }
  }
} else {
  return res.status(400).send({
    success: false,
    status: 400,
    message: "Outdoors and Activities Type should be an array.",
  });
}

let roomForOutdoorsAndActivities = [];

for (let index = 0; index < reqData.outdoors_and_activities_types_id.length; index++) {
  roomForOutdoorsAndActivities.push(
   {
     "outdoors_and_activities_types_id": reqData.outdoors_and_activities_types_id[index],
     "created_by": 1,
     "updated_by": 1
    }
 )
}


// parking Types
if (
  reqData.parking_types_id !== undefined &&
  !isEmpty(reqData.parking_types_id)
) {
  // Convert single value to array if necessary
  if (!Array.isArray(reqData.parking_types_id) && !isEmpty(reqData.parking_types_id)) {
    reqData.parking_types_id = [reqData.parking_types_id];
  }

  if (reqData.parking_types_id.length === 0) {
    return res.status(400).send({
      success: false,
      status: 400,
      message: "Parking types should be an array or a single value.",
    });
  }

  // Check for duplicate values in the array
  let duplicateCheckInArrayResult = await commonObject.duplicateCheckInArray(reqData.parking_types_id);

  if (duplicateCheckInArrayResult.result) {
    return res.status(400).send({
      success: false,
      status: 400,
      message: "Parking types contain duplicate values.",
    });
  }

  // Check parking Types IDs from the database
  for (let i = 0; i < reqData.parking_types_id.length; i++) {
    let validateParkingTypesId = await commonObject.checkItsNumber(reqData.parking_types_id[i]);

    if (!validateParkingTypesId.success) {
      return res.status(400).send({
        success: false,
        status: 400,
        message: `Parking types value '${reqData.parking_types_id[i]}' should be an integer.`,
      });
    }

    reqData.parking_types_id[i] = validateParkingTypesId.data;

    let parkingTypesDetails = await parkingModel.getDataByWhereCondition({
      status: 1,
      id: reqData.parking_types_id[i],
    });

    if (isEmpty(parkingTypesDetails)) {
      return res.status(404).send({
        success: false,
        status: 404,
        message: "No Parking Type found.",
      });
    }
  }
} else {
  return res.status(400).send({
    success: false,
    status: 400,
    message: "Parking Type should be an array.",
  });
}

let roomForParking = [];

for (let index = 0; index < reqData.parking_types_id.length; index++) {
  roomForParking.push(
   {
     "parking_types_id": reqData.parking_types_id[index],
     "created_by": 1,
     "updated_by": 1
    }
 )
}


// room for safety and security
if (
  reqData.safety_and_security_types_id !== undefined &&
  !isEmpty(reqData.safety_and_security_types_id)
) {
  // Convert single value to array if necessary
  if (!Array.isArray(reqData.safety_and_security_types_id) && !isEmpty(reqData.safety_and_security_types_id)) {
    reqData.safety_and_security_types_id = [reqData.safety_and_security_types_id];
  }

  if (reqData.safety_and_security_types_id.length === 0) {
    return res.status(400).send({
      success: false,
      status: 400,
      message: "Safety and Security types should be an array or a single value.",
    });
  }

  // Check for duplicate values in the array
  let duplicateCheckInArrayResult = await commonObject.duplicateCheckInArray(reqData.safety_and_security_types_id);

  if (duplicateCheckInArrayResult.result) {
    return res.status(400).send({
      success: false,
      status: 400,
      message: "Safety and Security types contain duplicate values.",
    });
  }

  // Check safety and security Types IDs from the database
  for (let i = 0; i < reqData.safety_and_security_types_id.length; i++) {
    let validateSafetyAndSecurityTypesId = await commonObject.checkItsNumber(reqData.safety_and_security_types_id[i]);

    if (!validateSafetyAndSecurityTypesId.success) {
      return res.status(400).send({
        success: false,
        status: 400,
        message: `Safety and Security types value '${reqData.safety_and_security_types_id[i]}' should be an integer.`,
      });
    }

    reqData.safety_and_security_types_id[i] = validateSafetyAndSecurityTypesId.data;

    let safetyAndSecurityTypesDetails = await safetyAndSecurityModel.getDataByWhereCondition({
      status: 1,
      id: reqData.safety_and_security_types_id[i],
    });

    if (isEmpty(safetyAndSecurityTypesDetails)) {
      return res.status(404).send({
        success: false,
        status: 404,
        message: "No Safety and Security Type found.",
      });
    }
  }
} else {
  return res.status(400).send({
    success: false,
    status: 400,
    message: "Safety and Security Type should be an array.",
  });
}



let roomForSafetyAndSecurity = [];

for (let index = 0; index < reqData.safety_and_security_types_id.length; index++) {
  roomForSafetyAndSecurity.push(
   {
     "safety_and_security_types_id": reqData.safety_and_security_types_id[index],
     "created_by": 1,
     "updated_by": 1
    }
 )
}


// service and extras type
if (
  reqData.services_and_extras_types_id !== undefined &&
  !isEmpty(reqData.services_and_extras_types_id)
) {
  // Convert single value to array if necessary
  if (!Array.isArray(reqData.services_and_extras_types_id) && !isEmpty(reqData.services_and_extras_types_id)) {
    reqData.services_and_extras_types_id = [reqData.services_and_extras_types_id];
  }

  if (reqData.services_and_extras_types_id.length === 0) {
    return res.status(400).send({
      success: false,
      status: 400,
      message: "Services and Extras types should be an array or a single value.",
    });
  }

  // Check for duplicate values in the array
  let duplicateCheckInArrayResult = await commonObject.duplicateCheckInArray(reqData.services_and_extras_types_id);

  if (duplicateCheckInArrayResult.result) {
    return res.status(400).send({
      success: false,
      status: 400,
      message: "Services and Extras types contain duplicate values.",
    });
  }

  // Check service and extras Types IDs from the database
  for (let i = 0; i < reqData.services_and_extras_types_id.length; i++) {
    let validateServiceAndExtrasTypesId = await commonObject.checkItsNumber(reqData.services_and_extras_types_id[i]);

    if (!validateServiceAndExtrasTypesId.success) {
      return res.status(400).send({
        success: false,
        status: 400,
        message: `Services and Extras types value '${reqData.services_and_extras_types_id[i]}' should be an integer.`,
      });
    }

    reqData.services_and_extras_types_id[i] = validateServiceAndExtrasTypesId.data;

    let serviceAndExtrasTypesDetails = await serviceAndExtrasModel.getDataByWhereCondition({
      status: 1,
      id: reqData.services_and_extras_types_id[i],
    });

    if (isEmpty(serviceAndExtrasTypesDetails)) {
      return res.status(404).send({
        success: false,
        status: 404,
        message: "No Services and Extras Type found.",
      });
    }
  }
} else {
  return res.status(400).send({
    success: false,
    status: 400,
    message: "Services and Extras Type should be an array.",
  });
}

let serviceAndExtras = [];

for (let index = 0; index < reqData.services_and_extras_types_id.length; index++) {
  serviceAndExtras.push(
   {
     "services_and_extras_types_id": reqData.services_and_extras_types_id[index],
     "created_by": 1,
     "updated_by": 1
    }
 )
}



// transportation Types
if (
  reqData.transportation_types_id !== undefined &&
  !isEmpty(reqData.transportation_types_id)
) {
  // Convert single value to array if necessary
  if (!Array.isArray(reqData.transportation_types_id) && !isEmpty(reqData.transportation_types_id)) {
    reqData.transportation_types_id = [reqData.transportation_types_id];
  }

  if (reqData.transportation_types_id.length === 0) {
    return res.status(400).send({
      success: false,
      status: 400,
      message: "Transportation types should be an array or a single value.",
    });
  }

  // Check for duplicate values in the array
  let duplicateCheckInArrayResult = await commonObject.duplicateCheckInArray(reqData.transportation_types_id);

  if (duplicateCheckInArrayResult.result) {
    return res.status(400).send({
      success: false,
      status: 400,
      message: "Transportation types contain duplicate values.",
    });
  }

  // Check transportation Types IDs from the database
  for (let i = 0; i < reqData.transportation_types_id.length; i++) {
    let validateTransportationTypesId = await commonObject.checkItsNumber(reqData.transportation_types_id[i]);

    if (!validateTransportationTypesId.success) {
      return res.status(400).send({
        success: false,
        status: 400,
        message: `Transportation types value '${reqData.transportation_types_id[i]}' should be an integer.`,
      });
    }

    reqData.transportation_types_id[i] = validateTransportationTypesId.data;

    let transportationTypesDetails = await transportationModel.getDataByWhereCondition({
      status: 1,
      id: reqData.transportation_types_id[i],
    });

    if (isEmpty(transportationTypesDetails)) {
      return res.status(404).send({
        success: false,
        status: 404,
        message: "No Transportation Type found.",
      });
    }
  }
} else {
  return res.status(400).send({
    success: false,
    status: 400,
    message: "Transportation Type should be an array.",
  });
}

let transportation = [];

for (let index = 0; index < reqData.transportation_types_id.length; index++) {
  transportation.push(
   {
     "transportation_types_id": reqData.transportation_types_id[index],
     "created_by": 1,
     "updated_by": 1
    }
 )
}

   let room = {}
   room = {
    "room_type": reqData.room_type,
    "room_description": reqData.room_description,
    "smoking_room": reqData.smoking_room,
    "policy_id": reqData.policy_id,
    "refundable": reqData.refundable,
    "price":  reqData.price,
    "discount":  reqData.discount,
    "vat":  reqData.vat,
    "total_price": reqData.total_price,
    "available": reqData.available,
    "total_adult_limit":  reqData.total_adult_limit,
    "total_child_limit": reqData.total_child_limit,
    "bed_type": reqData.bed_type,
    "total_room": reqData.total_room,
    "out_door_view":  reqData.out_door_view,
    // "created_by": 1,
    "updated_by":1
    
 };




let roomForFitnessWellness = [];

for (let index = 0; index < reqData.fitness_and_wellness_facilities_types_id.length; index++) {
  roomForFitnessWellness.push(
   {
     "fitness_and_wellness_facilities_types_id": reqData.fitness_and_wellness_facilities_types_id[index],
     "created_by": 1,
     "updated_by": 1
    }
 )
}

let roomForFoodAndDrinks = [];

for (let index = 0; index < reqData.food_and_drink_types_id.length; index++) {
  roomForFoodAndDrinks.push(
   {
     "food_and_drink_types_id": reqData.food_and_drink_types_id[index],
     "created_by": 1,
     "updated_by": 1
    }
 )
}
// return res.status(201).send({
//   success: true,
//   status: 201,
//   message: [room,roomForBusiness,roomForFitnessWellness,roomForFoodAndDrinks,roomForGeneral,roomForMediaAndTechnology,roomForOutdoorsAndActivities,roomForParking,roomForSafetyAndSecurity,serviceAndExtras,transportation,fileObject]
// });



  let result = await roomModel.addNew(room,roomForBusiness,roomForFitnessWellness,roomForFoodAndDrinks,roomForGeneral,roomForMediaAndTechnology,roomForOutdoorsAndActivities,roomForParking,roomForSafetyAndSecurity,serviceAndExtras,transportation,fileObject);

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
    message: "Room Added Successfully.",
  });
});


// list
router.get("/list", async (req, res) => {
  let result = await roomModel.getList();
  return res.status(200).send({
    success: true,
    status: 200,
    message: "Room List.",
    count: result.length,
    data: result,
  });
});


//active list
router.get('/activeList',async (req, res) => {

  let result = await roomModel.getActiveList();

  return res.status(200).send({
      "success": true,
      "status": 200,
      "message": "Room Active List.",
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

  let existingDataById = await roomModel.getById(reqData.id);
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
   
 
   let result = await roomModel.updateById(reqData.id,data);


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
       "message": "Room successfully deleted."
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

    let existingDataById = await roomModel.getById(reqData.id);
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

  let result = await roomModel.updateById(reqData.id,data);


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
      "message": "Room status has successfully changed."
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

  let result = await roomModel.getById(id);

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
      message: "Room Details.",
      data: result[0],
    });
    
  }

}
);



// update

router.put("/update", async (req, res) => {
  let reqData = {
    "id": req.body.id,
    "room_type": req.body.room_type,
    "room_description": req.body.room_description,
    "smoking_room": req.body.smoking_room,
    "policy_id": req.body.policy_id,
    "refundable": req.body.refundable,
    "price": req.body.price,
    "discount": req.body.discount,
    "vat": req.body.vat,
    "available": req.body.available,
    "total_adult_limit": req.body.total_adult_limit,
    "total_child_limit": req.body.total_child_limit,
    "bed_type": req.body.bed_type,
    "total_room": req.body.total_room,
    "out_door_view": req.body.out_door_view,
    "business_facilities_types_id": req.body.business_facilities_types_id
  };


  
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

    let existingDataById = await roomModel.getById(reqData.id);
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


  // room_type
  let validateRoomType = await commonObject.checkItsNumber(reqData.room_type);

  if (validateRoomType.success == false) {
    return res.status(400).send({
      success: false,
      status: 400,
      message: "Invalid Room Type ID",
    });
  } else {
    req.body.room_type = validateRoomType.data;
    reqData.room_type = validateRoomType.data;
  }

  let existingRoomTypeDataById = await roomTypeModel.getById(reqData.room_type);
  if (isEmpty(existingRoomTypeDataById)) {
    return res.status(404).send({
      success: false,
      status: 404,
      message: "Room Type data no found",
    });
  }
  if (existingDataById[0].room_type != reqData.room_type) {
    willWeUpdate = 1;
    updateData.room_type = reqData.room_type;
}



  // room descriptions
  if (typeof reqData.room_description === "string") {
    reqData.room_description = reqData.room_description.trim();
  } else {
    return res.status(400).send({
      success: false,
      status: 400,
      message: "Room description should be string",
    });
  }
  if (existingDataById[0].room_description != reqData.room_description) {
    willWeUpdate = 1;
    updateData.room_description = reqData.room_description;
}

  // smoking_room
  let validateSomkingRoom = await commonObject.checkItsNumber(
    reqData.smoking_room
  );

  if (validateSomkingRoom.success == false) {
    return res.status(400).send({
      success: false,
      status: 400,
      message: "Invalid Somking Room ",
    });
  } else if (validateSomkingRoom.data != 0 && validateSomkingRoom.data != 1) {
    return res.status(400).send({
      success: false,
      status: 400,
      message: "Invalid.Somking Room should be 1 or 0.",
    });
  }else{
    req.body.smoking_room = validateSomkingRoom.data;
    reqData.smoking_room = validateSomkingRoom.data;
  }

  if (existingDataById[0].smoking_room != reqData.smoking_room) {
    willWeUpdate = 1;
    updateData.smoking_room = reqData.smoking_room;
}

  // policy_id
  let validatePolicy = await commonObject.checkItsNumber(reqData.policy_id);

  if (validatePolicy.success == false) {
    return res.status(400).send({
      success: false,
      status: 400,
      message: "Invalid Policy ID",
    });
  } else {
    req.body.policy_id = validatePolicy.data;
    reqData.policy_id = validatePolicy.data;
  }

  let existingPolicyDataById = await policyModel.getById(reqData.policy_id);
  if (isEmpty(existingPolicyDataById)) {
    return res.status(404).send({
      success: false,
      status: 404,
      message: "Policy data no found",
    });
  }
  if (existingDataById[0].policy_id != reqData.policy_id) {
    willWeUpdate = 1;
    updateData.policy_id = reqData.policy_id;
}

  // refundable

  let validateRefundable = await commonObject.checkItsNumber(
    reqData.refundable
  );

  if (validateRefundable.success == false) {
    return res.status(400).send({
      success: false,
      status: 400,
      message: "Invalid Refundable ",
    });
  } else if (validateRefundable.data != 0 && validateRefundable.data != 1) {
    return res.status(400).send({
      success: false,
      status: 400,
      message: "Invalid.Refundable should be 1 or 0.",
    });
  } else {
    req.body.refundable = validateRefundable.data;
    reqData.refundable = validateRefundable.data;
  }

  if (existingDataById[0].refundable != reqData.refundable) {
    willWeUpdate = 1;
    updateData.refundable = reqData.refundable;
}


  // price

  let validatePrice = await commonObject.checkItsNumber(reqData.price);

  if (validatePrice.success == false) {
    return res.status(400).send({
      success: false,
      status: 400,
      message: "Invalid Price ",
    });
  }
  if (isEmpty(validatePrice) || validatePrice.data < 0) {
    return res.status(400).send({
      success: false,
      status: 400,
      message: "Invalid Price",
    });
  } else {
    req.body.price = validatePrice.data;
    reqData.price = validatePrice.data;
  }
  if (existingDataById[0].price != reqData.price) {
    willWeUpdate = 1;
    updateData.price = reqData.price;
}

  // discount
 if (isEmpty(req.body.discount)) {
    req.body.discount = 0;
    reqData.discount = 0;
  }

  let validateDiscount = await commonObject.checkItsNumber(reqData.discount);

  if (validateDiscount.success == false) {
    return res.status(400).send({
      success: false,
      status: 400,
      message: "Invalid Discount",
    });
  } else if (
    validateDiscount.data > validatePrice.data ||
    validateDiscount.data < 0
  ) {
    return res.status(400).send({
      success: false,
      status: 400,
      message: "Invalid Discount",
    });
  } else {
    req.body.discount = validateDiscount.data;
    reqData.discount = validateDiscount.data;
  }
  if (existingDataById[0].discount != reqData.discount) {
    willWeUpdate = 1;
    updateData.discount = reqData.discount;
}
 

  // vat
  if (isEmpty(req.body.vat)) {
    req.body.vat = 0;
    reqData.vat = 0;
  }
  let validateVat = await commonObject.checkItsNumber(reqData.vat);

  if (validateVat.success == false) {
    return res.status(400).send({
      success: false,
      status: 400,
      message: "Invalid Vat ",
    });
  }
  if (validateVat.data > 100 || validateVat.data < 0) {
    return res.status(400).send({
      success: false,
      status: 400,
      message: "Invalid Vat",
    });
  } else {
    req.body.vat = validateVat.data;
    reqData.vat = validateVat.data;
  }
  if (existingDataById[0].vat != reqData.vat) {
    willWeUpdate = 1;
    updateData.vat = reqData.vat;
}
 

  // total price

  const totalPrice =
    validatePrice.data -
    validateDiscount.data +
    validatePrice.data * (validateVat.data / 100);

  req.body.price = validatePrice.data;
  req.body.discount = validateDiscount.data;
  req.body.vat = validateVat.data;

  reqData.price = validatePrice.data;
  reqData.discount = validateDiscount.data;
  reqData.vat = validateVat.data;
  reqData.total_price = totalPrice;
  updateData.total_price = totalPrice
  

  // avaiable
  let validateAvaiable = await commonObject.checkItsNumber(reqData.available);

  if (validateAvaiable.success == false) {
    return res.status(400).send({
      success: false,
      status: 400,
      message: "Invalid Avaiable ",
    });
  } else if (validateAvaiable.data != 0 && validateAvaiable.data != 1) {
    return res.status(400).send({
      success: false,
      status: 400,
      message: "Invalid.Avaiable should be 1 or 0.",
    });
  } else {
    req.body.available = validateAvaiable.data;
    reqData.available = validateAvaiable.data;
  }
  if (existingDataById[0].available != reqData.available) {
    willWeUpdate = 1;
    updateData.available = reqData.available;
}


  
  //total_adult_limit

  let validateAdultLimit = await commonObject.checkItsNumber(
    reqData.total_adult_limit
  );

  if (validateAdultLimit.success == false) {
    return res.status(400).send({
      success: false,
      status: 400,
      message: "Invalid Adult Limit ",
    });
  }else if(reqData.total_adult_limit>6 || reqData.total_adult_limit < 1){
    return res.status(400).send({
      success: false,
      status: 400,
      message: "Please Select total adult limit 1 to 6",
    });

  }else {
    req.body.total_adult_limit = validateAdultLimit.data;
    reqData.total_adult_limit = validateAdultLimit.data;
  }
  if (existingDataById[0].total_adult_limit != reqData.total_adult_limit) {
    willWeUpdate = 1;
    updateData.total_adult_limit = reqData.total_adult_limit;
  }

  // total_clild_limit
  let validateChildLimit = await commonObject.checkItsNumber(
    reqData.total_child_limit
  );

  if (validateChildLimit.success == false) {
    return res.status(400).send({
      success: false,
      status: 400,
      message: "Invalid Child Limit ",
    });
  }else if(validateChildLimit.data>3 || validateChildLimit.data < 0){
    return res.status(400).send({
      success: false,
      status: 400,
      message: "Please Select total Child limit 0 to 3",
    });
   }else if(validateChildLimit.data > validateAdultLimit.data){
    return res.status(400).send({
      success: false,
      status: 400,
      message: "Please Select total Child limit less than total adult limit ",
    });

   } else {
    req.body.total_child_limit = validateChildLimit.data;
    reqData.total_child_limit = validateChildLimit.data;
  }
  if (existingDataById[0].total_child_limit != reqData.total_child_limit) {
    willWeUpdate = 1;
    updateData.total_child_limit = reqData.total_child_limit;
}


  // bed_type
  let validateBedType = await commonObject.checkItsNumber(reqData.bed_type);

  if (validateBedType.success == false) {
    return res.status(400).send({
      success: false,
      status: 400,
      message: "Invalid Bed Type ",
    });
  }else {
    req.body.bed_type = validateBedType.data;
    reqData.bed_type = validateBedType.data;
  }
  let existingBedTypeById = await bedTypeModel.getById(reqData.bed_type);
  if (isEmpty(existingBedTypeById)) {
    return res.status(404).send({
      success: false,
      status: 404,
      message: "Bed Type data no found",
    });
  }
  if (existingDataById[0].bed_type != reqData.bed_type) {
    willWeUpdate = 1;
    updateData.bed_type = reqData.bed_type;
}

  // total_room
  let validateRoomLimit = await commonObject.checkItsNumber(reqData.total_room);

  if (validateRoomLimit.success == false) {
    return res.status(400).send({
      success: false,
      status: 400,
      message: "Invalid Room Limit ",
    });
  } else if (validateRoomLimit.data > 3) {
    return res.status(400).send({
      success: false,
      status: 400,
      message: "Invalid.Selected Maximun 3 Rooms.",
    });
  } else {
    req.body.total_room = validateRoomLimit.data;
    reqData.total_room = validateRoomLimit.data;
  }
  if (existingDataById[0].total_room != reqData.total_room) {
    willWeUpdate = 1;
    updateData.total_room = reqData.total_room;
}

  // out_door_view
  let validateOutDoorView = await commonObject.checkItsNumber(
    reqData.out_door_view
  );

  if (validateOutDoorView.success == false) {
    return res.status(400).send({
      success: false,
      status: 400,
      message: "Invalid Out door view ",
    });
  } else if (validateOutDoorView.data != 0 && validateOutDoorView.data != 1) {
    return res.status(400).send({
      success: false,
      status: 400,
      message: "Invalid.Out door view should be 1 or 0.",
    });
  } else {
    req.body.out_door_view = validateOutDoorView.data;
    reqData.out_door_view = validateOutDoorView.data;
  }
  if (existingDataById[0].out_door_view != reqData.out_door_view) {
    willWeUpdate = 1;
    updateData.out_door_view = reqData.out_door_view;
}
  
//   if (isError == 1) {
//     return res.status(400).send({
//         "success": false,
//         "status": 400,
//         "message": errorMessage
//     });
// }

  // update business_facilities_types_id 
if (reqData.business_facilities_types_id != undefined && !isEmpty(reqData.business_facilities_types_id)) {
  if (Array.isArray(reqData.business_facilities_types_id) && reqData.business_facilities_types_id.length > 0) {
    // Check for duplicate values in the array
    let duplicateCheckInArrayResult = await commonObject.duplicateCheckInArray(reqData.business_facilities_types_id);
    if (duplicateCheckInArrayResult.result) {
      return res.status(400).send({
        success: false,
        status: 400,
        message: "business facilities types contains duplicate values."
      });
    }

    // Validate each business_facilities_types_id
    for (let i = 0; i < reqData.business_facilities_types_id.length; i++) {
      let validateBusinessFacilitiesTypesId = await commonObject.checkItsNumber(reqData.business_facilities_types_id[i]);
      if (validateBusinessFacilitiesTypesId.success == false) {
        return res.status(400).send({
          success: false,
          status: 400,
          message: `business facilities types Value ${reqData.business_facilities_types_id[i]} should be an integer.`
        });
      }
      reqData.business_facilities_types_id[i] = validateBusinessFacilitiesTypesId.data;
  

      let businessFacilitiesTypesDetails = await businessFacilitiesModel.getDataByWhereCondition({ "status": 1, "id": reqData.business_facilities_types_id[i] });
      if (isEmpty(businessFacilitiesTypesDetails)) {
        return res.status(404).send({
          success: false,
          status: 404,
          message: "No business Facilities Type found"
        });
      }
    }
  } else {
    return res.status(400).send({
      success: true,
      status: 400,
      message: "business Facilities Type should be an array."
    });
  }
} else {
  return res.status(400).send({
    success: true,
    status: 400,
    message: "Please select a business Facilities Type."
  });
}

let newRoomForBusiness = [];
let getByRoomForBusinessTypeId = await roomForBusinessModel.getDataByWhereCondition({
  "status": 1,
  "room_id": reqData.id
});

let deleted = [];

for (let i = 0; i < getByRoomForBusinessTypeId.length; i++) {
  let found = false;
  for (let j = 0; j < reqData.business_facilities_types_id.length; j++) {
    if (getByRoomForBusinessTypeId[i].business_facilities_types_id === reqData.business_facilities_types_id[j]) {
      found = true;
      break;
    }
  }
  if (!found) {
    deleted.push({
      "id": getByRoomForBusinessTypeId[i].id,
      "data": {
        "status": 0,
      }
    });
  }
}

for (let i = 0; i < reqData.business_facilities_types_id.length; i++) {
  let isOld = false;
  let isFullNew = false;

  for (let j = 0; j < getByRoomForBusinessTypeId.length; j++) {
    if (reqData.business_facilities_types_id[i] === getByRoomForBusinessTypeId[j].business_facilities_types_id) {
      isOld = true;
      break;
    }
  }

  for (let k = 0; k < newRoomForBusiness.length; k++) {
    if (reqData.business_facilities_types_id[i] === newRoomForBusiness[k].business_facilities_types_id) {
      isFullNew = true;
      break;
    }
  }

  if (!isOld && !isFullNew) {
    newRoomForBusiness.push({
      "room_id" : reqData.id,
      "business_facilities_types_id": reqData.business_facilities_types_id[i],
      "created_by": 1,
      "updated_by": 1
    });
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
 
 
  // return res.status(400).send({
  //   success: true,
  //   status: 400,
  //   message: [updateData,deleted,newRoomForBusiness]
  // });



  result= await roomModel.updateById(reqData.id, updateData,deleted,newRoomForBusiness); //,newRoomForBusiness

  if (result.affectedRows == undefined || result.affectedRows < 1) {
    return res.status(500).send({
      "success": true,
      "status": 500,
      "message": "Something went wrong in the system database."
    });
  }

  return res.status(200).send({
    "success": true,
    "status": 200,
    "message": "Room successfully updated."
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
