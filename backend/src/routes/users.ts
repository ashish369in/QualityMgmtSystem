import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import { checkRole } from '../middleware/roleAuth';
import { UserGroup } from '../types';

const router = Router();

// Mock users data (replace with database later)
const users = [
  { 
    id: 1, 
    username: 'admin',
    email: 'admin@example.com',
    userGroup: 'Admin' as UserGroup,
    createdAt: new Date().toISOString(),
  },
  { 
    id: 2, 
    username: 'qualityuser',
    email: 'quality@example.com',
    userGroup: 'Quality' as UserGroup,
    createdAt: new Date().toISOString(),
  },
  { 
    id: 3, 
    username: 'user',
    email: 'user@example.com',
    userGroup: 'User' as UserGroup,
    createdAt: new Date().toISOString(),
  },
];

// Get all users - protected for Quality and Admin roles
router.get('/', authenticateToken, checkRole(['Quality', 'Admin']), (req, res) => {
  res.json(users);
});

// Get user by ID
router.get('/:id', authenticateToken, checkRole(['Quality', 'Admin']), (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  res.json(user);
});

// Create user
router.post('/', authenticateToken, checkRole(['Quality', 'Admin']), (req, res) => {
  const { username, email, userGroup } = req.body;
  
  if (!username || !email || !userGroup) {
    return res.status(400).json({ message: 'Username, email and userGroup are required' });
  }

  // Check if username already exists
  if (users.some(u => u.username === username)) {
    return res.status(400).json({ message: 'Username already exists' });
  }

  const newUser = {
    id: users.length + 1,
    username,
    email,
    userGroup,
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  res.status(201).json(newUser);
});

// Update user
router.patch('/:id', authenticateToken, checkRole(['Quality', 'Admin']), (req, res) => {
  const { userGroup } = req.body;
  const userId = parseInt(req.params.id);
  
  const userIndex = users.findIndex(u => u.id === userId);
  if (userIndex === -1) {
    return res.status(404).json({ message: 'User not found' });
  }

  // Don't allow updating your own role
  if (userId === (req as any).user.id) {
    return res.status(403).json({ message: 'Cannot update your own role' });
  }

  const updatedUser = {
    ...users[userIndex],
    userGroup: userGroup || users[userIndex].userGroup,
  };

  users[userIndex] = updatedUser;
  res.json(updatedUser);
});

// Delete user
router.delete('/:id', authenticateToken, checkRole(['Quality', 'Admin']), (req, res) => {
  const userId = parseInt(req.params.id);
  
  // Don't allow deleting your own account
  if (userId === (req as any).user.id) {
    return res.status(403).json({ message: 'Cannot delete your own account' });
  }

  const userIndex = users.findIndex(u => u.id === userId);
  if (userIndex === -1) {
    return res.status(404).json({ message: 'User not found' });
  }

  users.splice(userIndex, 1);
  res.status(204).send();
});

export default router;
