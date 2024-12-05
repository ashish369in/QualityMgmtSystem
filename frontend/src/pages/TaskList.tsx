import { useQuery } from '@tanstack/react-query';
import { useUsers } from '../hooks/useUsers';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import type { Task } from '../types/api';

const API_URL = 'http://localhost:3000'; // Make sure this matches your backend port

const getStatusColor = (status: Task['status']) => {
  switch (status) {
    case 'Open':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'InProgress':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'Closed':
      return 'bg-gray-100 text-gray-800 border-gray-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const TaskList = () => {
  // Fetch tasks
  const { data: tasks, isLoading, error } = useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      const token = localStorage.getItem('token');
      console.log('Current auth token:', token);
      
      try {
        console.log('Fetching tasks from:', `${API_URL}/api/tasks`);
        const response = await fetch(`${API_URL}/api/tasks`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        console.log('Response status:', response.status);
        const data = await response.json();
        console.log('Tasks response data:', data);
        
        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch tasks');
        }
        
        return data;
      } catch (err) {
        console.error('Error fetching tasks:', err);
        throw err;
      }
    }
  });

  const { users } = useUsers();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Log current state
  console.log('Current user:', user);
  console.log('Tasks data:', tasks);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Error loading tasks: {error instanceof Error ? error.message : 'Unknown error'}
        </div>
        <button
          onClick={() => navigate('/')}
          className="mt-4 px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
        >
          Back to Home
        </button>
      </div>
    );
  }

  if (!tasks?.length) {
    return (
      <div className="p-4">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          No tasks found
        </div>
      </div>
    );
  }

  // Filter tasks based on user role
  const filteredTasks = tasks.filter(task => 
    user?.userGroup === 'Quality' || task.assignee.id === user?.id
  );

  const handleTaskClick = (taskId: number) => {
    console.log('Navigating to task:', taskId);
    navigate(`/tasks/${taskId}`);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Tasks</h1>
      </div>

      {isLoading ? (
        <div>Loading tasks...</div>
      ) : error ? (
        <div className="text-red-500">Error loading tasks: {error.message}</div>
      ) : (
        <div className="grid gap-4">
          <div className="grid grid-cols-7 gap-4 p-4 bg-gray-50 border-b font-medium text-sm">
            <div>Title</div>
            <div>Description</div>
            <div>Status</div>
            <div>Assignee</div>
            <div>Issue</div>
            <div>Created</div>
            <div>Updated</div>
          </div>

          <div className="divide-y">
            {filteredTasks.map(task => (
              <div 
                key={task.id} 
                className="grid grid-cols-7 gap-4 p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => handleTaskClick(task.id)}
              >
                <div className="font-medium">{task.title}</div>
                <div className="truncate text-gray-600">{task.description}</div>
                <div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(task.status)}`}>
                    {task.status}
                  </span>
                </div>
                <div className="text-gray-600">{task.assignee.username}</div>
                <div className="text-gray-600">
                  <span className="hover:text-primary" onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/issues/${task.issue.id}`);
                  }}>
                    {task.issue.title}
                  </span>
                </div>
                <div className="text-gray-500 text-sm">
                  {formatDate(task.createdAt)}
                </div>
                <div className="text-gray-500 text-sm">
                  {formatDate(task.updatedAt)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskList;
