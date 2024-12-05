import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import { checkRole } from '../middleware/roleAuth';
import { Issue } from '../types/issue';
import { User, UserGroup } from '../types/user';
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

  const newIssue: Issue = {
    id: issues.length + 1,
    title,
    description,
    status: 'Open',
    creator: req.user as User,
    defectIds: defectIds || [],
    defects: [],
    tasks: [],
    createdAt: new Date(),
    updatedAt: new Date()
  };

  const savedIssue = addIssue(newIssue);
  console.log('Created new issue:', savedIssue);
  res.status(201).json(savedIssue);
});

// Update issue
router.put('/:id', authenticateToken, (req, res) => {
  const id = parseInt(req.params.id);
  const { title, description, status, defectIds } = req.body;

  console.log(`PUT /issues/${id} - Update requested`, { title, description, status, defectIds });

  const updatedIssue = updateIssue(id, {
    ...(title && { title }),
    ...(description && { description }),
    ...(status && { status }),
    ...(defectIds && { defectIds }),
    updatedAt: new Date()
  });

  if (!updatedIssue) {
    return res.status(404).json({ message: 'Issue not found' });
  }

  console.log('Updated issue:', updatedIssue);
  res.json(updatedIssue);
});

// Delete issue
router.delete('/:id', authenticateToken, checkRole([UserGroup.QUALITY, UserGroup.ADMIN]), (req, res) => {
  const id = parseInt(req.params.id);
  console.log(`DELETE /issues/${id} - Deletion requested`);

  const success = deleteIssue(id);
  
  if (!success) {
    return res.status(404).json({ message: 'Issue not found' });
  }

  console.log(`Issue ${id} deleted successfully`);
  res.status(204).send();
});

export default router;
