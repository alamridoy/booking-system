const express = require("express");
const router = express.Router();
const fetch = require('node-fetch')


const NodeCache = require( "node-cache" );
const { json } = require("body-parser");
const myCache = new NodeCache({stdTTL:5});

const todosUrl = "https://jsonplaceholder.typicode.com/todos"

router.get('/getcache',(req,res)=>{

 if(myCache.has("getcache")){
    console.log("geeting it from cache");
    return res.send(myCache.get("getcache"))
 }else{
    fetch(todosUrl)
    .then((response) =>response.json())
    .then((json)=>{
        myCache.set("getcache",json)
        console.log("Geeting it from API");
        
        res.send(json)
    })
        
    
 }





 















// // Set a value in the cache
// const obj = { my: "Special", variable: 42 };

// myCache.set('key1', obj);

// // Get a value from the cache

// const value2 = myCache.get('key1');
// console.log(value2); 

// // Check if a key exists in the cache
// const exists = myCache.has('key2');
// console.log(exists); 

// // Set a value in the cache with a specific TTL (time to live) in seconds
// myCache.set('key2', 'value2', 120); 

// // Get the remaining time to live (in seconds) for a key
// const ttl = myCache.ttl('key2');
// console.log("ttl:",ttl); 

// // Delete a key from the cache
// const deleted = myCache.del('key2');
// console.log("deleted::",deleted); 

// // Clear the entire cache
// myCache.flushAll();
});

//In this example, we first import the 
//node-cache module and create a new instance
//of NodeCache. We then use the set method
//to store a key-value pair in the cache, and
//get to retrieve the value associated with
//a key. The has method is used to check if
//a key exists in the cache, and del to 
//delete a specific key. Finally, flushAll 
//is used to clear the entire cache.

module.exports = router;