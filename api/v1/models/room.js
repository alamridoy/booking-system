const { connectionHotelPool } = require("../connections/connection");
const queries = require("../queries/room");
const roomForBusinessqueries = require("../queries/roomForBusinessFacilities");
// const roomModel = require('./');
const isEmpty = require("is-empty");
const roomForBusinessFacilitiesModel = require("../models/roomForBusinessFacilities");
const fitnessWellnessFacilitiesModel = require("../models/roomForFacilitiesAndWellness");
const foodAndDrinkFacilitiesModel = require("../models/roomForFoodAndDrink");
const generalFacilitiesModel = require("../models/roomForGeneral");
const mediaAndTechnologyModel = require("../models/roomForMediaAndTechnology");
const outdoorsAndActivitiesModel = require("../models/roomForOutdoorsAndActivities");
const parkingModel = require("../models/roomForParking");
const safetyAndSecurityModel = require("../models/roomForSafetyAndSecurity");
const serviceAndExtrasModel = require("../models/roomForservicesAndExtras");
const transportationModel = require("../models/roomForTransportation");
const imageModel = require("../models/roomForImages")

let getUserByEmail = async (email = "") => {
  return new Promise((resolve, reject) => {
    connectionHotelPool.query(
      queries.getUserByEmail(),
      [email],
      (error, result, fields) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
  });
};

let getByRoomType = async (room_type = "") => {
  return new Promise((resolve, reject) => {
    connectionHotelPool.query(
      queries.getByRoomType(),
      [room_type],
      (error, result, fields) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
  });
};

let getUserByPhone = async (phone = "") => {
  return new Promise((resolve, reject) => {
    connectionHotelPool.query(
      queries.getUserByPhone(),
      [phone],
      (error, result, fields) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
  });
};

let getUserByNid = async (nid = "") => {
  return new Promise((resolve, reject) => {
    connectionHotelPool.query(
      queries.getUserByNid(),
      [nid],
      (error, result, fields) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
  });
};

// let allFacilities = [
//     roomForBusiness = [],roomForFitnessWellness=[],roomForFoodAndDrinks=[],roomForGeneral=[],roomForMediaAndTechnology=[],roomForOutdoorsAndActivities=[],roomForParking=[]
// ]

let addNew = (
  room = {},
  roomForBusiness = [],
  roomForFitnessWellness = [],
  roomForFoodAndDrinks = [],
  roomForGeneral = [],
  roomForMediaAndTechnology = [],
  roomForOutdoorsAndActivities = [],
  roomForParking = [],
  roomForSafetyAndSecurity = [],
  serviceAndExtras = [],
  transportation = [],
  fileObject=[]
) => {
  return new Promise((resolve, reject) => {
    connectionHotelPool.getConnection(function (err, conn) {
      conn.beginTransaction(async function (error) {
        if (error) {
          return conn.rollback(function () {
            conn.release();
            resolve([]);
          });
        }
        try {
          // Create the room
          conn.query(
            queries.addNewRoom(),
            [room],
            async (error, result, fields) => {
              if (
                error ||
                isEmpty(result) ||
                result.affectedRows === undefined ||
                result.affectedRows < 1
              ) {
                return conn.rollback(function () {
                  conn.release();
                  resolve([]);
                });
              }

              // Assign room ID to the roomForBusiness table

              for (let i = 0; i < roomForBusiness.length; i++) {
                roomForBusiness[i].room_id = result.insertId;

                const roomForBusinessResult =
                  await roomForBusinessFacilitiesModel.addNewRoomForBusiness(
                    roomForBusiness[i],
                    conn
                  );
                if (
                  isEmpty(roomForBusinessResult) ||
                  roomForBusinessResult.affectedRows === undefined ||
                  roomForBusinessResult.affectedRows < 1
                ) {
                  return conn.rollback(function () {
                    conn.release();
                    resolve([]);
                  });
                }
              }

              //Assign room ID to the roomForFacilities and wellness table

              for (let i = 0; i < roomForFitnessWellness.length; i++) {
                roomForFitnessWellness[i].room_id = result.insertId;

                const roomForFitnessWellnessResult =
                  await fitnessWellnessFacilitiesModel.addNewRoomForFitnessWellness(
                    roomForFitnessWellness[i],
                    conn
                  );
                if (
                  isEmpty(roomForFitnessWellnessResult) ||
                  roomForFitnessWellnessResult.affectedRows === undefined ||
                  roomForFitnessWellnessResult.affectedRows < 1
                ) {
                  return conn.rollback(function () {
                    conn.release();
                    resolve([]);
                  });
                }
              }

              // Assign room ID to the room food and drinks facilities table
              for (let i = 0; i < roomForFoodAndDrinks.length; i++) {
                roomForFoodAndDrinks[i].room_id = result.insertId;

                const roomForFoodAndDrinkResult =
                  await foodAndDrinkFacilitiesModel.addNewRoomForFoodAndDrink(
                    roomForFoodAndDrinks[i],
                    conn
                  );
                if (
                  isEmpty(roomForFoodAndDrinkResult) ||
                  roomForFoodAndDrinkResult.affectedRows === undefined ||
                  roomForFoodAndDrinkResult.affectedRows < 1
                ) {
                  return conn.rollback(function () {
                    conn.release();
                    resolve([]);
                  });
                }
              }
              // Assign room ID to the room General type facilities table
              for (let i = 0; i < roomForGeneral.length; i++) {
                roomForGeneral[i].room_id = result.insertId;

                const roomForGeneralResult =
                  await generalFacilitiesModel.addNewRoomForGeneral(
                    roomForGeneral[i],
                    conn
                  );
                if (
                  isEmpty(roomForGeneralResult) ||
                  roomForGeneralResult.affectedRows === undefined ||
                  roomForGeneralResult.affectedRows < 1
                ) {
                  return conn.rollback(function () {
                    conn.release();
                    resolve([]);
                  });
                }
              }

              // Assign room ID to the room Media and Technology facilities table

              for (let i = 0; i < roomForMediaAndTechnology.length; i++) {
                roomForMediaAndTechnology[i].room_id = result.insertId;

                const roomForMediaAndTechnologyResult =
                  await mediaAndTechnologyModel.addNewRoomFormediaAndTechnology(
                    roomForMediaAndTechnology[i],
                    conn
                  );
                if (
                  isEmpty(roomForMediaAndTechnologyResult) ||
                  roomForMediaAndTechnologyResult.affectedRows === undefined ||
                  roomForMediaAndTechnologyResult.affectedRows < 1
                ) {
                  return conn.rollback(function () {
                    conn.release();
                    resolve([]);
                  });
                }
              }

              // Assign room ID to the room Outdoor and activities facilities table

              for (let i = 0; i < roomForOutdoorsAndActivities.length; i++) {
                roomForOutdoorsAndActivities[i].room_id = result.insertId;

                const roomForOutdoorsAndActivitiesResult =
                  await outdoorsAndActivitiesModel.addNewRoomForoutdoorsAndActivities(
                    roomForOutdoorsAndActivities[i],
                    conn
                  );
                if (
                  isEmpty(roomForOutdoorsAndActivitiesResult) ||
                  roomForOutdoorsAndActivitiesResult.affectedRows ===
                    undefined ||
                  roomForOutdoorsAndActivitiesResult.affectedRows < 1
                ) {
                  return conn.rollback(function () {
                    conn.release();
                    resolve([]);
                  });
                }
              }

              // Assign room ID to the room Parking facilities table

              for (let i = 0; i < roomForParking.length; i++) {
                roomForParking[i].room_id = result.insertId;

                const roomForParkingResult =
                  await parkingModel.addNewRoomParking(roomForParking[i], conn);
                if (
                  isEmpty(roomForParkingResult) ||
                  roomForParkingResult.affectedRows === undefined ||
                  roomForParkingResult.affectedRows < 1
                ) {
                  return conn.rollback(function () {
                    conn.release();
                    resolve([]);
                  });
                }
              }

              // Assign room ID to the safety and security facilities table
              for (let i = 0; i < roomForSafetyAndSecurity.length; i++) {
                roomForSafetyAndSecurity[i].room_id = result.insertId;

                const roomForSafetyAndSecurityResult =
                  await safetyAndSecurityModel.addNewRoomSafetyAndSecurity(
                    roomForSafetyAndSecurity[i],
                    conn
                  );
                if (
                  isEmpty(roomForSafetyAndSecurityResult) ||
                  roomForSafetyAndSecurityResult.affectedRows === undefined ||
                  roomForSafetyAndSecurityResult.affectedRows < 1
                ) {
                  return conn.rollback(function () {
                    conn.release();
                    resolve([]);
                  });
                }
              }

              // Assign room ID to the service and extras facilities table
              for (let i = 0; i < serviceAndExtras.length; i++) {
                serviceAndExtras[i].room_id = result.insertId;

                const roomForserviceAndExtrasResult =
                  await serviceAndExtrasModel.addNewRoomserviceAndExtras(
                    serviceAndExtras[i],
                    conn
                  );
                if (
                  isEmpty(roomForserviceAndExtrasResult) ||
                  roomForserviceAndExtrasResult.affectedRows === undefined ||
                  roomForserviceAndExtrasResult.affectedRows < 1
                ) {
                  return conn.rollback(function () {
                    conn.release();
                    resolve([]);
                  });
                }
              }

              // Assign room ID to the transportation facilities table
              for (let i = 0; i < transportation.length; i++) {
                transportation[i].room_id = result.insertId;

                const roomForsTransportationResult =
                  await transportationModel.addNewRoomTransportation(
                    transportation[i],
                    conn
                  );
                if (
                  isEmpty(roomForsTransportationResult) ||
                  roomForsTransportationResult.affectedRows === undefined ||
                  roomForsTransportationResult.affectedRows < 1
                ) {
                  return conn.rollback(function () {
                    conn.release();
                    resolve([]);
                  });
                }
              }

               // Assign room ID to the images table
               for (let i = 0; i < fileObject.length; i++) {
                fileObject[i].room_id = result.insertId;

                const roomForImagesResult =
                  await imageModel.addNewRoomImages(
                    fileObject[i],
                    conn
                  );
                if (
                  isEmpty(roomForImagesResult) ||
                  roomForImagesResult.affectedRows === undefined ||
                  roomForImagesResult.affectedRows < 1
                ) {
                  return conn.rollback(function () {
                    conn.release();
                    resolve([]);
                  });
                }
              }


            

              conn.commit(function (err) {
                if (err) {
                  return conn.rollback(function () {
                    conn.release();
                    resolve([]);
                  });
                }
                conn.release();
                return resolve(result);
              });
            }
          );
        } catch (error) {
          console.log(error);
          return conn.rollback(function () {
            conn.release();
            resolve([]);
          });
        }
      });
    });
  });
};

let getRoomSearching = async (searchFieldObject = {}) => {
  return new Promise((resolve, reject) => {
    connectionHotelPool.query(
      quaries.getRoomSearching(),
      [searchFieldObject],
      (error, result, fields) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
  });
};
//

//

let getList = async () => {
  return new Promise((resolve, reject) => {
    connectionHotelPool.query(queries.getList(), (error, result, fields) => {
      if (error) reject(error);
      else resolve(result);
    });
  });
};

let getActiveList = async () => {
  return new Promise((resolve, reject) => {
    connectionHotelPool.query(
      queries.getActiveList(),
      (error, result, fields) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
  });
};

let getById = async (id = 0) => {
  return new Promise((resolve, reject) => {
    connectionHotelPool.query(
      queries.getById(),
      [id],
      (error, result, fields) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
  });
};

let getDataByType = async (month_name = "") => {
  return new Promise((resolve, reject) => {
    connectionHotelPool.query(
      queries.getDataByType(),
      [month_name],
      (error, result, fields) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
  });
};

let getUserById = async (id = 0) => {
  return new Promise((resolve, reject) => {
    connectionHotelPool.query(
      queries.getUserById(),
      [id],
      (error, result, fields) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
  });
};

let updateById = (
  id = 0,
  updateData = {},
  deleted = [],
  newRoomForBusiness = []
) => {
    
  return new Promise((resolve, reject) => {

    connectionHotelPool.getConnection((err, conn) => {
      conn.beginTransaction(async (error) => {
        if (error) {
          
            return conn.rollback(() => {
            conn.release();
            resolve([]);
          });
          
        }

       
        try {

            let result;
          // Update data
          if (Object.keys(updateData).length > 0) {
            const keysOfUpdateData = Object.keys(updateData);
            const dataParameterUpdateData = keysOfUpdateData.map(
              (key) => updateData[key]
            );
      
            result = await new Promise((resolve, reject) => {
              conn.query(
                queries.updateById(updateData),
                [...dataParameterUpdateData, id],
                (error, result, fields) => {

                    console.log("  -- donee--- - - -- ")
     
                  if (error) reject(error);
                  else resolve(result);
                }
              );
            });

          }
         
   
          // Delete room for business
          for (let i = 0; i < deleted.length; i++) {
           
            const deleteRoomForBusiness =
              await roomForBusinessFacilitiesModel.updateById(
                deleted[i].id,
                deleted[i].data,
                conn
              );

            if (
              isEmpty(deleteRoomForBusiness) ||
              deleteRoomForBusiness.affectedRows === undefined ||
              deleteRoomForBusiness.affectedRows < 1
            ) {
             
              return conn.rollback(function () {
                conn.release();
                resolve([]);
              });
            }
          }
       
  
         // Add new room for business
          for (let i = 0; i < newRoomForBusiness.length; i++) {
           
            const addRoomForBusiness =
              await roomForBusinessFacilitiesModel.addNew(
                
                newRoomForBusiness[i],
                conn
              );
         
          
            if (
              isEmpty(addRoomForBusiness) ||
              addRoomForBusiness.affectedRows === undefined ||
              addRoomForBusiness.affectedRows < 1
            ) {
              return conn.rollback(function () {
                conn.release();
                resolve([]);
              });
            }
          }

          conn.commit((err) => {
            if (err) {
            return conn.rollback(() => {
                conn.release();
                resolve([]);
              });
            
            }
            conn.release();
            return resolve(result);
          });
        } catch (error) {
         conn.rollback(() => {
            conn.release();
            resolve([]);
          });
        }
      });
    });
  });
};






// let delUpdateById = async (id = 0, data = {}, conn = undefined) => {
//   return new Promise((resolve, reject) => {

//     connectionHotelPool.getConnection((err, conn) => {
//       conn.beginTransaction(async (error) => {
//         if (error) {
          
//             return conn.rollback(() => {
//             conn.release();
//             resolve([]);
//           });
          
//         }

       
//         try {

//             let result;
//           // Update data
//           if (Object.keys(data).length > 0) {
//             const keysOfUpdateData = Object.keys(data);
//             const dataParameterUpdateData = keysOfUpdateData.map(
//               (key) => data[key]
//             );
      
//             result = await new Promise((resolve, reject) => {
//               conn.query(
//                 queries.updateById(data),
//                 [...dataParameterUpdateData, id],
//                 (error, result, fields) => {
//                   if (error) reject(error);
//                   else resolve(result);
//                 }
//               );
//             });

//           }
         
   
//           // Delete room for business
 
    
  
           
//             const deleteRoomForImage =
//               await imageModel.updateById(
//                 deleted.id,
//                 deleted.data,
//                 conn
//               );

//             if (
//               isEmpty(deleteRoomForImage) ||
//               deleteRoomForImage.affectedRows === undefined ||
//               deleteRoomForImage.affectedRows < 1
//             ) {
             
//               return conn.rollback(function () {
//                 conn.release();
//                 resolve([]);
//               });
//             }
          
           
  
       

//           conn.commit((err) => {
//             if (err) {
//             return conn.rollback(() => {
//                 conn.release();
//                 resolve([]);
//               });
            
//             }
//             conn.release();
//             return resolve(result);
//           });
//         } catch (error) {
//          conn.rollback(() => {
//             conn.release();
//             resolve([]);
//           });
//         }
//       });
//     });
//   });
// };

// let addNewUser = (room = {}, roomForBusiness = {}) => {

//     return new Promise((resolve, reject) => {
//         connectionHotelPool.getConnection(function (err, conn) {
//             conn.beginTransaction(async function (error) {
//                 if (error) {
//                     return conn.rollback(function () {
//                         conn.release();
//                         resolve([]);
//                     });
//                 }

//                 // let profileResult = {};

//                    result = await roomForBusinessFacilitiesModel.addNewRoomForBusiness(roomForBusiness, conn);

//                 if (isEmpty(result) || result.affectedRows == undefined || result.affectedRows < 1) {
//                     return conn.rollback(function () {
//                         conn.release();
//                         resolve([]);
//                     });
//                 }

//                 //insert added data's id into users
//                 // users.profile_id = result.insertId;

//                     conn.query(queries.addNewRoom(), [room], (error, result, fields) => {
//                         if (error) {
//                             console.log(error)
//                             return conn.rollback(function () {
//                                 conn.release();
//                                 resolve([]);
//                             });
//                         }

//                             conn.commit(function (err) {
//                                 if (err) {
//                                     console.log(err)
//                                     return conn.rollback(function () {
//                                         conn.release();
//                                         resolve([]);
//                                     });
//                                 }
//                                 conn.release();
//                                 return resolve(result);
//                             });

//                 });

//             });
//         });
//     });
// }

let getDataByWhereCondition = async (
  where = {},
  orderBy = {},
  limit = 2000,
  offset = 0,
  columnList = []
) => {
  let connection = connectionHotelPool;
  // get object, generate an array and push data value here
  let keys = Object.keys(where);

  let dataParameter = [];

  for (let index = 0; index < keys.length; index++) {
    if (Array.isArray(where[keys[index]]) && where[keys[index]].length > 1) {
      dataParameter.push(where[keys[index]][0], where[keys[index]][1]); // where date between  ? and ?  [ so we pass multiple data]
    } else if (
      typeof where[keys[index]] === "object" &&
      !Array.isArray(where[keys[index]]) &&
      where[keys[index]] !== null
    ) {
      let key2 = Object.keys(where[keys[index]]);

      for (let indexKey = 0; indexKey < key2.length; indexKey++) {
        let tempSubKeyValue = where[keys[index]][key2[indexKey]];
        if (
          key2[indexKey].toUpperCase() === "OR" &&
          Array.isArray(tempSubKeyValue)
        ) {
          for (
            let indexValue = 0;
            indexValue < tempSubKeyValue.length;
            indexValue++
          ) {
            dataParameter.push(tempSubKeyValue[indexValue]);
          }
        } else if (key2[indexKey].toUpperCase() === "OR") {
          dataParameter.push(tempSubKeyValue);
        } else if (key2[indexKey].toUpperCase() === "LIKE") {
          dataParameter.push("%" + tempSubKeyValue + "%");
        } else if (["IN", "NOT IN"].includes(key2[indexKey].toUpperCase())) {
          dataParameter.push(tempSubKeyValue);
        } else if (
          ["IN QUERY", "NOT IN QUERY"].includes(key2[indexKey].toUpperCase())
        ) {
          // General Code manage my  query file
        } else if (
          ["GTE", "GT", "LTE", "LT", "NOT EQ"].includes(
            key2[indexKey].toUpperCase()
          )
        ) {
          dataParameter.push(tempSubKeyValue);
        }
      }
    } else {
      dataParameter.push(where[keys[index]]);
    }
  }

  return new Promise((resolve, reject) => {
    connection.query(
      queries.getDataByWhereCondition(
        where,
        orderBy,
        limit,
        offset,
        columnList
      ),
      [...dataParameter],
      (error, result, fields) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
  });
};

module.exports = {
  getUserByEmail,
  addNew,
  getList,
  getActiveList,
  getById,
  getDataByType,
  updateById,
  getUserByPhone,
  getUserByNid,
  // addNewUser,
  getUserById,
  getByRoomType,
  getRoomSearching,
  getDataByWhereCondition,
};
