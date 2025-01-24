# Buy-Sell-IIITH
DASS Assignment-1

# Folders:
1. Backend
2. Frontend
3. Readme

# How to install React folders inside the frontend folder: (by vite)
1. download the node.js dependencies and install vite 
2. ```npm create vite@latest my-react-app``` 
where replace the my-react-app with your frontend folder name, here 'frontend'
3. Use react-javascript as the language.
4.``` cd frontend```
5. ```npm i``` or ```npm install``` to download all the dependencies.
6. ```npm run dev``` to run it, it will redirect you to vite+React page.


We will be using fragments instead of div, bcz we often need to group multiple elements together. Normally, we woould use a div or another HTML tag to do this. BUt adding extra tags like div can sometimes mess up with our layout or styles because it adds unnecessary HTML elements to our page.

# How to make folders in backend

```npm init -y ``` in the backend folder, to get the package. json file.
then install express and mongoose by
```npm install express mongoose dotenv``` .

now go to package.json file and change ```"start": "node server.js" ``` to ```"start": "nodemon server.js"```.

Then we will use a little new notation in server.js file i.e. instead of using const express= smthng smthng we will use import, for that we first need to go to package.json file and add the ```"type":"module" ``` line

here, ```{
  "name": "backend",
  "version": "1.0.0",
  "main": "server.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "nodemon server.js"
  },
  "type": "module",
  "keywords": [],
  "author": "",
  "license": "ISC",
  "description": "",
  "dependencies": {
    "dotenv": "^16.4.7",
    "express": "^4.21.2",
    "mongoose": "^8.9.5"
  },
  "devDependencies": {
    "nodemon": "^3.1.9"
  }
}```

above is the code for reference on where to add the type line. 
remove the test line from above bcz its getting printed a lot of time, and instead add ```    "dev":"nodemon server.js",``` so that now for running the code you can just do ```npm run dev```.

then put 
```
app.get("/",(req,res)=>{
    res.send("Server is ready");
})
```
in the server.js file you'll get the output as server is ready,

## MongoDB
1. Go to mongodb's website, and login
2. make a project
3. make a cluster in it.
4. create a .env file and write the connection string in it, and replace the <password> placeholder with ur password.
5. Then, go to network access and change the setting of IP adress to be accessed by anywhere.
6. ```console.log(process.env.MONGO_URI);``` write this in server.js, you'll get an undefined error in console.
7. for that use
```
import dotenv from "dotenv";
dotenv.config();
```
You will get output as your mongo_URI connection string in the terminal as well. 
8. Then make a config folder in backend and create a db.js file
9. write the following code in db.js
```
import mongoose from "mongoose";


export const connectDB=async()=>{
    try{
        const conn=await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB connected: ${conn.conection.host}');
    }catch(error){
        console.error('Error: ${error.message}');
        process.exit(1);
    }
}
```
10. after that we need to connect it to server.js, so add ```import { connectDB } from './config/db.js'; ```
11. And add the line connectDB() in console.log() function like:
    
    ```
    console.log(process.env.MONGO_URI);
    app.listen(5000,()=>{
    connectDB() //function which is specified in db.js file
    console.log("Server started at http://localhost:5000");});
    ```
12.  Run the code, you should get mongoDB connected in your terminal.

13.  Create models folder in backend , and in this folder make a product.js file.
14.  write the following code in this file:
``` import mongoose from "mongoose";

const productSchema=new mongoose.Schema({
    name:{
        type:String,
        required: true
    },
    price:{
        type:Number,
        required: true 
    },
    image:{
        type:String,
        required: true
    },
},{
    timestamps: true //createdAT, UpdatedAT
}
);

const Product= mongoose.model('Product', productSchema);
//mongoose will automatically make it lowercase and plural i.e. products. Hence, we will use product so that it makes it products, if we will use products it will make it productss.
//product will be the name of collection mongoose will make, or automatically connect to if one like this already exist.

export default Product;
```
15. change the get place in server.js to products from root like this:
    ```
    app.get("/products",(req,res)=>{
    res.send("Server is r123eady");}) ```

  

## API

1. The await keyword you will use afterwards can only be used if you use async in the main function. So keep that in mind.
2. This will be your new server.js, you have to specify which error and all will come when we use mongo
   ```
   import express from "express";
    import dotenv from "dotenv";
    import { connectDB } from './config/db.js';
    import Product from './models/product.js';
    
    dotenv.config();
    
    const app=express();
    
    app.post("/products",async(req,res)=>{
        //defines a route that listens for post requests at the /products endpoint
        const product=req.body;
        //req.body is the data sent by the client in the request body (As JSON)
        //eg.{ name: "Laptop", price: 1500, image: "laptop.jpg" }

    if(!product.name || !product.price || !product.image){
        return res.status(400).json({success:false, message:"Please provide all fields"});
    }

    const newProduct=new Product(product) //product from above, were we requested client's input into it
    //this we will put into database now

    try{
        await newProduct.save();
        // saves newly created product document to the database.
        res.status(201).json({success: true, data: newProduct});
        // data: new product means it Sends the saved product (including its _id assigned by MongoDB) back to the client as confirmation.

    }
    catch{
        console.error("Error in create product: ", error.message);
        res.status(500).json({success:false, message:"Server error"});
    }}); 
    // console.log(process.env.MONGO_URI);
    app.listen(5000,()=>{
        connectDB();//function which is specified in db.js file
        console.log("Server started at http://localhost:5000");
    });
    
    
    // xhIyHErQDTcWsMQi password for mongodb ```
3. 

