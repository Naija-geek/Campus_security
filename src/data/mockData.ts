import { 
  User, 
  Personnel, 
  Manager, 
  Admin, 
  DutyPost, 
  DutyAssignment, 
  LeaveRequest, 
  LoanRequest, 
  OvertimeRequest 
} from '../types';

// Mock Users
export const mockUsers: User[] = [
  {
    id: 'p1',
    name: 'John Smith',
    email: 'personnel@example.com',
    role: 'personnel',
    profileImage: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=300',
  },
  {
    id: 'm1',
    name: 'Sarah Johnson',
    email: 'manager@example.com',
    role: 'manager',
    profileImage: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=300',
  },
  {
    id: 'a1',
    name: 'Michael Chen',
    email: 'admin@example.com',
    role: 'admin',
    profileImage: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=300',
  },
];

// Mock Personnel
export const mockPersonnel: Personnel[] = [
  {
    id: 'p1',
    name: 'John Smith',
    email: 'personnel@example.com',
    role: 'personnel',
    dutyPost: 'dp1',
    salary: 3500,
    isOnLeave: false,
    joiningDate: '2022-05-15',
    contactNumber: '555-123-4567',
    profileImage: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=300',
  },
  {
    id: 'p2',
    name: 'Emily Davis',
    email: 'emily@example.com',
    role: 'personnel',
    dutyPost: 'dp2',
    salary: 3200,
    isOnLeave: true,
    joiningDate: '2021-11-03',
    contactNumber: '555-987-6543',
    profileImage: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=300',
  },
  {
    id: 'p3',
    name: 'Robert Johnson',
    email: 'robert@example.com',
    role: 'personnel',
    dutyPost: 'dp3',
    salary: 3800,
    isOnLeave: false,
    joiningDate: '2023-01-22',
    contactNumber: '555-456-7890',
    profileImage: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=300',
  },
];

// Mock Managers
export const mockManagers: Manager[] = [
  {
    id: 'm1',
    name: 'Sarah Johnson',
    email: 'manager@example.com',
    role: 'manager',
    department: 'Campus Security',
    managingPosts: ['dp1', 'dp2', 'dp3'],
    profileImage: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=300',
  },
];

// Mock Admins
export const mockAdmins: Admin[] = [
  {
    id: 'a1',
    name: 'Michael Chen',
    email: 'admin@example.com',
    role: 'admin',
    accessLevel: 10,
    profileImage: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=300',
  },
];

// Mock Duty Posts
export const mockDutyPosts: DutyPost[] = [
  {
    id: 'dp1',
    name: 'Main Entrance',
    location: 'Campus North Gate',
    description: 'Main security checkpoint for all visitors and staff',
    latitude: 37.7749,
    longitude: -122.4194,
    priority: 'high',
  },
  {
    id: 'dp2',
    name: 'Library',
    location: 'Central Campus',
    description: 'Security post outside the main library',
    latitude: 37.7752,
    longitude: -122.4189,
    priority: 'medium',
  },
  {
    id: 'dp3',
    name: 'Dormitory A',
    location: 'West Campus',
    description: 'Security monitoring for student dormitories',
    latitude: 37.7746,
    longitude: -122.4199,
    priority: 'high',
  },
  {
    id: 'dp4',
    name: 'Science Building',
    location: 'East Campus',
    description: 'Monitoring access to labs and equipment',
    latitude: 37.7751,
    longitude: -122.4185,
    priority: 'medium',
  },
  {
    id: 'dp5',
    name: 'Sports Complex',
    location: 'South Campus',
    description: 'Security for athletic facilities',
    latitude: 37.7740,
    longitude: -122.4190,
    priority: 'low',
  },
];

// Mock Duty Assignments
export const mockDutyAssignments: DutyAssignment[] = [
  {
    id: 'da1',
    personnelId: 'p1',
    dutyPostId: 'dp1',
    startDate: '2023-05-01',
    endDate: '2023-05-15',
    shifts: ['morning'],
  },
  {
    id: 'da2',
    personnelId: 'p2',
    dutyPostId: 'dp2',
    startDate: '2023-05-01',
    endDate: '2023-05-15',
    shifts: ['evening'],
  },
  {
    id: 'da3',
    personnelId: 'p3',
    dutyPostId: 'dp3',
    startDate: '2023-05-01',
    endDate: '2023-05-15',
    shifts: ['night'],
  },
];

// Mock Leave Requests
export const mockLeaveRequests: LeaveRequest[] = [
  {
    id: 'lr1',
    personnelId: 'p1',
    startDate: '2023-06-01',
    endDate: '2023-06-10',
    reason: 'Family vacation',
    status: 'pending',
  },
  {
    id: 'lr2',
    personnelId: 'p2',
    startDate: '2023-05-15',
    endDate: '2023-05-22',
    reason: 'Medical procedure',
    status: 'approved',
    reviewedBy: 'm1',
    reviewDate: '2023-05-10',
  },
];

// Mock Loan Requests
export const mockLoanRequests: LoanRequest[] = [
  {
    id: 'loan1',
    personnelId: 'p1',
    amount: 5000,
    requestDate: '2023-04-15',
    reason: 'Home repair',
    proposedDeductionPercentage: 10,
    status: 'pending',
  },
  {
    id: 'loan2',
    personnelId: 'p3',
    amount: 2000,
    requestDate: '2023-03-20',
    reason: 'Education expenses',
    proposedDeductionPercentage: 5,
    status: 'approved',
    approvedDeductionPercentage: 5,
    approvedDuration: 12,
    reviewedBy: 'm1',
    reviewDate: '2023-03-25',
  },
];

// Mock Overtime Requests
export const mockOvertimeRequests: OvertimeRequest[] = [
  {
    id: 'ot1',
    personnelId: 'p1',
    date: '2023-05-12',
    hours: 3,
    reason: 'Special campus event',
    status: 'pending',
  },
  {
    id: 'ot2',
    personnelId: 'p3',
    date: '2023-05-05',
    hours: 2,
    reason: 'Emergency situation',
    status: 'approved',
    reviewedBy: 'm1',
  },
];