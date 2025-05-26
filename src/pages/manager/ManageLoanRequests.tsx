import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import { useAppContext } from '../../context/AppContext';
import StatusBadge from '../../components/StatusBadge';
import { DollarSign, Calendar, User, CheckCircle, XCircle, TrendingUp } from 'lucide-react';

const ManageLoanRequests: React.FC = () => {
  const [loanRequests, setLoanRequests] = useState<any[]>([]);
  const [personnel, setPersonnel] = useState<any[]>([]);
  const { updateLoanRequestStatus } = useAppContext();
  const [selectedRequest, setSelectedRequest] = useState<string | null>(null);
  const [approvedDeductionPercentage, setApprovedDeductionPercentage] = useState<number>(0);
  const [approvedDuration, setApprovedDuration] = useState<number>(0);
  
  useEffect(() => {
    // Fetch all loan requests
    fetch('http://localhost:5000/api/loan-requests', { credentials: 'include' })
      .then(res => res.json())
      .then(data => setLoanRequests(data.requests || []));
    // Optionally fetch personnel data for display
    fetch('http://localhost:5000/api/personnel', { credentials: 'include' })
      .then(res => res.json())
      .then(data => setPersonnel(data.personnel || []));
  }, []);

  const pendingRequests = loanRequests.filter(request => request.status === 'pending');
  const otherRequests = loanRequests.filter(request => request.status !== 'pending');
  
  const handleApprove = async (id: string) => {
    await updateLoanRequestStatus(id, 'approved', approvedDeductionPercentage, approvedDuration);
    setSelectedRequest(null);
    setApprovedDeductionPercentage(0);
    setApprovedDuration(0);
    // Refresh loan requests
    fetch('http://localhost:5000/api/loan-requests', { credentials: 'include' })
      .then(res => res.json())
      .then(data => setLoanRequests(data.requests || []));
  };
  
  const handleReject = async (id: string) => {
    await updateLoanRequestStatus(id, 'rejected');
    setSelectedRequest(null);
    // Refresh loan requests
    fetch('http://localhost:5000/api/loan-requests', { credentials: 'include' })
      .then(res => res.json())
      .then(data => setLoanRequests(data.requests || []));
  };
  
  return (
    <Layout>
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Manage Loan Requests</h1>
          <p className="text-gray-600">Review and manage personnel loan requests</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <div className="bg-white rounded-lg shadow">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-800">Pending Requests</h2>
              </div>
              
              <div className="divide-y divide-gray-200">
                {pendingRequests.map((request) => {
                  const person = personnel.find(
                    p => p._id === (typeof request.personnelId === 'object' ? request.personnelId._id : request.personnelId)
                  );
                  
                  return (
                    <div 
                      key={request._id} 
                      className={`p-4 cursor-pointer transition-colors duration-200 ${
                        selectedRequest === request._id ? 'bg-blue-50' : 'hover:bg-gray-50'
                      }`}
                      onClick={() => setSelectedRequest(request._id)}
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
                            <DollarSign size={16} className="mr-1" />
                            <span>${request.amount}</span>
                          </div>
                        </div>
                        
                        <StatusBadge status={request.status} />
                      </div>
                      
                      {selectedRequest === request._id && (
                        <div className="mt-4 space-y-4">
                          <div>
                            <p className="text-gray-700">{request.reason}</p>
                            <div className="mt-2 text-sm text-gray-600">
                              <div className="flex items-center">
                                <TrendingUp size={16} className="mr-1" />
                                Proposed Deduction: {request.proposedDeductionPercentage}%
                              </div>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Approved Deduction (%)
                              </label>
                              <input
                                type="number"
                                min="1"
                                max="50"
                                value={approvedDeductionPercentage}
                                onChange={(e) => setApprovedDeductionPercentage(parseInt(e.target.value))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Duration (months)
                              </label>
                              <input
                                type="number"
                                min="1"
                                max="36"
                                value={approvedDuration}
                                onChange={(e) => setApprovedDuration(parseInt(e.target.value))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                            </div>
                          </div>
                          
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleApprove(request._id)}
                              disabled={!approvedDeductionPercentage || !approvedDuration}
                              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                            >
                              <CheckCircle size={16} className="mr-2" />
                              Approve
                            </button>
                            
                            <button
                              onClick={() => handleReject(request._id)}
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
                  const person = personnel.find(
                    p => p._id === (typeof request.personnelId === 'object' ? request.personnelId._id : request.personnelId)
                  );

                  return (
                    <div key={request._id} className="p-4">
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
                            <DollarSign size={16} className="mr-1" />
                            <span>${request.amount}</span>
                          </div>
                        </div>
                        <StatusBadge status={request.status} />
                      </div>
                      {request.status === 'approved' && (
                        <div className="mt-2 text-sm text-gray-600">
                          <div>Approved Deduction: {request.approvedDeductionPercentage}%</div>
                          <div>Duration: {request.approvedDuration} months</div>
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

export default ManageLoanRequests;