const express = require('express');
const TaskSubmission = require('./models/tasksubmission');
const router = express.Router();

router.get('/:taskId', (req, res) => {
    // Define your admin dashboard route logic here

    const taskId = parseInt(req.params.taskId, 10);

    TaskSubmission.findById(taskId)
        .then(taskSubmission => {
            res.status(200).json({ success: true, message: 'Successfully fetched the taskSubmission', taskSubmission: taskSubmission });
        })
        .catch(error => {
            console.error('Error fetching task Submission:', error);
            res.status(500).json({ success: false, message: "Server Error" });
        });
});

router.get('/memberrating/:memberId', (req, res) => {
  // Define your admin dashboard route logic here

  const memberId = parseInt(req.params.memberId, 10);

  TaskSubmission.find({memberId:memberId})
      .then(taskSubmission => {
          res.status(200).json({ success: true, message: 'Successfully fetched the taskSubmission', taskSubmission: taskSubmission });
      })
      .catch(error => {
          console.error('Error fetching task Submission:', error);
          res.status(500).json({ success: false, message: "Server Error" });
      });
});

router.post('/update', (req, res) => {
    // Get task data from request body

    // Get task data from request body
    const newTaskSubmissionData = req.body;

    const newTaskSubmission = new TaskSubmission(newTaskSubmissionData);

    newTaskSubmission._id = newTaskSubmission.taskId;

    TaskSubmission.findByIdAndUpdate(newTaskSubmission.taskId,newTaskSubmission)
      .then(result => {
        if (result.nModified === 0) {
          return res.status(404).json({ success: false, message: 'TaskSubmission not found' });
        }
        res.status(200).json({ success: true, message: 'TaskSubmission updated successfully',taskSubmission: newTaskSubmission });
      })
      .catch(error => {
        console.error('Error updating taskSubmission:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
      });
    // Send a success response
});

router.post('/', (req, res) => {
    // Get task data from request body
    const newTaskSubmissionData = req.body;

    const newTaskSubmission = new TaskSubmission(newTaskSubmissionData);

    newTaskSubmission._id = newTaskSubmission.taskId;

    // Save the new task to the database
    newTaskSubmission.save()
        .then(savedTaskSubmission => {
            res.status(201).json({ success: true, message: 'Task Successfully Submitted', taskSubmission: savedTaskSubmission }); // Send a response with the saved task
        })
        .catch(error => {
            res.status(500).json({ success: false, message: 'Cannot Submission Task' });
        });
    // Send a success response
});

module.exports = router;