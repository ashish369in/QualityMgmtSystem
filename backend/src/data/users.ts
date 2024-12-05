import { User, UserGroup } from '../types/user';

// Mock users data (replace with database later)
export const users: User[] = [
  { 
    id: 1, 
    username: 'admin',
    email: 'admin@example.com',
    userGroup: UserGroup.ADMIN,
    createdAt: new Date(),
  },
  { 
    id: 2, 
    username: 'qualityuser',
    email: 'quality@example.com',
    userGroup: UserGroup.QUALITY,
    createdAt: new Date(),
  },
  { 
    id: 3, 
    username: 'user',
    email: 'user@example.com',
    userGroup: UserGroup.USER,
    createdAt: new Date(),
  },
];

// Helper functions
export const findUser = (id: number): User | undefined => {
  return users.find(user => user.id === id);
};

export const findUserByUsername = (username: string): User | undefined => {
  return users.find(user => user.username === username);
};

export const addUser = (user: User): User => {
  users.push(user);
  return user;
};

export const updateUser = (id: number, updatedUser: Partial<User>): User | undefined => {
  const index = users.findIndex(user => user.id === id);
  if (index === -1) return undefined;

  users[index] = { ...users[index], ...updatedUser };
  return users[index];
};

export const deleteUser = (id: number): boolean => {
  const index = users.findIndex(user => user.id === id);
  if (index === -1) return false;

  users.splice(index, 1);
  return true;
};
