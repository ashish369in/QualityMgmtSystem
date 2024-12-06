import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../components/ui/use-toast';
import { CreateUserForm } from '../components/forms/CreateUserForm';
import type { User, UserGroup } from '../types/api';
import { apiClient } from '../api/client';
import { Trash2 } from 'lucide-react';

const UserManagement = () => {
  const queryClient = useQueryClient();
  const { user: currentUser } = useAuth();
  const [deleteConfirmation, setDeleteConfirmation] = useState<number | null>(null);
  const { toast } = useToast();

  const { data: users, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: apiClient.getUsers,
  });

  const updateUser = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<User> }) =>
      apiClient.updateUser({ id, data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: (userId: number) => apiClient.deleteUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  if (isLoading) {
    return <div className="p-4">Loading users...</div>;
  }

  const handleGroupChange = async (user: User, newGroup: UserGroup) => {
    try {
      await updateUser.mutateAsync({
        id: user.id,
        data: { userGroup: newGroup },
      });
      toast({
        title: "User Updated",
        description: `${user.username}'s group has been updated to ${newGroup}`,
      });
    } catch (error) {
      console.error('Failed to update user group:', error);
      toast({
        title: "Update Failed",
        description: "There was an error updating the user's group.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteClick = (userId: number) => {
    setDeleteConfirmation(userId);
  };

  const confirmDelete = async (userId: number) => {
    try {
      await deleteUserMutation.mutateAsync(userId);
      setDeleteConfirmation(null);
      toast({
        title: "User Deleted",
        description: "The user has been successfully deleted.",
      });
    } catch (error) {
      console.error('Failed to delete user:', error);
      toast({
        title: "Delete Failed",
        description: "There was an error deleting the user.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">User Management</h1>
        <CreateUserForm />
      </div>

      <div className="bg-white shadow-sm rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Username
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Group
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users?.map((user: User) => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {user.username}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <select
                    value={user.userGroup}
                    onChange={(e) => handleGroupChange(user, e.target.value as UserGroup)}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                    disabled={user.id === currentUser?.id}
                  >
                    <option value="User">User</option>
                    <option value="Quality">Quality</option>
                    <option value="Admin">Admin</option>
                  </select>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.id !== currentUser?.id && (
                    <div className="flex items-center space-x-4">
                      {deleteConfirmation === user.id ? (
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => confirmDelete(user.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Confirm
                          </button>
                          <button
                            onClick={() => setDeleteConfirmation(null)}
                            className="text-gray-600 hover:text-gray-900"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleDeleteClick(user.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;
