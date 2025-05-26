import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import { useAuth } from '../../context/AuthContext';
import RequestForm from '../../components/RequestForm';
import StatusBadge from '../../components/StatusBadge';
import { Calendar, Clock } from 'lucide-react';

const LeaveRequests: React.FC = () => {
  const { user } = useAuth();
  const [leaveRequests, setLeaveRequests] = useState<any[]>([]);
  const [notification, setNotification] = useState<string | null>(null);

  const myRequests = leaveRequests.filter(request =>
    (typeof request.personnelId === 'object'
      ? request.personnelId._id
      : request.personnelId) === user?._id
  );

  const handleSubmit = (data: any) => {
    fetch('http://localhost:5000/api/leave-requests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        personnelId: user?._id,
        startDate: data.startDate,
        endDate: data.endDate,
        reason: data.reason
      })
    }).then(res => {
      if (res.ok) {
        setNotification('Leave request sent successfully!');
        // Optionally refresh the requests list here
        fetch(`http://localhost:5000/api/leave-requests?personnelId=${user?._id}`, { credentials: 'include' })
          .then(res => res.json())
          .then(data => setLeaveRequests(data.requests || []));
      } else {
        setNotification('Failed to send leave request.');
      }
      setTimeout(() => setNotification(null), 3000);
    });
  };

  useEffect(() => {
    fetch(`http://localhost:5000/api/leave-requests?personnelId=${user?._id}`, { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        console.log('Fetched requests:', data.requests);
        setLeaveRequests(data.requests || []);
      });
  }, [user?._id]);

  return (
    <Layout>
      <div className="p-6">
        {notification && (
          <div className="mb-4 p-3 rounded bg-green-100 text-green-800 text-center">
            {notification}
          </div>
        )}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Leave Requests</h1>
          <p className="text-gray-600">Submit and track your leave requests</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-800">My Leave Requests</h2>
              </div>
              
              <div className="divide-y divide-gray-200">
                {myRequests.map((request) => (
                  <div key={request._id} className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <StatusBadge status={request.status} />
                      <span className="text-sm text-gray-500">
                        {request.reviewDate
                          ? new Date(request.reviewDate).toLocaleDateString()
                          : 'Pending Review'}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 mb-2">
                      <div className="flex items-center text-gray-600">
                        <Calendar size={16} className="mr-1" />
                        <span>
                          {new Date(request.startDate).toLocaleDateString()} - {new Date(request.endDate).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Clock size={16} className="mr-1" />
                        <span>
                          {Math.ceil(
                            (new Date(request.endDate).getTime() - new Date(request.startDate).getTime()) /
                            (1000 * 60 * 60 * 24)
                          )} days
                        </span>
                      </div>
                    </div>
                    <p className="text-gray-700">{request.reason}</p>
                    {request.comments && (
                      <div className="mt-2 p-2 bg-gray-50 rounded text-sm text-gray-600">
                        <strong>Comments:</strong> {request.comments}
                      </div>
                    )}
                  </div>
                ))}
                {myRequests.length === 0 && (
                  <div className="p-4 text-center text-gray-500">
                    No leave requests found
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div>
            <RequestForm
              title="Submit Leave Request"
              fields={[
                {
                  name: 'startDate',
                  label: 'Start Date',
                  type: 'date',
                  required: true
                },
                {
                  name: 'endDate',
                  label: 'End Date',
                  type: 'date',
                  required: true
                },
                {
                  name: 'reason',
                  label: 'Reason',
                  type: 'textarea',
                  required: true
                }
              ]}
              onSubmit={handleSubmit}
              submitLabel="Submit Request"
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default LeaveRequests;