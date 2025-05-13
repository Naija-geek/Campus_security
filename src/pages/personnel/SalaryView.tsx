import React from 'react';
import Layout from '../../components/Layout';
import { useAppContext } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { DollarSign, TrendingUp, Clock, Calendar } from 'lucide-react';

const SalaryView: React.FC = () => {
  const { user } = useAuth();
  const { personnel, loanRequests, overtimeRequests } = useAppContext();
  
  const myDetails = personnel.find(p => p.id === user?.id);
  const activeLoan = loanRequests.find(
    lr => lr.personnelId === user?.id && lr.status === 'approved'
  );
  const approvedOvertimeHours = overtimeRequests
    .filter(or => or.personnelId === user?.id && or.status === 'approved')
    .reduce((total, or) => total + or.hours, 0);
  
  const overtimeRate = 1.5; // 1.5x regular hourly rate
  const hourlyRate = (myDetails?.salary || 0) / (22 * 8); // Assuming 22 working days per month, 8 hours per day
  const overtimePay = approvedOvertimeHours * hourlyRate * overtimeRate;
  
  const loanDeduction = activeLoan 
    ? (myDetails?.salary || 0) * (activeLoan.approvedDeductionPercentage || 0) / 100
    : 0;
  
  const netSalary = (myDetails?.salary || 0) + overtimePay - loanDeduction;
  
  return (
    <Layout>
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Salary Information</h1>
          <p className="text-gray-600">View your salary details and payment history</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <DollarSign size={24} className="text-blue-600" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-800">${myDetails?.salary}</h3>
            <p className="text-gray-600">Base Salary</p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <TrendingUp size={24} className="text-green-600" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-800">${overtimePay.toFixed(2)}</h3>
            <p className="text-gray-600">Overtime Pay</p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-red-100 rounded-lg">
                <DollarSign size={24} className="text-red-600" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-800">-${loanDeduction.toFixed(2)}</h3>
            <p className="text-gray-600">Loan Deduction</p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <DollarSign size={24} className="text-purple-600" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-800">${netSalary.toFixed(2)}</h3>
            <p className="text-gray-600">Net Salary</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">Overtime Details</h2>
            </div>
            
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center text-gray-600">
                  <Clock size={16} className="mr-2" />
                  <span>Total Overtime Hours</span>
                </div>
                <span className="font-semibold">{approvedOvertimeHours} hours</span>
              </div>
              
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center text-gray-600">
                  <DollarSign size={16} className="mr-2" />
                  <span>Overtime Rate</span>
                </div>
                <span className="font-semibold">{overtimeRate}x regular rate</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center text-gray-600">
                  <DollarSign size={16} className="mr-2" />
                  <span>Total Overtime Pay</span>
                </div>
                <span className="font-semibold text-green-600">${overtimePay.toFixed(2)}</span>
              </div>
            </div>
          </div>
          
          {activeLoan && (
            <div className="bg-white rounded-lg shadow">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-800">Active Loan Details</h2>
              </div>
              
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center text-gray-600">
                    <DollarSign size={16} className="mr-2" />
                    <span>Loan Amount</span>
                  </div>
                  <span className="font-semibold">${activeLoan.amount}</span>
                </div>
                
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center text-gray-600">
                    <Calendar size={16} className="mr-2" />
                    <span>Duration</span>
                  </div>
                  <span className="font-semibold">{activeLoan.approvedDuration} months</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-gray-600">
                    <TrendingUp size={16} className="mr-2" />
                    <span>Monthly Deduction</span>
                  </div>
                  <span className="font-semibold text-red-600">${loanDeduction.toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default SalaryView;