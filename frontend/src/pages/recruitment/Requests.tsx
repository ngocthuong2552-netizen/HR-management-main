import { useState } from 'react';
import { Plus, CheckCircle, XCircle, Clock, ChevronRight, User } from 'lucide-react';
import Header from '../../components/layout/Header';
import { PriorityBadge, StatusBadge } from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import { mockRequests } from '../../data/mockData';
import type { RecruitmentRequest, Approval } from '../../types';

const statusLabels: Record<string, string> = {
  pending: 'Chờ TL duyệt', approved_tl: 'TL đã duyệt', approved_dh: 'DH đã duyệt',
  approved_hr: 'HR đã duyệt', approved: 'Đã phê duyệt', rejected: 'Từ chối',
};

function ApprovalStep({ approval, step }: { approval: Approval; step: string }) {
  return (
    <div className={`flex items-center gap-3 p-3 rounded-xl border ${
      approval.status === 'approved' ? 'bg-green-50 border-green-200' :
      approval.status === 'rejected' ? 'bg-red-50 border-red-200' :
      'bg-gray-50 border-gray-200'
    }`}>
      {approval.status === 'approved' ? (
        <CheckCircle size={18} className="text-green-500 flex-shrink-0" />
      ) : approval.status === 'rejected' ? (
        <XCircle size={18} className="text-red-500 flex-shrink-0" />
      ) : (
        <Clock size={18} className="text-gray-400 flex-shrink-0" />
      )}
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-800">{step}</p>
        {approval.approvedBy && <p className="text-xs text-gray-500 mt-0.5">{approval.approvedBy} • {approval.date}</p>}
        {approval.note && <p className="text-xs text-gray-600 italic mt-1">"{approval.note}"</p>}
      </div>
      <span className={`text-xs font-medium ${
        approval.status === 'approved' ? 'text-green-600' :
        approval.status === 'rejected' ? 'text-red-600' : 'text-gray-400'
      }`}>
        {approval.status === 'approved' ? 'Đã duyệt' : approval.status === 'rejected' ? 'Từ chối' : 'Chờ duyệt'}
      </span>
    </div>
  );
}

function RequestCard({ req, onClick }: { req: RecruitmentRequest; onClick: () => void }) {
  const approvedCount = req.approvals.filter(a => a.status === 'approved').length;
  return (
    <div className="card p-4 hover:shadow-md transition-all cursor-pointer" onClick={onClick}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-sm font-semibold text-gray-900">{req.position}</h3>
            <PriorityBadge priority={req.priority} />
          </div>
          <p className="text-xs text-gray-500 mt-1">{req.department} • {req.headcount} người • {req.type}</p>
          <p className="text-xs text-gray-400 mt-1">
            <span className="flex items-center gap-1 inline-flex"><User size={10} />{req.requestedBy}</span>
          </p>
        </div>
        <div className="text-right flex-shrink-0">
          <StatusBadge status={req.status} label={statusLabels[req.status]} />
          <p className="text-xs text-gray-400 mt-1">{req.requestedDate}</p>
        </div>
      </div>

      {/* Approval progress */}
      <div className="mt-3 pt-3 border-t border-gray-100">
        <div className="flex items-center gap-2">
          <div className="flex-1 h-1.5 bg-gray-100 rounded-full">
            <div
              className="h-full bg-blue-500 rounded-full transition-all"
              style={{ width: `${(approvedCount / 3) * 100}%` }}
            />
          </div>
          <span className="text-xs text-gray-500">{approvedCount}/3 duyệt</span>
        </div>
        <div className="flex items-center gap-1 mt-2">
          {['Team Lead', 'Dept Head', 'HR'].map((step, i) => (
            <div key={step} className="flex items-center gap-1">
              <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                req.approvals[i].status === 'approved' ? 'bg-green-500 text-white' :
                req.approvals[i].status === 'rejected' ? 'bg-red-500 text-white' :
                'bg-gray-200 text-gray-500'
              }`}>
                {req.approvals[i].status === 'approved' ? '✓' : req.approvals[i].status === 'rejected' ? '✗' : i+1}
              </div>
              <span className="text-xs text-gray-400">{step}</span>
              {i < 2 && <ChevronRight size={10} className="text-gray-300" />}
            </div>
          ))}
        </div>
      </div>

      {req.reason && (
        <p className="text-xs text-gray-500 mt-2 bg-gray-50 px-2 py-1.5 rounded-lg italic">
          Lý do: {req.reason}
        </p>
      )}
    </div>
  );
}

export default function Requests() {
  const [selected, setSelected] = useState<RecruitmentRequest | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [filter, setFilter] = useState('all');

  const filtered = mockRequests.filter(r => filter === 'all' || r.status === filter);

  return (
    <div>
      <Header title="Yêu cầu tuyển dụng" subtitle="Quản lý & phê duyệt yêu cầu từ các phòng ban" />
      <div className="p-6">
        {/* Summary */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          {[
            { label: 'Tổng yêu cầu', count: mockRequests.length, color: 'text-gray-900' },
            { label: 'Chờ xử lý', count: mockRequests.filter(r => r.status === 'pending' || r.status === 'approved_tl' || r.status === 'approved_dh').length, color: 'text-yellow-600' },
            { label: 'Đã phê duyệt', count: mockRequests.filter(r => r.status === 'approved').length, color: 'text-green-600' },
            { label: 'Từ chối', count: mockRequests.filter(r => r.status === 'rejected').length, color: 'text-red-600' },
          ].map(s => (
            <div key={s.label} className="card p-4 text-center">
              <div className={`text-2xl font-bold ${s.color}`}>{s.count}</div>
              <p className="text-xs text-gray-500 mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="flex gap-1.5">
            {[
              { value: 'all', label: 'Tất cả' },
              { value: 'pending', label: 'Chờ duyệt' },
              { value: 'approved', label: 'Đã duyệt' },
              { value: 'rejected', label: 'Từ chối' },
            ].map(f => (
              <button
                key={f.value}
                onClick={() => setFilter(f.value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${filter === f.value ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 border border-gray-200'}`}
              >
                {f.label}
              </button>
            ))}
          </div>
          <button className="btn-primary" onClick={() => setShowAdd(true)}><Plus size={14} />Tạo yêu cầu</button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filtered.map(r => <RequestCard key={r.id} req={r} onClick={() => setSelected(r)} />)}
        </div>
      </div>

      {/* Detail Modal */}
      {selected && (
        <Modal isOpen={true} onClose={() => setSelected(null)} title="Chi tiết yêu cầu tuyển dụng" size="lg">
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><span className="text-gray-500">Vị trí:</span> <strong>{selected.position}</strong></div>
              <div><span className="text-gray-500">Phòng ban:</span> <strong>{selected.department}</strong></div>
              <div><span className="text-gray-500">Số lượng:</span> <strong>{selected.headcount}</strong></div>
              <div><span className="text-gray-500">Loại:</span> <strong>{selected.type}</strong></div>
              <div><span className="text-gray-500">Cần vào:</span> <strong>{selected.neededBy}</strong></div>
              <div><span className="text-gray-500">Người tạo:</span> <strong>{selected.requestedBy}</strong></div>
            </div>
            <div>
              <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">Lý do tuyển dụng</h4>
              <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">{selected.reason}</p>
            </div>
            <div>
              <h4 className="text-xs font-semibold text-gray-500 uppercase mb-3">Quy trình phê duyệt</h4>
              <div className="space-y-2">
                <ApprovalStep approval={selected.approvals[0]} step="Team Lead" />
                <ApprovalStep approval={selected.approvals[1]} step="Department Head" />
                <ApprovalStep approval={selected.approvals[2]} step="HR Manager" />
              </div>
            </div>
            {selected.status !== 'approved' && selected.status !== 'rejected' && (
              <div className="flex gap-2 pt-2 border-t">
                <button className="btn-primary flex-1 justify-center">
                  <CheckCircle size={14} />Phê duyệt
                </button>
                <button className="btn-danger flex-1 justify-center">
                  <XCircle size={14} />Từ chối
                </button>
              </div>
            )}
          </div>
        </Modal>
      )}

      {/* Add Modal */}
      {showAdd && (
        <Modal isOpen={true} onClose={() => setShowAdd(false)} title="Tạo yêu cầu tuyển dụng mới" size="lg">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-xs font-medium text-gray-700 mb-1">Tên vị trí *</label>
                <input className="input-field" placeholder="Senior Developer" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Phòng ban</label>
                <select className="select-field"><option>Engineering</option><option>Product</option><option>Design</option><option>Finance</option></select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Số lượng cần tuyển</label>
                <input className="input-field" type="number" defaultValue={1} />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Loại hình làm việc</label>
                <select className="select-field"><option>full-time</option><option>part-time</option><option>intern</option><option>contract</option></select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Mức độ ưu tiên</label>
                <select className="select-field"><option>medium</option><option>high</option><option>urgent</option><option>low</option></select>
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-medium text-gray-700 mb-1">Thời gian cần nhân sự</label>
                <input className="input-field" type="date" />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-medium text-gray-700 mb-1">Lý do tuyển dụng *</label>
                <textarea className="input-field h-20 resize-none" placeholder="Mở rộng team / thay thế nhân sự / dự án mới..." />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button className="btn-secondary" onClick={() => setShowAdd(false)}>Hủy</button>
              <button className="btn-primary">Gửi yêu cầu</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
