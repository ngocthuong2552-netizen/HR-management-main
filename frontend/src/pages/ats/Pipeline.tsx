import { useState } from 'react';
import { Plus, User, Clock, Star } from 'lucide-react';
import Header from '../../components/layout/Header';
import { ScoreBadge } from '../../components/ui/Badge';
import { mockCandidates } from '../../data/mockData';
import type { Candidate, PipelineStage } from '../../types';

const columns: { id: PipelineStage; label: string; color: string; bg: string }[] = [
  { id: 'applied', label: 'Applied', color: 'text-gray-700', bg: 'bg-gray-50' },
  { id: 'cv_screening', label: 'CV Screening', color: 'text-blue-700', bg: 'bg-blue-50' },
  { id: 'hr_interview', label: 'HR Interview', color: 'text-purple-700', bg: 'bg-purple-50' },
  { id: 'technical_interview', label: 'Technical', color: 'text-orange-700', bg: 'bg-orange-50' },
  { id: 'manager_interview', label: 'Manager', color: 'text-yellow-700', bg: 'bg-yellow-50' },
  { id: 'offer', label: 'Offer', color: 'text-indigo-700', bg: 'bg-indigo-50' },
  { id: 'hired', label: 'Hired', color: 'text-green-700', bg: 'bg-green-50' },
];

function KanbanCard({ candidate }: { candidate: Candidate }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-3 shadow-sm hover:shadow-md transition-all cursor-pointer group">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
          {candidate.name.charAt(0)}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-gray-900 truncate">{candidate.name}</p>
          <p className="text-xs text-gray-400 truncate">{candidate.position}</p>
        </div>
        {candidate.talentPool && <Star size={12} className="text-yellow-400 flex-shrink-0" />}
      </div>
      <div className="flex flex-wrap gap-1 mb-2">
        {candidate.skills.slice(0, 2).map(s => (
          <span key={s} className="text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">{s}</span>
        ))}
      </div>
      <div className="flex items-center justify-between text-xs text-gray-400">
        <span className="flex items-center gap-1"><Clock size={10} />{candidate.appliedDate}</span>
        {candidate.matchingScore && <ScoreBadge score={candidate.matchingScore} />}
      </div>
    </div>
  );
}

export default function Pipeline() {
  const [candidates, setCandidates] = useState<Candidate[]>(mockCandidates.filter(c => c.stage !== 'rejected'));
  const [dragId, setDragId] = useState<string | null>(null);

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDragId(id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDrop = (e: React.DragEvent, stage: PipelineStage) => {
    e.preventDefault();
    if (!dragId) return;
    setCandidates(prev => prev.map(c => c.id === dragId ? { ...c, stage } : c));
    setDragId(null);
  };

  const handleDragOver = (e: React.DragEvent) => e.preventDefault();

  return (
    <div>
      <Header title="Pipeline Tuyển dụng" subtitle="Kéo thả ứng viên để cập nhật trạng thái" />
      <div className="p-6">
        <div className="flex items-center gap-2 mb-4 text-sm text-gray-500">
          <User size={14} />
          <span>{candidates.length} ứng viên đang trong pipeline</span>
          <span className="mx-2">•</span>
          <span className="text-green-600 font-medium">{candidates.filter(c => c.stage === 'hired').length} đã tuyển</span>
        </div>

        <div className="flex gap-3 overflow-x-auto pb-4" style={{ minHeight: 'calc(100vh - 200px)' }}>
          {columns.map(col => {
            const colCandidates = candidates.filter(c => c.stage === col.id);
            return (
              <div
                key={col.id}
                className={`flex-shrink-0 w-60 ${col.bg} rounded-xl p-3 border border-opacity-50`}
                onDrop={e => handleDrop(e, col.id)}
                onDragOver={handleDragOver}
              >
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <span className={`text-xs font-bold ${col.color}`}>{col.label}</span>
                    <span className={`ml-2 inline-flex items-center justify-center w-5 h-5 rounded-full bg-white text-xs font-bold ${col.color} shadow-sm`}>
                      {colCandidates.length}
                    </span>
                  </div>
                  <button className={`p-1 rounded-lg hover:bg-white/60 transition-colors ${col.color}`}>
                    <Plus size={14} />
                  </button>
                </div>

                <div className="space-y-2">
                  {colCandidates.map(c => (
                    <div
                      key={c.id}
                      draggable
                      onDragStart={e => handleDragStart(e, c.id)}
                      className={dragId === c.id ? 'opacity-50' : ''}
                    >
                      <KanbanCard candidate={c} />
                    </div>
                  ))}
                  {colCandidates.length === 0 && (
                    <div className="text-center py-8 text-xs text-gray-400">
                      Kéo ứng viên vào đây
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Rejected column */}
          <div
            className="flex-shrink-0 w-60 bg-red-50 rounded-xl p-3 border border-red-100"
            onDrop={e => handleDrop(e, 'rejected')}
            onDragOver={handleDragOver}
          >
            <div className="flex items-center justify-between mb-3">
              <div>
                <span className="text-xs font-bold text-red-700">Rejected</span>
                <span className="ml-2 inline-flex items-center justify-center w-5 h-5 rounded-full bg-white text-xs font-bold text-red-600 shadow-sm">
                  {mockCandidates.filter(c => c.stage === 'rejected').length}
                </span>
              </div>
            </div>
            <div className="space-y-2">
              {mockCandidates.filter(c => c.stage === 'rejected').map(c => (
                <KanbanCard key={c.id} candidate={c} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
