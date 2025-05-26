import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import StatusBadge from '../../components/StatusBadge';
import { Clock, User, CheckCircle, XCircle } from 'lucide-react';

const ManageOvertimeRequests: React.FC = () => {
  const [overtimeRequests, setOvertimeRequests] = useState<any[]>([]);
  const [personnel, setPersonnel] = useState<any[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<string | null>(null);

  // Fetch all overtime requests and personnel
  useEffect(() => {
    fetch('http://localhost:5000/api/overtime-requests', { credentials: 'include' })
      .then(res => res.json())
      .then(data => setOvertimeRequests(data.requests || []));
    fetch('http://localhost:5000/api/personnel', { credentials: 'include' })
      .then(res => res.json())
      .then(data => setPersonnel(data.personnel || []));
  }, []);

  const handleApprove = async (id: string) => {
    await fetch(`http://localhost:5000/api/overtime-requests/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ status: 'approved' }),
    });
    setSelectedRequest(null);
    // Refresh requests
    fetch('http://localhost:5000/api/overtime-requests', { credentials: 'include' })
      .then(res => res.json())
      .then(data => setOvertimeRequests(data.requests || []));
  };

  const handleReject = async (id: string) => {
    await fetch(`http://localhost:5000/api/overtime-requests/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ status: 'declined' }),
    });
    setSelectedRequest(null);
    // Refresh requests
    fetch('http://localhost:5000/api/overtime-requests', { credentials: 'include' })
      .then(res => res.json())
      .then(data => setOvertimeRequests(data.requests || []));
  };

  const pendingRequests = overtimeRequests.filter(r => r.status === 'pending');
  const historyRequests = overtimeRequests.filter(r => r.status !== 'pending');

  return (
    <Layout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Manage Overtime Requests</h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pending */}
          <div>
            <h2 className="text-lg font-semibold mb-2">Pending Requests</h2>
            <div className="bg-white rounded-lg shadow divide-y divide-gray-200">
              {pendingRequests.length === 0 && (
                <div className="p-4 text-center text-gray-500">No pending requests</div>
              )}
              {pendingRequests.map(request => {
                const person = personnel.find(
                  p => p._id === (typeof request.personnelId === 'object' ? request.personnelId._id : request.personnelId)
                );
                return (
                  <div
                    key={request._id}
                    className={`p-4 cursor-pointer ${selectedRequest === request._id ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
                    onClick={() => setSelectedRequest(request._id)}
                  >
                    <div className="flex items-center space-x-3 mb-2">
                      <User size={18} className="text-gray-400" />
                      <span className="font-medium">{person?.name || 'Unknown'}</span>
                      <StatusBadge status={request.status} />
                      <span className="text-sm text-gray-500">{new Date(request.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center text-gray-600 mb-2">
                      <Clock size={16} className="mr-1" />
                      <span>{request.hours} hours</span>
                    </div>
                    <div className="text-gray-700 mb-2">{request.reason}</div>
                    {selectedRequest === request._id && (
                      <div className="flex space-x-2 mt-2">
                        <button
                          onClick={() => handleApprove(request._id)}
                          className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                        >
                          <CheckCircle size={16} className="mr-2" />
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(request._id)}
                          className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                        >
                          <XCircle size={16} className="mr-2" />
                          Decline
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          {/* History */}
          <div>
            <h2 className="text-lg font-semibold mb-2">Request History</h2>
            <div className="bg-white rounded-lg shadow divide-y divide-gray-200">
              {historyRequests.length === 0 && (
                <div className="p-4 text-center text-gray-500">No request history</div>
              )}
              {historyRequests.map(request => {
                const person = personnel.find(
                  p => p._id === (typeof request.personnelId === 'object' ? request.personnelId._id : request.personnelId)
                );
                return (
                  <div key={request._id} className="p-4">
                    <div className="flex items-center space-x-3 mb-2">
                      <User size={18} className="text-gray-400" />
                      <span className="font-medium">{person?.name || 'Unknown'}</span>
                      <StatusBadge status={request.status} />
                      <span className="text-sm text-gray-500">{new Date(request.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center text-gray-600 mb-2">
                      <Clock size={16} className="mr-1" />
                      <span>{request.hours} hours</span>
                    </div>
                    <div className="text-gray-700 mb-2">{request.reason}</div>
                    {request.status === 'declined' && (
                      <div className="mt-2 p-2 bg-red-50 rounded text-red-700 text-sm">
                        Declined by manager
                      </div>
                    )}
                    {request.status === 'approved' && (
                      <div className="mt-2 p-2 bg-green-50 rounded text-green-700 text-sm">
                        Approved by manager
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ManageOvertimeRequests;