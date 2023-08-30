const apiUrl = 'http://localhost:8082/members';

function FetchAllMembersService() {
    return fetch(apiUrl, {
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

function UpdateMemberService(newMember) {
    return fetch(apiUrl + '/update', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newMember)
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

function DeleteMemberService(memberId) {
    return fetch(apiUrl + '/' + memberId, {
        method: 'DELETE',
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

function AddMemberService(newMember) {
    return fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newMember)
    })
        .then(response => {
            return response.json();
        })
        .then(data => {
            return data; // Return the added task data
        });
}


export { AddMemberService, DeleteMemberService, UpdateMemberService, FetchAllMembersService };