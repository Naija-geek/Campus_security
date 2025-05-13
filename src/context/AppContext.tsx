import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Personnel, 
  Manager, 
  Admin, 
  DutyPost, 
  DutyAssignment, 
  LeaveRequest, 
  LoanRequest, 
  OvertimeRequest 
} from '../types';
import {
  mockPersonnel,
  mockManagers,
  mockAdmins,
  mockDutyPosts,
  mockDutyAssignments,
  mockLeaveRequests,
  mockLoanRequests,
  mockOvertimeRequests
} from '../data/mockData';
import { useAuth } from './AuthContext';

interface AppContextType {
  // Data
  personnel: Personnel[];
  managers: Manager[];
  admins: Admin[];
  dutyPosts: DutyPost[];
  dutyAssignments: DutyAssignment[];
  leaveRequests: LeaveRequest[];
  loanRequests: LoanRequest[];
  overtimeRequests: OvertimeRequest[];
  
  // Personnel Functions
  submitLeaveRequest: (request: Omit<LeaveRequest, 'id' | 'status'>) => void;
  submitLoanRequest: (request: Omit<LoanRequest, 'id' | 'status' | 'requestDate'>) => void;
  submitOvertimeRequest: (request: Omit<OvertimeRequest, 'id' | 'status'>) => void;
  
  // Manager Functions
  updateLeaveRequestStatus: (id: string, status: 'approved' | 'rejected', comments?: string) => void;
  updateLoanRequestStatus: (
    id: string, 
    status: 'approved' | 'rejected', 
    approvedDeductionPercentage?: number, 
    approvedDuration?: number
  ) => void;
  updateOvertimeRequestStatus: (id: string, status: 'approved' | 'rejected') => void;
  assignDuty: (assignment: Omit<DutyAssignment, 'id'>) => void;
  
  // Admin Functions
  addPersonnel: (person: Omit<Personnel, 'id'>) => void;
  updatePersonnel: (id: string, updates: Partial<Personnel>) => void;
  deletePersonnel: (id: string) => void;
  changePassword: (userId: string, newPassword: string) => void;
}

const AppContext = createContext<AppContextType>({} as AppContextType);

export const useAppContext = () => useContext(AppContext);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  
  const [personnel, setPersonnel] = useState<Personnel[]>(mockPersonnel);
  const [managers, setManagers] = useState<Manager[]>(mockManagers);
  const [admins, setAdmins] = useState<Admin[]>(mockAdmins);
  const [dutyPosts, setDutyPosts] = useState<DutyPost[]>(mockDutyPosts);
  const [dutyAssignments, setDutyAssignments] = useState<DutyAssignment[]>(mockDutyAssignments);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(mockLeaveRequests);
  const [loanRequests, setLoanRequests] = useState<LoanRequest[]>(mockLoanRequests);
  const [overtimeRequests, setOvertimeRequests] = useState<OvertimeRequest[]>(mockOvertimeRequests);

  // Personnel Functions
  const submitLeaveRequest = (request: Omit<LeaveRequest, 'id' | 'status'>) => {
    const newRequest: LeaveRequest = {
      ...request,
      id: `lr${leaveRequests.length + 1}`,
      status: 'pending'
    };
    setLeaveRequests([...leaveRequests, newRequest]);
  };

  const submitLoanRequest = (request: Omit<LoanRequest, 'id' | 'status' | 'requestDate'>) => {
    const newRequest: LoanRequest = {
      ...request,
      id: `loan${loanRequests.length + 1}`,
      status: 'pending',
      requestDate: new Date().toISOString().split('T')[0]
    };
    setLoanRequests([...loanRequests, newRequest]);
  };

  const submitOvertimeRequest = (request: Omit<OvertimeRequest, 'id' | 'status'>) => {
    const newRequest: OvertimeRequest = {
      ...request,
      id: `ot${overtimeRequests.length + 1}`,
      status: 'pending'
    };
    setOvertimeRequests([...overtimeRequests, newRequest]);
  };

  // Manager Functions
  const updateLeaveRequestStatus = (id: string, status: 'approved' | 'rejected', comments?: string) => {
    setLeaveRequests(leaveRequests.map(req => {
      if (req.id === id) {
        const updatedReq: LeaveRequest = {
          ...req,
          status,
          reviewedBy: user?.id,
          reviewDate: new Date().toISOString().split('T')[0]
        };
        
        if (comments) {
          updatedReq.comments = comments;
        }
        
        // If approved, update personnel leave status
        if (status === 'approved') {
          setPersonnel(personnel.map(p => {
            if (p.id === req.personnelId) {
              return { ...p, isOnLeave: true };
            }
            return p;
          }));
        }
        
        return updatedReq;
      }
      return req;
    }));
  };

  const updateLoanRequestStatus = (
    id: string, 
    status: 'approved' | 'rejected', 
    approvedDeductionPercentage?: number, 
    approvedDuration?: number
  ) => {
    setLoanRequests(loanRequests.map(req => {
      if (req.id === id) {
        const updatedReq: LoanRequest = {
          ...req,
          status,
          reviewedBy: user?.id,
          reviewDate: new Date().toISOString().split('T')[0]
        };
        
        if (status === 'approved' && approvedDeductionPercentage && approvedDuration) {
          updatedReq.approvedDeductionPercentage = approvedDeductionPercentage;
          updatedReq.approvedDuration = approvedDuration;
        }
        
        return updatedReq;
      }
      return req;
    }));
  };

  const updateOvertimeRequestStatus = (id: string, status: 'approved' | 'rejected') => {
    setOvertimeRequests(overtimeRequests.map(req => {
      if (req.id === id) {
        return {
          ...req,
          status,
          reviewedBy: user?.id
        };
      }
      return req;
    }));
  };

  const assignDuty = (assignment: Omit<DutyAssignment, 'id'>) => {
    // Check if personnel is on leave
    const isOnLeave = personnel.find(p => p.id === assignment.personnelId)?.isOnLeave;
    
    if (isOnLeave) {
      alert('Cannot assign duty to personnel on leave');
      return;
    }
    
    const newAssignment: DutyAssignment = {
      ...assignment,
      id: `da${dutyAssignments.length + 1}`
    };
    
    setDutyAssignments([...dutyAssignments, newAssignment]);
    
    // Update personnel duty post
    setPersonnel(personnel.map(p => {
      if (p.id === assignment.personnelId) {
        return { ...p, dutyPost: assignment.dutyPostId };
      }
      return p;
    }));
  };

  // Admin Functions
  const addPersonnel = (person: Omit<Personnel, 'id'>) => {
    const newPerson: Personnel = {
      ...person,
      id: `p${personnel.length + 1}`
    };
    
    setPersonnel([...personnel, newPerson]);
  };

  const updatePersonnel = (id: string, updates: Partial<Personnel>) => {
    setPersonnel(personnel.map(p => {
      if (p.id === id) {
        return { ...p, ...updates };
      }
      return p;
    }));
  };

  const deletePersonnel = (id: string) => {
    // Remove personnel from all assignments
    setDutyAssignments(dutyAssignments.filter(da => da.personnelId !== id));
    setLeaveRequests(leaveRequests.filter(lr => lr.personnelId !== id));
    setLoanRequests(loanRequests.filter(lr => lr.personnelId !== id));
    setOvertimeRequests(overtimeRequests.filter(or => or.personnelId !== id));
    
    // Remove personnel
    setPersonnel(personnel.filter(p => p.id !== id));
  };

  const changePassword = (userId: string, newPassword: string) => {
    // In a real app, this would call an API to update the password
    console.log(`Password changed for user ${userId}`);
  };

  return (
    <AppContext.Provider
      value={{
        personnel,
        managers,
        admins,
        dutyPosts,
        dutyAssignments,
        leaveRequests,
        loanRequests,
        overtimeRequests,
        submitLeaveRequest,
        submitLoanRequest,
        submitOvertimeRequest,
        updateLeaveRequestStatus,
        updateLoanRequestStatus,
        updateOvertimeRequestStatus,
        assignDuty,
        addPersonnel,
        updatePersonnel,
        deletePersonnel,
        changePassword
      }}
    >
      {children}
    </AppContext.Provider>
  );
};