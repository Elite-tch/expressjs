const express = require('express');
const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());

let nextId = 3;
const users = [
  { id: 1, name: 'Deo', email: 'deo@gmail.com', number: '+2349000000001' },
  { id: 2, name: 'Ada', email: 'ada@gmail.com', number: '+2349000000002' },
];

// GET /users returns all users. Add ?name=ada to search by name.
app.get('/users', (req, res) => {
  const searchName = req.query.name;

  if (!searchName) {
    return res.json(users);
  }

  const matchingUsers = users.filter((user) => {
    return user.name.toLowerCase().includes(searchName.toLowerCase());
  });

  res.json(matchingUsers);
});

// POST /users adds a new user. Send name, email, and number in the request body.
app.post('/users', (req, res) => {
  if (!req.body.name || !req.body.email || !req.body.number) {
    return res.status(400).json({ error: 'name, email, and number are required' });
  }

  const newUser = {
    id: nextId,
    name: req.body.name,
    email: req.body.email,
    number: req.body.number,
  };

  nextId = nextId + 1;
  users.push(newUser);
  res.status(201).json(newUser);
});

// PUT /users/1 replaces that user's name, email, and number.
app.put('/users/:id', (req, res) => {
  const userId = Number(req.params.id);
  const user = users.find((currentUser) => currentUser.id === userId);

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  if (!req.body.name || !req.body.email || !req.body.number) {
    return res.status(400).json({ error: 'name, email, and number are required' });
  }

  user.name = req.body.name;
  user.email = req.body.email;
  user.number = req.body.number;

  res.json(user);
});

// DELETE /users/1 removes that user.
app.delete('/users/:id', (req, res) => {
  const userId = Number(req.params.id);
  const userIndex = users.findIndex((user) => user.id === userId);

  if (userIndex === -1) {
    return res.status(404).json({ error: 'User not found' });
  }

  const deletedUser = users[userIndex];
  users.splice(userIndex, 1);
  res.json({ message: 'User deleted', user: deletedUser });
});

app.listen(port, () => {
  console.log(`Users API listening on port ${port}`);
});