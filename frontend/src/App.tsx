import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Login from './pages/Login';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard';
import DefectList from './pages/DefectList';
import IssueList from './pages/IssueList';
import TaskList from './pages/TaskList';
import TaskDetail from './pages/TaskDetail';
import UserManagement from './pages/UserManagement';
import IssueDetail from './pages/IssueDetail';
import { AuthProvider } from './contexts/AuthContext';
import { UserProvider } from './components/UserProvider';
import { RoleGuard } from './components/RoleGuard';
import { Toaster } from "./components/ui/toaster";
import { ProtectedRoute } from './components/ProtectedRoute';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0,
      refetchOnWindowFocus: false,
    },
  },
});

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="issues" element={<IssueList />} />
        <Route path="issues/:id" element={<IssueDetail />} />
        <Route path="defects" element={<DefectList />} />
        <Route path="tasks" element={<TaskList />} />
        <Route path="tasks/:id" element={<TaskDetail />} />
        <Route
          path="users"
          element={
            <RoleGuard allowedRoles={['Admin']}>
              <UserManagement />
            </RoleGuard>
          }
        />
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthProvider>
          <UserProvider>
            <AppRoutes />
          </UserProvider>
        </AuthProvider>
      </Router>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;