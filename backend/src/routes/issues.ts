import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import { checkRole } from '../middleware/roleAuth';
import { Issue } from '../types/issue';
import { User, UserGroup } from '../types';
import { issues, addIssue, updateIssue, deleteIssue, findIssue } from '../data/issues';

const router = Router();

// Get all issues
router.get('/', authenticateToken, (req, res) => {
  console.log('GET /issues - All issues requested');
  res.json(issues);
});

// Get issue by ID
router.get('/:id', authenticateToken, (req, res) => {
  const id = parseInt(req.params.id);
  console.log(`GET /issues/${id} - Issue details requested`);
  
  const issue = findIssue(id);
  console.log('Found issue:', issue || 'Not found');
  
  if (!issue) {
    return res.status(404).json({ message: 'Issue not found' });
  }
  res.json(issue);
});

// Create issue
router.post('/', authenticateToken, (req, res) => {
  const { title, description, defectIds } = req.body;
  
  if (!title || !description) {
    return res.status(400).json({ message: 'Title and description are required' });
  }

  if (!req.user) {
    return res.status(401).json({ message: 'User not authenticated' });
  }

  const creator: User = {
    id: req.user.id,
    username: req.user.username,
    email: req.user.email,
    userGroup: req.user.userGroup as UserGroup,
    createdAt: new Date().toISOString()
  };

  const newIssue: Issue = {
    id: issues.length + 1,
    title,
    description,
    status: 'Open',
    creator,
    defectIds: defectIds || [],
    defects: [],
    tasks: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  const createdIssue = addIssue(newIssue);
  res.status(201).json(createdIssue);
});

// Update issue
router.patch('/:id', authenticateToken, (req, res) => {
  const id = parseInt(req.params.id);
  console.log(`PATCH /issues/${id} - Update requested`);
  console.log('Update data:', req.body);

  const issue = findIssue(id);
  if (!issue) {
    return res.status(404).json({ message: 'Issue not found' });
  }

  // Only allow status updates if user is Quality role
  if (req.body.status && req.user?.userGroup !== 'Quality') {
    return res.status(403).json({ message: 'Only Quality users can update issue status' });
  }

  const updatedIssue = updateIssue(id, req.body);
  if (!updatedIssue) {
    return res.status(404).json({ message: 'Issue not found' });
  }

  console.log('Updated issue:', updatedIssue);
  res.json(updatedIssue);
});

// Delete issue
router.delete('/:id', authenticateToken, checkRole(['Quality']), (req, res) => {
  const id = parseInt(req.params.id);
  
  if (!deleteIssue(id)) {
    return res.status(404).json({ message: 'Issue not found' });
  }

  res.status(204).send();
});

export default router;
