import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  Heart,
  ClipboardList,
  Settings,
  LogOut,
  Activity,
  FolderOpen
} from 'lucide-react';
import { Button } from './ui/button';

interface SidebarProps {
  role: 'admin' | 'bk';
}

export const DashboardSidebar: React.FC<SidebarProps> = ({ role }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const adminMenuItems = [
    { 
      icon: LayoutDashboard, 
      label: 'Dashboard', 
      path: '/admin',
      active: location.pathname === '/admin'
    },
    { 
      icon: Users, 
      label: 'Manajemen User', 
      path: '/admin/users',
      active: location.pathname === '/admin/users'
    },
    { 
      icon: FileText, 
      label: 'Laporan Sistem', 
      path: '/admin/reports',
      active: location.pathname === '/admin/reports'
    },
    { 
      icon: Activity, 
      label: 'Statistik', 
      path: '/admin/statistics',
      active: location.pathname === '/admin/statistics'
    },
  ];

  const bkMenuItems = [
    { 
      icon: LayoutDashboard, 
      label: 'Dashboard', 
      path: '/bk',
      active: location.pathname === '/bk'
    },
    { 
      icon: Heart, 
      label: 'Kasus Mahasiswa', 
      path: '/bk/cases',
      active: location.pathname === '/bk/cases'
    },
    { 
      icon: FolderOpen, 
      label: 'Rekam Medis', 
      path: '/bk',
      active: false
    },
    { 
      icon: ClipboardList, 
      label: 'Jadwal Konseling', 
      path: '/bk/schedule',
      active: location.pathname === '/bk/schedule'
    },
  ];

  const menuItems = role === 'admin' ? adminMenuItems : bkMenuItems;
  const headerColor = role === 'admin' ? 'bg-blue-600' : 'bg-purple-600';
  const activeColor = role === 'admin' 
    ? 'bg-blue-100 text-blue-900 border-l-4 border-blue-600' 
    : 'bg-purple-100 text-purple-900 border-l-4 border-purple-600';

  return (
    <div className="w-64 bg-white shadow-xl h-screen flex flex-col sticky top-0">
      {/* Header */}
      <div className={`${headerColor} text-white p-6`}>
        <h2 className="text-xl font-bold mb-1">
          {role === 'admin' ? 'Admin Panel' : 'BK Panel'}
        </h2>
        <p className="text-sm opacity-90">{user?.name}</p>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 py-6 overflow-y-auto">
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <Link
              key={index}
              to={item.path}
              className={`flex items-center gap-3 px-6 py-3 transition-all hover:bg-gray-50 ${
                item.active ? activeColor : 'text-gray-700'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div className="p-6 border-t border-gray-200 space-y-2">
        <Button
          variant="outline"
          className="w-full justify-start"
          onClick={() => navigate('/')}
        >
          <Settings className="w-4 h-4 mr-2" />
          Pengaturan
        </Button>
        <Button
          variant="destructive"
          className="w-full justify-start"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </div>
    </div>
  );
};