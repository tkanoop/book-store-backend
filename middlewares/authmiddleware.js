const Jwt=require('jsonwebtoken')
const mongoose=require('mongoose')

const authmiddleware = (req, res, next) => {
  try {

    const token = req.headers?.authorization
    let decodeData = Jwt.verify(token, process.env.JWTPRIVATEKEY);
    req.id=decodeData._id
    next();
  } catch (error) {
    console.log("here "+error);
    res.status(404).json("Invalid Credentials");
  }
};

module.exports = authmiddleware;

