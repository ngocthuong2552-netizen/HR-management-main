import { Map, ChevronRight, Clock } from 'lucide-react';
import Header from '../../components/layout/Header';
import { mockLearningPaths, mockCourses } from '../../data/mockData';

const categoryColors: Record<string, string> = {
  onboarding: 'from-green-400 to-teal-500',
  technical: 'from-blue-500 to-indigo-600',
  soft_skills: 'from-purple-500 to-pink-500',
  leadership: 'from-orange-400 to-red-500',
};

const categoryLabels: Record<string, string> = {
  onboarding: 'Onboarding', technical: 'Kỹ thuật', soft_skills: 'Kỹ năng mềm', leadership: 'Lãnh đạo',
};

export default function LearningPaths() {
  return (
    <div>
      <Header title="Lộ trình học tập" subtitle="Chương trình đào tạo theo từng nhóm nhân viên" />
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {mockLearningPaths.map(lp => {
            const courses = mockCourses.filter(c => lp.courses.includes(c.id));
            const totalHours = Math.floor(lp.totalDuration / 60);
            return (
              <div key={lp.id} className="card overflow-hidden hover:shadow-md transition-all cursor-pointer">
                <div className={`h-24 bg-gradient-to-br ${categoryColors[lp.category]} flex items-center justify-center`}>
                  <Map size={32} className="text-white/80" />
                </div>
                <div className="p-5">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-sm font-bold text-gray-900">{lp.title}</h3>
                    <span className={`badge text-xs bg-white border text-${lp.category === 'onboarding' ? 'green' : lp.category === 'technical' ? 'blue' : lp.category === 'soft_skills' ? 'purple' : 'orange'}-600`}>
                      {categoryLabels[lp.category]}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mb-3">{lp.description}</p>
                  <p className="text-xs font-medium text-gray-600 mb-3">
                    👥 Đối tượng: <span className="text-gray-800">{lp.targetAudience}</span>
                  </p>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    <div className="text-center p-2 bg-gray-50 rounded-lg">
                      <div className="text-sm font-bold text-gray-800">{lp.courses.length}</div>
                      <div className="text-xs text-gray-400">Khóa học</div>
                    </div>
                    <div className="text-center p-2 bg-gray-50 rounded-lg">
                      <div className="text-sm font-bold text-gray-800">{totalHours}h</div>
                      <div className="text-xs text-gray-400">Thời gian</div>
                    </div>
                    <div className="text-center p-2 bg-gray-50 rounded-lg">
                      <div className="text-sm font-bold text-gray-800">{lp.enrolledCount}</div>
                      <div className="text-xs text-gray-400">Học viên</div>
                    </div>
                  </div>

                  {/* Progress */}
                  <div className="mb-4">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>Tỷ lệ hoàn thành</span>
                      <span className="font-semibold text-gray-700">{lp.completionRate}%</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: `${lp.completionRate}%` }} />
                    </div>
                  </div>

                  {/* Courses */}
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Các khóa học</p>
                    <div className="space-y-1.5">
                      {courses.map((c, i) => (
                        <div key={c.id} className="flex items-center gap-2 text-xs text-gray-600 p-1.5 hover:bg-gray-50 rounded-lg">
                          <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold flex-shrink-0">{i + 1}</span>
                          <span className="flex-1 truncate">{c.title}</span>
                          <span className="text-gray-400 flex-shrink-0 flex items-center gap-0.5">
                            <Clock size={10} />{Math.floor(c.duration/60)}h
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button className="btn-primary w-full justify-center mt-4">
                    Xem lộ trình <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
