import React from 'react';
import { 
  MapPin, 
  Calendar, 
  DollarSign, 
  Clock, 
  User
} from 'lucide-react';
import Layout from '../../components/Layout';
import DashboardCard from '../../components/DashboardCard';
import { useAuth } from '../../context/AuthContext';
import { useAppContext } from '../../context/AppContext';

const PersonnelDashboard: React.FC = () => {
  const { user } = useAuth();
  const { 
    dutyPosts, 
    dutyAssignments, 
    leaveRequests, 
    loanRequests, 
    overtimeRequests,
    personnel
  } = useAppContext();
  
  // Get personnel details
  const personnelDetails = personnel.find(p => p.id === user?.id);
  
  // Get personnel's duty assignment
  const dutyAssignment = dutyAssignments.find(da => da.personnelId === user?.id);
  const dutyPost = dutyAssignment 
    ? dutyPosts.find(dp => dp.id === dutyAssignment.dutyPostId) 
    : null;
  
  // Count requests
  const pendingLeaveRequests = leaveRequests.filter(
    lr => lr.personnelId === user?.id && lr.status === 'pending'
  ).length;
  
  const pendingLoanRequests = loanRequests.filter(
    lr => lr.personnelId === user?.id && lr.status === 'pending'
  ).length;
  
  const pendingOvertimeRequests = overtimeRequests.filter(
    or => or.personnelId === user?.id && or.status === 'pending'
  ).length;
  
  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Welcome, {user?.name}</h1>
        <p className="text-gray-600">Here's what's happening with your account today.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <DashboardCard
          title="Current Duty Post"
          count={dutyPost?.name || 'None Assigned'}
          icon={<MapPin size={24} />}
          to="/personnel/duty-posts"
          color="blue"
        />
        
        <DashboardCard
          title="Leave Requests"
          count={pendingLeaveRequests.toString()}
          icon={<Calendar size={24} />}
          to="/personnel/leave-requests"
          color="green"
        />
        
        <DashboardCard
          title="Monthly Salary"
          count={`$${personnelDetails?.salary || 0}`}
          icon={<DollarSign size={24} />}
          to="/personnel/salary"
          color="purple"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <DashboardCard
          title="Loan Requests"
          count={pendingLoanRequests.toString()}
          icon={<DollarSign size={24} />}
          to="/personnel/loan-requests"
          color="yellow"
        />
        
        <DashboardCard
          title="Overtime Requests"
          count={pendingOvertimeRequests.toString()}
          icon={<Clock size={24} />}
          to="/personnel/overtime-requests"
          color="red"
        />
        
        <DashboardCard
          title="My Profile"
          count={personnelDetails?.isOnLeave ? 'On Leave' : 'Active'}
          icon={<User size={24} />}
          to="/personnel"
          color="blue"
        />
      </div>
      
      {dutyPost && (
        <div className="mt-8 bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Current Assignment</h2>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className="text-lg font-semibold text-blue-800">
                  {dutyPost.name}
                </h3>
                <p className="text-gray-600">{dutyPost.location}</p>
                <p className="text-sm text-gray-500 mt-1">{dutyPost.description}</p>
              </div>
              
              <div className="mt-4 md:mt-0">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                  dutyPost.priority === 'high' 
                    ? 'bg-red-100 text-red-800' 
                    : dutyPost.priority === 'medium'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-green-100 text-green-800'
                }`}>
                  {dutyPost.priority.charAt(0).toUpperCase() + dutyPost.priority.slice(1)} Priority
                </span>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
            <div className="flex flex-wrap gap-4">
              <div>
                <span className="text-sm text-gray-500">Start Date:</span>
                <p className="font-medium">{dutyAssignment?.startDate}</p>
              </div>
              
              <div>
                <span className="text-sm text-gray-500">End Date:</span>
                <p className="font-medium">{dutyAssignment?.endDate}</p>
              </div>
              
              <div>
                <span className="text-sm text-gray-500">Shifts:</span>
                <p className="font-medium capitalize">
                  {dutyAssignment?.shifts.join(', ')}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default PersonnelDashboard;