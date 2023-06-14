const express = require("express");
const router = express.Router();



const adminRouter = require('./routers/admin');
const authenticationRouter = require('./routers/authentication')
const policyRouter = require('./routers/policy')
const businessFacilitiesRouter = require('./routers/businessFacilities')
const fitnessWellnessFacilitiesRouter = require('./routers/fitnessWellnessFacilities')
const foodDrinksRouter = require('./routers/foodDrinks')
const generalRouter = require('./routers/general')
const mediaTechnologyRouter = require('./routers/mediaTechnology')
const outdoorsActivitiesRouter = require('./routers/outdoors-activities')
const parkingRouter = require('./routers/parking')
const safetySecurityRouter = require('./routers/safety-security')
const servicesExtrasRouter = require('./routers/services-extras')
const transportationRouter = require('./routers/transportation')
const roomRouter = require('./routers/room')
const bedTypeRouter = require('./routers/bedType')
const roomForBusinessFacilitiesRouter = require('./routers/roomForBusinessFacilities')
const roomForFoodAndDrinkRouter = require('./routers/roomForFoodAndDrink')
const roomForGeneralRouter = require('./routers/roomForGeneral')
const searchRouter = require('./routers/search')
const roomTypeRouter = require('./routers/roomType')
const imageRouter = require('./routers/image');
const organizationRouter = require('./routers/organization_api');
const nodeCatcheRouter = require('./routers/test-nodeCatche');


router.use('/admin', adminRouter);
router.use('/authentication', authenticationRouter);
router.use('/policy', policyRouter);
router.use('/businessFacilities', businessFacilitiesRouter);
router.use('/fitnessWellnessFacilities', fitnessWellnessFacilitiesRouter);
router.use('/foodDrinks', foodDrinksRouter);
router.use('/general', generalRouter);
router.use('/mediaTechnology', mediaTechnologyRouter);
router.use('/outdoorsActivities', outdoorsActivitiesRouter);
router.use('/parking', parkingRouter);
router.use('/safety-security', safetySecurityRouter);
router.use('/services-extras', servicesExtrasRouter);
router.use('/transportation', transportationRouter);
router.use('/room', roomRouter);
router.use('/bedType', bedTypeRouter);
router.use('/roomForBusinessFacilities', roomForBusinessFacilitiesRouter);
router.use('/roomForFoodAndDrink', roomForFoodAndDrinkRouter);
router.use('/roomForGeneral', roomForGeneralRouter);
router.use('/search', searchRouter);
router.use('/roomTypes', roomTypeRouter);
router.use('/images', imageRouter);
router.use('/organization_api', organizationRouter);


module.exports = router;