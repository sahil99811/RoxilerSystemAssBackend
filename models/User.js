const mongoose = require('mongoose');

// Define the User schema for MongoDB
const userSchema = new mongoose.Schema({
    // Field for storing the name of the user
    name: {
        type: String,
        required: true,
    },
    // Field for storing the email of the user
    email: {
        type: String,
        required: true,
        unique: true,  // Ensures email addresses are unique in the database
    },
    // Field for storing the password of the user
    password: {
        type: String,
        required: true,
    },
    // Field for storing the address of the user
    address: {
        type: String,
        required: true,
        maxLength: 400  // Maximum length of 400 characters
    },
    // Field for storing the role of the user
    role: {
        type: String,
        enum: ["admin", "user", "storeOwner"],  // Specifies valid roles
        default: "user"  // Default role is 'user'
    },
    store: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Store", // Reference to the 'Store' model
    
    },

});
// Export the User model created using the defined schema
module.exports = mongoose.model('User', userSchema);
