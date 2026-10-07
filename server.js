import express from 'express'; // this require will import the package express from node_modules

import cors from 'cors';

import dotenv from 'dotenv'; 

import { db } from './db/db.js'; //ES6
import  userRoutes  from "./routes/userRoutes.js";     //ES6 module use import not require
import  productRoutes from "./routes/productRoutes.js";  

import categoryRoutes from "./routes/categoryRoutes.js";

import cookieParser from "cookie-parser";

dotenv.config();  

console.log(process.env.MONGO_URI);

const app = express();

app.use(express.json());  //express.json() is middleware that converts incoming JSON request data into a JavaScript object available as req.body.

app.use(cookieParser());  // cookie-parser allows Express to easily read cookies sent by the browser through req.cookies.

  
const port = process.env.PORT || 5000;

db();

// Because these are different origins (5173 vs 3000), your backend must allow the frontend origin
//CORS / connection between your frontend and backend.

app.use(
  cors({
    origin:[
      'http://localhost:5173',
      'https://inventory-frontend-rho-self.vercel.app'
    ],
    credentials: true
  })
);


app.use("/api/users",userRoutes);  //tells Express which middleware or router should handle a particular URL path.

app.use("/api/products",productRoutes); 

app.use("/api/categories", categoryRoutes);


app.get('/',(req,res)=>{

    res.send(`<h1>Welcome To NODE JS</h1>`);

});



console.log(`5+6=`,5 + 6,"",`6*6`, 6*6);

app.listen(port,console.log(`App is running on port ${port}`));