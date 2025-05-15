import React from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Home, 
  LogOut, 
  User, 
  Calendar, 
  DollarSign, 
  MapPin, 
  Clock, 
  UserCog, 
  CheckCircle, 
  Shield, 
  Key
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  const getNavLinks = () => {
    switch (user?.role) {
      case 'personnel':
        return [
          { to: '/personnel', label: 'Dashboard', icon: <Home size={20} /> },
          { to: '/personnel/duty-posts', label: 'Duty Posts', icon: <MapPin size={20} /> },
          { to: '/personnel/leave-requests', label: 'Leave Requests', icon: <Calendar size={20} /> },
          { to: '/personnel/salary', label: 'Salary', icon: <DollarSign size={20} /> },
          { to: '/personnel/loan-requests', label: 'Loan Requests', icon: <DollarSign size={20} /> },
          { to: '/personnel/overtime-requests', label: 'Overtime', icon: <Clock size={20} /> }
        ];
      case 'manager':
        return [
          { to: '/manager', label: 'Dashboard', icon: <Home size={20} /> },
          { to: '/manager/personnel', label: 'Personnel', icon: <User size={20} /> },
          { to: '/manager/assign-duty', label: 'Assign Duty', icon: <MapPin size={20} /> },
          { to: '/manager/leave-requests', label: 'Leave Requests', icon: <Calendar size={20} /> },
          { to: '/manager/loan-requests', label: 'Loan Requests', icon: <DollarSign size={20} /> }
        ];
      case 'admin':
        return [
          { to: '/admin', label: 'Dashboard', icon: <Home size={20} /> },
          { to: '/admin/users', label: 'User Management', icon: <UserCog size={20} /> },
          { to: '/admin/password-management', label: 'Password Management', icon: <Key size={20} /> }
        ];
      default:
        return [];
    }
  };
  
  const navLinks = getNavLinks();
  
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-green-900 text-white shadow-lg transition-all duration-300 ease-in-out">
        <div className="p-5 border-b border-green-800">
          <div className="flex items-center space-x-3">
            <Shield size={24} className="text-green-500" />
            <h1 className="text-xl font-bold">FUOYE Security Hub</h1>
          </div>
        </div>
        
        <div className="p-4">
          <div className="flex items-center space-x-3 mb-6 p-3 bg-green-800 rounded-lg">
            <div className="relative w-10 h-10 rounded-full overflow-hidden">
              <img
                src={user?.profileImage || 'https://images.pexels.com/photos/3785079/pexels-photo-3785079.jpeg'}
                alt="Profile"
                className="object-cover w-full h-full"
              />
            </div>
            <div>
              <p className="font-medium">{user?.name}</p>
              <p className="text-xs text-green-200 capitalize">{user?.role}</p>
            </div>
          </div>
          
          <nav>
            <ul className="space-y-1">
              {navLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className={`flex items-center space-x-3 p-3 rounded-lg transition-colors duration-200 hover:bg-green-800 ${
                      location.pathname === link.to ? 'bg-green-800 font-medium' : 'text-green-200'
                    }`}
                  >
                    {link.icon}
                    <span>{link.label}</span>
                  </Link>
                </li>
              ))}
              <li className="pt-6">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-3 p-3 rounded-lg text-green-200 transition-colors duration-200 hover:bg-red-700 hover:text-white"
                >
                  <LogOut size={20} />
                  <span>Logout</span>
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <header className="bg-white shadow-sm px-6 py-4 flex items-center justify-between">
          <h1 className="text-lg font-semibold text-gray-800">
            {navLinks.find((link) => link.to === location.pathname)?.label || 'Dashboard'}
          </h1>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <button className="relative p-2 rounded-full hover:bg-gray-100 transition-colors duration-200">
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                <CheckCircle size={20} className="text-gray-600" />
              </button>
            </div>
          </div>
        </header>
        
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
};

export default Layout;