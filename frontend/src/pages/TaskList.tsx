import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import type { Task } from '../types/api';
import { Card } from '../components/ui/card';
import { apiClient } from '../api/client';

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

export default function TaskList() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data: tasks, isLoading, error } = useQuery<Task[]>({
    queryKey: ['tasks'],
    queryFn: apiClient.getTasks, // Use apiClient.getTasks
  });

  // Log current state
  console.log('Current user:', user);
  console.log('Tasks:', tasks);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Tasks</h1>
        </div>
        <Card className="p-6">
          <div>Loading tasks...</div>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Tasks</h1>
        </div>
        <Card className="p-6">
          <div className="text-red-500">Error loading tasks: {(error as Error).message}</div>
          <button
            onClick={() => navigate('/')}
            className="mt-4 px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
          >
            Back to Home
          </button>
        </Card>
      </div>
    );
  }

  // Filter tasks based on user role
  const filteredTasks = tasks?.filter((task: Task) =>
    task.assignee.id === user?.id
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
        <h1 className="text-3xl font-bold">Tasks</h1>
      </div>

      <Card className="p-6">
        <div className="space-y-4">
          <div className="grid grid-cols-7 gap-4 p-4 font-medium border-b bg-muted rounded-t-lg">
            <div>Title</div>
            <div>Description</div>
            <div>Status</div>
            <div>Assignee</div>
            <div>Issue</div>
            <div>Created</div>
            <div>Updated</div>
          </div>

          <div className="space-y-2">
            {filteredTasks?.map((task) => (
              <div
                key={task.id}
                className="grid grid-cols-7 gap-4 p-4 border rounded-lg hover:bg-accent/50 transition-colors cursor-pointer"
                onClick={() => handleTaskClick(task.id)}
              >
                <div className="font-medium">{task.title}</div>
                <div className="text-sm text-gray-600 truncate">{task.description}</div>
                <div>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm ${getStatusColor(task.status)}`}>
                    {task.status}
                  </span>
                </div>
                <div className="text-sm text-gray-600">{task.assignee.username}</div>
                <div className="text-sm text-gray-600">
                  <span className="hover:text-primary" onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/issues/${task.issue.id}`);
                  }}>
                    {task.issue.title}
                  </span>
                </div>
                <div className="text-sm text-gray-500">{formatDate(task.createdAt)}</div>
                <div className="text-sm text-gray-500">{formatDate(task.updatedAt)}</div>
              </div>
            ))}

            {(!filteredTasks || filteredTasks.length === 0) && (
              <div className="text-center p-4 text-gray-500">
                No tasks found
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
