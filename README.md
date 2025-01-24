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
dotenv.config(); ``` 


