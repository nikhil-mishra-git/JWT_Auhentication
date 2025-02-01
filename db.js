const mongoose = require('mongoose');

const database = mongoose.connect("mongodb://0.0.0.0/userAuthentication").then(()=>{
    console.log("Databse Connected");
}).catch(err => {
    console.log({err : "Unable to Connect Database"});  
})

module.exports = database;