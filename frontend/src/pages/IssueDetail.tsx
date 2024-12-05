import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useIssues } from '../hooks/useIssues';
import { useUsers } from '../hooks/useUsers';
import { useAuth } from '../hooks/useAuth';
import { useDefects } from '../hooks/useDefects';
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

export default function IssueDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const { users } = useUsers();
  const { useGetIssue, updateIssue } = useIssues();
  const { defects } = useDefects();
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
      <div className="space-y-4 p-4">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  if (!issue) {
    return null;
  }

  const canEdit = user?.role === 'Quality' || user?.id === issue.creator.id;

  const handleUpdateIssue = async (data: any) => {
    console.log('Update data:', {
      id: issue.id,
      ...data
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
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{issue.title}</h1>
        <div className="space-x-2">
          {canEdit && (
            <Button onClick={() => setIsEditDialogOpen(true)}>Edit Issue</Button>
          )}
          <Button variant="outline" onClick={() => navigate('/issues')}>
            Back to Issues
          </Button>
        </div>
      </div>

      <Card className="p-6 space-y-4">
        <div>
          <h2 className="text-lg font-semibold">Description</h2>
          <p className="mt-2 text-gray-700">{issue.description}</p>
        </div>

        <div>
          <h2 className="text-lg font-semibold">Status</h2>
          {canEdit ? (
            <div className="mt-2">
              <Select
                value={issue.status}
                onValueChange={async (newStatus) => {
                  try {
                    await updateIssue.mutateAsync({
                      id: issue.id,
                      status: newStatus,
                    });
                    toast({
                      title: 'Success',
                      description: 'Issue status updated successfully',
                    });
                  } catch (error) {
                    console.error('Error updating issue status:', error);
                    toast({
                      title: 'Error',
                      description: 'Failed to update issue status',
                      variant: 'destructive',
                    });
                  }
                }}
              >
                <SelectTrigger className="w-[200px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Open">Open</SelectItem>
                  <SelectItem value="InProgress">In Progress</SelectItem>
                  <SelectItem value="ReadyForClosure">Ready for Closure</SelectItem>
                  <SelectItem value="Closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          ) : (
            <span className={`mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(issue.status)}`}>
              {issue.status}
            </span>
          )}
        </div>

        <div>
          <h2 className="text-lg font-semibold">Created By</h2>
          <p className="mt-2 text-gray-700">{issue.creator.username}</p>
        </div>

        <div>
          <h2 className="text-lg font-semibold">Related Defects</h2>
          <div className="mt-2 space-y-2">
            {issue.defectIds && issue.defectIds.length > 0 ? (
              issue.defectIds.map((defectId) => {
                const defect = defects?.find(d => d.id === defectId);
                return defect ? (
                  <div key={defect.id} className="p-3 border rounded-lg">
                    <h3 className="font-medium">{defect.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">{defect.description}</p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-sm text-gray-500">Status: {defect.status}</span>
                      <span className="text-sm text-gray-500">Created by: {defect.creator.username}</span>
                    </div>
                  </div>
                ) : null;
              })
            ) : (
              <p className="text-gray-500">No defects linked to this issue</p>
            )}
          </div>
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Tasks</h3>
          {issue && (
            <CreateTaskForm 
              issue={issue} 
              users={users || []} 
            />
          )}
        </div>
        <div className="space-y-4">
          {issue.tasks && issue.tasks.length > 0 ? (
            issue.tasks.map((task) => (
              <div
                key={task.id}
                className="p-3 border rounded-lg relative"
              >
                <div className="absolute top-3 right-3">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(task.status)}`}>
                    {task.status}
                  </span>
                </div>
                <div className="pr-24">
                  <h4 className="font-medium">{task.title}</h4>
                  <p className="text-sm text-gray-500">{task.description}</p>
                  <div className="mt-1 text-sm text-gray-500">
                    <span>Assignee: {task.assignee.username}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No tasks for this issue</p>
          )}
        </div>
      </Card>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Issue</DialogTitle>
          </DialogHeader>
          {issue && (
            <EditIssueForm
              issue={issue}
              onSubmit={handleUpdateIssue}
              onClose={() => setIsEditDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
