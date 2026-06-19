import { useState } from 'react';
import { Search, Filter, Plus, Download, Upload, Mail, Phone, MapPin, Star, ExternalLink, Users } from 'lucide-react';
import Header from '../../components/layout/Header';
import { StageBadge, ScoreBadge } from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import { mockCandidates } from '../../data/mockData';
import type { Candidate } from '../../types';

const stages: { value: string; label: string }[] = [
  { value: '', label: 'Tất cả' },
  { value: 'applied', label: 'Applied' },
  { value: 'cv_screening', label: 'CV Screening' },
  { value: 'hr_interview', label: 'HR Interview' },
  { value: 'technical_interview', label: 'Technical' },
  { value: 'manager_interview', label: 'Manager' },
  { value: 'offer', label: 'Offer' },
  { value: 'hired', label: 'Hired' },
  { value: 'rejected', label: 'Rejected' },
];

function CandidateCard({ candidate, onClick }: { candidate: Candidate; onClick: () => void }) {
  return (
    <div
      className="card p-4 hover:shadow-md transition-all cursor-pointer border-l-4"
      style={{ borderLeftColor: candidate.stage === 'hired' ? '#22c55e' : candidate.stage === 'rejected' ? '#ef4444' : '#3b82f6' }}
      onClick={onClick}
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
          {candidate.name.charAt(0)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-sm font-semibold text-gray-900 truncate">{candidate.name}</h3>
            {candidate.matchingScore && <ScoreBadge score={candidate.matchingScore} />}
          </div>
          <p className="text-xs text-gray-500 truncate mt-0.5">{candidate.position}</p>
          <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
            <span className="flex items-center gap-1"><MapPin size={10} />{candidate.location}</span>
            <span>{candidate.experience} năm KN</span>
            <span className="capitalize">{candidate.source}</span>
          </div>
          <div className="flex flex-wrap gap-1 mt-2">
            {candidate.skills.slice(0, 3).map(s => (
              <span key={s} className="text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">{s}</span>
            ))}
            {candidate.skills.length > 3 && (
              <span className="text-xs text-gray-400">+{candidate.skills.length - 3}</span>
            )}
          </div>
          <div className="flex items-center justify-between mt-3">
            <StageBadge stage={candidate.stage} />
            <span className="text-xs text-gray-400">{candidate.appliedDate}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function CandidateDetail({ candidate, onClose }: { candidate: Candidate; onClose: () => void }) {
  return (
    <Modal isOpen={true} onClose={onClose} title="Hồ sơ ứng viên" size="xl">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-2xl font-bold">
            {candidate.name.charAt(0)}
          </div>
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">{candidate.name}</h2>
                <p className="text-gray-600 font-medium">{candidate.position}</p>
                <p className="text-sm text-gray-500">{candidate.department}</p>
              </div>
              {candidate.matchingScore && (
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">{candidate.matchingScore}%</div>
                  <div className="text-xs text-gray-500">Matching Score</div>
                </div>
              )}
            </div>
            <div className="flex flex-wrap gap-3 mt-3 text-sm text-gray-500">
              <span className="flex items-center gap-1"><Mail size={14} />{candidate.email}</span>
              <span className="flex items-center gap-1"><Phone size={14} />{candidate.phone}</span>
              <span className="flex items-center gap-1"><MapPin size={14} />{candidate.location}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-4">
            <div>
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Thông tin</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-gray-500">Kinh nghiệm:</span><span className="font-medium">{candidate.experience} năm</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Học vấn:</span><span className="font-medium text-right max-w-[200px] text-xs">{candidate.education}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Nguồn:</span><span className="font-medium capitalize">{candidate.source}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Ngày ứng tuyển:</span><span className="font-medium">{candidate.appliedDate}</span></div>
                {candidate.expectedSalary && (
                  <div className="flex justify-between"><span className="text-gray-500">Lương mong muốn:</span><span className="font-medium">{(candidate.expectedSalary / 1000000).toFixed(0)}tr VNĐ</span></div>
                )}
              </div>
            </div>

            <div>
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Kỹ năng</h4>
              <div className="flex flex-wrap gap-1.5">
                {candidate.skills.map(s => (
                  <span key={s} className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-lg border border-blue-100">{s}</span>
                ))}
              </div>
            </div>

            {candidate.certifications.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Chứng chỉ</h4>
                <div className="space-y-1">
                  {candidate.certifications.map(c => (
                    <div key={c} className="flex items-center gap-2 text-sm">
                      <Star size={12} className="text-yellow-500" />
                      <span>{c}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            <div>
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Trạng thái Pipeline</h4>
              <div className="p-3 bg-gray-50 rounded-lg">
                <StageBadge stage={candidate.stage} />
                {candidate.talentPool && (
                  <span className="ml-2 badge bg-yellow-100 text-yellow-700">
                    <Star size={10} className="mr-1" />Talent Pool
                  </span>
                )}
              </div>
            </div>

            {candidate.interviewHistory.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Lịch sử phỏng vấn</h4>
                <div className="space-y-2">
                  {candidate.interviewHistory.map(iv => (
                    <div key={iv.id} className="p-3 border border-gray-100 rounded-lg text-sm">
                      <div className="flex justify-between items-center">
                        <span className="font-medium capitalize">{iv.type} Interview</span>
                        <span className={`badge text-xs ${iv.result === 'pass' ? 'bg-green-100 text-green-700' : iv.result === 'fail' ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'}`}>
                          {iv.result || 'Pending'}
                        </span>
                      </div>
                      <p className="text-gray-500 text-xs mt-1">{iv.date} • {iv.interviewers.join(', ')}</p>
                      {iv.feedback && <p className="text-gray-600 mt-1 text-xs italic">"{iv.feedback}"</p>}
                      {iv.score && <p className="text-xs text-gray-500 mt-1">Điểm: {iv.score}/10</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {candidate.notes && (
              <div>
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Ghi chú HR</h4>
                <p className="text-sm text-gray-600 bg-yellow-50 p-3 rounded-lg border border-yellow-100 italic">
                  "{candidate.notes}"
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2 border-t border-gray-100">
          <button className="btn-primary">
            <Mail size={14} /> Gửi email
          </button>
          <button className="btn-secondary">
            <ExternalLink size={14} /> Xem CV
          </button>
          <select className="input-field w-auto">
            <option>Chuyển stage...</option>
            {stages.slice(1).map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </div>
      </div>
    </Modal>
  );
}

export default function Candidates() {
  const [search, setSearch] = useState('');
  const [stageFilter, setStageFilter] = useState('');
  const [selected, setSelected] = useState<Candidate | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const filtered = mockCandidates.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.position.toLowerCase().includes(search.toLowerCase()) ||
      c.skills.some(s => s.toLowerCase().includes(search.toLowerCase()));
    const matchStage = !stageFilter || c.stage === stageFilter;
    return matchSearch && matchStage;
  });

  return (
    <div>
      <Header title="Cơ sở dữ liệu ứng viên" subtitle={`${mockCandidates.length} ứng viên • ${filtered.length} kết quả`} />
      <div className="p-6">
        {/* Toolbar */}
        <div className="flex items-center gap-3 mb-6 flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Tìm theo tên, vị trí, kỹ năng..."
              className="input-field pl-9"
            />
          </div>
          <select value={stageFilter} onChange={e => setStageFilter(e.target.value)} className="select-field w-44">
            {stages.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
          <button className="btn-secondary"><Filter size={14} />Bộ lọc</button>
          <button className="btn-secondary"><Download size={14} />Xuất Excel</button>
          <button className="btn-secondary"><Upload size={14} />Import CV</button>
          <button className="btn-primary" onClick={() => setShowAddModal(true)}><Plus size={14} />Thêm ứng viên</button>
        </div>

        {/* Stats summary */}
        <div className="grid grid-cols-4 lg:grid-cols-8 gap-2 mb-6">
          {stages.slice(1).map(s => {
            const count = mockCandidates.filter(c => c.stage === s.value).length;
            return (
              <button
                key={s.value}
                onClick={() => setStageFilter(stageFilter === s.value ? '' : s.value)}
                className={`p-2 rounded-lg text-center border transition-all ${stageFilter === s.value ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white hover:border-blue-300'}`}
              >
                <div className="text-lg font-bold text-gray-800">{count}</div>
                <div className="text-xs text-gray-500 leading-tight">{s.label}</div>
              </button>
            );
          })}
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <Users size={40} className="mx-auto mb-3 opacity-30" />
            <p>Không tìm thấy ứng viên nào</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(c => (
              <CandidateCard key={c.id} candidate={c} onClick={() => setSelected(c)} />
            ))}
          </div>
        )}
      </div>

      {selected && <CandidateDetail candidate={selected} onClose={() => setSelected(null)} />}

      {showAddModal && (
        <Modal isOpen={true} onClose={() => setShowAddModal(false)} title="Thêm ứng viên mới" size="lg">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Họ tên *</label>
                <input className="input-field" placeholder="Nguyễn Văn A" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Email *</label>
                <input className="input-field" type="email" placeholder="email@example.com" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Điện thoại</label>
                <input className="input-field" placeholder="0901234567" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Vị trí ứng tuyển *</label>
                <input className="input-field" placeholder="Senior Developer" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Phòng ban</label>
                <select className="select-field">
                  <option>Engineering</option><option>Product</option><option>Design</option>
                  <option>Data</option><option>Marketing</option><option>Finance</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Nguồn</label>
                <select className="select-field">
                  <option value="linkedin">LinkedIn</option>
                  <option value="website">Website</option>
                  <option value="referral">Referral</option>
                  <option value="headhunt">Headhunt</option>
                  <option value="other">Khác</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Upload CV (PDF/DOCX)</label>
              <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:border-blue-400 cursor-pointer transition-colors">
                <Upload size={24} className="mx-auto text-gray-300 mb-2" />
                <p className="text-sm text-gray-500">Kéo thả CV vào đây hoặc <span className="text-blue-600">chọn file</span></p>
                <p className="text-xs text-gray-400 mt-1">PDF, DOCX tối đa 10MB</p>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button className="btn-secondary" onClick={() => setShowAddModal(false)}>Hủy</button>
              <button className="btn-primary">Thêm ứng viên</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
