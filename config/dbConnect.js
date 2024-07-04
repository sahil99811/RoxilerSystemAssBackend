const mongoose=require('mongoose');
exports.dbConnect= () => {
    console.log(process.env.MONGODB_URL)
   return mongoose.connect(process.env.MONGODB_URL);
};