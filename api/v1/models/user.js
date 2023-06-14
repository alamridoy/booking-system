const { connectionHotelPool } = require('../connections/connection');
const queries = require('../queries/user');
const customerModel = require('./customer');
const isEmpty = require("is-empty");



let getUserByEmail = async (email = "") => {
    return new Promise((resolve, reject) => {
        connectionHotelPool.query(queries.getUserByEmail(), [email], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}

let getUserByPhone = async (phone = "") => {
    return new Promise((resolve, reject) => {
        connectionHotelPool.query(queries.getUserByPhone(), [phone], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}

let getUserByNid = async (nid = "") => {
    return new Promise((resolve, reject) => {
        connectionHotelPool.query(queries.getUserByNid(), [nid], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}



let addNew = async (info = {}) => {

    return new Promise((resolve, reject) => {
        connectionHotelPool.query(queries.addNew(), info, (error, result, fields) => {
            if (error) reject(error);
            else resolve(result);
        });
    });
}


let getList = async () => {
    return new Promise((resolve, reject) => {
        connectionHotelPool.query(queries.getList(), (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}


let getActiveList = async () => {
    return new Promise((resolve, reject) => {
        connectionHotelPool.query(queries.getActiveList(), (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}


let getById = async (id = 0) => {
    return new Promise((resolve, reject) => {
        connectionHotelPool.query(queries.getById(), [id], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}


let getDataByType = async (month_name = "") => {
    return new Promise((resolve, reject) => {
        connectionHotelPool.query(queries.getDataByType(), [month_name], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}

let getUserById = async (id = 0) => {
    return new Promise((resolve, reject) => {
        connectionHotelPool.query(queries.getUserById(), [id], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}




let updateById = async (id = 0, updateData = {}, conn = undefined) => {

    
    let connection = connectionHostelPool;
    if (conn !== undefined) connection = conn;
    

    let keysOfUpdateData = Object.keys(updateData);
    
    let dataParameterUpdateData = [];

    for (let index = 0; index < keysOfUpdateData.length; index++) {
        dataParameterUpdateData.push(updateData[keysOfUpdateData[index]]);
    }

    console.log(dataParameterUpdateData)
    return new Promise((resolve, reject) => {
        connection.query(queries.updateById(updateData), [...dataParameterUpdateData, id], (error, result, fields) => {
            if (error) reject(error);
            else resolve(result);
        });
    });
}



let delUpdateById = async (id = 0, data = {}, conn = undefined) => {

    
    let connection = connectionHostelPool;
    if (conn !== undefined) connection = conn;
    

    let keysOfUpdateData = Object.keys(data);
    let dataParameterUpdateData = [];
    

    for (let index = 0; index < keysOfUpdateData.length; index++) {
        dataParameterUpdateData.push(data[keysOfUpdateData[index]]);
    }

    
    return new Promise((resolve, reject) => {
        connection.query(queries.delUpdateById(data), [...dataParameterUpdateData, id], (error, result, fields) => {
            if (error) reject(error);
            else resolve(result);
        });
    });
}



let getMonthNameById = async (monthId = "") => {
    return new Promise((resolve, reject) => {
        connectionHotelPool.query(queries.getMonthNameById(), [monthId], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}


let addNewUser = (users = {}, customers = {}) => {

    return new Promise((resolve, reject) => {
        connectionHotelPool.getConnection(function (err, conn) {
            conn.beginTransaction(async function (error) {
                if (error) {
                    return conn.rollback(function () {
                        conn.release();
                        resolve([]);
                    });
                }

                // let profileResult = {};

                if (users.role_id === 2) {
                    profileResult = await customerModel.addNewCustomer(customers, conn);
                }


                if (isEmpty(profileResult) || profileResult.affectedRows == undefined || profileResult.affectedRows < 1) {
                    return conn.rollback(function () {
                        conn.release();
                        resolve([]);
                    });
                }

                //insert added data's id into users
                users.profile_id = profileResult.insertId;
              
                    conn.query(queries.addNewUser(), [users], (error, result, fields) => {
                        if (error) {
                            console.log(error)
                            return conn.rollback(function () {
                                conn.release();
                                resolve([]);
                            });
                        } 
                        
                            conn.commit(function (err) {
                                if (err) {
                                    console.log(err)
                                    return conn.rollback(function () {
                                        conn.release();
                                        resolve([]);
                                    });
                                }
                                conn.release();
                                return resolve(result);
                            });
                    
                });


            });
        });
    });
}


let getDataByWhereCondition = async (where = {}, orderBy = {}, limit = 2000, offset = 0, columnList = []) => {

    let connection = connectionHotelPool;
    // get object, generate an array and push data value here
    let keys = Object.keys(where);

    let dataParameter = [];

    for (let index = 0; index < keys.length; index++) {
        if (Array.isArray(where[keys[index]]) && where[keys[index]].length > 1) {
            dataParameter.push(where[keys[index]][0], where[keys[index]][1]);    // where date between  ? and ?  [ so we pass multiple data]

        } else if (typeof where[keys[index]] === 'object' && !Array.isArray(where[keys[index]]) && where[keys[index]] !== null) {

            let key2 = Object.keys(where[keys[index]]);


            for (let indexKey = 0; indexKey < key2.length; indexKey++) {

                let tempSubKeyValue = where[keys[index]][key2[indexKey]];
                if (key2[indexKey].toUpperCase() === "OR" && Array.isArray(tempSubKeyValue)) {
                    for (let indexValue = 0; indexValue < tempSubKeyValue.length; indexValue++) {
                        dataParameter.push(tempSubKeyValue[indexValue]);
                    }
                } else if (key2[indexKey].toUpperCase() === "OR") {
                    dataParameter.push(tempSubKeyValue);
                } else if (key2[indexKey].toUpperCase() === "LIKE") {
                    dataParameter.push('%' + tempSubKeyValue + '%');
                } else if (["IN", "NOT IN"].includes(key2[indexKey].toUpperCase())) {
                    dataParameter.push(tempSubKeyValue);
                } else if (["IN QUERY", "NOT IN QUERY"].includes(key2[indexKey].toUpperCase())) {
                    // General Code manage my  query file
                } else if (["GTE", "GT", "LTE", "LT", "NOT EQ"].includes(key2[indexKey].toUpperCase())) {
                    dataParameter.push(tempSubKeyValue);
                }

            }

        } else {
            dataParameter.push(where[keys[index]]);
        }
    }

    return new Promise((resolve, reject) => {
        connection.query(queries.getDataByWhereCondition(where, orderBy, limit, offset, columnList), [...dataParameter], (error, result, fields) => {
            if (error) reject(error);
            else resolve(result);
        });
    });
}








module.exports = {
    getUserByEmail,
    addNew,
    getList,
    getActiveList,
    getById,
    getDataByType,
    updateById,
    delUpdateById,
    getMonthNameById,
    getUserByPhone,
    getUserByNid,
    addNewUser,
    getUserById,
    getDataByWhereCondition
}

