import { useEffect, useState } from 'react';
import { Search, Filter, Plus, Download, Mail, Phone, MapPin, Star, Users, Send, Loader2, CheckCircle2, Clock } from 'lucide-react';
import Header from '../../components/layout/Header';
import { StageBadge, ScoreBadge } from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import type { PipelineStage } from '../../types';
import {
  listCandidates, createCandidate, updateCandidate,
  getEmailTemplates, previewEmail, sendEmail, getEmailHistory,
  type CandidateAPI, type EmailTemplate, type EmailLog,
} from '../../api/candidates';

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

const departments = ['Engineering', 'Product', 'Design', 'Data', 'Marketing', 'Finance', 'Sales', 'Human Resources'];

// ---------- Send Email Modal ----------
function SendEmailModal({ candidate, onClose }: { candidate: CandidateAPI; onClose: () => void }) {
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [templateId, setTemplateId] = useState('interview_invite');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [history, setHistory] = useState<EmailLog[]>([]);
  const [error, setError] = useState('');

  // extra fields for interview/offer templates
  const [interviewTime, setInterviewTime] = useState('');
  const [interviewLocation, setInterviewLocation] = useState('Văn phòng công ty');
  const [salary, setSalary] = useState('');
  const [startDate, setStartDate] = useState('');

  useEffect(() => {
    getEmailTemplates().then(r => setTemplates(r.templates)).catch(() => {});
    getEmailHistory(candidate.id).then(setHistory).catch(() => {});
  }, [candidate.id]);

  useEffect(() => {
    if (templateId === 'custom') {
      setSubject('');
      setBody('');
      return;
    }
    setLoadingPreview(true);
    setError('');
    previewEmail(candidate.id, {
      template: templateId,
      interview_time: interviewTime || undefined,
      interview_location: interviewLocation || undefined,
      salary: salary || undefined,
      start_date: startDate || undefined,
    })
      .then(r => { setSubject(r.subject); setBody(r.body); })
      .catch(e => setError(e.message))
      .finally(() => setLoadingPreview(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [templateId, interviewTime, interviewLocation, salary, startDate, candidate.id]);

  async function handleSend() {
    setSending(true);
    setError('');
    try {
      const log = await sendEmail(candidate.id, {
        template: templateId,
        subject,
        body,
        interview_time: interviewTime || undefined,
        interview_location: interviewLocation || undefined,
        salary: salary || undefined,
        start_date: startDate || undefined,
      });
      setHistory(h => [log, ...h]);
      setSent(true);
      setTimeout(() => setSent(false), 2500);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Gửi email thất bại');
    } finally {
      setSending(false);
    }
  }

  return (
    <Modal isOpen={true} onClose={onClose} title={`Gửi email cho ${candidate.name}`} size="lg">
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Mail size={14} /> Tới: <span className="font-medium text-gray-700">{candidate.email}</span>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Mẫu email</label>
          <select className="select-field" value={templateId} onChange={e => setTemplateId(e.target.value)}>
            {templates.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
            <option value="custom">Soạn tự do</option>
          </select>
        </div>

        {templateId === 'interview_invite' && (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Thời gian phỏng vấn</label>
              <input className="input-field" placeholder="VD: 10:00 Thứ 3, 25/06/2026"
                value={interviewTime} onChange={e => setInterviewTime(e.target.value)} />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Địa điểm</label>
              <input className="input-field" value={interviewLocation} onChange={e => setInterviewLocation(e.target.value)} />
            </div>
          </div>
        )}

        {templateId === 'offer' && (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Mức lương đề xuất</label>
              <input className="input-field" placeholder="VD: 25,000,000 VNĐ" value={salary} onChange={e => setSalary(e.target.value)} />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Ngày bắt đầu</label>
              <input className="input-field" placeholder="VD: 01/07/2026" value={startDate} onChange={e => setStartDate(e.target.value)} />
            </div>
          </div>
        )}

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Tiêu đề</label>
          <input className="input-field" value={subject} onChange={e => setSubject(e.target.value)} placeholder="Tiêu đề email" />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1 flex items-center gap-2">
            Nội dung {loadingPreview && <Loader2 size={12} className="animate-spin text-gray-400" />}
          </label>
          <textarea className="input-field font-sans" rows={10} value={body} onChange={e => setBody(e.target.value)} />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
          <button className="btn-secondary" onClick={onClose}>Đóng</button>
          <button
            className="btn-primary"
            disabled={sending || !subject || !body}
            onClick={handleSend}
          >
            {sending ? <Loader2 size={14} className="animate-spin" /> : sent ? <CheckCircle2 size={14} /> : <Send size={14} />}
            {sent ? 'Đã gửi!' : 'Gửi email'}
          </button>
        </div>

        {history.length > 0 && (
          <div className="pt-3 border-t border-gray-100">
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Lịch sử email</h4>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {history.map(h => (
                <div key={h.id} className="text-xs p-2 bg-gray-50 rounded-lg flex items-start justify-between gap-2">
                  <div>
                    <p className="font-medium text-gray-700">{h.subject}</p>
                    <p className="text-gray-400 flex items-center gap-1 mt-0.5">
                      <Clock size={10} />{new Date(h.created_at).toLocaleString('vi-VN')}
                    </p>
                  </div>
                  <span className="badge bg-green-100 text-green-700 flex-shrink-0">{h.status}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}

// ---------- Candidate Card ----------
function CandidateCard({ candidate, onClick }: { candidate: CandidateAPI; onClick: () => void }) {
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
            {!!candidate.matching_score && <ScoreBadge score={candidate.matching_score} />}
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
            <StageBadge stage={candidate.stage as PipelineStage} />
            <span className="text-xs text-gray-400">{candidate.applied_date}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------- Candidate Detail ----------
function CandidateDetail({
  candidate, onClose, onSendEmail, onStageChange,
}: {
  candidate: CandidateAPI;
  onClose: () => void;
  onSendEmail: () => void;
  onStageChange: (stage: string) => void;
}) {
  return (
    <Modal isOpen={true} onClose={onClose} title="Hồ sơ ứng viên" size="xl">
      <div className="space-y-6">
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
              {!!candidate.matching_score && (
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">{candidate.matching_score}%</div>
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
          <div className="space-y-4">
            <div>
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Thông tin</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-gray-500">Kinh nghiệm:</span><span className="font-medium">{candidate.experience} năm</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Học vấn:</span><span className="font-medium text-right max-w-[200px] text-xs">{candidate.education}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Nguồn:</span><span className="font-medium capitalize">{candidate.source}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Ngày ứng tuyển:</span><span className="font-medium">{candidate.applied_date}</span></div>
                {!!candidate.expected_salary && (
                  <div className="flex justify-between"><span className="text-gray-500">Lương mong muốn:</span><span className="font-medium">{(candidate.expected_salary / 1000000).toFixed(0)}tr VNĐ</span></div>
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

          <div className="space-y-4">
            <div>
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Trạng thái Pipeline</h4>
              <div className="p-3 bg-gray-50 rounded-lg">
                <StageBadge stage={candidate.stage as PipelineStage} />
                {candidate.talent_pool && (
                  <span className="ml-2 badge bg-yellow-100 text-yellow-700">
                    <Star size={10} className="mr-1" />Talent Pool
                  </span>
                )}
              </div>
            </div>

            {candidate.notes && (
              <div>
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Ghi chú HR</h4>
                <p className="text-sm text-gray-600 bg-yellow-50 p-3 rounded-lg border border-yellow-100 italic">
                  "{candidate.notes}"
                </p>
              </div>
            )}

            {candidate.cv_text && (
              <div>
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Trích CV</h4>
                <p className="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg max-h-32 overflow-y-auto whitespace-pre-line">
                  {candidate.cv_text.slice(0, 500)}...
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-2 pt-2 border-t border-gray-100">
          <button className="btn-primary" onClick={onSendEmail}>
            <Mail size={14} /> Gửi email
          </button>
          <select
            className="input-field w-auto"
            value=""
            onChange={e => { if (e.target.value) onStageChange(e.target.value); }}
          >
            <option value="">Chuyển stage...</option>
            {stages.slice(1).map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </div>
      </div>
    </Modal>
  );
}

// ---------- Add Candidate Modal ----------
function AddCandidateModal({ onClose, onCreated }: { onClose: () => void; onCreated: (c: CandidateAPI) => void }) {
  const [form, setForm] = useState({
    name: '', email: '', phone: '', position: '', department: 'Engineering', source: 'website',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  function set<K extends keyof typeof form>(key: K, value: string) {
    setForm(f => ({ ...f, [key]: value }));
  }

  async function handleSubmit() {
    if (!form.name || !form.email || !form.position) {
      setError('Vui lòng nhập đủ Họ tên, Email, Vị trí ứng tuyển');
      return;
    }
    setSaving(true);
    setError('');
    try {
      const created = await createCandidate({
        ...form,
        skills: [],
        notes: '',
        location: 'TP.HCM',
      });
      onCreated(created);
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Tạo ứng viên thất bại');
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal isOpen={true} onClose={onClose} title="Thêm ứng viên mới" size="lg">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Họ tên *</label>
            <input className="input-field" placeholder="Nguyễn Văn A" value={form.name} onChange={e => set('name', e.target.value)} />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Email *</label>
            <input className="input-field" type="email" placeholder="email@example.com" value={form.email} onChange={e => set('email', e.target.value)} />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Điện thoại</label>
            <input className="input-field" placeholder="0901234567" value={form.phone} onChange={e => set('phone', e.target.value)} />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Vị trí ứng tuyển *</label>
            <input className="input-field" placeholder="Senior Developer" value={form.position} onChange={e => set('position', e.target.value)} />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Phòng ban</label>
            <select className="select-field" value={form.department} onChange={e => set('department', e.target.value)}>
              {departments.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Nguồn</label>
            <select className="select-field" value={form.source} onChange={e => set('source', e.target.value)}>
              <option value="linkedin">LinkedIn</option>
              <option value="website">Website</option>
              <option value="referral">Referral</option>
              <option value="headhunt">Headhunt</option>
              <option value="other">Khác</option>
            </select>
          </div>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="flex justify-end gap-2 pt-2">
          <button className="btn-secondary" onClick={onClose}>Hủy</button>
          <button className="btn-primary" disabled={saving} onClick={handleSubmit}>
            {saving && <Loader2 size={14} className="animate-spin" />}
            Thêm ứng viên
          </button>
        </div>
      </div>
    </Modal>
  );
}

// ---------- Main Page ----------
export default function Candidates() {
  const [candidates, setCandidates] = useState<CandidateAPI[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [search, setSearch] = useState('');
  const [stageFilter, setStageFilter] = useState('');
  const [selected, setSelected] = useState<CandidateAPI | null>(null);
  const [emailTarget, setEmailTarget] = useState<CandidateAPI | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  async function refresh() {
    setLoading(true);
    setLoadError('');
    try {
      const data = await listCandidates({ stage: stageFilter || undefined, search: search || undefined });
      setCandidates(data);
    } catch (e) {
      setLoadError(e instanceof Error ? e.message : 'Không thể tải danh sách ứng viên');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const t = setTimeout(refresh, 300); // debounce search/filter
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, stageFilter]);

  async function handleStageChange(candidateId: string, stage: string) {
    const updated = await updateCandidate(candidateId, { stage });
    setCandidates(cs => cs.map(c => (c.id === candidateId ? updated : c)));
    setSelected(updated);
  }

  return (
    <div>
      <Header title="Cơ sở dữ liệu ứng viên" subtitle={`${candidates.length} ứng viên hiển thị`} />
      <div className="p-6">
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
          <button className="btn-primary" onClick={() => setShowAddModal(true)}><Plus size={14} />Thêm ứng viên</button>
        </div>

        <div className="grid grid-cols-4 lg:grid-cols-8 gap-2 mb-6">
          {stages.slice(1).map(s => {
            const count = candidates.filter(c => c.stage === s.value).length;
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

        {loading ? (
          <div className="text-center py-16 text-gray-400">
            <Loader2 size={28} className="mx-auto mb-3 animate-spin" />
            <p>Đang tải danh sách ứng viên...</p>
          </div>
        ) : loadError ? (
          <div className="text-center py-16 text-red-500">
            <p>{loadError}</p>
            <button className="btn-secondary mt-3" onClick={refresh}>Thử lại</button>
          </div>
        ) : candidates.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <Users size={40} className="mx-auto mb-3 opacity-30" />
            <p>Không tìm thấy ứng viên nào</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {candidates.map(c => (
              <CandidateCard key={c.id} candidate={c} onClick={() => setSelected(c)} />
            ))}
          </div>
        )}
      </div>

      {selected && (
        <CandidateDetail
          candidate={selected}
          onClose={() => setSelected(null)}
          onSendEmail={() => setEmailTarget(selected)}
          onStageChange={stage => handleStageChange(selected.id, stage)}
        />
      )}

      {emailTarget && (
        <SendEmailModal candidate={emailTarget} onClose={() => setEmailTarget(null)} />
      )}

      {showAddModal && (
        <AddCandidateModal
          onClose={() => setShowAddModal(false)}
          onCreated={c => setCandidates(cs => [c, ...cs])}
        />
      )}
    </div>
  );
}