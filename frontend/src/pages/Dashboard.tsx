import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { TrainingSection } from '../components/training/TrainingSection';
import { TaskIcon, IssueIcon, ChartIcon } from '../components/icons/TrainingIcons';
import { useAuth } from '../hooks/useAuth';
import { cn } from '../lib/utils';
import { API_URL } from '../config';
import { Issue } from '../types/api';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data: tasks, isLoading: isLoadingTasks } = useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      const response = await fetch(`${API_URL}/api/tasks`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch tasks');
      }
      return response.json();
    },
  });

  const { data: issues, isLoading: isLoadingIssues } = useQuery({
    queryKey: ['issues'],
    queryFn: async () => {
      const response = await fetch(`${API_URL}/api/issues`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch issues');
      }
      return response.json();
    },
  });

  const activeIssuesCount = issues?.filter((issue: Issue) => issue.status === 'Open' || issue.status === 'InProgress').length ?? 0;
  const totalIssues = issues?.length ?? 0;
  const completionRate = totalIssues === 0 ? 0 : Math.round(((totalIssues - activeIssuesCount) / totalIssues) * 100);

  return (
    <div className="flex flex-col w-full">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user?.username}</p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-6">
        {/* Tasks Card */}
        <div 
          onClick={() => navigate('/tasks')}
          className={cn(
            "bg-white p-6 rounded-lg shadow-md transition-all duration-200",
            "hover:shadow-lg hover:scale-[1.02] cursor-pointer"
          )}
        >
          <div className="flex items-center space-x-3">
            <TaskIcon />
            <div>
              <h3 className="text-lg font-semibold">Tasks</h3>
              {isLoadingTasks ? (
                <div className="h-8 w-16 bg-gray-200 animate-pulse rounded"></div>
              ) : (
                <p className="text-2xl">{tasks?.length ?? 0}</p>
              )}
            </div>
          </div>
        </div>

        {/* Active Issues Card */}
        <div 
          onClick={() => navigate('/issues')}
          className={cn(
            "bg-white p-6 rounded-lg shadow-md transition-all duration-200",
            "hover:shadow-lg hover:scale-[1.02] cursor-pointer"
          )}
        >
          <div className="flex items-center space-x-3">
            <IssueIcon />
            <div>
              <h3 className="text-lg font-semibold">Active Issues</h3>
              {isLoadingIssues ? (
                <div className="h-8 w-16 bg-gray-200 animate-pulse rounded"></div>
              ) : (
                <p className="text-2xl">{activeIssuesCount}</p>
              )}
            </div>
          </div>
        </div>

        {/* Completion Rate Card */}
        <div 
          onClick={() => navigate('/issues')}
          className={cn(
            "bg-white p-6 rounded-lg shadow-md transition-all duration-200",
            "hover:shadow-lg hover:scale-[1.02] cursor-pointer"
          )}
        >
          <div className="flex items-center space-x-3">
            <ChartIcon />
            <div>
              <h3 className="text-lg font-semibold">Completion Rate</h3>
              {isLoadingIssues ? (
                <div className="h-8 w-16 bg-gray-200 animate-pulse rounded"></div>
              ) : (
                <p className="text-2xl">{completionRate}%</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Training Section */}
      <div className="mt-8 w-full">
        <TrainingSection />
      </div>
    </div>
  );
}
