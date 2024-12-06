import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { authenticateToken } from '../middleware/auth';
import { checkRole } from '../middleware/roleAuth';
import { User, UserGroup } from '../types/user';
import { users, findUserByUsername } from '../data/users';

const router = Router();

// Login endpoint
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Find user (in a real app, you would verify the password)
  const user = findUserByUsername(username);

  if (!user) {
    return res.status(401).json({ message: 'Invalid username or password' });
  }

  // Create JWT token
  const token = jwt.sign(
    { 
      id: user.id,
      username: user.username,
      email: user.email,
      userGroup: user.userGroup
    },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: '24h' }
  );

  // Return both token and user data
  res.json({ 
    token,
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      userGroup: user.userGroup
    }
  });
});

// Get current user
router.get('/me', authenticateToken, (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  const user = findUserByUsername(req.user.username);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  res.json(user);
});

// Get all users route
router.get('/users', authenticateToken, (req, res) => {
  console.log('GET /users - All users requested');
  res.json(users);
});

// Create user route
router.post('/users', authenticateToken, checkRole(['Quality']), (req, res) => {
  console.log('POST /users - Create user request:', req.body);

  const { username, email, userGroup } = req.body;

  // Validate input
  if (!username || !email || !userGroup) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  // Validate user group
  if (!['LineSide', 'Quality', 'Others'].includes(userGroup)) {
    return res.status(400).json({ message: 'Invalid user group' });
  }

  // Create new user
  const newUser: User = {
    id: users.length + 1,
    username,
    email,
    userGroup: userGroup as UserGroup,
    createdAt: new Date()
  };

  users.push(newUser);
  console.log('User created:', newUser);
  res.status(201).json(newUser);
});

// Update user route
router.patch('/users/:id', authenticateToken, checkRole(['Quality']), (req, res) => {
  console.log('PATCH /users/:id - Update user request:', req.params.id, req.body);

  const id = parseInt(req.params.id);
  const userIndex = users.findIndex(u => u.id === id);

  if (userIndex === -1) {
    return res.status(404).json({ message: 'User not found' });
  }

  const { username, email, userGroup } = req.body;
  const updatedUser = { ...users[userIndex] };

  if (username) updatedUser.username = username;
  if (email) updatedUser.email = email;
  if (userGroup && ['LineSide', 'Quality', 'Others'].includes(userGroup)) {
    updatedUser.userGroup = userGroup as UserGroup;
  }

  users[userIndex] = updatedUser;
  console.log('User updated:', updatedUser);
  res.json(updatedUser);
});

// Delete user route
router.delete('/users/:id', authenticateToken, checkRole(['Quality']), (req, res) => {
  console.log('DELETE /users/:id - Delete user request:', req.params.id);

  const id = parseInt(req.params.id);
  const userIndex = users.findIndex(u => u.id === id);

  if (userIndex === -1) {
    return res.status(404).json({ message: 'User not found' });
  }

  const deletedUser = users.splice(userIndex, 1)[0];
  console.log('User deleted:', deletedUser);
  res.json({ message: 'User deleted successfully' });
});

// Register endpoint
router.post('/register', (req, res) => {
  const { username, email, password } = req.body;

  // Check if username already exists
  if (findUserByUsername(username)) {
    return res.status(400).json({ message: 'Username already exists' });
  }

  // Create new user (in a real app, you would hash the password)
  const newUser: User = {
    id: users.length + 1,
    username,
    email,
    password,
    userGroup: UserGroup.USER,
    createdAt: new Date()
  };

  users.push(newUser);
  console.log('User created:', newUser);
  res.status(201).json(newUser);
});

export default router;
