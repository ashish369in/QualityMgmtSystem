import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Issue } from '../../types/api';
import { useDefects } from '../../hooks/useDefects';

const issueFormSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  status: z.enum(['Open', 'InProgress', 'ReadyForClosure', 'Closed']),
  defectIds: z.array(z.number()),
});

type FormData = z.infer<typeof issueFormSchema>;

interface EditIssueFormProps {
  issue: Issue;
  onSubmit: (data: FormData) => void;
  onClose: () => void;
}

export function EditIssueForm({ issue, onSubmit, onClose }: EditIssueFormProps) {
  const { defects } = useDefects();
  
  const form = useForm<FormData>({
    resolver: zodResolver(issueFormSchema),
    defaultValues: {
      title: issue.title,
      description: issue.description,
      status: issue.status,
      defectIds: issue.defectIds || [],
    },
  });

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Open">Open</SelectItem>
                    <SelectItem value="InProgress">In Progress</SelectItem>
                    <SelectItem value="ReadyForClosure">Ready for Closure</SelectItem>
                    <SelectItem value="Closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="defectIds"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Related Defects</FormLabel>
                <div className="max-h-[200px] overflow-y-auto border rounded-md p-2">
                  {defects?.map((defect) => (
                    <div key={defect.id} className="flex items-center space-x-2 p-2 hover:bg-muted">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300"
                        id={`defect-${defect.id}`}
                        checked={field.value?.includes(defect.id)}
                        onChange={(e) => {
                          const currentIds = field.value || [];
                          const newIds = e.target.checked
                            ? [...currentIds, defect.id]
                            : currentIds.filter((id) => id !== defect.id);
                          field.onChange(newIds);
                        }}
                      />
                      <div className="space-y-1 leading-none">
                        <label
                          htmlFor={`defect-${defect.id}`}
                          className="text-sm font-medium"
                        >
                          {defect.title}
                        </label>
                        <p className="text-sm text-muted-foreground">
                          {defect.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
