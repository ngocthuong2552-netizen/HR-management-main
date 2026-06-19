import { useState } from 'react';
import { BookOpen, Play, Clock, Users, Star, Plus, Search } from 'lucide-react';
import Header from '../../components/layout/Header';
import { StatusBadge } from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import { mockCourses } from '../../data/mockData';
import type { Course } from '../../types';

const categoryLabels: Record<string, string> = {
  onboarding: 'Onboarding', technical: 'Kỹ thuật', soft_skills: 'Kỹ năng mềm',
  leadership: 'Lãnh đạo', compliance: 'Quy định',
};
const categoryColors: Record<string, string> = {
  onboarding: 'bg-green-100 text-green-700', technical: 'bg-blue-100 text-blue-700',
  soft_skills: 'bg-purple-100 text-purple-700', leadership: 'bg-orange-100 text-orange-700',
  compliance: 'bg-red-100 text-red-700',
};

function CourseCard({ course, onClick }: { course: Course; onClick: () => void }) {
  const hours = Math.floor(course.duration / 60);
  const mins = course.duration % 60;
  return (
    <div className="card hover:shadow-md transition-all cursor-pointer overflow-hidden" onClick={onClick}>
      <div className="h-28 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center relative">
        <BookOpen size={36} className="text-white/80" />
        <div className="absolute top-2 right-2">
          <span className={`badge text-xs ${categoryColors[course.category]}`}>{categoryLabels[course.category]}</span>
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 mb-1">{course.title}</h3>
        <p className="text-xs text-gray-500 mb-3 line-clamp-2">{course.description}</p>
        <div className="flex items-center gap-3 text-xs text-gray-400 mb-3">
          <span className="flex items-center gap-1"><Clock size={11} />{hours}h{mins > 0 ? ` ${mins}m` : ''}</span>
          <span className="flex items-center gap-1"><BookOpen size={11} />{course.lessons} bài</span>
          <span className="flex items-center gap-1"><Users size={11} />{course.enrolledCount}</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Star size={12} className="text-yellow-400" fill="currentColor" />
            <span className="text-xs font-medium text-gray-700">{course.rating}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-16 h-1.5 bg-gray-100 rounded-full">
              <div className="h-full bg-green-500 rounded-full" style={{ width: `${course.completionRate}%` }} />
            </div>
            <span className="text-xs text-gray-500">{course.completionRate}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Courses() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [selected, setSelected] = useState<Course | null>(null);

  const categories = ['', 'onboarding', 'technical', 'soft_skills', 'leadership'];

  const filtered = mockCourses.filter(c => {
    const matchSearch = c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.instructor.toLowerCase().includes(search.toLowerCase());
    const matchCat = !category || c.category === category;
    return matchSearch && matchCat;
  });

  return (
    <div>
      <Header title="Khóa học" subtitle={`${mockCourses.length} khóa học • ${mockCourses.reduce((s, c) => s + c.enrolledCount, 0)} lượt học`} />
      <div className="p-6">
        <div className="flex items-center gap-3 mb-6 flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Tìm khóa học..." className="input-field pl-9" />
          </div>
          <div className="flex gap-1.5">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${category === cat ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 border border-gray-200'}`}
              >
                {cat ? categoryLabels[cat] : 'Tất cả'}
              </button>
            ))}
          </div>
          <button className="btn-primary"><Plus size={14} />Tạo khóa học</button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(c => <CourseCard key={c.id} course={c} onClick={() => setSelected(c)} />)}
        </div>
      </div>

      {selected && (
        <Modal isOpen={true} onClose={() => setSelected(null)} title={selected.title} size="lg">
          <div className="space-y-4">
            <div className="flex gap-2 flex-wrap">
              <span className={`badge ${categoryColors[selected.category]}`}>{categoryLabels[selected.category]}</span>
              <StatusBadge status={selected.status} />
            </div>
            <p className="text-sm text-gray-700">{selected.description}</p>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><span className="text-gray-500">Giảng viên:</span> <strong>{selected.instructor}</strong></div>
              <div><span className="text-gray-500">Thời lượng:</span> <strong>{Math.floor(selected.duration/60)}h {selected.duration%60}m</strong></div>
              <div><span className="text-gray-500">Số bài:</span> <strong>{selected.lessons} bài học</strong></div>
              <div><span className="text-gray-500">Học viên:</span> <strong>{selected.enrolledCount} người</strong></div>
              <div><span className="text-gray-500">Hoàn thành:</span> <strong>{selected.completionRate}%</strong></div>
              <div><span className="text-gray-500">Đánh giá:</span> <strong>⭐ {selected.rating}/5</strong></div>
            </div>
            <div>
              <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">Tags</h4>
              <div className="flex flex-wrap gap-1.5">
                {selected.tags.map(t => <span key={t} className="badge bg-gray-100 text-gray-600">{t}</span>)}
              </div>
            </div>
            <div className="flex gap-2 pt-2 border-t">
              <button className="btn-primary"><Play size={14} />Bắt đầu học</button>
              <button className="btn-secondary"><Users size={14} />Danh sách học viên</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
