import type { Candidate, Job, RecruitmentRequest, Course, LearningPath, RecruitmentMetrics } from '../types';

export const mockCandidates: Candidate[] = [
  {
    id: '1', name: 'Nguyễn Văn An', email: 'an.nguyen@email.com', phone: '0901234567',
    position: 'Senior Frontend Developer', department: 'Engineering', experience: 5,
    education: 'Đại học Bách Khoa TP.HCM - Kỹ thuật Phần mềm',
    skills: ['React', 'TypeScript', 'Node.js', 'GraphQL', 'Docker'],
    certifications: ['AWS Certified Developer', 'Google Cloud Professional'],
    stage: 'technical_interview', matchingScore: 92, source: 'linkedin',
    appliedDate: '2026-06-01', notes: 'Ứng viên xuất sắc, có kinh nghiệm tốt.',
    tags: ['senior', 'react', 'fullstack'], location: 'TP.HCM',
    expectedSalary: 45000000, currentSalary: 35000000, talentPool: false,
    interviewHistory: [
      { id: 'i1', candidateId: '1', type: 'hr', date: '2026-06-05', interviewers: ['Trần Thị Lan'], result: 'pass', score: 8, feedback: 'Giao tiếp tốt, thái độ chuyên nghiệp' }
    ]
  },
  {
    id: '2', name: 'Trần Thị Bích', email: 'bich.tran@email.com', phone: '0912345678',
    position: 'Product Manager', department: 'Product', experience: 4,
    education: 'Đại học Kinh tế TP.HCM - Quản trị Kinh doanh',
    skills: ['Product Strategy', 'Agile/Scrum', 'Data Analysis', 'Figma', 'SQL'],
    certifications: ['PMP', 'Scrum Master'],
    stage: 'offer', matchingScore: 88, source: 'referral',
    appliedDate: '2026-05-28', notes: 'Có background kinh doanh tốt',
    tags: ['pm', 'agile'], location: 'Hà Nội',
    expectedSalary: 40000000, currentSalary: 30000000, talentPool: false,
    interviewHistory: []
  },
  {
    id: '3', name: 'Lê Minh Cường', email: 'cuong.le@email.com', phone: '0923456789',
    position: 'Data Scientist', department: 'Data', experience: 3,
    education: 'Đại học Khoa học Tự nhiên - Toán Tin',
    skills: ['Python', 'Machine Learning', 'TensorFlow', 'SQL', 'Tableau'],
    certifications: ['TensorFlow Developer Certificate'],
    stage: 'hr_interview', matchingScore: 85, source: 'website',
    appliedDate: '2026-06-10', notes: 'Portfolio ấn tượng, nhiều dự án ML',
    tags: ['ml', 'python', 'data'], location: 'TP.HCM',
    expectedSalary: 35000000, talentPool: false,
    interviewHistory: []
  },
  {
    id: '4', name: 'Phạm Thị Dung', email: 'dung.pham@email.com', phone: '0934567890',
    position: 'UX/UI Designer', department: 'Design', experience: 2,
    education: 'Đại học Mỹ thuật TP.HCM - Thiết kế Đồ họa',
    skills: ['Figma', 'Adobe XD', 'Sketch', 'Prototyping', 'User Research'],
    certifications: ['Google UX Design Certificate'],
    stage: 'cv_screening', matchingScore: 79, source: 'linkedin',
    appliedDate: '2026-06-12', notes: '',
    tags: ['ux', 'design'], location: 'Đà Nẵng',
    expectedSalary: 25000000, talentPool: false,
    interviewHistory: []
  },
  {
    id: '5', name: 'Hoàng Văn Em', email: 'em.hoang@email.com', phone: '0945678901',
    position: 'DevOps Engineer', department: 'Infrastructure', experience: 6,
    education: 'Đại học Bách Khoa Hà Nội - Công nghệ Thông tin',
    skills: ['Kubernetes', 'Docker', 'AWS', 'Terraform', 'CI/CD', 'Linux'],
    certifications: ['AWS Solutions Architect', 'CKA'],
    stage: 'applied', matchingScore: 94, source: 'headhunt',
    appliedDate: '2026-06-15', notes: 'Ứng viên cực kỳ mạnh',
    tags: ['devops', 'k8s', 'aws'], location: 'Hà Nội',
    expectedSalary: 55000000, currentSalary: 45000000, talentPool: true,
    interviewHistory: []
  },
  {
    id: '6', name: 'Nguyễn Thị Fang', email: 'fang.nguyen@email.com', phone: '0956789012',
    position: 'Backend Developer', department: 'Engineering', experience: 3,
    education: 'FPT University - Software Engineering',
    skills: ['Java', 'Spring Boot', 'PostgreSQL', 'Redis', 'Microservices'],
    certifications: [],
    stage: 'manager_interview', matchingScore: 81, source: 'website',
    appliedDate: '2026-05-20', notes: 'Tốt về backend Java',
    tags: ['java', 'backend'], location: 'TP.HCM',
    expectedSalary: 30000000, talentPool: false,
    interviewHistory: []
  },
  {
    id: '7', name: 'Bùi Văn Giang', email: 'giang.bui@email.com', phone: '0967890123',
    position: 'Marketing Manager', department: 'Marketing', experience: 7,
    education: 'RMIT Vietnam - Marketing',
    skills: ['Digital Marketing', 'SEO/SEM', 'Content Strategy', 'Google Analytics', 'HubSpot'],
    certifications: ['Google Ads Certified', 'HubSpot Marketing'],
    stage: 'hired', matchingScore: 90, source: 'referral',
    appliedDate: '2026-05-15', notes: 'Đã ký hợp đồng, onboarding tuần tới',
    tags: ['marketing', 'digital'], location: 'TP.HCM',
    expectedSalary: 50000000, currentSalary: 42000000, talentPool: false,
    interviewHistory: []
  },
  {
    id: '8', name: 'Đỗ Thị Hà', email: 'ha.do@email.com', phone: '0978901234',
    position: 'QA Engineer', department: 'Engineering', experience: 2,
    education: 'Đại học FPT - Công nghệ Thông tin',
    skills: ['Selenium', 'JUnit', 'Postman', 'JIRA', 'Test Planning'],
    certifications: ['ISTQB Foundation'],
    stage: 'rejected', matchingScore: 62, source: 'website',
    appliedDate: '2026-06-03', notes: 'Kinh nghiệm còn ít so với yêu cầu',
    tags: ['qa', 'testing'], location: 'TP.HCM',
    expectedSalary: 20000000, talentPool: false,
    interviewHistory: []
  },
];

export const mockJobs: Job[] = [
  {
    id: 'j1', title: 'Senior Frontend Developer', department: 'Engineering',
    headcount: 2, filled: 0, type: 'full-time', status: 'open', priority: 'high',
    description: 'Tìm kiếm Frontend Developer giàu kinh nghiệm với React & TypeScript.',
    requirements: ['5+ năm kinh nghiệm React', 'TypeScript thành thạo', 'Kinh nghiệm GraphQL'],
    benefits: ['Lương cạnh tranh', 'Bảo hiểm sức khỏe', 'WFH linh hoạt'],
    salaryMin: 35000000, salaryMax: 55000000, location: 'TP.HCM', remote: true,
    postedDate: '2026-05-20', deadline: '2026-07-31', requestId: 'req1',
  },
  {
    id: 'j2', title: 'Product Manager', department: 'Product',
    headcount: 1, filled: 0, type: 'full-time', status: 'open', priority: 'urgent',
    description: 'Quản lý sản phẩm B2B SaaS với đội ngũ cross-functional.',
    requirements: ['4+ năm kinh nghiệm PM', 'Kinh nghiệm SaaS', 'Kỹ năng data-driven'],
    benefits: ['Stock options', 'Lương top 20%', 'Training budget'],
    salaryMin: 30000000, salaryMax: 50000000, location: 'Hà Nội', remote: false,
    postedDate: '2026-05-25', requestId: 'req2',
  },
  {
    id: 'j3', title: 'Data Scientist', department: 'Data',
    headcount: 2, filled: 1, type: 'full-time', status: 'open', priority: 'medium',
    description: 'Xây dựng các mô hình ML/AI để phân tích dữ liệu kinh doanh.',
    requirements: ['Python/R thành thạo', 'Kinh nghiệm Deep Learning', 'SQL nâng cao'],
    benefits: ['GPU workstation', 'Conference budget', 'Research time'],
    salaryMin: 25000000, salaryMax: 45000000, location: 'TP.HCM', remote: true,
    postedDate: '2026-06-01',
  },
  {
    id: 'j4', title: 'DevOps Engineer', department: 'Infrastructure',
    headcount: 1, filled: 0, type: 'full-time', status: 'open', priority: 'high',
    description: 'Quản lý hạ tầng cloud và CI/CD pipeline.',
    requirements: ['Kubernetes', 'AWS/GCP', 'Terraform', 'Linux admin'],
    benefits: ['Lương hấp dẫn', 'Thiết bị high-end', 'Remote 100%'],
    salaryMin: 40000000, salaryMax: 65000000, location: 'Remote', remote: true,
    postedDate: '2026-06-05',
  },
  {
    id: 'j5', title: 'Marketing Intern', department: 'Marketing',
    headcount: 3, filled: 2, type: 'intern', status: 'open', priority: 'low',
    description: 'Thực tập sinh marketing hỗ trợ digital marketing campaigns.',
    requirements: ['Sinh viên năm 3-4', 'Đam mê marketing', 'Kỹ năng viết tốt'],
    benefits: ['Phụ cấp 5tr/tháng', 'Mentorship', 'Cơ hội chính thức'],
    salaryMin: 5000000, salaryMax: 7000000, location: 'TP.HCM', remote: false,
    postedDate: '2026-06-10',
  },
];

export const mockRequests: RecruitmentRequest[] = [
  {
    id: 'req1', position: 'Senior Frontend Developer', department: 'Engineering',
    headcount: 2, type: 'full-time', priority: 'high',
    neededBy: '2026-08-01', reason: 'Mở rộng team phát triển sản phẩm mới',
    status: 'approved',
    requestedBy: 'Nguyễn Minh Tuấn (Engineering Lead)', requestedDate: '2026-05-15',
    jobId: 'j1', notes: 'Ưu tiên ứng viên có kinh nghiệm startup',
    approvals: [
      { role: 'team_lead', approvedBy: 'Nguyễn Minh Tuấn', date: '2026-05-16', status: 'approved', note: 'Cần gấp cho Q3' },
      { role: 'dept_head', approvedBy: 'Trần Văn Bình', date: '2026-05-17', status: 'approved', note: 'Đồng ý' },
      { role: 'hr', approvedBy: 'Lê Thị Mai', date: '2026-05-18', status: 'approved', note: 'Đã tạo JD' },
    ],
  },
  {
    id: 'req2', position: 'Product Manager', department: 'Product',
    headcount: 1, type: 'full-time', priority: 'urgent',
    neededBy: '2026-07-15', reason: 'Trưởng nhóm PM hiện tại nghỉ việc',
    status: 'approved_dh',
    requestedBy: 'Phạm Văn Cường (CPO)', requestedDate: '2026-05-20',
    notes: '',
    approvals: [
      { role: 'team_lead', approvedBy: 'Phạm Văn Cường', date: '2026-05-21', status: 'approved', note: 'Rất cần thiết' },
      { role: 'dept_head', approvedBy: 'Lê Văn Đức', date: '2026-05-22', status: 'approved' },
      { role: 'hr', status: 'pending' },
    ],
  },
  {
    id: 'req3', position: 'UI/UX Designer', department: 'Design',
    headcount: 1, type: 'full-time', priority: 'medium',
    neededBy: '2026-09-01', reason: 'Tăng cường capacity thiết kế cho năm 2026',
    status: 'pending',
    requestedBy: 'Hoàng Thị Linh (Design Lead)', requestedDate: '2026-06-10',
    notes: 'Cần người có kinh nghiệm B2C',
    approvals: [
      { role: 'team_lead', status: 'pending' },
      { role: 'dept_head', status: 'pending' },
      { role: 'hr', status: 'pending' },
    ],
  },
  {
    id: 'req4', position: 'Kế toán trưởng', department: 'Finance',
    headcount: 1, type: 'full-time', priority: 'high',
    neededBy: '2026-07-01', reason: 'Kế toán trưởng hiện tại sắp nghỉ hưu',
    status: 'approved_tl',
    requestedBy: 'Vũ Văn Phúc (CFO)', requestedDate: '2026-06-05',
    notes: '',
    approvals: [
      { role: 'team_lead', approvedBy: 'Vũ Văn Phúc', date: '2026-06-06', status: 'approved' },
      { role: 'dept_head', status: 'pending' },
      { role: 'hr', status: 'pending' },
    ],
  },
];

export const mockCourses: Course[] = [
  {
    id: 'c1', title: 'Onboarding: Văn hóa & Quy trình Công ty',
    description: 'Khóa học bắt buộc cho nhân viên mới. Tìm hiểu về văn hóa, giá trị và quy trình làm việc.',
    category: 'onboarding', instructor: 'HR Team', duration: 240,
    lessons: 12, enrolledCount: 156, completionRate: 94, rating: 4.8,
    tags: ['bắt buộc', 'nhân viên mới'], status: 'published', createdDate: '2026-01-01',
  },
  {
    id: 'c2', title: 'React Advanced Patterns',
    description: 'Các pattern nâng cao trong React: Custom Hooks, Context, Performance Optimization.',
    category: 'technical', instructor: 'Nguyễn Văn Dũng', duration: 480,
    lessons: 24, enrolledCount: 42, completionRate: 67, rating: 4.9,
    tags: ['react', 'javascript', 'frontend'], status: 'published', createdDate: '2026-02-15',
  },
  {
    id: 'c3', title: 'Kỹ năng Giao tiếp Chuyên nghiệp',
    description: 'Nâng cao kỹ năng giao tiếp, thuyết trình và làm việc nhóm.',
    category: 'soft_skills', instructor: 'Trần Thị Hương', duration: 180,
    lessons: 9, enrolledCount: 89, completionRate: 82, rating: 4.6,
    tags: ['communication', 'presentation'], status: 'published', createdDate: '2026-03-01',
  },
  {
    id: 'c4', title: 'Leadership Fundamentals',
    description: 'Kỹ năng lãnh đạo cơ bản: quản lý nhóm, ra quyết định, coaching.',
    category: 'leadership', instructor: 'Lê Văn Minh', duration: 360,
    lessons: 18, enrolledCount: 28, completionRate: 71, rating: 4.7,
    tags: ['leadership', 'management'], status: 'published', createdDate: '2026-04-01',
  },
  {
    id: 'c5', title: 'Machine Learning với Python',
    description: 'Từ cơ bản đến nâng cao: scikit-learn, TensorFlow, model deployment.',
    category: 'technical', instructor: 'Phạm Văn Khoa', duration: 720,
    lessons: 36, enrolledCount: 35, completionRate: 45, rating: 4.9,
    tags: ['ml', 'python', 'ai'], status: 'published', createdDate: '2026-05-01',
  },
  {
    id: 'c6', title: 'Agile & Scrum Mastery',
    description: 'Hiểu sâu về Agile methodology và cách áp dụng Scrum trong thực tế.',
    category: 'technical', instructor: 'Nguyễn Thị Lan', duration: 300,
    lessons: 15, enrolledCount: 63, completionRate: 78, rating: 4.5,
    tags: ['agile', 'scrum', 'pm'], status: 'published', createdDate: '2026-03-15',
  },
];

export const mockLearningPaths: LearningPath[] = [
  {
    id: 'lp1', title: 'New Employee Onboarding',
    description: 'Lộ trình hoàn chỉnh cho nhân viên mới gia nhập công ty',
    targetAudience: 'Tất cả nhân viên mới',
    courses: ['c1', 'c3'], totalDuration: 420,
    enrolledCount: 156, completionRate: 89,
    category: 'onboarding',
  },
  {
    id: 'lp2', title: 'Frontend Developer Track',
    description: 'Từ Junior đến Senior Frontend Developer',
    targetAudience: 'Frontend Developers',
    courses: ['c2', 'c6'], totalDuration: 780,
    enrolledCount: 35, completionRate: 58,
    category: 'technical',
  },
  {
    id: 'lp3', title: 'Management Essentials',
    description: 'Kỹ năng thiết yếu cho Team Lead và Manager',
    targetAudience: 'Team Lead, Manager',
    courses: ['c4', 'c3', 'c6'], totalDuration: 840,
    enrolledCount: 22, completionRate: 64,
    category: 'leadership',
  },
];

export const mockMetrics: RecruitmentMetrics = {
  totalPositions: 12,
  totalCandidates: 284,
  hired: 23,
  timeToHire: 28,
  timeToFill: 45,
  offerAcceptanceRate: 84,
  interviewToHireRatio: 4.2,
};

export const funnelData = [
  { stage: 'Applied', count: 284, color: '#3b82f6' },
  { stage: 'CV Screening', count: 142, color: '#8b5cf6' },
  { stage: 'HR Interview', count: 68, color: '#f59e0b' },
  { stage: 'Technical', count: 35, color: '#10b981' },
  { stage: 'Manager', count: 28, color: '#6366f1' },
  { stage: 'Offer', count: 25, color: '#ec4899' },
  { stage: 'Hired', count: 23, color: '#22c55e' },
];

export const monthlyHiringData = [
  { month: 'Jan', hired: 4, applied: 45 },
  { month: 'Feb', hired: 6, applied: 52 },
  { month: 'Mar', hired: 3, applied: 38 },
  { month: 'Apr', hired: 8, applied: 67 },
  { month: 'May', hired: 5, applied: 58 },
  { month: 'Jun', hired: 7, applied: 71 },
];

export const departmentData = [
  { dept: 'Engineering', open: 5, hired: 8 },
  { dept: 'Product', open: 2, hired: 3 },
  { dept: 'Design', open: 1, hired: 2 },
  { dept: 'Data', open: 2, hired: 4 },
  { dept: 'Marketing', open: 1, hired: 3 },
  { dept: 'Finance', open: 1, hired: 3 },
];

export const sourceData = [
  { name: 'LinkedIn', value: 38, color: '#0077b5' },
  { name: 'Website', value: 25, color: '#3b82f6' },
  { name: 'Referral', value: 22, color: '#10b981' },
  { name: 'Headhunt', value: 10, color: '#f59e0b' },
  { name: 'Other', value: 5, color: '#6b7280' },
];
