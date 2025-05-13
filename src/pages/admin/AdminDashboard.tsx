import React from 'react';
import { 
  Users, 
  Shield, 
  Key, 
  UserPlus 
} from 'lucide-react';
import Layout from '../../components/Layout';
import DashboardCard from '../../components/DashboardCard';
import { useAppContext } from '../../context/AppContext';
import { Personnel } from '../../types';

const AdminDashboard: React.FC = () => {
  const { 
    personnel, 
    managers, 
    admins 
  } = useAppContext();
  
  // Calculate stats
  const totalUsers = personnel.length + managers.length + admins.length;
  
  // Find newest personnel
  const getNewestPersonnel = () => {
    return [...personnel].sort((a, b) => 
      new Date(b.joiningDate).getTime() - new Date(a.joiningDate).getTime()
    ).slice(0, 3);
  };
  
  const newestPersonnel = getNewestPersonnel();
  
  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Manage system users and security personnel.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <DashboardCard
          title="Total Users"
          count={totalUsers.toString()}
          icon={<Users size={24} />}
          to="/admin/users"
          color="blue"
        />
        
        <DashboardCard
          title="Personnel"
          count={personnel.length.toString()}
          icon={<Shield size={24} />}
          to="/admin/users"
          color="green"
        />
        
        <DashboardCard
          title="Managers"
          count={managers.length.toString()}
          icon={<Shield size={24} />}
          to="/admin/users"
          color="purple"
        />
        
        <DashboardCard
          title="Admins"
          count={admins.length.toString()}
          icon={<Shield size={24} />}
          to="/admin/users"
          color="red"
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-800">Recent Personnel</h3>
              <a 
                href="/admin/users" 
                className="text-sm font-medium text-blue-600 hover:text-blue-900"
              >
                View All
              </a>
            </div>
          </div>
          
          <div className="divide-y divide-gray-200">
            {newestPersonnel.map((person: Personnel) => (
              <div key={person.id} className="px-6 py-4 flex items-center">
                <div className="h-10 w-10 rounded-full overflow-hidden">
                  <img src={person.profileImage} alt={person.name} className="h-full w-full object-cover" />
                </div>
                
                <div className="ml-4 flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">{person.name}</h4>
                      <p className="text-sm text-gray-500">{person.email}</p>
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-500">
                      <p>{new Date(person.joiningDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {newestPersonnel.length === 0 && (
              <div className="px-6 py-4 text-center text-gray-500">
                No personnel found.
              </div>
            )}
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h3 className="text-lg font-medium text-gray-800">Quick Actions</h3>
          </div>
          
          <div className="p-6 space-y-4">
            <a 
              href="/admin/users"
              className="group block p-4 rounded-lg border border-gray-200 hover:border-blue-200 hover:bg-blue-50 transition-all duration-200"
            >
              <div className="flex items-center">
                <div className="p-2 rounded-lg bg-blue-100 text-blue-700 group-hover:bg-blue-200">
                  <UserPlus size={20} />
                </div>
                <div className="ml-3">
                  <h4 className="text-sm font-medium text-gray-900">Add New Personnel</h4>
                  <p className="text-xs text-gray-500">Register new security personnel</p>
                </div>
              </div>
            </a>
            
            <a 
              href="/admin/password-management"
              className="group block p-4 rounded-lg border border-gray-200 hover:border-purple-200 hover:bg-purple-50 transition-all duration-200"
            >
              <div className="flex items-center">
                <div className="p-2 rounded-lg bg-purple-100 text-purple-700 group-hover:bg-purple-200">
                  <Key size={20} />
                </div>
                <div className="ml-3">
                  <h4 className="text-sm font-medium text-gray-900">Password Management</h4>
                  <p className="text-xs text-gray-500">Change passwords for users</p>
                </div>
              </div>
            </a>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;