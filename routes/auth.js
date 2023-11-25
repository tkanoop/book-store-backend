const router=require("express").Router()
const {User} = require("../models/user")
const Joi=require("joi")
const bcrypt=require("bcrypt")
const {Book}=require("../models/books")
const jwt=require('jsonwebtoken')
const {Cart}=require("../models/cart")
const mongoose=require("mongoose")

router.post("/",async(req,res)=>{
    try {
        const {error}=validate(req.body)
        if(error){
            return res.status(400).send({message:error.details[0].message})
        }
        const user = await User.findOne({email:req.body.email})
        if(!user){
            return res.status(401).send({message:"Invalid Email"})
        }
        const validPassword=await bcrypt.compare(
            req.body.password,user.password
        );
        if(!validPassword){
            return res.status(401).send({message:"Invalid password"})
        }

        const token=user.generateAuthToken()
        res.status(200).send({data:token,message:"Logged In Successfully"})


    } catch (error) {
        res.status(500).send({message:"Internal Server Erro"})
    }
})


// fetching all books

router.get("/books",async(req,res)=>{
    const bookList=await Book.find()
    res.status(200).send({book:bookList})
})


// creating cart
router.post("/cart",async(req,res)=>{
    try {
        const token = req.headers.authorization.split(' ')[1];
        const bookId = req.body.bookId;
        const decodedToken = jwt.verify(token, process.env.JWTPRIVATEKEY);
        const objectIdUserId = new mongoose.Types.ObjectId(decodedToken._id); 
        console.log(objectIdUserId);
    
    
        const cart = await Cart.findOne({ userId: objectIdUserId });
    
        if (cart) {
        
          const existingProductIndex = cart.product.findIndex(item => item.productId.equals(bookId));
    
          if (existingProductIndex !== -1) {

            cart.product[existingProductIndex].quantity += 1;
            console.log("quanty added");
          } else {

            cart.product.push({ productId: bookId, quantity: 1 });
            console.log("pushed");
          }
    
       
          await cart.save();
        } else {
        
          const newCart = new Cart({
            userId: objectIdUserId,
            product: [{ productId: bookId, quantity: 1 }]
          });
          await newCart.save();
          console.log("saved");
        }
    
        res.status(200).json({ message: 'Cart updated successfully' });
      } catch (error) {
        console.error('Error updating cart:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    });

// fetching cart items
router.get("/cartView",async(req,res)=>{
  console.log("request came");
  const token = req.headers.authorization.split(' ')[1];
  const decodedToken = jwt.verify(token, process.env.JWTPRIVATEKEY);
        const objectIdUserId = new mongoose.Types.ObjectId(decodedToken._id); 
        console.log("hiiii");


        const cartList = await Cart.findOne({ userId: objectIdUserId }).populate({
          path: 'product.productId',
          model: 'book',
        });
        
        
        if (cartList) {
          
          console.log("check "+cartList.product);
        
          
          const productImages = cartList.product.map((item) => ({
            productId: item.productId._id,
            Quantity: item.quantity,
            bookName: item.productId.bookName,
            Price: item.productId.Price,
          
            Category: item.productId.Category,
            Image: item.productId.Image,

            
          }));
          console.log((productImages));
        
          res.status(200).send({ cart: productImages });
        } else {
          res.status(404).send({ message: 'Cart not found' });
        }
  
})

// change Quantity

router.get("/change-qty",async(req,res)=>{
  
})




    

const validate=(data)=>{
    const schema = Joi.object({
        email:Joi.string().email().required().label("Email"),
        password:Joi.string().required().label("Password")
    })
    return schema.validate(data)
}
module.exports=router;