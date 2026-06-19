import type { PipelineStage } from '../../types';

const stageConfig: Record<PipelineStage, { label: string; color: string }> = {
  applied: { label: 'Applied', color: 'bg-gray-100 text-gray-700' },
  cv_screening: { label: 'CV Screening', color: 'bg-blue-100 text-blue-700' },
  hr_interview: { label: 'HR Interview', color: 'bg-purple-100 text-purple-700' },
  technical_interview: { label: 'Technical', color: 'bg-orange-100 text-orange-700' },
  manager_interview: { label: 'Manager', color: 'bg-yellow-100 text-yellow-700' },
  offer: { label: 'Offer', color: 'bg-indigo-100 text-indigo-700' },
  hired: { label: 'Hired', color: 'bg-green-100 text-green-700' },
  rejected: { label: 'Rejected', color: 'bg-red-100 text-red-600' },
};

interface StageBadgeProps { stage: PipelineStage }
export function StageBadge({ stage }: StageBadgeProps) {
  const cfg = stageConfig[stage];
  return <span className={`badge ${cfg.color}`}>{cfg.label}</span>;
}

interface PriorityBadgeProps { priority: 'low' | 'medium' | 'high' | 'urgent' }
const priorityConfig = {
  low: 'bg-gray-100 text-gray-600',
  medium: 'bg-blue-100 text-blue-700',
  high: 'bg-orange-100 text-orange-700',
  urgent: 'bg-red-100 text-red-700',
};
const priorityLabel = { low: 'Thấp', medium: 'Trung bình', high: 'Cao', urgent: 'Khẩn cấp' };
export function PriorityBadge({ priority }: PriorityBadgeProps) {
  return <span className={`badge ${priorityConfig[priority]}`}>{priorityLabel[priority]}</span>;
}

interface StatusBadgeProps { status: string; label?: string }
export function StatusBadge({ status, label }: StatusBadgeProps) {
  const colors: Record<string, string> = {
    open: 'bg-green-100 text-green-700',
    closed: 'bg-gray-100 text-gray-600',
    paused: 'bg-yellow-100 text-yellow-700',
    draft: 'bg-gray-100 text-gray-500',
    approved: 'bg-green-100 text-green-700',
    pending: 'bg-yellow-100 text-yellow-700',
    rejected: 'bg-red-100 text-red-600',
    approved_tl: 'bg-blue-100 text-blue-700',
    approved_dh: 'bg-indigo-100 text-indigo-700',
    approved_hr: 'bg-purple-100 text-purple-700',
    published: 'bg-green-100 text-green-700',
    full_time: 'bg-blue-100 text-blue-700',
    part_time: 'bg-purple-100 text-purple-700',
    intern: 'bg-orange-100 text-orange-700',
    contract: 'bg-gray-100 text-gray-700',
  };
  const labels: Record<string, string> = {
    open: 'Đang tuyển', closed: 'Đã đóng', paused: 'Tạm dừng', draft: 'Nháp',
    approved: 'Đã duyệt', pending: 'Chờ duyệt', rejected: 'Từ chối',
    approved_tl: 'TL đã duyệt', approved_dh: 'DH đã duyệt', approved_hr: 'HR đã duyệt',
    published: 'Đã xuất bản',
  };
  return (
    <span className={`badge ${colors[status] || 'bg-gray-100 text-gray-600'}`}>
      {label || labels[status] || status}
    </span>
  );
}

interface ScoreBadgeProps { score: number }
export function ScoreBadge({ score }: ScoreBadgeProps) {
  const color = score >= 85 ? 'bg-green-100 text-green-700' : score >= 70 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-600';
  return <span className={`badge ${color} font-semibold`}>{score}%</span>;
}
