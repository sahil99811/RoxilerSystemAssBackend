const express = require('express');
const router = express.Router();
const { auth, isAdmin,isUser,isStoreOwner } = require('../middlewares/Auth');
const { createStore, storesAnalytics ,getAllStores,getStoreRatings} = require('../controllers/Store');
const {createRating,updateRating}=require('../controllers/Rating')
router.post('/createstore', auth, isAdmin, createStore);
router.get('/storesAnalytics', auth, isAdmin, storesAnalytics);
router.get('/getallstores',auth,getAllStores)
router.post('/createrating',auth,isUser,createRating);
router.patch('/updaterating',auth,isUser,updateRating);
router.get('/storeratings',auth,isStoreOwner,getStoreRatings);
module.exports = router;
