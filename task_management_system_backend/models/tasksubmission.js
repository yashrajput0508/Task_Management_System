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
const taskSubmissionSchema = new mongoose.Schema({
    _id:Number,
    taskId: Number,
    memberId: Number,
    taskSubmission: String,
    taskRating:Number,
    taskComment:String
});

// Create a model from the schema
const TaskSubmission = mongoose.model('TaskSubmission', taskSubmissionSchema, "tasksubmission");

// Export the model
module.exports = TaskSubmission;
