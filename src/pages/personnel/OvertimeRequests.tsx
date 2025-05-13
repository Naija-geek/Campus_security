import React from 'react';
import Layout from '../../components/Layout';
import { useAppContext } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import RequestForm from '../../components/RequestForm';
import StatusBadge from '../../components/StatusBadge';
import { Clock, Calendar, DollarSign } from 'lucide-react';

const OvertimeRequests: React.FC = () => {
  const { user } = useAuth();
  const { overtimeRequests, submitOvertimeRequest } = useAppContext();
  
  const myRequests = overtimeRequests.filter(request => request.personnelId === user?.id);
  
  const handleSubmit = (data: any) => {
    submitOvertimeRequest({
      personnelId: user?.id || '',
      date: data.date,
      hours: parseFloat(data.hours),
      reason: data.reason
    });
  };
  
  return (
    <Layout>
      <div className="p-6">
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
                  <div key={request.id} className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <StatusBadge status={request.status} />
                      <span className="text-sm text-gray-500">
                        {request.date}
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
                {
                  name: 'date',
                  label: 'Date',
                  type: 'date',
                  required: true
                },
                {
                  name: 'hours',
                  label: 'Hours',
                  type: 'number',
                  min: 1,
                  max: 12,
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

export default OvertimeRequests;