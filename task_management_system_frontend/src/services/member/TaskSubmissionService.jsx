const apiUrl = 'http://localhost:8082/tasksubmission';

function AddTaskSubmissionService(newTaskSubmission) {
    return fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newTaskSubmission)
    })
        .then(response => {
            return response.json();
        })
        .then(data => {
            return data; // Return the added task data
        });
}

function UpdateTaskSubmissionService(newTaskSubmission) {
    return fetch(apiUrl+'/'+'update', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newTaskSubmission)
    })
        .then(response => {
            return response.json();
        })
        .then(data => {
            return data; // Return the added task data
        });
}

function FetchMemberTaskSubmissionService(memberId) {
    return fetch(apiUrl+'/memberrating/'+memberId, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            return data; // Return the added task data
        });
}


function FetchTaskSubmissionService(taskId) {
    return fetch(apiUrl+'/'+taskId, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            return data; // Return the added task data
        });
}
export {AddTaskSubmissionService, UpdateTaskSubmissionService, FetchTaskSubmissionService, FetchMemberTaskSubmissionService};