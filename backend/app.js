const express = require("express");
const app = express();



const cors = require("cors")

app.use(cors({ 
    origin: "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    optionsSuccessStatus: 200,
  }));
app.use(express.json());
const errorMiddleware = require('./middleware/error')


//config
const dotenv = require("dotenv");
dotenv.config({path:"./config/.env"});

//routes
const eComRoute = require("./routes/eComRoute");
app.use('/api',eComRoute);


// middleware for error
app.use(errorMiddleware);


module.exports = app;