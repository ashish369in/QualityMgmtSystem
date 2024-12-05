import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useIssues } from '../hooks/useIssues';
import { useUsers } from '../hooks/useUsers';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Skeleton } from '../components/ui/skeleton';
import { useToast } from '../components/ui/use-toast';
import { CreateTaskForm } from '../components/forms/CreateTaskForm';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog';
import { EditIssueForm } from '../components/forms/EditIssueForm';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import type { IssueStatus } from '../types/api';

export default function IssueDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const { users } = useUsers();
  const { useGetIssue, updateIssue } = useIssues();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const issueId = parseInt(id!, 10);
  const { data: issue, isLoading, error } = useGetIssue(issueId);

  useEffect(() => {
    if (error) {
      console.error('Error loading issue:', error);
      toast({
        title: 'Error',
        description: 'Failed to load issue details',
        variant: 'destructive',
      });
      navigate('/issues');
    }
  }, [error, navigate, toast]);

  if (isLoading) {
    return (
      <div className="flex justify-center min-h-screen bg-background">
        <div className="container max-w-[80%] py-6 space-y-6">
          <Card className="p-6 space-y-4">
            <Skeleton className="h-8 w-1/3" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-8 w-1/4" />
          </Card>
        </div>
      </div>
    );
  }

  if (!issue) {
    return null;
  }

  const canEdit = user?.userGroup === 'Quality' || user?.id === issue.creator.id;

  const handleUpdateIssue = async (data: { status?: IssueStatus }) => {
    console.log('Update data:', {
      id: issue.id,
      ...data,
    });

    try {
      await updateIssue.mutateAsync({
        id: issue.id,
        ...data,
      });
      setIsEditDialogOpen(false);
      toast({
        title: 'Success',
        description: 'Issue updated successfully',
      });
    } catch (error) {
      console.error('Error updating issue:', error);
      toast({
        title: 'Error',
        description: 'Failed to update issue',
        variant: 'destructive',
      });
    }
  };

  const handleStatusChange = async (data: { status?: IssueStatus }) => {
    try {
      await updateIssue.mutateAsync({
        id: issueId,
        ...data,
        updatedAt: new Date().toISOString()
      });
      toast({
        title: 'Success',
        description: 'Issue status updated successfully',
      });
    } catch (error) {
      console.error('Error updating issue:', error);
      toast({
        title: 'Error',
        description: 'Failed to update issue status',
        variant: 'destructive',
      });
    }
  };

  const getStatusColor = (status: any) => {
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

  return (
    <div className="flex justify-center min-h-screen bg-background">
      <div className="container max-w-[80%] py-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Issue Details</h1>
          <div className="flex gap-4">
            <Button variant="outline" onClick={() => navigate('/issues')}>
              Back to Issues
            </Button>
            {canEdit && (
              <Button onClick={() => setIsEditDialogOpen(true)}>Edit Issue</Button>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <Card className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h2 className="text-sm font-medium text-gray-500">Title</h2>
                  <p className="text-lg font-medium">{issue.title}</p>
                </div>
                <div>
                  <h2 className="text-sm font-medium text-gray-500">Description</h2>
                  <p className="text-gray-700">{issue.description}</p>
                </div>
                <div>
                  <h2 className="text-sm font-medium text-gray-500">Status</h2>
                  {canEdit ? (
                    <Select
                      value={issue.status}
                      onValueChange={(value: IssueStatus) =>
                        handleStatusChange({ status: value })
                      }
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Open">Open</SelectItem>
                        <SelectItem value="InProgress">In Progress</SelectItem>
                        <SelectItem value="Resolved">Resolved</SelectItem>
                        <SelectItem value="Closed">Closed</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <span
                      className={`inline-block px-3 py-1 text-sm rounded-full ${getStatusColor(
                        issue.status
                      )}`}
                    >
                      {issue.status}
                    </span>
                  )}
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <h2 className="text-sm font-medium text-gray-500">Created By</h2>
                  <p>{issue.creator.username}</p>
                </div>
                <div>
                  <h2 className="text-sm font-medium text-gray-500">Created At</h2>
                  <p>{new Date(issue.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <h2 className="text-sm font-medium text-gray-500">Updated At</h2>
                  <p>{new Date(issue.updatedAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </Card>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Tasks</h2>
              <CreateTaskForm issueId={issueId} users={users} />
            </div>
            <Card className="p-6">
              {issue.tasks && issue.tasks.length > 0 ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-4 gap-4 font-medium text-gray-500 border-b pb-2">
                    <div>Title</div>
                    <div>Status</div>
                    <div>Assignee</div>
                    <div>Due Date</div>
                  </div>
                  <div className="space-y-2">
                    {issue.tasks.map((task) => (
                      <div
                        key={task.id}
                        className="grid grid-cols-4 gap-4 p-4 hover:bg-accent/50 rounded-lg transition-colors"
                      >
                        <div className="font-medium">{task.title}</div>
                        <div>
                          <span
                            className={`inline-block px-3 py-1 text-sm rounded-full ${getStatusColor(
                              task.status
                            )}`}
                          >
                            {task.status}
                          </span>
                        </div>
                        <div>{task.assignee?.username || 'Unassigned'}</div>
                        <div>
                          {task.dueDate
                            ? new Date(task.dueDate).toLocaleDateString()
                            : 'No due date'}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-center text-gray-500">No tasks found</p>
              )}
            </Card>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Related Defects</h2>
            </div>
            <Card className="p-6">
              {issue.defects && issue.defects.length > 0 ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-4 gap-4 font-medium text-gray-500 border-b pb-2">
                    <div>Title</div>
                    <div>Status</div>
                    <div>Creator</div>
                    <div>Created At</div>
                  </div>
                  <div className="space-y-2">
                    {issue.defects.map((defect) => (
                      <div
                        key={defect.id}
                        className="grid grid-cols-4 gap-4 p-4 hover:bg-accent/50 rounded-lg transition-colors"
                      >
                        <div className="font-medium">{defect.title}</div>
                        <div>
                          <span
                            className={`inline-block px-3 py-1 text-sm rounded-full ${getStatusColor(
                              defect.status
                            )}`}
                          >
                            {defect.status}
                          </span>
                        </div>
                        <div>{defect.creator.username}</div>
                        <div>
                          {new Date(defect.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-center text-gray-500">No defects found</p>
              )}
            </Card>
          </div>
        </div>

        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Issue</DialogTitle>
            </DialogHeader>
            <EditIssueForm 
              issue={issue} 
              onSubmit={handleUpdateIssue}
              onClose={() => setIsEditDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
