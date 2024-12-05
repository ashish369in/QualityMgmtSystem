import { z } from 'zod';

export const issueSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  defectIds: z.array(z.string()).transform(ids => ids.map(Number)).default([]),
});

export type IssueFormData = z.infer<typeof issueSchema>;
