const mongoose = require('mongoose');

// Define the Store schema for MongoDB
const storeSchema = new mongoose.Schema({
    // Field for storing the name of the store
    name: {
        type: String,
        required: true,
        minLength: 20,  // Minimum length of 20 characters
        maxLength: 60   // Maximum length of 60 characters
    },
    // Field for storing the email of the store
    email: {
        type: String,
        required: true,
        unique:true
    },
    // Field for storing the address of the store
    address: {
        type: String,
        required: true,
        maxLength: 400  // Maximum length of 400 characters
    },
    rating:{
        type:Number,
        min:0,
        max:5,
        default:0
    },
    // Field for storing references to Rating documents
    ratings: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Rating",  // Reference to the 'Rating' model
        },
    ],
});

// Export the Store model created using the defined schema
module.exports = mongoose.model('Store', storeSchema);
