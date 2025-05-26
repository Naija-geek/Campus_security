import React, { useEffect, useState, useMemo } from 'react';
import { Users, Calendar, ClipboardCheck, DollarSign, UserX } from 'lucide-react';
import Layout from '../../components/Layout';
import DashboardCard from '../../components/DashboardCard';

const ManagerDashboard: React.FC = () => {
  const [personnel, setPersonnel] = useState<any[]>([]);
  const [leaveRequests, setLeaveRequests] = useState<any[]>([]);
  const [loanRequests, setLoanRequests] = useState<any[]>([]);
  const [dutyAssignments, setDutyAssignments] = useState<any[]>([]);
  const [dutyPosts, setDutyPosts] = useState<any[]>([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/personnel', { credentials: 'include' })
      .then(res => res.json())
      .then(data => setPersonnel(data.personnel || []));
    fetch('http://localhost:5000/api/leave-requests', { credentials: 'include' })
      .then(res => res.json())
      .then(data => setLeaveRequests(data.requests || []));
    fetch('http://localhost:5000/api/loan-requests', { credentials: 'include' })
      .then(res => res.json())
      .then(data => setLoanRequests(data.requests || []));
    fetch('http://localhost:5000/api/duty-assignments', { credentials: 'include' })
      .then(res => res.json())
      .then(data => setDutyAssignments(data.assignments || []));
    fetch('http://localhost:5000/api/duty-posts', { credentials: 'include' })
      .then(res => res.json())
      .then(data => setDutyPosts(data.posts || []));
  }, []);

  // Counts and calculations
  const pendingLeaveRequests = leaveRequests.filter(lr => lr.status === 'pending').length;
  const pendingLoanRequests = loanRequests.filter(lr => lr.status === 'pending').length;
  const today = new Date();
  const personnelOnLeave = personnel.filter(person => {
    // Find an approved leave request for this person that covers today
    return leaveRequests.some(lr =>
      (typeof lr.personnelId === 'object' ? lr.personnelId._id : lr.personnelId) === person._id &&
      lr.status === 'approved' &&
      new Date(lr.startDate) <= today &&
      new Date(lr.endDate) >= today
    );
  }).length;

  const coveredPosts = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const activeDutyAssignments = dutyAssignments.filter(da => da.startDate <= today && da.endDate >= today);
    const coveredPostIds = [...new Set(activeDutyAssignments.map(da => da.dutyPostId))];
    return coveredPostIds.length;
  }, [dutyAssignments]);

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Manager Dashboard</h1>
        <p className="text-gray-600">Monitor and manage security personnel and operations.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <DashboardCard
          title="Total Personnel"
          count={personnel.length.toString()}
          icon={<Users size={24} />}
          to="/manager/personnel"
          color="blue"
        />
        <DashboardCard
          title="Personnel on Leave"
          count={personnelOnLeave.toString()}
          icon={<UserX size={24} />}
          to="/manager/personnel"
          color="red"
        />
        <DashboardCard
          title="Pending Leave Requests"
          count={pendingLeaveRequests.toString()}
          icon={<Calendar size={24} />}
          to="/manager/leave-requests"
          color="green"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <DashboardCard
          title="Duty Post Coverage"
          count={`${coveredPosts}/${dutyPosts.length}`}
          icon={<ClipboardCheck size={24} />}
          to="/manager/assign-duty"
          color="purple"
        />
        <DashboardCard
          title="Pending Loan Requests"
          count={pendingLoanRequests.toString()}
          icon={<DollarSign size={24} />}
          to="/manager/loan-requests"
          color="yellow"
        />
      </div>
      
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Leave Requests</h2>
            {leaveRequests.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Personnel</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Range</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {leaveRequests.slice(0, 3).map((request) => {
                      const person = personnel.find(
                        p => p._id === (typeof request.personnelId === 'object' ? request.personnelId._id : request.personnelId)
                      );
                      return (
                        <tr key={request._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="h-8 w-8 rounded-full overflow-hidden">
                                <img src={person?.profileImage} alt={person?.name} className="h-full w-full object-cover" />
                              </div>
                              <div className="ml-3">
                                <div className="text-sm font-medium text-gray-900">{person?.name}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {new Date(request.startDate).toLocaleDateString()} to {new Date(request.endDate).toLocaleDateString()}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              request.status === 'approved' 
                                ? 'bg-green-100 text-green-800' 
                                : request.status === 'pending' 
                                ? 'bg-yellow-100 text-yellow-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500">No leave requests.</p>
            )}
          </div>
          <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
            <a 
              href="/manager/leave-requests" 
              className="text-sm font-medium text-blue-600 hover:text-blue-900"
            >
              View all requests →
            </a>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Personnel on Leave</h2>
            {personnelOnLeave > 0 ? (
              <div className="space-y-4">
                {personnel.filter(person => {
                  // Only show if they have an approved leave request covering today
                  return leaveRequests.some(lr =>
                    (typeof lr.personnelId === 'object' ? lr.personnelId._id : lr.personnelId) === person._id &&
                    lr.status === 'approved' &&
                    new Date(lr.startDate) <= today &&
                    new Date(lr.endDate) >= today
                  );
                }).slice(0, 3).map((person) => {
                  const leaveRequest = leaveRequests.find(
                    lr =>
                      (typeof lr.personnelId === 'object' ? lr.personnelId._id : lr.personnelId) === person._id &&
                      lr.status === 'approved' &&
                      new Date(lr.startDate) <= today &&
                      new Date(lr.endDate) >= today
                  );
                  return (
                    <div key={person._id} className="bg-white border rounded-lg p-4">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full overflow-hidden">
                          <img src={person.profileImage} alt={person.name} className="h-full w-full object-cover" />
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">{person.name}</div>
                          <div className="text-xs text-gray-500">{person.email}</div>
                        </div>
                      </div>
                      {leaveRequest && (
                        <div className="mt-3 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-500">From:</span>
                            <span className="font-medium">{new Date(leaveRequest.startDate).toLocaleDateString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">To:</span>
                            <span className="font-medium">{new Date(leaveRequest.endDate).toLocaleDateString()}</span>
                          </div>
                          <div className="mt-1 text-xs text-gray-500">{leaveRequest.reason}</div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-500">No personnel on leave.</p>
            )}
          </div>
          <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
            <a 
              href="/manager/personnel" 
              className="text-sm font-medium text-blue-600 hover:text-blue-900"
            >
              View all personnel →
            </a>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ManagerDashboard;