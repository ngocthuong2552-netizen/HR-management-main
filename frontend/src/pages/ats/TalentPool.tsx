import { useState } from 'react';
import { Star, Search, UserPlus, Mail } from 'lucide-react';
import Header from '../../components/layout/Header';
import { ScoreBadge, StageBadge } from '../../components/ui/Badge';
import { mockCandidates } from '../../data/mockData';

const categories = ['Tất cả', 'Engineering', 'Product', 'Design', 'Data', 'Marketing'];

export default function TalentPool() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('Tất cả');
  const [pool] = useState(
    mockCandidates.filter(c => c.talentPool || c.stage === 'rejected' || c.stage === 'hired')
  );

  const filtered = pool.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.skills.some(s => s.toLowerCase().includes(search.toLowerCase()));
    const matchCat = category === 'Tất cả' || c.department === category;
    return matchSearch && matchCat;
  });

  return (
    <div>
      <Header title="Talent Pool" subtitle="Nguồn ứng viên tiềm năng cho tương lai" />
      <div className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Tìm kiếm trong Talent Pool..." className="input-field pl-9" />
          </div>
          <div className="flex gap-1.5">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${category === cat ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="card p-4 text-center">
            <div className="text-2xl font-bold text-yellow-500"><Star className="inline mb-1" size={20} />{pool.length}</div>
            <p className="text-xs text-gray-500 mt-1">Tổng ứng viên trong pool</p>
          </div>
          <div className="card p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{pool.filter(c => c.stage === 'hired').length}</div>
            <p className="text-xs text-gray-500 mt-1">Đã từng làm việc</p>
          </div>
          <div className="card p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{pool.filter(c => c.matchingScore && c.matchingScore >= 85).length}</div>
            <p className="text-xs text-gray-500 mt-1">Score ≥ 85%</p>
          </div>
        </div>

        {/* Candidates */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(c => (
            <div key={c.id} className="card p-4 hover:shadow-md transition-all">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                  {c.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-gray-900">{c.name}</h3>
                    <Star size={14} className="text-yellow-400" fill="currentColor" />
                  </div>
                  <p className="text-xs text-gray-500">{c.position} • {c.experience}yr exp</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {c.skills.slice(0, 3).map(s => (
                      <span key={s} className="text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">{s}</span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <StageBadge stage={c.stage} />
                    {c.matchingScore && <ScoreBadge score={c.matchingScore} />}
                  </div>
                </div>
              </div>
              <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100">
                <button className="btn-secondary text-xs flex-1 justify-center py-1.5">
                  <Mail size={12} />Email
                </button>
                <button className="btn-primary text-xs flex-1 justify-center py-1.5">
                  <UserPlus size={12} />Mời ứng tuyển
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
