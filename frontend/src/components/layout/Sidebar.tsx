import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Users, GitBranch, Star, Briefcase, ClipboardList,
  BarChart3, BookOpen, Map, Bot, Brain, FileSearch, MessageSquare,
  ChevronDown, ChevronRight, Building2, Wand2, LogOut
} from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

interface NavItem {
  label: string;
  icon: React.ReactNode;
  path?: string;
  children?: { label: string; path: string; icon: React.ReactNode }[];
}

const navItems: NavItem[] = [
  { label: 'Dashboard', icon: <LayoutDashboard size={18} />, path: '/' },
  {
    label: 'ATS - Tuyển dụng', icon: <Users size={18} />,
    children: [
      { label: 'Ứng viên', path: '/ats/candidates', icon: <Users size={16} /> },
      { label: 'Pipeline', path: '/ats/pipeline', icon: <GitBranch size={16} /> },
      { label: 'Talent Pool', path: '/ats/talent-pool', icon: <Star size={16} /> },
    ]
  },
  {
    label: 'Quản lý Tuyển dụng', icon: <Briefcase size={18} />,
    children: [
      { label: 'Vị trí tuyển dụng', path: '/recruitment/jobs', icon: <Briefcase size={16} /> },
      { label: 'Yêu cầu tuyển dụng', path: '/recruitment/requests', icon: <ClipboardList size={16} /> },
    ]
  },
  { label: 'Analytics', icon: <BarChart3 size={18} />, path: '/analytics' },
  {
    label: 'Learning (LMS)', icon: <BookOpen size={18} />,
    children: [
      { label: 'Khóa học', path: '/lms/courses', icon: <BookOpen size={16} /> },
      { label: 'Lộ trình học', path: '/lms/paths', icon: <Map size={16} /> },
    ]
  },
  {
    label: 'AI Tools', icon: <Brain size={18} />,
    children: [
      { label: 'HR Chatbot', path: '/ai/chatbot', icon: <MessageSquare size={16} /> },
      { label: 'CV Parser', path: '/ai/cv-parser', icon: <FileSearch size={16} /> },
      { label: 'JD Generator', path: '/ai/jd-generator', icon: <Wand2 size={16} /> },
      { label: 'Interview Assistant', path: '/ai/interview', icon: <Bot size={16} /> },
    ]
  },
];

function NavGroup({ item }: { item: NavItem }) {
  const location = useLocation();
  const isChildActive = item.children?.some(c => location.pathname === c.path);
  const [open, setOpen] = useState(isChildActive ?? false);

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-150 ${
          isChildActive ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
        }`}
      >
        <span className="flex items-center gap-2.5">
          <span className={isChildActive ? 'text-blue-600' : 'text-gray-400'}>{item.icon}</span>
          {item.label}
        </span>
        {open ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
      </button>
      {open && (
        <div className="ml-4 mt-1 space-y-0.5 pl-3 border-l-2 border-gray-100">
          {item.children?.map(child => (
            <NavLink
              key={child.path}
              to={child.path}
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors duration-150 ${
                  isActive
                    ? 'bg-blue-600 text-white font-medium'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`
              }
            >
              {child.icon}
              {child.label}
            </NavLink>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  return (
    <aside className="w-60 bg-white border-r border-gray-200 flex flex-col h-screen sticky top-0 overflow-y-auto">
      {/* Logo */}
      <div className="px-4 py-4 border-b border-gray-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Building2 size={18} className="text-white" />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-900">HR.AI</p>
            <p className="text-xs text-gray-400">Management System</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) =>
          item.path ? (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-150 ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`
              }
              end
            >
              {({ isActive }) => (
                <>
                  <span className={isActive ? 'text-white' : 'text-gray-400'}>{item.icon}</span>
                  {item.label}
                </>
              )}
            </NavLink>
          ) : (
            <NavGroup key={item.label} item={item} />
          )
        )}
      </nav>

      {/* User */}
      <div className="px-3 py-3 border-t border-gray-100">
        <div className="flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-gray-50">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{user?.name || 'Người dùng'}</p>
            <p className="text-xs text-gray-400 truncate">
              {user?.email} {user?.role === 'admin' ? '• Quản lý' : '• Nhân viên'}
            </p>
          </div>
          <button
            onClick={() => { logout(); navigate('/login'); }}
            title="Đăng xuất"
            className="text-gray-400 hover:text-red-500 p-1.5 rounded-lg hover:bg-red-50 flex-shrink-0"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
}