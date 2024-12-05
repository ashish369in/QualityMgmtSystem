import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import { checkRole } from '../middleware/roleAuth';
import type { Task } from '../types/task';
import { users } from '../data/users';
import { issues, findIssue, updateIssue } from '../data/issues';
import { tasks, addTask, updateTask, findTask, deleteTask } from '../data/tasks';

const router = Router();

// Debug middleware for tasks route
router.use((req, res, next) => {
  console.log('Tasks Route:', req.method, req.path);
  console.log('Current tasks:', tasks);
  next();
});

// Get all tasks
router.get('/', authenticateToken, (req, res) => {
  console.log('GET /tasks - User:', req.user);
  console.log('Available tasks:', tasks);
  
  // Filter tasks by assignee if not Quality role
  if (req.user?.userGroup !== 'Quality') {
    const userTasks = tasks.filter(task => task.assignee.id === req.user?.id);
    console.log('Filtered tasks for user:', userTasks);
    return res.json(userTasks);
  }
  
  console.log('Returning all tasks for Quality user');
  res.json(tasks);
});

// Get task by ID
router.get('/:id', authenticateToken, (req, res) => {
  console.log('GET /tasks/:id - Params:', req.params);
  const taskId = parseInt(req.params.id);
  console.log('Looking for task with ID:', taskId);
  console.log('Current tasks array:', tasks);
  
  const task = findTask(taskId);
  console.log('Found task:', task);
  
  if (!task) {
    return res.status(404).json({ message: 'Task not found' });
  }

  // Only allow viewing if user is Quality or the assignee
  if (req.user?.userGroup !== 'Quality' && task.assignee.id !== req.user?.id) {
    return res.status(403).json({ message: 'Access denied' });
  }

  res.json(task);
});

// Create task
router.post('/', authenticateToken, async (req, res) => {
  console.log('POST /tasks - Creating new task with data:', req.body);
  const { title, description, assigneeId, issueId } = req.body;
  
  if (!title || !description || !assigneeId || !issueId) {
    return res.status(400).json({ 
      message: 'Title, description, assigneeId, and issueId are required' 
    });
  }

  // Find the assignee user
  const assignee = users.find(u => u.id === parseInt(assigneeId));
  console.log('Found assignee:', assignee);
  if (!assignee) {
    return res.status(400).json({ message: 'Invalid assigneeId' });
  }

  // Find the issue
  const issue = findIssue(parseInt(issueId));
  console.log('Found issue:', issue);
  if (!issue) {
    return res.status(400).json({ message: 'Invalid issueId' });
  }

  const newTask: Task = {
    id: tasks.length + 1,
    title,
    description,
    status: 'Open',
    assignee,
    issue,
    comments: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  console.log('Created new task:', newTask);

  // Add task to tasks array
  const createdTask = addTask(newTask);
  console.log('Task added to tasks array. Current tasks:', tasks);

  // Update the issue's tasks array
  updateIssue(issue.id, {
    tasks: [...(issue.tasks || []), createdTask]
  });

  res.status(201).json(createdTask);
});

// Update task
router.patch('/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  const { title, description, status, comments, assignee: newAssignee } = req.body;
  
  const task = findTask(parseInt(id));
  if (!task) {
    return res.status(404).json({ message: 'Task not found' });
  }

  // Only allow updates if user is Quality or the assignee
  if (req.user?.userGroup !== 'Quality' && task.assignee.id !== req.user?.id) {
    return res.status(403).json({ message: 'Access denied' });
  }

  // Only allow assignee updates if user is Quality
  if (newAssignee && req.user?.userGroup !== 'Quality') {
    return res.status(403).json({ message: 'Only Quality users can reassign tasks' });
  }

  const updatedTask = updateTask(parseInt(id), {
    title: title || task.title,
    description: description || task.description,
    status: (status as Task['status']) || task.status,
    comments: comments || task.comments,
    assignee: newAssignee || task.assignee,
  });

  if (!updatedTask) {
    return res.status(404).json({ message: 'Task not found' });
  }

  // Also update the task in the issue's tasks array
  const issue = findIssue(task.issue.id);
  if (issue) {
    const updatedTasks = issue.tasks.map(t => 
      t.id === task.id ? updatedTask : t
    );
    updateIssue(issue.id, { tasks: updatedTasks });

    // Check if task was closed and verify all tasks status
    if (status === 'Closed') {
      const allTasksClosed = updatedTasks.every(t => t.status === 'Closed');
      if (allTasksClosed && issue.status !== 'ReadyForClosure') {
        // Update issue status to ReadyForClosure if all tasks are closed
        updateIssue(issue.id, { 
          status: 'ReadyForClosure',
          tasks: updatedTasks 
        });
        console.log(`Issue ${issue.id} status updated to ReadyForClosure as all tasks are closed`);
      }
    }
  }

  res.json(updatedTask);
});

// Delete task
router.delete('/:id', authenticateToken, checkRole(['Quality']), (req, res) => {
  const { id } = req.params;
  
  if (!deleteTask(parseInt(id))) {
    return res.status(404).json({ message: 'Task not found' });
  }

  res.status(204).send();
});

export default router;
