const {User} = require("../models/user")
const Joi=require("joi")
const bcrypt=require("bcrypt")
const {Book}=require("../models/books")
const jwt=require('jsonwebtoken')
const {Cart}=require("../models/cart")
const {Order}= require("../models/order")
const mongoose=require("mongoose")
const passwordComplexity=require('joi-password-complexity')

// checking existing user
const   login = async (req, res) => {
  try {
    const { error } = validate(req.body);
    if (error) {
      return res.status(400).send({ message: error.details[0].message });
    }
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(401).send({ message: "Invalid Email" });
    }
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) {
      return res.status(401).send({ message: "Invalid password" });
    }
    console.log(user.generateAuthToken);
    const token = user.generateAuthToken();
    res.status(200).send({ data: token, message: "Logged In Successfully" });
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
};

// creating new user
const signup = async (req, res) => {
  try {
    console.log("hii");
    const { error } = validateSignUp(req.body);
    console.log(error);
    if (error) {
      return res.status(400).send({ message: error.details[0].message });
    }

    const user = await User.findOne({ email: req.body.email });
    if (user) {
      return res.status(409).send({ message: "User with given email already exists!" });
    }

    const salt = await bcrypt.genSalt(Number(process.env.SALT));
    const hashPassword = await bcrypt.hash(req.body.password, salt);
    await new User({ ...req.body, password: hashPassword }).save();
    res.status(201).send({ message: "User created successfully" });
  } catch (error) {
    res.status(500).send({ message: "Internal server error" });
  }
};

// fetching all books
const fetchBooks = async (req, res) => {
  const bookList = await Book.find();
  res.status(200).send({ book: bookList,id:req.id });
};
const authenticate = async (req, res) => {
  res.status(200).send({ id:req.id });
};
// creating cart
const cartCreating = async (req, res) => {
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

    res.status(200).json({ message: 'Cart Created Successfully' });
  } catch (error) {
    console.error('Error updating cart:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
 
// fetching cart items
const fetchingCart = async (req, res) => {
  const objectIdUserId = new mongoose.Types.ObjectId(req.id);

  const cartList = await Cart.findOne({ userId: objectIdUserId }).populate({
    path: 'product.productId',
    model: 'book',
  });

  if (cartList) {
    console.log("check " + cartList.product);

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
    res.status(400).send({ message: 'Cart not found' });
  }
};

// change Quantity
const changingQuantity = async (req, res) => {
  const qty=req.body.qty
  const productId=req.body.productId
  console.log(req.body)

  const token = req.headers.authorization.split(' ')[1];
  const decodedToken = jwt.verify(token, process.env.JWTPRIVATEKEY);
        const objectIdUserId = new mongoose.Types.ObjectId(decodedToken._id);

        await Cart
        .aggregate([
            {
                $unwind: '$product',
            },
        ])
        .then(() => {
            Cart
                .updateOne(
                    { userId: objectIdUserId, 'product.productId': productId },
                    { $inc: { 'product.$.quantity': qty } },
                )
                .then(() => {
                    res.json({ status: true });
                    
                });
        });
};

// make order
const makingOrder = async (req, res) => {
  try {
    const objectIdUserId = new mongoose.Types.ObjectId(req.id);
    const cartList = await Cart.findOne({ userId: objectIdUserId }).populate({
      path: 'product.productId',
      model: 'book',
    });

    console.log("cartlistc", cartList);
    const currentDate = new Date();

    const formattedDate = currentDate.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });

    const total = cartList.product.reduce(
      (total, item) => item.productId.Price * item.quantity,
      0
    );

    const orderList = new Order({
      user_id: cartList.userId,
      products: cartList.product,
      totalAmount: total,
      order_placed_on: formattedDate,
    });

    await orderList.save();

    await Cart.deleteOne({ userId: objectIdUserId });

    res.status(200).json({ message: 'Order placed successfully' });
  } catch (error) {
    console.error('Error placing order:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const validate = (data) => {
  const schema = Joi.object({

    email: Joi.string().email().required().label("Email"),
    password: Joi.string().required().label("Password"),
  });
  return schema.validate(data);
};
const validateSignUp = (data) => {
  const schema = Joi.object({
    firstName: Joi.string().required().label("First name"),
    lastName: Joi.string().required().label("Last Name"),
    email: Joi.string().email().required().label("Email"),
    password:passwordComplexity().required().label("Password")
  });
  return schema.validateSignUp(data);
};


module.exports = {
  login,
  signup,
  fetchBooks,
  authenticate,
  cartCreating,
  fetchingCart,
  changingQuantity,
  makingOrder,
  validate,
  validateSignUp
};
