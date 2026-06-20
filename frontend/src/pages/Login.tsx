import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, LogIn } from 'lucide-react';
import { login, bootstrapAdmin } from '../api/auth';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const [mode, setMode] = useState<'login' | 'bootstrap'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = mode === 'login'
        ? await login(email, password)
        : await bootstrapAdmin(email, password, name);
      setUser(user);
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Đăng nhập thất bại');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-xl bg-blue-600 mx-auto mb-3 flex items-center justify-center text-white font-bold text-lg">
            HR
          </div>
          <h1 className="text-lg font-bold text-gray-900">
            {mode === 'login' ? 'Đăng nhập hệ thống' : 'Tạo tài khoản Admin đầu tiên'}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Chỉ dành cho email @aiforvietnam.org
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'bootstrap' && (
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Họ tên</label>
              <input className="input-field" value={name} onChange={e => setName(e.target.value)} required />
            </div>
          )}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Email công ty</label>
            <input
              className="input-field" type="email" placeholder="ten@aiforvietnam.org"
              value={email} onChange={e => setEmail(e.target.value)} required
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Mật khẩu</label>
            <input
              className="input-field" type="password"
              value={password} onChange={e => setPassword(e.target.value)} required
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button type="submit" className="btn-primary w-full justify-center" disabled={loading}>
            {loading ? <Loader2 size={16} className="animate-spin" /> : <LogIn size={16} />}
            {mode === 'login' ? 'Đăng nhập' : 'Tạo tài khoản Admin'}
          </button>
        </form>

        <button
          className="text-xs text-gray-400 hover:text-gray-600 mt-4 block mx-auto"
          onClick={() => { setMode(m => m === 'login' ? 'bootstrap' : 'login'); setError(''); }}
        >
          {mode === 'login'
            ? 'Lần đầu sử dụng? Tạo tài khoản Admin đầu tiên'
            : '← Quay lại Đăng nhập'}
        </button>
      </div>
    </div>
  );
}