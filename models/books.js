
const mongoose=require('mongoose')
const bookSchema= new mongoose.Schema({
    bookName:{type:String,required:true},
    Author:{type:String,required:true},
    Image:{type:String,required:true},
    Category:{type:String,required:true},
    Price:{type:Number,required:true},
    Quantity:{type:Number,required:true}
})

const Book=mongoose.model("book",bookSchema)
module.exports={Book}