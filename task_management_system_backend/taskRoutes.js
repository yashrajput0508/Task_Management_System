const express = require('express');
const Task = require('./models/tasks');
const router = express.Router();

router.get('/', (req, res) => {
    // Define your admin dashboard route logic here
    Task.find()
        .then(tasks => {
            res.status(200).json({ success: true, message: 'Successfully fetched the task', tasks: tasks });
        })
        .catch(error => {
            console.error('Error fetching tasks:', error);
            res.status(500).json({ success: false, message: "Couldn't connect to server" });
        });
});

router.delete('/:taskId', (req, res) => {

    const taskId = parseInt(req.params.taskId, 10);

    Task.deleteOne({ taskId: taskId }).then(deletedTask => {
        if (!deletedTask) {
            return res.status(404).json({ success: false, message: 'Task not found' });
        }
        res.status(200).json({ success: true, message: 'Task deleted successfully', deletedTask });
    })
        .catch(error => {
            console.error('Error deleting task:', error);
            res.status(500).json({ success: false, message: 'Internal Server Error' });
        });

});

router.post('/update', (req, res) => {
    // Get task data from request body

    const newTaskData = req.body;

    const newTask = new Task(newTaskData);

    newTask._id = newTask.taskId;

    Task.findByIdAndUpdate(newTask.taskId,newTask)
      .then(result => {
        if (result.nModified === 0) {
          return res.status(404).json({ success: false, message: 'Task not found' });
        }
        res.status(200).json({ success: true, message: 'Task updated successfully',task: newTask });
      })
      .catch(error => {
        console.error('Error updating task:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
      });
    // Send a success response
});

router.post('/', (req, res) => {
    // Get task data from request body
    const newTaskData = req.body;

    const newTask = new Task(newTaskData);

    newTask._id = newTask.taskId;

    // Save the new task to the database
    newTask.save()
        .then(savedTask => {
            res.status(201).json({ success: true, message: 'Task Successfully Added', task: savedTask }); // Send a response with the saved task
        })
        .catch(error => {
            console.error('Error saving task:', error);
            res.status(500).json({ success: false, message: 'Cannot Save Task' });
        });
    // Send a success response
});

module.exports = router;