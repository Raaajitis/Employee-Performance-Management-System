import React, { useState, useContext } from 'react';
import { Link, useNavigate, useLocation, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { 
  Users, 
  FolderKanban, 
  CalendarCheck, 
  Award, 
  LogOut, 
  Menu, 
  X, 
  Sun, 
  Moon, 
  LayoutDashboard,
  UserCheck,
  User
} from 'lucide-react';

const Layout = () => {
  const { user, logout, theme, toggleTheme } = useContext(AuthContext);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Define sidebar links based on user role
  const getSidebarLinks = () => {
    switch (user?.role) {
      case 'ADMIN':
        return [
          { path: '/admin/dashboard', name: 'Dashboard', icon: LayoutDashboard },
          { path: '/admin/employees', name: 'Employees', icon: Users },
          { path: '/admin/projects', name: 'Projects', icon: FolderKanban },
          { path: '/admin/attendance', name: 'Attendance', icon: CalendarCheck },
        ];
      case 'MANAGER':
        return [
          { path: '/manager/dashboard', name: 'Dashboard', icon: LayoutDashboard },
          { path: '/manager/attendance', name: 'Team Attendance', icon: CalendarCheck },
          { path: '/manager/reviews', name: 'Performance Reviews', icon: Award },
        ];
      case 'EMPLOYEE':
        return [
          { path: '/employee/dashboard', name: 'Dashboard', icon: LayoutDashboard },
          { path: '/employee/attendance', name: 'Mark Attendance', icon: CalendarCheck },
          { path: '/employee/performance', name: 'My Performance', icon: Award },
        ];
      default:
        return [];
    }
  };

  const links = getSidebarLinks();

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950 transition-colors duration-200">
      
      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex flex-col w-64 glass border-r dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 p-4 fixed h-full z-20">
        <div className="flex items-center gap-3 px-2 py-4 mb-6">
          <div className="bg-brand-600 text-white p-2 rounded-xl shadow-lg shadow-brand-500/20">
            <Award size={24} />
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight tracking-tight text-slate-800 dark:text-slate-100">EPMS Portal</h1>
            <span className="text-xs text-brand-600 dark:text-brand-400 font-semibold uppercase tracking-wider">{user?.role}</span>
          </div>
        </div>

        <nav className="flex-1 flex flex-col gap-1.5">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-3 px-3.5 py-3 rounded-xl transition-all duration-200 group text-sm font-medium ${
                  isActive 
                    ? 'bg-brand-600 text-white shadow-md shadow-brand-600/10' 
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100'
                }`}
              >
                <Icon size={18} className={`transition-transform duration-200 group-hover:scale-105 ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-slate-700 dark:group-hover:text-slate-300'}`} />
                {link.name}
              </Link>
            );
          })}
        </nav>

        <div className="border-t dark:border-slate-800 pt-4 mt-auto flex flex-col gap-2">
          <div className="flex items-center gap-3 px-2 py-2">
            <div className="w-9 h-9 rounded-full bg-brand-100 dark:bg-brand-950 flex items-center justify-center text-brand-700 dark:text-brand-300 font-bold border border-brand-200 dark:border-brand-900">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate text-slate-800 dark:text-slate-200">{user?.name}</p>
              <p className="text-xs text-slate-500 truncate dark:text-slate-400">{user?.email}</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 text-sm font-medium transition-colors"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Sidebar for Mobile */}
      <div className={`md:hidden fixed inset-0 z-50 transition-opacity duration-300 bg-black/40 ${sidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} onClick={() => setSidebarOpen(false)}>
        <aside 
          className={`w-64 max-w-xs h-full bg-white dark:bg-slate-900 border-r dark:border-slate-800 flex flex-col p-4 transition-transform duration-300 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between px-2 py-3 mb-6">
            <div className="flex items-center gap-3">
              <div className="bg-brand-600 text-white p-2 rounded-xl">
                <Award size={20} />
              </div>
              <h1 className="font-bold text-lg text-slate-800 dark:text-slate-100">EPMS Portal</h1>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="text-slate-600 dark:text-slate-400 p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">
              <X size={20} />
            </button>
          </div>

          <nav className="flex-1 flex flex-col gap-1.5">
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-medium transition-all ${
                    isActive 
                      ? 'bg-brand-600 text-white shadow-md' 
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Icon size={18} />
                  {link.name}
                </Link>
              );
            })}
          </nav>

          <div className="border-t dark:border-slate-800 pt-4 mt-auto">
            <div className="flex items-center gap-3 px-2 py-2 mb-3">
              <div className="w-9 h-9 rounded-full bg-brand-100 dark:bg-brand-900 flex items-center justify-center text-brand-700 dark:text-brand-300 font-bold">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{user?.name}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 text-sm font-medium transition-colors"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </aside>
      </div>

      {/* Main Container */}
      <div className="flex-1 flex flex-col md:pl-64 min-w-0">
        
        {/* Header */}
        <header className="sticky top-0 z-10 glass border-b dark:border-slate-800 bg-white/70 dark:bg-slate-950/70 h-16 flex items-center justify-between px-4 md:px-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
            >
              <Menu size={20} />
            </button>
            <h2 className="font-semibold text-slate-800 dark:text-slate-100 hidden sm:block">
              Welcome back, {user?.name}!
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all duration-200"
              aria-label="Toggle Theme"
            >
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>
            <div className="h-6 w-px bg-slate-200 dark:bg-slate-800" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-brand-500 text-white flex items-center justify-center font-bold text-sm">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300 hidden md:block">{user?.name}</span>
            </div>
          </div>
        </header>

        {/* Content Wrapper */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto animate-fade-in">
            <Outlet />
          </div>
        </main>

      </div>
    </div>
  );
};

export default Layout;
