// Load required packages
var mongoose = require('mongoose');

// Define our task schema
var ClassSchema = mongoose.Schema({
    id: {type: String, unique: true, required: true},
    identifier: String,
    department_id: String,
    name: String,
    credit: String,
    description: String,
    users: [String]
});

// Export the Mongoose model
module.exports = mongoose.model('Class', ClassSchema);