import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import { checkRole } from '../middleware/roleAuth';
import { Defect, DefectStatus } from '../types/defect';

const router = Router();

// Mock defects data (replace with database later)
const defects: Defect[] = [
  {
    id: 1,
    title: 'Assembly Line Misalignment',
    description: 'Parts not aligning correctly during assembly process',
    status: 'New',
    creator: {
      id: 1,
      username: 'lineuser',
      email: 'line@example.com',
      userGroup: 'LineSide',
      createdAt: new Date().toISOString()
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 2,
    title: 'Quality Check Failure',
    description: 'Product failing standard quality checks',
    status: 'Working',
    creator: {
      id: 2,
      username: 'qualityuser',
      email: 'quality@example.com',
      userGroup: 'Quality',
      createdAt: new Date().toISOString()
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// Get all defects
router.get('/', authenticateToken, (req, res) => {
  res.json(defects);
});

// Get defect by ID
router.get('/:id', authenticateToken, (req, res) => {
  const defect = defects.find(d => d.id === parseInt(req.params.id));
  if (!defect) {
    return res.status(404).json({ message: 'Defect not found' });
  }
  res.json(defect);
});

// Create defect
router.post('/', authenticateToken, (req, res) => {
  const { title, description } = req.body;
  
  if (!title || !description) {
    return res.status(400).json({ message: 'Title and description are required' });
  }

  const newDefect: Defect = {
    id: defects.length + 1,
    title,
    description,
    status: 'New',
    creator: {
      id: (req as any).user.id,
      username: (req as any).user.username,
      email: (req as any).user.email,
      userGroup: (req as any).user.userGroup,
      createdAt: (req as any).user.createdAt
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  defects.push(newDefect);
  res.status(201).json(newDefect);
});

// Update defect
router.patch('/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  const { title, description, status } = req.body;
  
  const defectIndex = defects.findIndex(d => d.id === parseInt(id));
  if (defectIndex === -1) {
    return res.status(404).json({ message: 'Defect not found' });
  }

  // Only allow status updates if user is Quality role
  if (status && (req as any).user.userGroup !== 'Quality') {
    return res.status(403).json({ message: 'Only Quality users can update defect status' });
  }

  defects[defectIndex] = {
    ...defects[defectIndex],
    title: title || defects[defectIndex].title,
    description: description || defects[defectIndex].description,
    status: (status as DefectStatus) || defects[defectIndex].status,
    updatedAt: new Date().toISOString()
  };

  res.json(defects[defectIndex]);
});

// Delete defect
router.delete('/:id', authenticateToken, checkRole(['Quality']), (req, res) => {
  const { id } = req.params;
  
  const defectIndex = defects.findIndex(d => d.id === parseInt(id));
  if (defectIndex === -1) {
    return res.status(404).json({ message: 'Defect not found' });
  }

  defects.splice(defectIndex, 1);
  res.status(204).send();
});

export default router;
