const express = require("express");
const isEmpty = require("is-empty");
const router = express.Router();
const commonObject = require("../common/common");
const organizationModel = require("../models/organization_api");
const licenseDetailsModel = require("../models/license_details");


// add organization
router.post('/add-organization',async(req,res)=>{
 
    let reqData = {
        "name":req.body.name,
        "description":req.body.description,
        "country": req.body.country,
        "city": req.body.city,
        "alias": req.body.alias,
        "currency": req.body.currency,
        "email": req.body.email,
        "mobile": req.body.mobile,
        "employee_count":req.body.employee_count,
        "zip":req.body.zip,
        "licence_details":req.body.licence_details,
        "website":req.body.website
        
}

     reqData.created_at = await commonObject.getGMT();
     reqData.updated_at = await commonObject.getGMT();
 
     
    let validateOrganizationName = await commonObject.characterLimitCheck(reqData.name, "Name");

    if (validateOrganizationName.success == false) {
        return res.status(400).send({
            "success": false,
            "status": 400,
            "message": validateOrganizationName.message,

        });
    }else{
        reqData.name = validateOrganizationName.data;
    }

   

    let existingData = await organizationModel.getByOrganizationName(reqData.name);


    if (!isEmpty(existingData)) {
        return res.status(409).send({
            "success": false,
            "status": 409,
            "message": existingData[0].status == "1" ? "This Organization Name Already Exists." : "This Organization Name Already Exists but Deactivate, You can activate it."
        });

    }


    //description
    if (typeof reqData.description === "string") {
        reqData.description = reqData.description.trim();
      } else {
        return res.status(400).send({
          success: false,
          status: 400,
          message: "Description should be string",
        });
      }

    
    //country
    let validateCountryName = await commonObject.characterLimitCheck(reqData.country, "Country Name");

    if (validateCountryName.success == false) {
        return res.status(400).send({
            "success": false,
            "status": 400,
            "message": validateCountryName.message,

        });
    }else{
        reqData.country = validateCountryName.data;
    }

     
    //city
    let validateCityName = await commonObject.characterLimitCheck(reqData.city, "City Name");

    if (validateCityName.success == false) {
        return res.status(400).send({
            "success": false,
            "status": 400,
            "message": validateCityName.message,

        });
    }else{
        reqData.city = validateCityName.data;
    }

     
    //alias
    let validateAliasName = await commonObject.characterLimitCheck(reqData.alias, "Alias Name");

    if (validateAliasName.success == false) {
        return res.status(400).send({
            "success": false,
            "status": 400,
            "message": validateAliasName.message,

        });
    }else{
        reqData.alias = validateAliasName.data;
    }
    
    //currency
    let validateCurrencyName = await commonObject.characterLimitCheck(reqData.currency, "Currency Name");

    if (validateCurrencyName.success == false) {
        return res.status(400).send({
            "success": false,
            "status": 400,
            "message": validateCurrencyName.message,

        });
    }else{
        reqData.currency = validateCurrencyName.data;
    }
      
// email validation
if (isEmpty(reqData.email)) {
    return res.status(400).send({
      success: false,
      status: 400,
      message: "Invalid request data. 'email' is required and cannot be empty.",
    });
  }

  let validateEmail = await commonObject.isValidEmail(reqData.email);
  if (validateEmail == false) {
    return res.status(400).send({
      success: false,
      status: 400,
      message: "Email is not valid",
    });
  }

  let existingUserByEmail = await organizationModel.getUserByEmail(reqData.email);


  if (!isEmpty(existingUserByEmail)) {
    return res.status(400).send({
      success: false,
      status: 400,
      message: "Email already in Use.",
    });
  }

  // phone validation
    
  if (isEmpty(reqData.mobile)) {
    return res.status(400).send({
      success: false,
      status: 400,
      message: "Invalid request data. 'Mobile' is required and cannot be empty.",
    });
  }

  let validateMobile = await commonObject.isValidPhoneNumberOfBD(reqData.mobile);
  if (validateMobile == false) {
    return res.status(400).send({
      success: false,
      status: 400,
      message: "Mobile Number is not valid",
    });
  }
  
  //employee_count
  let validateEmployeeCount = await commonObject.characterLimitCheck(reqData.employee_count, "Employee Count");

    if (validateEmployeeCount.success == false) {
        return res.status(400).send({
            "success": false,
            "status": 400,
            "message": validateEmployeeCount.message,

        });
    }else{
        reqData.employee_count = validateEmployeeCount.data;
    }

 //zip
  let validateZip = await commonObject.checkItsNumber(reqData.zip);

  if (validateZip.success == false) {
    return res.status(400).send({
      success: false,
      status: 400,
      message: "Invalid.Zip should be Number",
    });
  } else {
    req.body.zip = validateZip.data;
    reqData.zip = validateZip.data;
  }


  //licence_details
  let validateLicenceDetails = await commonObject.checkItsNumber(reqData.licence_details);

  if (validateLicenceDetails.success == false) {
    return res.status(400).send({
      success: false,
      status: 400,
      message: "Invalid Licence Details",
    });
  } else {
    req.body.licence_details = validateLicenceDetails.data;
    reqData.licence_details = validateLicenceDetails.data;
  }
  let existingLicenceDetailsId = await licenseDetailsModel.getById(reqData.licence_details);
  if (isEmpty(existingLicenceDetailsId)) {
    return res.status(404).send({
      success: false,
      status: 404,
      message: "Licence Details data no found",
    });
  }

    let result = await organizationModel.addNew(reqData);


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
        message: "Organization added Successfully.",
    });
    
});


//list
router.get('/list', async (req, res) => {
  try {
    let result = await organizationModel.getList();

    for (let i = 0; i < result.length; i++) {
      let licenceDetailsId = result[i].licence_details;
      let licenceDetails = await licenseDetailsModel.getLicenseDetailsById(licenceDetailsId);

      result[i].licenceDetails = licenceDetails[0];
    }

    return res.status(200).send({
      success: true,
      status: 200,
      message: "Organization List.",
      count: result.length,
      org: result,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).send({
     
      success: false,
      status: 500,
      message: "Internal server error.",
      error: error.message,
    });
  }
});




//details
router.get("/details/:id", async (req, res) => {
  try {
    let id = req.params.id;

    let validateId = await commonObject.checkItsNumber(id);

    if (validateId.success === false) {
      return res.status(400).send({
        success: false,
        status: 400,
        message: "Value should be an integer.",
      });
    } else {
      id = validateId.data;
    }

    let result = await organizationModel.getById(id);

    if (result.length === 0) {
      return res.status(404).send({
        success: false,
        status: 404,
        message: "No organization found.",
      });
    }

    let organization = result[0];

    let licenceDetailsId = organization.licence_details;
    let licenceDetails = await licenseDetailsModel.getLicenseDetailsById(
      licenceDetailsId
    );

    organization.licenceDetails = licenceDetails[0];

    return res.status(200).send({
      success: true,
      status: 200,
      message: "Organization details.",
      data: organization,
    });
  } catch (error) {
   return res.status(500).send({
      success: false,
      status: 500,
      message: "Internal server error.",
    });
  }
});



module.exports = router;