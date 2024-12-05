import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import type { Task } from '../types/api';

const API_URL = 'http://localhost:3000';

const TaskDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [showConfirmation, setShowConfirmation] = React.useState(false);
  const [pendingStatus, setPendingStatus] = React.useState<Task['status'] | null>(null);

  // Fetch task details
  const { data: task, isLoading: isLoadingTask, error: taskError } = useQuery({
    queryKey: ['task', id],
    queryFn: async () => {
      const token = localStorage.getItem('token');
      console.log('Fetching task with ID:', id);
      
      const response = await fetch(`${API_URL}/api/tasks/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      console.log('Response status:', response.status);
      
      const data = await response.json();
      console.log('Response data:', data);
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch task');
      }
      return data;
    },
    retry: false
  });

  // Update task mutation
  const updateTaskMutation = useMutation({
    mutationFn: async (updates: Partial<Task>) => {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/tasks/${id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updates),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update task');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['task', id] });
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast({
        title: 'Success',
        description: 'Task status updated successfully',
      });
    },
    onError: (error) => {
      console.error('Failed to update task:', error);
      toast({
        title: 'Error',
        description: 'Failed to update task status',
        variant: 'destructive',
      });
    }
  });

  // Handle task update
  const handleTaskUpdate = async (updates: Partial<Task>) => {
    try {
      await updateTaskMutation.mutateAsync(updates);
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  };

  // Handle status change with confirmation
  const handleStatusChange = (newStatus: Task['status']) => {
    setPendingStatus(newStatus);
    setShowConfirmation(true);
  };

  // Confirm status change
  const confirmStatusChange = async () => {
    if (pendingStatus) {
      await handleTaskUpdate({ status: pendingStatus });
      setShowConfirmation(false);
      setPendingStatus(null);
    }
  };

  // Cancel status change
  const cancelStatusChange = () => {
    setShowConfirmation(false);
    setPendingStatus(null);
  };

  // Get status color
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

  // Error state
  if (taskError) {
    return (
      <div className="text-red-500">Error loading task: {taskError.message}</div>
    );
  }

  // Loading state
  if (isLoadingTask) {
    return <div>Loading task...</div>;
  }

  // No task found
  if (!task) {
    return (
      <div className="text-red-600">Task not found</div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Confirmation Dialog */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full space-y-4">
            <h3 className="text-lg font-semibold">Confirm Status Change</h3>
            <p>Are you sure you want to change the task status to {pendingStatus}?</p>
            <div className="flex justify-end gap-4">
              <button
                onClick={cancelStatusChange}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
              >
                Cancel
              </button>
              <button
                onClick={confirmStatusChange}
                className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">{task.title}</h1>
          <p className="text-gray-600">Task #{task.id}</p>
        </div>
        <button
          onClick={() => navigate('/tasks')}
          className="px-4 py-2 bg-secondary text-white rounded hover:bg-secondary/90"
        >
          Back to Tasks
        </button>
      </div>

      <div className="grid gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="font-semibold mb-2">Description</h2>
          <p className="text-gray-700">{task.description}</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="font-semibold mb-2">Status</h2>
          {user?.userGroup === 'Quality' || task.assignee.id === user?.id ? (
            <select
              value={task.status}
              onChange={(e) => handleStatusChange(e.target.value as Task['status'])}
              className="border rounded p-2"
            >
              <option value="Open">Open</option>
              <option value="InProgress">In Progress</option>
              <option value="Closed">Closed</option>
            </select>
          ) : (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(task.status)}`}>
              {task.status}
            </span>
          )}
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="font-semibold mb-2">Comments</h2>
          <textarea
            value={task.comments}
            onChange={(e) => handleTaskUpdate({ comments: e.target.value })}
            className="w-full h-32 border rounded p-2 focus:ring-1 focus:ring-primary focus:border-primary"
            placeholder="Add comments..."
            disabled={!user || (user.userGroup !== 'Quality' && task.assignee.id !== user.id)}
          />
        </div>

        {task.issueId && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="font-semibold mb-2">Related Issue</h2>
            <div className="text-blue-600 hover:underline cursor-pointer">
              <a href={`/issues/${task.issueId}`}>View Issue #{task.issueId}</a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskDetail;
