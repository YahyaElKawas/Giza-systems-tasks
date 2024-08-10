async function submitForm() {
    const firstName = document.getElementById('first-name').value;
    const lastName = document.getElementById('last-name').value;
    const index = document.getElementById('user-index').value;

    if (index === '') {
        // Create a new user
        const response = await fetch('/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ firstName, lastName }),
        });

        if (response.ok) {
            loadUsers();
            clearForm();
        }
    } else {
        // Update an existing user
        const response = await fetch(`/users/${index}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ firstName, lastName }),
        });

        if (response.ok) {
            loadUsers();
            clearForm();
        }
    }
}

async function loadUsers() {
    const response = await fetch('/users');
    const users = await response.json();
    const usersList = document.getElementById('users-list');
    usersList.innerHTML = '';
    users.forEach((user, index) => {
        const userDiv = document.createElement('div');
        userDiv.textContent = `${user.firstName} ${user.lastName}`;
        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.onclick = () => editUser(index);
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.onclick = () => deleteUser(index);
        userDiv.appendChild(editButton);
        userDiv.appendChild(deleteButton);
        usersList.appendChild(userDiv);
    });
}

function editUser(index) {
    fetch(`/users/${index}`)
        .then(response => response.json())
        .then(user => {
            document.getElementById('first-name').value = user.firstName;
            document.getElementById('last-name').value = user.lastName;
            document.getElementById('user-index').value = index;
        });
}

function clearForm() {
    document.getElementById('first-name').value = '';
    document.getElementById('last-name').value = '';
    document.getElementById('user-index').value = '';
}

function displayEnteredData() {
    const firstName = document.getElementById('first-name').value;
    const lastName = document.getElementById('last-name').value;
    const enteredDataDiv = document.getElementById('entered-data');
}

async function deleteUser(index) {
    const response = await fetch(`/users/${index}`, {
        method: 'DELETE',
    });

    if (response.ok) {
        loadUsers();
    }
}

document.addEventListener('DOMContentLoaded', loadUsers);
