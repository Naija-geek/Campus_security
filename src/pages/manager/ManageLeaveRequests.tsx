import React, { useState } from 'react';
import Layout from '../../components/Layout';
import { useAppContext } from '../../context/AppContext';
import StatusBadge from '../../components/StatusBadge';
import { Calendar, Clock, User, CheckCircle, XCircle } from 'lucide-react';

const ManageLeaveRequests: React.FC = () => {
  const { leaveRequests, personnel, updateLeaveRequestStatus } = useAppContext();
  const [selectedRequest, setSelectedRequest] = useState<string | null>(null);
  const [comments, setComments] = useState('');
  
  const pendingRequests = leaveRequests.filter(request => request.status === 'pending');
  const otherRequests = leaveRequests.filter(request => request.status !== 'pending');
  
  const handleApprove = (id: string) => {
    updateLeaveRequestStatus(id, 'approved', comments);
    setSelectedRequest(null);
    setComments('');
  };
  
  const handleReject = (id: string) => {
    updateLeaveRequestStatus(id, 'rejected', comments);
    setSelectedRequest(null);
    setComments('');
  };
  
  return (
    <Layout>
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Manage Leave Requests</h1>
          <p className="text-gray-600">Review and manage personnel leave requests</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <div className="bg-white rounded-lg shadow">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-800">Pending Requests</h2>
              </div>
              
              <div className="divide-y divide-gray-200">
                {pendingRequests.map((request) => {
                  const person = personnel.find(p => p.id === request.personnelId);
                  
                  return (
                    <div 
                      key={request.id} 
                      className={`p-4 cursor-pointer transition-colors duration-200 ${
                        selectedRequest === request.id ? 'bg-blue-50' : 'hover:bg-gray-50'
                      }`}
                      onClick={() => setSelectedRequest(request.id)}
                    >
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          <img 
                            src={person?.profileImage} 
                            alt={person?.name} 
                            className="h-10 w-10 rounded-full"
                          />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {person?.name}
                          </p>
                          <div className="flex items-center text-sm text-gray-500">
                            <Calendar size={16} className="mr-1" />
                            <span>{request.startDate} - {request.endDate}</span>
                          </div>
                        </div>
                        
                        <StatusBadge status={request.status} />
                      </div>
                      
                      {selectedRequest === request.id && (
                        <div className="mt-4 space-y-4">
                          <p className="text-gray-700">{request.reason}</p>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Comments
                            </label>
                            <textarea
                              value={comments}
                              onChange={(e) => setComments(e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              rows={3}
                              placeholder="Add your comments..."
                            />
                          </div>
                          
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleApprove(request.id)}
                              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                            >
                              <CheckCircle size={16} className="mr-2" />
                              Approve
                            </button>
                            
                            <button
                              onClick={() => handleReject(request.id)}
                              className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                            >
                              <XCircle size={16} className="mr-2" />
                              Reject
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
                
                {pendingRequests.length === 0 && (
                  <div className="p-4 text-center text-gray-500">
                    No pending requests
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div>
            <div className="bg-white rounded-lg shadow">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-800">Request History</h2>
              </div>
              
              <div className="divide-y divide-gray-200">
                {otherRequests.map((request) => {
                  const person = personnel.find(p => p.id === request.personnelId);
                  
                  return (
                    <div key={request.id} className="p-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          <img 
                            src={person?.profileImage} 
                            alt={person?.name} 
                            className="h-10 w-10 rounded-full"
                          />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {person?.name}
                          </p>
                          <div className="flex items-center text-sm text-gray-500">
                            <Calendar size={16} className="mr-1" />
                            <span>{request.startDate} - {request.endDate}</span>
                          </div>
                        </div>
                        
                        <StatusBadge status={request.status} />
                      </div>
                      
                      {request.comments && (
                        <div className="mt-2 text-sm text-gray-600">
                          <p className="font-medium">Comments:</p>
                          <p>{request.comments}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
                
                {otherRequests.length === 0 && (
                  <div className="p-4 text-center text-gray-500">
                    No request history
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ManageLeaveRequests;