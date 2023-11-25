const express = require("express");

// Import all controllers
const { login, signup, fetchBooks, cartCreating, fetchingCart, changingQuantity, makingOrder ,authenticate} = require("../controller/controller");
const authmiddleware=require("../middlewares/authmiddleware")

const routes = express.Router();

routes.post("/auth", login);
routes.post("/user/signup", signup);

routes.get("/auth/books", fetchBooks);
routes.get("/auth/authentication",authmiddleware, authenticate);

routes.post("/auth/cart", cartCreating);
routes.get("/auth/cartView",authmiddleware,fetchingCart);
routes.get("/auth/make-order",authmiddleware,makingOrder);
routes.patch("/auth/change-qty", changingQuantity);


module.exports = routes;
