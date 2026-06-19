import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend, AreaChart, Area
} from 'recharts';
import Header from '../components/layout/Header';
import StatsCard from '../components/ui/StatsCard';
import { TrendingUp, Clock, Target, UserCheck } from 'lucide-react';
import { mockMetrics, monthlyHiringData, departmentData, sourceData } from '../data/mockData';

const timeToHireData = [
  { week: 'W1 Jan', days: 35 }, { week: 'W2 Jan', days: 32 }, { week: 'W3 Jan', days: 28 },
  { week: 'W1 Feb', days: 30 }, { week: 'W2 Feb', days: 25 }, { week: 'W3 Feb', days: 27 },
  { week: 'W1 Mar', days: 22 }, { week: 'W2 Mar', days: 24 }, { week: 'W1 Apr', days: 20 },
  { week: 'W2 Apr', days: 28 }, { week: 'W1 May', days: 26 }, { week: 'W1 Jun', days: 28 },
];

const recruiterData = [
  { name: 'Nguyễn Lan', hired: 8, pipeline: 24, offers: 10 },
  { name: 'Trần Minh', hired: 6, pipeline: 18, offers: 8 },
  { name: 'Lê Hương', hired: 5, pipeline: 15, offers: 6 },
  { name: 'Phạm Tuấn', hired: 4, pipeline: 12, offers: 5 },
];

const passRateData = [
  { stage: 'CV → HR', rate: 47.9 },
  { stage: 'HR → Tech', rate: 51.5 },
  { stage: 'Tech → Manager', rate: 80 },
  { stage: 'Manager → Offer', rate: 89.3 },
  { stage: 'Offer → Hired', rate: 92 },
];

export default function Analytics() {
  return (
    <div>
      <Header title="Analytics & Reports" subtitle="Phân tích hiệu suất tuyển dụng tháng 6/2026" />
      <div className="p-6 space-y-6">

        {/* KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard title="Time to Hire" value={`${mockMetrics.timeToHire} ngày`} icon={<Clock size={20} className="text-blue-600" />} iconBg="bg-blue-50" trend={-12} trendLabel="cải thiện" />
          <StatsCard title="Time to Fill" value={`${mockMetrics.timeToFill} ngày`} icon={<TrendingUp size={20} className="text-purple-600" />} iconBg="bg-purple-50" trend={-8} trendLabel="cải thiện" />
          <StatsCard title="Offer Acceptance Rate" value={`${mockMetrics.offerAcceptanceRate}%`} icon={<Target size={20} className="text-green-600" />} iconBg="bg-green-50" trend={3} />
          <StatsCard title="Interview-to-Hire" value={`${mockMetrics.interviewToHireRatio}:1`} icon={<UserCheck size={20} className="text-orange-600" />} iconBg="bg-orange-50" trend={-5} trendLabel="cải thiện" />
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card p-5">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Trend tuyển dụng 6 tháng</h3>
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={monthlyHiringData}>
                <defs>
                  <linearGradient id="hired" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="applied" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#94a3b8" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="applied" stroke="#94a3b8" fill="url(#applied)" strokeWidth={2} name="Ứng tuyển" />
                <Area type="monotone" dataKey="hired" stroke="#2563eb" fill="url(#hired)" strokeWidth={2} name="Tuyển thành công" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="card p-5">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Time-to-Hire theo tuần (ngày)</h3>
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={timeToHireData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="week" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 12 }} domain={[15, 40]} />
                <Tooltip />
                <Line type="monotone" dataKey="days" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 3 }} name="Ngày" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="card p-5">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Nguồn tuyển dụng</h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={sourceData} cx="50%" cy="50%" outerRadius={75} paddingAngle={2} dataKey="value">
                  {sourceData.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Pie>
                <Tooltip formatter={v => [`${v}%`]} />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-1.5 mt-2">
              {sourceData.map(s => (
                <div key={s.name} className="flex items-center gap-1.5 text-xs">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color }} />
                  <span className="text-gray-500">{s.name}</span>
                  <span className="font-medium ml-auto">{s.value}%</span>
                </div>
              ))}
            </div>
          </div>

          <div className="card p-5">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Tỷ lệ pass từng vòng</h3>
            <div className="space-y-3">
              {passRateData.map((d, i) => (
                <div key={i}>
                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span>{d.stage}</span>
                    <span className="font-semibold">{d.rate}%</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${d.rate}%`,
                        background: `hsl(${d.rate * 1.2}, 70%, 50%)`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card p-5">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Hiệu suất Recruiter</h3>
            <div className="space-y-3">
              {recruiterData.map((r, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    {r.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-medium text-gray-800 truncate">{r.name}</span>
                      <span className="text-green-600 font-semibold">{r.hired} hired</span>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: `${(r.hired / 10) * 100}%` }} />
                    </div>
                    <div className="flex justify-between text-xs text-gray-400 mt-1">
                      <span>{r.pipeline} pipeline</span>
                      <span>{r.offers} offers</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Department Comparison */}
        <div className="card p-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Tuyển dụng theo phòng ban</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={departmentData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="dept" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="open" fill="#bfdbfe" name="Đang tuyển" radius={[4, 4, 0, 0]} />
              <Bar dataKey="hired" fill="#2563eb" name="Đã tuyển" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

      </div>
    </div>
  );
}
