import { useState } from 'react';
import { Plus, Search, Briefcase, Users, MapPin, Clock, Edit2, Eye } from 'lucide-react';
import Header from '../../components/layout/Header';
import { StatusBadge, PriorityBadge } from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import { mockJobs } from '../../data/mockData';
import type { Job } from '../../types';

function JobRow({ job, onClick }: { job: Job; onClick: () => void }) {
  const fillRate = Math.round((job.filled / job.headcount) * 100);
  return (
    <tr className="hover:bg-gray-50 transition-colors cursor-pointer" onClick={onClick}>
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
            <Briefcase size={16} className="text-blue-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">{job.title}</p>
            <p className="text-xs text-gray-500">{job.department}</p>
          </div>
        </div>
      </td>
      <td className="px-4 py-3"><StatusBadge status={job.status} /></td>
      <td className="px-4 py-3"><PriorityBadge priority={job.priority} /></td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex-1 h-1.5 bg-gray-100 rounded-full w-16">
            <div className="h-full bg-blue-500 rounded-full" style={{ width: `${fillRate}%` }} />
          </div>
          <span className="text-xs text-gray-600">{job.filled}/{job.headcount}</span>
        </div>
      </td>
      <td className="px-4 py-3">
        <span className="badge bg-gray-100 text-gray-600 capitalize">{job.type.replace('-', ' ')}</span>
      </td>
      <td className="px-4 py-3">
        <span className="flex items-center gap-1 text-xs text-gray-500"><MapPin size={11} />{job.location}</span>
      </td>
      <td className="px-4 py-3">
        {job.salaryMin && (
          <span className="text-xs text-gray-600">
            {(job.salaryMin / 1000000).toFixed(0)}-{(job.salaryMax! / 1000000).toFixed(0)}tr
          </span>
        )}
      </td>
      <td className="px-4 py-3">
        <span className="flex items-center gap-1 text-xs text-gray-400"><Clock size={11} />{job.postedDate}</span>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-1">
          <button className="p-1 hover:bg-blue-50 rounded text-blue-600" onClick={e => { e.stopPropagation(); }}>
            <Eye size={14} />
          </button>
          <button className="p-1 hover:bg-gray-100 rounded text-gray-500" onClick={e => { e.stopPropagation(); }}>
            <Edit2 size={14} />
          </button>
        </div>
      </td>
    </tr>
  );
}

export default function Jobs() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selected, setSelected] = useState<Job | null>(null);
  const [showAdd, setShowAdd] = useState(false);

  const filtered = mockJobs.filter(j => {
    const matchSearch = j.title.toLowerCase().includes(search.toLowerCase()) ||
      j.department.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !statusFilter || j.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div>
      <Header title="Vị trí tuyển dụng" subtitle={`${mockJobs.filter(j => j.status === 'open').length} vị trí đang mở`} />
      <div className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Tìm theo tên vị trí, phòng ban..." className="input-field pl-9" />
          </div>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="select-field w-36">
            <option value="">Tất cả trạng thái</option>
            <option value="open">Đang tuyển</option>
            <option value="paused">Tạm dừng</option>
            <option value="closed">Đã đóng</option>
          </select>
          <button className="btn-primary" onClick={() => setShowAdd(true)}><Plus size={14} />Đăng JD mới</button>
        </div>

        <div className="card overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {['Vị trí', 'Trạng thái', 'Ưu tiên', 'Tiến độ', 'Loại', 'Địa điểm', 'Lương (VNĐ)', 'Ngày đăng', ''].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map(j => <JobRow key={j.id} job={j} onClick={() => setSelected(j)} />)}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <Briefcase size={36} className="mx-auto mb-2 opacity-30" />
              <p>Không tìm thấy vị trí nào</p>
            </div>
          )}
        </div>
      </div>

      {selected && (
        <Modal isOpen={true} onClose={() => setSelected(null)} title={selected.title} size="lg">
          <div className="space-y-4">
            <div className="flex gap-2 flex-wrap">
              <StatusBadge status={selected.status} />
              <PriorityBadge priority={selected.priority} />
              <span className="badge bg-gray-100 text-gray-600">{selected.type}</span>
              {selected.remote && <span className="badge bg-green-100 text-green-700">Remote</span>}
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><span className="text-gray-500">Phòng ban: </span><strong>{selected.department}</strong></div>
              <div><span className="text-gray-500">Headcount: </span><strong>{selected.filled}/{selected.headcount}</strong></div>
              <div><span className="text-gray-500">Địa điểm: </span><strong>{selected.location}</strong></div>
              {selected.salaryMin && <div><span className="text-gray-500">Lương: </span><strong>{(selected.salaryMin/1e6).toFixed(0)}-{(selected.salaryMax!/1e6).toFixed(0)}tr VNĐ</strong></div>}
              {selected.deadline && <div><span className="text-gray-500">Deadline: </span><strong>{selected.deadline}</strong></div>}
            </div>
            <div>
              <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">Mô tả</h4>
              <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">{selected.description}</p>
            </div>
            <div>
              <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">Yêu cầu</h4>
              <ul className="space-y-1">
                {selected.requirements.map((r, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full flex-shrink-0" />{r}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">Quyền lợi</h4>
              <ul className="space-y-1">
                {selected.benefits.map((b, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full flex-shrink-0" />{b}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex gap-2 pt-2">
              <button className="btn-primary"><Users size={14} />Xem ứng viên</button>
              <button className="btn-secondary"><Edit2 size={14} />Chỉnh sửa JD</button>
            </div>
          </div>
        </Modal>
      )}

      {showAdd && (
        <Modal isOpen={true} onClose={() => setShowAdd(false)} title="Đăng vị trí tuyển dụng mới" size="xl">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-xs font-medium text-gray-700 mb-1">Tên vị trí *</label>
                <input className="input-field" placeholder="Senior Frontend Developer" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Phòng ban</label>
                <select className="select-field"><option>Engineering</option><option>Product</option><option>Design</option><option>Data</option></select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Số lượng tuyển</label>
                <input className="input-field" type="number" defaultValue={1} />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Loại hình</label>
                <select className="select-field"><option>full-time</option><option>part-time</option><option>intern</option></select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Mức độ ưu tiên</label>
                <select className="select-field"><option>medium</option><option>high</option><option>urgent</option><option>low</option></select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Lương từ (VNĐ)</label>
                <input className="input-field" type="number" placeholder="20000000" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Lương đến (VNĐ)</label>
                <input className="input-field" type="number" placeholder="40000000" />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-medium text-gray-700 mb-1">Mô tả công việc</label>
                <textarea className="input-field h-24 resize-none" placeholder="Mô tả chi tiết về vị trí và trách nhiệm..." />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button className="btn-secondary" onClick={() => setShowAdd(false)}>Hủy</button>
              <button className="btn-primary">Đăng JD</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
