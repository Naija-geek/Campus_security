import React from 'react';
import { Link } from 'react-router-dom';

interface DashboardCardProps {
  title: string;
  count: number | string;
  icon: React.ReactNode;
  to: string;
  color: 'blue' | 'green' | 'yellow' | 'red' | 'purple';
}

const DashboardCard: React.FC<DashboardCardProps> = ({ title, count, icon, to, color }) => {
  const getColorClasses = () => {
    switch (color) {
      case 'blue':
        return 'bg-blue-50 text-blue-500 border-blue-200';
      case 'green':
        return 'bg-green-50 text-green-500 border-green-200';
      case 'yellow':
        return 'bg-yellow-50 text-yellow-500 border-yellow-200';
      case 'red':
        return 'bg-red-50 text-red-500 border-red-200';
      case 'purple':
        return 'bg-purple-50 text-purple-500 border-purple-200';
      default:
        return 'bg-blue-50 text-blue-500 border-blue-200';
    }
  };
  
  const colorClasses = getColorClasses();
  
  return (
    <Link
      to={to}
      className="group block p-6 rounded-lg border shadow-sm hover:shadow-md transition-all duration-200 bg-white transform hover:-translate-y-1"
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${colorClasses}`}>{icon}</div>
        <span className={`text-sm font-medium ${colorClasses.split(' ')[1]}`}>View</span>
      </div>
      
      <h3 className="text-xl font-bold text-gray-800 mb-1">{count}</h3>
      <p className="text-gray-600 text-sm">{title}</p>
    </Link>
  );
};

export default DashboardCard;