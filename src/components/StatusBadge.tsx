import React from 'react';
import { RequestStatus } from '../types';

interface StatusBadgeProps {
  status: RequestStatus;
  className?: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = '' }) => {
  let badgeClasses = 'px-2.5 py-0.5 rounded-full text-xs font-medium';
  
  switch (status) {
    case 'pending':
      badgeClasses += ' bg-yellow-100 text-yellow-800';
      break;
    case 'approved':
      badgeClasses += ' bg-green-100 text-green-800';
      break;
    case 'rejected':
      badgeClasses += ' bg-red-100 text-red-800';
      break;
    default:
      badgeClasses += ' bg-gray-100 text-gray-800';
  }
  
  return (
    <span className={`${badgeClasses} ${className}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

export default StatusBadge;