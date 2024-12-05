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
import { AuthProvider } from './components/AuthProvider';
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

function App() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <Router>
          <AuthProvider>
            <UserProvider>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route element={<ProtectedRoute />}>
                  <Route element={<MainLayout />}>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/defects" element={<DefectList />} />
                    <Route path="/issues" element={<IssueList />} />
                    <Route path="/issues/:id" element={<IssueDetail />} />
                    <Route path="/tasks" element={<TaskList />} />
                    <Route path="/tasks/:id" element={<TaskDetail />} />
                    <Route
                      path="/users"
                      element={
                        <RoleGuard allowedRoles={['Quality', 'Admin']}>
                          <UserManagement />
                        </RoleGuard>
                      }
                    />
                  </Route>
                </Route>
              </Routes>
            </UserProvider>
          </AuthProvider>
        </Router>
      </QueryClientProvider>
      <Toaster />
    </>
  );
}

export default App;
