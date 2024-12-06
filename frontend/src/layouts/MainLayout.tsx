import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';

export default function MainLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const navigation = [
    { name: 'Dashboard', href: '/' },
    { name: 'Issues', href: '/issues' },
    { name: 'Defects', href: '/defects' },
    { name: 'Tasks', href: '/tasks' },
  ];

  if (user?.userGroup === 'Quality') {
    navigation.push({ name: 'Users', href: '/users' });
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm w-full">
        <div className="max-w-[80%] mx-auto px-4">
          <div className="flex h-16 justify-between">
            <div className="flex">
              <div className="flex flex-shrink-0 items-center">
                <span className="text-xl font-bold text-gray-900">QMS</span>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                {navigation.map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                      location.pathname === item.href
                        ? 'border-b-2 border-indigo-500 text-gray-900'
                        : 'text-gray-500 hover:border-b-2 hover:border-gray-300 hover:text-gray-700'
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-700">
                {user ? (
                  <span>
                    {user.username} ({user.userGroup})
                  </span>
                ) : null}
              </div>
              <Button
                onClick={handleLogout}
                variant="ghost"
                className="text-sm font-medium text-gray-700 hover:text-gray-800"
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>
      <main className="py-6">
        <div className="max-w-[80%] mx-auto px-4">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
