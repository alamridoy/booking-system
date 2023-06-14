let superAdminPermission = [
   "CreateRoom","CreatePolicy"
];




let customerPermission = [
   
];


let getRouterPermissionList = async (id = 0) => {
    return new Promise((resolve, reject) => {
        if (id === 1) resolve(superAdminPermission);
        else if (id === 2) resolve(customerPermission);
        else  resolve([]);
    });
}


module.exports = {
    getRouterPermissionList
}
