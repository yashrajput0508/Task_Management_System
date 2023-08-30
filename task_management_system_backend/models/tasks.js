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
const taskSchema = new mongoose.Schema({
    _id:Number,
    taskId: Number,
    taskTitle: String,
    taskDescription: String,
    priority: String,
    progress: Boolean,
    taskAssigned: Number,
    dueDate: String,
    createdDate : String,
    updatedDate : String,
});

// Create a model from the schema
const Task = mongoose.model('Task', taskSchema, "tasks");

// Export the model
module.exports = Task;
