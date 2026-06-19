// ============ CANDIDATE / ATS ============
export type PipelineStage =
  | 'applied'
  | 'cv_screening'
  | 'hr_interview'
  | 'technical_interview'
  | 'manager_interview'
  | 'offer'
  | 'hired'
  | 'rejected';

export interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  position: string;
  department: string;
  experience: number; // years
  education: string;
  skills: string[];
  certifications: string[];
  stage: PipelineStage;
  matchingScore?: number;
  source: 'linkedin' | 'website' | 'referral' | 'headhunt' | 'other';
  appliedDate: string;
  notes: string;
  tags: string[];
  cvUrl?: string;
  portfolio?: string;
  expectedSalary?: number;
  currentSalary?: number;
  location: string;
  interviewHistory: Interview[];
  talentPool?: boolean;
}

export interface Interview {
  id: string;
  candidateId: string;
  type: 'hr' | 'technical' | 'manager';
  date: string;
  interviewers: string[];
  result?: 'pass' | 'fail' | 'pending';
  feedback?: string;
  score?: number;
}

// ============ JOB / RECRUITMENT ============
export interface Job {
  id: string;
  title: string;
  department: string;
  headcount: number;
  filled: number;
  type: 'full-time' | 'part-time' | 'intern' | 'contract';
  status: 'draft' | 'open' | 'paused' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  description: string;
  requirements: string[];
  benefits: string[];
  salaryMin?: number;
  salaryMax?: number;
  location: string;
  remote: boolean;
  postedDate: string;
  deadline?: string;
  requestId?: string;
}

export interface RecruitmentRequest {
  id: string;
  position: string;
  department: string;
  headcount: number;
  type: 'full-time' | 'part-time' | 'intern' | 'contract';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  neededBy: string;
  reason: string;
  status: 'pending' | 'approved_tl' | 'approved_dh' | 'approved_hr' | 'approved' | 'rejected';
  requestedBy: string;
  requestedDate: string;
  approvals: Approval[];
  jobId?: string;
  notes: string;
}

export interface Approval {
  role: 'team_lead' | 'dept_head' | 'hr';
  approvedBy?: string;
  date?: string;
  status: 'pending' | 'approved' | 'rejected';
  note?: string;
}

// ============ ANALYTICS ============
export interface RecruitmentMetrics {
  totalPositions: number;
  totalCandidates: number;
  hired: number;
  timeToHire: number; // days
  timeToFill: number; // days
  offerAcceptanceRate: number;
  interviewToHireRatio: number;
}

// ============ LMS ============
export interface Course {
  id: string;
  title: string;
  description: string;
  category: 'onboarding' | 'technical' | 'soft_skills' | 'leadership' | 'compliance';
  instructor: string;
  duration: number; // minutes
  lessons: number;
  enrolledCount: number;
  completionRate: number;
  rating: number;
  tags: string[];
  thumbnail?: string;
  status: 'draft' | 'published';
  createdDate: string;
}

export interface LearningPath {
  id: string;
  title: string;
  description: string;
  targetAudience: string;
  courses: string[]; // course IDs
  totalDuration: number;
  enrolledCount: number;
  completionRate: number;
  category: 'onboarding' | 'technical' | 'soft_skills' | 'leadership';
}

export interface Enrollment {
  id: string;
  userId: string;
  courseId: string;
  enrolledDate: string;
  progress: number; // 0-100
  completedDate?: string;
  score?: number;
  certified: boolean;
}

// ============ CHAT ============
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

// ============ USER ============
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'hr_admin' | 'hr_recruiter' | 'hiring_manager' | 'employee' | 'team_lead' | 'dept_head';
  department: string;
  avatar?: string;
}
