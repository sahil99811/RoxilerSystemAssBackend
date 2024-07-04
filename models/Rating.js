const mongoose = require("mongoose");

// Define the Rating schema for MongoDB
const ratingSchema = new mongoose.Schema({
    // Field for storing the ID of the user who submitted the rating
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User", // Reference to the 'User' model
    },
    // Field for storing the rating given by the user
    rating: {
        type: Number,
        required: true,
        min: 0,
        max: 5,
    },
    // Field for storing the ID of the store being reviewed
    store: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Store", // Reference to the 'Store' model
    },
});

// Export the Rating model created using the defined schema
module.exports = mongoose.model("Rating", ratingSchema);
