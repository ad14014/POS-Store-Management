const express=require('express');
const route=express.Router()
const AllUserController=require('../Controllers/AllUserController.js')
route.post('/register',AllUserController.CreateUser)
route.post('/login',AllUserController.LoginUser)
module.exports=route