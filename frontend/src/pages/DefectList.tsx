import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../hooks/useAuth';
import type { Defect } from '../types/api';
import { Card } from '../components/ui/card';
import { apiClient } from '../api/client';
import { CreateDefectForm } from '../components/forms/CreateDefectForm';
import { useToast } from '../components/ui/use-toast';

const DefectList = () => {
  const { data: defects, isLoading, error } = useQuery<Defect[]>({
    queryKey: ['defects'],
    queryFn: apiClient.getDefects,
  });
  const { toast } = useToast();

  const handleStatusChange = async (id: number, newStatus: string) => {
    try {
      await apiClient.updateDefect({ id, data: { status: newStatus } });
      toast({
        title: "Status Updated",
        description: `Defect status has been updated to ${newStatus}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update defect status",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <div className="p-4">Loading defects...</div>;
  }

  if (error) {
    return <div className="p-4">Error loading defects</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Defects</h1>
        <CreateDefectForm />
      </div>

      <div className="border rounded-lg">
        <div className="grid grid-cols-5 gap-4 p-4 font-medium border-b bg-muted">
          <div>Title</div>
          <div>Description</div>
          <div>Status</div>
          <div>Creator</div>
          <div>Created At</div>
        </div>

        {defects?.map((defect) => (
          <div key={defect.id} className="grid grid-cols-5 gap-4 p-4 border-b hover:bg-muted/50">
            <div>{defect.title}</div>
            <div className="truncate">{defect.description}</div>
            <div>
              <select
                value={defect.status}
                onChange={(e) => handleStatusChange(defect.id, e.target.value as string)}
                className="w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm"
              >
                <option value="New">New</option>
                <option value="Working">Working</option>
                <option value="Resolved">Resolved</option>
              </select>
            </div>
            <div>{defect.creator.username}</div>
            <div>{new Date(defect.createdAt).toLocaleDateString()}</div>
          </div>
        ))}

        {!defects?.length && (
          <div className="p-4 text-center text-muted-foreground">
            No defects found
          </div>
        )}
      </div>
    </div>
  );
};

export default DefectList;
