import { useEffect, useState } from 'react';
import { Users, Briefcase, UserCheck, Clock, TrendingUp, Target, BookOpen, Bot } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend } from 'recharts';
import Header from '../components/layout/Header';
import StatsCard from '../components/ui/StatsCard';
import { funnelData, monthlyHiringData, departmentData, sourceData, mockJobs } from '../data/mockData';
import { StageBadge } from '../components/ui/Badge';
import { listCandidates, type CandidateAPI } from '../api/candidates';
import { authHeader } from '../api/auth';
import API_BASE from '../api/config';
import type { PipelineStage } from '../types';

interface Overview {
  totalPositions: number;
  totalCandidates: number;
  hired: number;
  timeToHire: number;
  timeToFill: number;
  offerAcceptanceRate: number;
  interviewToHireRatio: number;
}

export default function Dashboard() {
  const [overview, setOverview] = useState<Overview | null>(null);
  const [recentCandidates, setRecentCandidates] = useState<CandidateAPI[]>([]);
  const [loading, setLoading] = useState(true);

  const openJobs = mockJobs.filter(j => j.status === 'open').length;

  useEffect(() => {
    async function load() {
      try {
        const [overviewRes, candidates] = await Promise.all([
          fetch(`${API_BASE}/api/analytics/overview`, { headers: authHeader() }).then(r => r.json()),
          listCandidates(),
        ]);
        setOverview(overviewRes);
        setRecentCandidates(
          [...candidates]
            .sort((a, b) => (a.applied_date < b.applied_date ? 1 : -1))
            .slice(0, 5)
        );
      } catch (e) {
        console.error('Failed to load dashboard data', e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div>
      <Header title="Dashboard" subtitle="Tổng quan hệ thống HR - Tháng 6/2026" />
      <div className="p-6 space-y-6">

        {/* Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Vị trí đang tuyển" value={openJobs} subtitle={`${overview?.totalPositions ?? '–'} tổng vị trí`}
            icon={<Briefcase size={20} className="text-blue-600" />} iconBg="bg-blue-50" trend={8}
          />
          <StatsCard
            title="Tổng ứng viên" value={loading ? '...' : overview?.totalCandidates ?? 0} subtitle="Đang trong pipeline"
            icon={<Users size={20} className="text-purple-600" />} iconBg="bg-purple-50" trend={15}
          />
          <StatsCard
            title="Đã tuyển dụng" value={loading ? '...' : overview?.hired ?? 0} subtitle="Tháng 6/2026"
            icon={<UserCheck size={20} className="text-green-600" />} iconBg="bg-green-50" trend={12}
          />
          <StatsCard
            title="Thời gian tuyển TB" value={`${overview?.timeToHire ?? '–'} ngày`} subtitle="Time-to-Hire"
            icon={<Clock size={20} className="text-orange-600" />} iconBg="bg-orange-50" trend={-5} trendLabel="cải thiện"
          />
        </div>

        {/* Second Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Offer Acceptance" value={`${overview?.offerAcceptanceRate ?? '–'}%`}
            icon={<Target size={20} className="text-indigo-600" />} iconBg="bg-indigo-50" trend={3}
          />
          <StatsCard
            title="Interview/Hire Ratio" value={`${overview?.interviewToHireRatio ?? '–'}:1`}
            icon={<TrendingUp size={20} className="text-pink-600" />} iconBg="bg-pink-50"
          />
          <StatsCard
            title="Khóa học đang mở" value={6} subtitle="LMS"
            icon={<BookOpen size={20} className="text-teal-600" />} iconBg="bg-teal-50"
          />
          <StatsCard
            title="Chatbot queries" value="1,284" subtitle="Tuần này"
            icon={<Bot size={20} className="text-violet-600" />} iconBg="bg-violet-50" trend={22}
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Monthly Hiring Trend */}
          <div className="card p-5 lg:col-span-2">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Xu hướng tuyển dụng theo tháng</h3>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={monthlyHiringData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="hired" stroke="#2563eb" strokeWidth={2} dot={{ r: 4 }} name="Tuyển thành công" />
                <Line type="monotone" dataKey="applied" stroke="#94a3b8" strokeWidth={2} dot={{ r: 4 }} name="Ứng tuyển" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Source Distribution */}
          <div className="card p-5">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Nguồn ứng viên</h3>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={sourceData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                  {sourceData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, '']} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-1.5 mt-2">
              {sourceData.map(s => (
                <div key={s.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color }} />
                    <span className="text-gray-600">{s.name}</span>
                  </div>
                  <span className="font-medium text-gray-800">{s.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Department Performance */}
          <div className="card p-5">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Tuyển dụng theo phòng ban</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={departmentData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis dataKey="dept" type="category" tick={{ fontSize: 11 }} width={80} />
                <Tooltip />
                <Legend />
                <Bar dataKey="open" fill="#bfdbfe" name="Đang tuyển" radius={[0, 4, 4, 0]} />
                <Bar dataKey="hired" fill="#2563eb" name="Đã tuyển" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Recent Candidates */}
          <div className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-900">Ứng viên gần đây</h3>
              <a href="/ats/candidates" className="text-xs text-blue-600 hover:underline">Xem tất cả →</a>
            </div>
            <div className="space-y-3">
              {recentCandidates.length === 0 && !loading && (
                <p className="text-sm text-gray-400">Chưa có ứng viên nào</p>
              )}
              {recentCandidates.map(c => (
                <div key={c.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    {c.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{c.name}</p>
                    <p className="text-xs text-gray-500 truncate">{c.position}</p>
                  </div>
                  <StageBadge stage={c.stage as PipelineStage} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recruitment Funnel */}
        <div className="card p-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Funnel Tuyển dụng</h3>
          <div className="flex items-end gap-3 h-40">
            {funnelData.map((item, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-xs font-bold text-gray-700">{item.count}</span>
                <div
                  className="w-full rounded-t-lg transition-all"
                  style={{
                    height: `${(item.count / funnelData[0].count) * 120}px`,
                    backgroundColor: item.color,
                    opacity: 0.85,
                  }}
                />
                <span className="text-xs text-gray-500 text-center leading-tight">{item.stage}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}