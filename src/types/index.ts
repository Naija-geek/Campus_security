// User Types
export type UserRole = 'personnel' | 'manager' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  profileImage?: string;
}

export interface Personnel extends User {
  role: 'personnel';
  dutyPost?: string;
  salary: number;
  isOnLeave: boolean;
  joiningDate: string;
  contactNumber: string;
}

export interface Manager extends User {
  role: 'manager';
  department: string;
  managingPosts: string[];
}

export interface Admin extends User {
  role: 'admin';
  accessLevel: number;
}

// Duty Related Types
export interface DutyPost {
  id: string;
  name: string;
  location: string;
  description: string;
  latitude: number;
  longitude: number;
  priority: 'low' | 'medium' | 'high';
}

export interface DutyAssignment {
  id: string;
  personnelId: string;
  dutyPostId: string;
  startDate: string;
  endDate: string;
  shifts: string[];
}

// Request Types
export type RequestStatus = 'pending' | 'approved' | 'rejected';

export interface LeaveRequest {
  id: string;
  personnelId: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: RequestStatus;
  reviewedBy?: string;
  reviewDate?: string;
  comments?: string;
}

export interface LoanRequest {
  id: string;
  personnelId: string;
  amount: number;
  requestDate: string;
  reason: string;
  proposedDeductionPercentage: number;
  status: RequestStatus;
  approvedDeductionPercentage?: number;
  approvedDuration?: number;
  reviewedBy?: string;
  reviewDate?: string;
}

export interface OvertimeRequest {
  id: string;
  personnelId: string;
  date: string;
  hours: number;
  reason: string;
  status: RequestStatus;
  reviewedBy?: string;
}