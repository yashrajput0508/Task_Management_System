const mongoose = require('mongoose');
const uri = "mongodb+srv://yasharajput0508:yasharajput0508@cluster0.njfyeou.mongodb.net/taskmanagementdb?retryWrites=true&w=majority";

// Connect to the MongoDB database
mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Connected to MongoDB');
})
.catch(error => {
    console.error('Error connecting to MongoDB:', error);
});

// Define a schema for the task
const memberSchema = new mongoose.Schema({
    _id:Number,
    memberId: Number,
    memberName: String,
    username: String,
    password: String,
    dob: String,
    status: String,
    createdDate : String,
    updatedDate : String,
});

// Create a model from the schema
const Member = mongoose.model('Member', memberSchema, "members");

// Export the model
module.exports = Member;
