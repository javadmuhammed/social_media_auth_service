const   mongoose  = require("mongoose");


function mongoConnection() {
    mongoose.connect(process.env.MONGO_URL).then(()=>{
        console.log("Database connected success")
    }).catch(()=>{
        console.log("Database connection failed");
    })
}


module.exports = mongoConnection;