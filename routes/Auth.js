const express=require('express')
const router=express.Router();
const {auth}=require('../middlewares/Auth')
const {login,signup,updatePassword}=require('../controllers/Auth')
router.post('/login',login);
router.post('/signup',signup);
router.patch('/updatePassword',auth,updatePassword);
module.exports=router;
