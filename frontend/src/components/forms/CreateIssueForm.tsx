import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { useIssues } from '../../hooks/useIssues';
import { useDefects } from '../../hooks/useDefects';
import { issueSchema, type IssueFormData } from '../../schemas/issue';
import { toast } from '../ui/use-toast';

export function CreateIssueForm() {
  const [open, setOpen] = useState(false);
  const { createIssue } = useIssues();
  const { defects } = useDefects();
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<IssueFormData>({
    resolver: zodResolver(issueSchema),
    defaultValues: {
      title: '',
      description: '',
      defectIds: [],
    },
  });

  const onSubmit = async (data: IssueFormData) => {
    try {
      // Convert defectIds from string array to number array
      const formattedData = {
        ...data,
        defectIds: data.defectIds.map(id => Number(id)),
      };
      
      console.log('Creating issue with data:', formattedData);
      await createIssue.mutateAsync(formattedData);
      toast({
        title: 'Success',
        description: 'Issue created successfully',
        variant: 'default',
      });
      setOpen(false);
      reset();
    } catch (error) {
      console.error('Failed to create issue:', error);
      toast({
        title: 'Error',
        description: 'Failed to create issue',
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90">
          Create Issue
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create New Issue</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input
              {...register('title')}
              className="w-full rounded-md border border-input bg-background px-3 py-2"
              placeholder="Enter issue title"
            />
            {errors.title && (
              <p className="text-sm text-destructive mt-1">{errors.title.message}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              {...register('description')}
              className="w-full rounded-md border border-input bg-background px-3 py-2 min-h-[100px]"
              placeholder="Enter issue description"
            />
            {errors.description && (
              <p className="text-sm text-destructive mt-1">{errors.description.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Related Defects</label>
            <div className="max-h-[200px] overflow-y-auto border rounded-md p-2">
              {defects?.map((defect) => (
                <label key={defect.id} className="flex items-center space-x-2 p-2 hover:bg-muted">
                  <input
                    type="checkbox"
                    value={defect.id}
                    {...register('defectIds')}
                    className="rounded border-gray-300"
                  />
                  <span>{defect.title}</span>
                </label>
              ))}
            </div>
            {errors.defectIds && (
              <p className="text-sm text-destructive mt-1">{errors.defectIds.message}</p>
            )}
          </div>

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="px-4 py-2 border rounded-md hover:bg-muted"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50"
            >
              {isSubmitting ? 'Creating...' : 'Create Issue'}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
