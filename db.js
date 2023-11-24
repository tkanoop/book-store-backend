const mongoose=require("mongoose")

module.exports=()=>{
 
    try {
        mongoose.connect(process.env.DB)
        console.log("connection succesfull");
    } catch (error) {
        console.log(error);
        console.log("could not connect to database");
        
    }
}




