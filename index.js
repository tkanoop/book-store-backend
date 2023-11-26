require('dotenv').config()
const express=require('express')
const app=express()
const cors=require("cors")
const connection =require('./db')
// import the route and middleware
const authmiddleware=require("./middlewares/authmiddleware")
const Routes=require("./routes/router")
const morgan = require('morgan')

// database Connection
connection()

// middleware
app.use(express.json())
// Enable CORS for a specific origin
// app.use(cors({ origin: 'https://656286dee167cf0bdd5302f6--celadon-unicorn-cc9e09.netlify.app' }));
app.use(cors())



// routes
app.use(morgan("dev"))
app.get("/",(req, res) => res.send("success"))
app.use("/auth",authmiddleware,(req, res) => res.status(200).json("success"))
app.use("/api",Routes)



const port=process.env.PORT || 8000;
app.listen(port,()=> console.log(`Listening on ${port}`))


