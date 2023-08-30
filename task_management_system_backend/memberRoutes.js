const express = require('express');
const Member = require('./models/members');
const router = express.Router();

router.get('/', (req, res) => {
    // Define your admin dashboard route logic here
    Member.find()
        .then(members => {
            res.status(200).json({ success: true, message: 'Successfully fetched the member', members: members });
        })
        .catch(error => {
            console.error('Error fetching members:', error);
            res.status(500).json({ success: false, message: "Couldn't connect to server" });
        });
});

router.delete('/:memberId', (req, res) => {

    const memberId = parseInt(req.params.memberId, 10);

    Member.deleteOne({ memberId: memberId }).then(deletedMember => {
        if (!deletedMember) {
            return res.status(404).json({ success: false, message: 'Member not found' });
        }
        res.status(200).json({ success: true, message: 'Member deleted successfully', deletedMember });
    })
        .catch(error => {
            console.error('Error deleting Member:', error);
            res.status(500).json({ success: false, message: 'Internal Server Error' });
        });
});

router.post('/update', (req, res) => {
    // Get task data from request body

    const newMemberData = req.body;

    const newMember = new Member(newMemberData);

    newMember._id = newMember.memberId;

    Member.findByIdAndUpdate(newMember.memberId,newMember)
      .then(result => {
        if (result.nModified === 0) {
          return res.status(404).json({ success: false, message: 'Member not found' });
        }
        res.status(200).json({ success: true, message: 'Member updated successfully',member: newMember });
      })
      .catch(error => {
        console.error('Error updating member:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
      });
    // Send a success response
});

router.post('/', (req, res) => {

    const newMemberData = req.body;

    const newMember = new Member(newMemberData);

    newMember._id = newMember.memberId;

    newMember.save()
        .then(savedMember => {
            if(savedMember){
                res.status(201).json({ success: true, message: 'Member Successfully Added', member: savedMember }); // Send a response with the saved task
            }else{
                console.log("Already Exist");
            }
        })
        .catch(error => {
            if (error.code === 11000) {
                // Duplicate key error, member already exists
                // res.status(404).json({ success: true, message: 'Member Successfully Added'}); // Send a response with the saved task
                res.status(409).json({ success: false, message: 'Member Already Exists' });
            } else {
                console.error('Error saving member:', error);
                res.status(500).json({ success: false, message: 'Server Error' });
            }
        });
});

module.exports = router;