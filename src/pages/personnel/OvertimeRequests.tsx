import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import { useAuth } from '../../context/AuthContext';
import RequestForm from '../../components/RequestForm';
import StatusBadge from '../../components/StatusBadge';
import { Clock, DollarSign } from 'lucide-react';

const OvertimeRequests: React.FC = () => {
  const { user } = useAuth();
  const [overtimeRequests, setOvertimeRequests] = useState<any[]>([]);
  const [notification, setNotification] = useState<string | null>(null);

  // Fetch user's overtime requests
  useEffect(() => {
    if (user?._id) {
      fetch(`http://localhost:5000/api/overtime-requests?personnelId=${user._id}`, { credentials: 'include' })
        .then(res => res.json())
        .then(data => setOvertimeRequests(data.requests || []));
    }
  }, [user?._id]);

  // Filter requests for this user
  const myRequests = overtimeRequests.filter(request =>
    (typeof request.personnelId === 'object'
      ? request.personnelId._id
      : request.personnelId) === user?._id
  );

  // Submit new overtime request
  const handleSubmit = (data: any) => {
    fetch('http://localhost:5000/api/overtime-requests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        personnelId: user?._id,
        date: data.date,
        hours: parseFloat(data.hours),
        reason: data.reason
      })
    }).then(res => {
      if (res.ok) {
        setNotification('Overtime request sent successfully!');
        fetch(`http://localhost:5000/api/overtime-requests?personnelId=${user._id}`, { credentials: 'include' })
          .then(res => res.json())
          .then(data => setOvertimeRequests(data.requests || []));
      } else {
        setNotification('Failed to send overtime request.');
      }
      setTimeout(() => setNotification(null), 3000);
    });
  };

  return (
    <Layout>
      <div className="p-6">
        {notification && (
          <div className="mb-4 p-3 rounded bg-green-100 text-green-800 text-center">
            {notification}
          </div>
        )}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Overtime Requests</h1>
          <p className="text-gray-600">Submit and track your overtime requests</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-800">My Overtime Requests</h2>
              </div>
              <div className="divide-y divide-gray-200">
                {myRequests.map((request) => (
                  <div key={request._id} className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <StatusBadge status={request.status} />
                      <span className="text-sm text-gray-500">
                        {new Date(request.date).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-2">
                      <div className="flex items-center text-gray-600">
                        <Clock size={16} className="mr-1" />
                        <span>{request.hours} hours</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <DollarSign size={16} className="mr-1" />
                        <span>Rate: 1.5x</span>
                      </div>
                    </div>
                    <p className="text-gray-700">{request.reason}</p>
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
                ))}
                {myRequests.length === 0 && (
                  <div className="p-4 text-center text-gray-500">
                    No overtime requests found
                  </div>
                )}
              </div>
            </div>
          </div>
          <div>
            <RequestForm
              title="Submit Overtime Request"
              fields={[
                { name: 'date', label: 'Date', type: 'date', required: true },
                { name: 'hours', label: 'Hours', type: 'number', min: 1, max: 12, required: true },
                { name: 'reason', label: 'Reason', type: 'textarea', required: true }
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

export default OvertimeRequests;