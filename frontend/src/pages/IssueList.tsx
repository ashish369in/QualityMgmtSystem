import { useIssues } from '../hooks/useIssues';
import type { Issue } from '../types/api';
import { CreateIssueForm } from '../components/forms/CreateIssueForm';
import { Link } from 'react-router-dom';

const IssueList = () => {
  const { issues, isLoading } = useIssues();

  if (isLoading) {
    return <div className="p-4">Loading issues...</div>;
  }

  const getStatusColor = (status: Issue['status']) => {
    switch (status) {
      case 'Open':
        return 'bg-blue-100 text-blue-800';
      case 'InProgress':
        return 'bg-yellow-100 text-yellow-800';
      case 'ReadyForClosure':
        return 'bg-green-100 text-green-800';
      case 'Closed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Issues</h1>
        <CreateIssueForm />
      </div>

      <div className="border rounded-lg">
        <div className="grid grid-cols-7 gap-4 p-4 font-medium border-b bg-muted">
          <div>Title</div>
          <div>Description</div>
          <div>Status</div>
          <div>Creator</div>
          <div>Created At</div>
          <div>Defects</div>
          <div>Tasks</div>
        </div>

        {issues?.map((issue) => (
          <Link
            key={issue.id}
            to={`/issues/${issue.id}`}
            className="block hover:bg-accent/50 transition-colors"
          >
            <div className="grid grid-cols-7 gap-4 p-4 border-b hover:bg-muted/50">
              <div>{issue.title}</div>
              <div className="truncate">{issue.description}</div>
              <div>
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(
                    issue.status
                  )}`}
                >
                  {issue.status}
                </span>
              </div>
              <div>{issue.creator.username}</div>
              <div>{new Date(issue.createdAt).toLocaleDateString()}</div>
              <div>
                <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-primary/10 text-primary">
                  {issue.defectIds?.length || 0} defects
                </span>
              </div>
              <div>
                <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-primary/10 text-primary">
                  {issue.tasks.length} tasks
                </span>
              </div>
            </div>
          </Link>
        ))}

        {!issues?.length && (
          <div className="p-4 text-center text-muted-foreground">
            No issues found
          </div>
        )}
      </div>
    </div>
  );
};

export default IssueList;
