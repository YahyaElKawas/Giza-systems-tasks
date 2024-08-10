const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

let users = [];

app.post('/users', (req, res) => {
    const user = req.body;
    users.push(user);
    res.status(201).send(user);
});

app.get('/users', (req, res) => {
    res.send(users);
});

app.get('/users/:index', (req, res) => {
    const index = req.params.index;
    if (index >= 0 && index < users.length) {
        res.send(users[index]);
    } else {
        res.status(404).send();
    }
});

app.put('/users/:index', (req, res) => {
    const index = req.params.index;
    if (index >= 0 && index < users.length) {
        users[index] = req.body;
        res.send(users[index]);
    } else {
        res.status(404).send();
    }
});

app.delete('/users/:index', (req, res) => {
    const index = req.params.index;
    if (index >= 0 && index < users.length) {
        users.splice(index, 1);
        res.status(204).send();
    } else {
        res.status(404).send();
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
