const express=require('express')
const router=express.Router();
const {auth, isAdmin}=require('../middlewares/Auth')
const {getAllUsers,signup}=require('../controllers/Auth')
router.get('/getalluser',auth,isAdmin,getAllUsers);
router.post('/adduser',auth,isAdmin,signup)
module.exports=router;
