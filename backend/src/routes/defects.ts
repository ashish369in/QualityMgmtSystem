import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import { checkRole } from '../middleware/roleAuth';
import { Defect, DefectStatus } from '../types/defect';
import { UserGroup } from '../types/user';

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
      userGroup: UserGroup.LINESIDE,
      createdAt: new Date()
    },
    createdAt: new Date(),
    updatedAt: new Date()
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
      userGroup: UserGroup.QUALITY,
      createdAt: new Date()
    },
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// Get all defects
router.get('/', authenticateToken, (req, res) => {
  res.json(defects);
});

// Get defect by ID
router.get('/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  const defect = defects.find(d => d.id === parseInt(id));
  
  if (!defect) {
    return res.status(404).json({ message: 'Defect not found' });
  }
  
  res.json(defect);
});

// Create new defect
router.post('/', authenticateToken, (req, res) => {
  const { title, description } = req.body;
  const user = (req as any).user;

  const newDefect: Defect = {
    id: defects.length + 1,
    title,
    description,
    status: 'New',
    creator: user,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  defects.push(newDefect);
  res.status(201).json(newDefect);
});

// Update defect
router.put('/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  const { title, description, status } = req.body;
  
  const defectIndex = defects.findIndex(d => d.id === parseInt(id));
  
  if (defectIndex === -1) {
    return res.status(404).json({ message: 'Defect not found' });
  }

  defects[defectIndex] = {
    ...defects[defectIndex],
    ...(title && { title }),
    ...(description && { description }),
    ...(status && { status }),
    updatedAt: new Date()
  };

  res.json(defects[defectIndex]);
});

// Delete defect
router.delete('/:id', authenticateToken, checkRole([UserGroup.QUALITY]), (req, res) => {
  const { id } = req.params;
  
  const defectIndex = defects.findIndex(d => d.id === parseInt(id));
  
  if (defectIndex === -1) {
    return res.status(404).json({ message: 'Defect not found' });
  }
  
  defects.splice(defectIndex, 1);
  res.status(204).send();
});

export default router;
