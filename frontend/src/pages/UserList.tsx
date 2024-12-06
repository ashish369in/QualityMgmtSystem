import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../hooks/useAuth';
import type { User } from '../types/api';
import { Card } from '../components/ui/card';
import { apiClient } from '../api/client';

const UserList = () => {
  const { data: users, isLoading, error } = useQuery<User[]>({
    queryKey: ['users'],
    queryFn: apiClient.getUsers,
  });

  if (isLoading) {
    return <div className="p-4">Loading users...</div>;
  }

  if (error) {
    return <div className="p-4">Error loading users</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Users</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {users?.map((user) => (
          <Card key={user.id} className="p-4">
            <div className="space-y-2">
              <div className="font-medium">{user.username}</div>
              <div className="text-sm text-muted-foreground">{user.email}</div>
              <div className="text-sm">
                <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-primary/10 text-primary">
                  {user.role}
                </span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {!users?.length && (
        <div className="p-4 text-center text-muted-foreground">
          No users found
        </div>
      )}
    </div>
  );
};

export default UserList;
