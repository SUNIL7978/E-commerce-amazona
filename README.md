1.List Of Product

    1.Create Product Array
    2.add Products Image
    3.Render Product
    4.style Product

2.Add Raect-Router-Dom 

    1. npm i react-router-dom
    2. create route for home screen
    3. create router for product screen
   
3.Ceate backend Api To install Node.js Server

    1. run npm init in root folder
    2. Update package.json set type: module
    3. Add .js to imports
    4. npm install express
    5. create server.js
    6. add start command as node backend/server.js
    7. require express
    8. create route for / return backend is ready.
    9. move products.js from frontend to backend
    10. create route for /api/products
    11. return products
    12. run npm start

4.Fetch Products From Backend

    1. set proxy in package.json
    2. npm install axios
    3. use state hook
    4. use effect hook
    5. use reducer hook
   
5.Manage State By Reducer Hook

    1. define reducer
    2. update fetch data
    3. get state from usReducer
   
6.Add bootstrap UI Framework

    1. npm install react-bootstrap bootstrap
    2. update App.js

7.Create Product and Rating Component

    1. create Rating component
    2. Create Product component
    3. Use Rating component in Product component

8.Create Product Details Screen

    1. fetch product from backend
    2. create 3 columns for image, info and action

9.Create Loading and Message Component

    1. create loading component
    2. use spinner component
    3. craete message component
    4. create utils.js to define getError fuction

10.Create React Context For Add Item To Cart

    1. Create React Context
    2. define reducer
    3. create store provider
    4. implement add to cart button click handler

11.Complete Add To Cart

    1. check exist item in the cart
    2. check count in stock in backend

12.Create Cart Screen

    1. create 2 columns
    2. display items list
    3. create action column

13.Complete Cart Screen

    1. click handler for inc/dec item
    2. click handler for remove item
    3. click handler for checkout

14.Create Signin Screen

    1. create sign in form
    2. add email and password
    3. add signin button

15.Connect To MongoDB Database

    1. create atlas monogodb database
    2. install local mongodb database
    3. npm install mongoose
    4. connect to mongodb database

16.Seed Sample Products

    1. create Product model
    2. create seed route
    3. use route in server.js
    4. seed sample product
   
17.Seed Sample Users

    1. create user model
    2. seed sample users

18.Create Signin Backend API

    1. create signin api
    2. npm install jsonwebtoken
    3. define generateToken

19.Complete Signin Screen

    1. handle submit action
    2. save token in store and local storage
    3. show user name in header

20.Create Shipping Screen

    1. create form inputs
    2. handle save shipping address
    3. add checkout wizard bar

21.Create Sign Up Screen

    1. create input forms
    2. handle submit
    3. create backend api

22.Implement Select Payment Method Screen

    1. create input forms
    2. handle submit