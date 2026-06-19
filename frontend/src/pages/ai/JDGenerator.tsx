import API_BASE from '../../api/config';
import { useState } from 'react';
import { Wand2, Copy, Download, Loader2, CheckCircle, RefreshCw } from 'lucide-react';
import Header from '../../components/layout/Header';

interface JDForm {
  title: string;
  department: string;
  type: string;
  experience: string;
  salary: string;
  location: string;
  remote: string;
  keySkills: string;
  responsibilities: string;
  companyName: string;
}

const defaultForm: JDForm = {
  title: '', department: 'Engineering', type: 'full-time',
  experience: '3-5 năm', salary: '', location: 'TP.HCM', remote: 'hybrid',
  keySkills: '', responsibilities: '', companyName: 'TechCorp Vietnam',
};

export default function JDGenerator() {
  const [form, setForm] = useState<JDForm>(defaultForm);
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState('');
  const [copied, setCopied] = useState(false);

  const handleChange = (k: keyof JDForm, v: string) => setForm(f => ({ ...f, [k]: v }));

  const generateJD = async () => {
    setLoading(true);
    setGenerated('');
    try {
      const res = await fetch(`${API_BASE}/api/ai/generate-jd`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        const data = await res.json();
        setGenerated(data.jd);
      } else {
        await new Promise(r => setTimeout(r, 2000));
        setGenerated(generateDemoJD(form));
      }
    } catch {
      await new Promise(r => setTimeout(r, 2000));
      setGenerated(generateDemoJD(form));
    } finally {
      setLoading(false);
    }
  };

  const copyJD = () => {
    navigator.clipboard.writeText(generated);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div>
      <Header title="AI JD Generator" subtitle="Tạo Job Description chuyên nghiệp bằng AI" />
      <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form */}
        <div className="space-y-4">
          <div className="card p-5">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Thông tin vị trí</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="block text-xs font-medium text-gray-600 mb-1">Tên vị trí *</label>
                <input value={form.title} onChange={e => handleChange('title', e.target.value)} className="input-field" placeholder="Senior Frontend Developer" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Phòng ban</label>
                <select value={form.department} onChange={e => handleChange('department', e.target.value)} className="select-field">
                  <option>Engineering</option><option>Product</option><option>Design</option>
                  <option>Data</option><option>Marketing</option><option>Finance</option><option>HR</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Loại hình</label>
                <select value={form.type} onChange={e => handleChange('type', e.target.value)} className="select-field">
                  <option value="full-time">Full-time</option>
                  <option value="part-time">Part-time</option>
                  <option value="intern">Intern</option>
                  <option value="contract">Contract</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Kinh nghiệm yêu cầu</label>
                <input value={form.experience} onChange={e => handleChange('experience', e.target.value)} className="input-field" placeholder="3-5 năm" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Mức lương (VNĐ)</label>
                <input value={form.salary} onChange={e => handleChange('salary', e.target.value)} className="input-field" placeholder="20-35 triệu" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Địa điểm</label>
                <input value={form.location} onChange={e => handleChange('location', e.target.value)} className="input-field" placeholder="TP.HCM" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Hình thức làm việc</label>
                <select value={form.remote} onChange={e => handleChange('remote', e.target.value)} className="select-field">
                  <option value="onsite">Onsite</option>
                  <option value="remote">Remote 100%</option>
                  <option value="hybrid">Hybrid</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Tên công ty</label>
                <input value={form.companyName} onChange={e => handleChange('companyName', e.target.value)} className="input-field" placeholder="TechCorp Vietnam" />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-medium text-gray-600 mb-1">Kỹ năng cần thiết (phân cách bằng dấu phẩy)</label>
                <input value={form.keySkills} onChange={e => handleChange('keySkills', e.target.value)} className="input-field" placeholder="React, TypeScript, Node.js, Docker" />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-medium text-gray-600 mb-1">Trách nhiệm chính (tùy chọn)</label>
                <textarea value={form.responsibilities} onChange={e => handleChange('responsibilities', e.target.value)} className="input-field h-20 resize-none" placeholder="Phát triển tính năng mới, maintain code base..." />
              </div>
            </div>

            <div className="flex gap-2 mt-4">
              <button onClick={generateJD} disabled={!form.title || loading} className="btn-primary flex-1 justify-center py-2.5 disabled:opacity-50">
                {loading ? <><Loader2 size={16} className="animate-spin" />Đang tạo...</> : <><Wand2 size={16} />Tạo JD bằng AI</>}
              </button>
              <button onClick={() => { setForm(defaultForm); setGenerated(''); }} className="btn-ghost">
                <RefreshCw size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* Output */}
        <div>
          {!generated && !loading && (
            <div className="card p-8 text-center h-full flex flex-col items-center justify-center text-gray-400">
              <Wand2 size={48} className="mb-4 opacity-30" />
              <p className="text-sm">Điền thông tin và nhấn "Tạo JD" để AI viết Job Description</p>
            </div>
          )}
          {loading && (
            <div className="card p-8 text-center h-full flex flex-col items-center justify-center">
              <Loader2 size={36} className="text-blue-600 animate-spin mb-3" />
              <p className="text-sm text-gray-700">AI đang soạn JD...</p>
            </div>
          )}
          {generated && (
            <div className="card p-5 fade-in">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle size={16} />
                  <span className="text-sm font-medium">JD đã được tạo!</span>
                </div>
                <div className="flex gap-2">
                  <button onClick={copyJD} className="btn-secondary text-xs py-1.5">
                    {copied ? <><CheckCircle size={12} />Đã copy</> : <><Copy size={12} />Copy</>}
                  </button>
                  <button className="btn-secondary text-xs py-1.5">
                    <Download size={12} />Tải xuống
                  </button>
                </div>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-800 whitespace-pre-wrap leading-relaxed overflow-y-auto max-h-[600px] font-mono text-xs">
                {generated}
              </div>
              <div className="flex gap-2 mt-3">
                <button className="btn-primary flex-1 justify-center">Đăng JD này</button>
                <button onClick={generateJD} className="btn-secondary flex-1 justify-center"><RefreshCw size={14} />Tạo lại</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function generateDemoJD(form: JDForm): string {
  return `# ${form.title}
📍 ${form.location} | 💼 ${form.type} | 🏠 ${form.remote} | 💰 ${form.salary || 'Thỏa thuận'}

## Về ${form.companyName}
${form.companyName} là công ty công nghệ hàng đầu Việt Nam, chuyên phát triển các giải pháp phần mềm B2B cho doanh nghiệp. Với đội ngũ 200+ kỹ sư và văn phòng tại TP.HCM, Hà Nội, chúng tôi đang tìm kiếm những tài năng xuất sắc để cùng xây dựng sản phẩm thế hệ tiếp theo.

## Trách nhiệm chính
• Phát triển và maintain các tính năng ${form.department.toLowerCase()} chất lượng cao
• Thiết kế và implement kiến trúc hệ thống scalable
• Code review và mentoring junior members
• Phối hợp chặt chẽ với Product, Design để deliver feature đúng hạn
• Cải thiện hiệu suất và chất lượng code base
${form.responsibilities ? `• ${form.responsibilities.split('\n').join('\n• ')}` : ''}

## Yêu cầu
**Bắt buộc:**
• ${form.experience} kinh nghiệm trong lĩnh vực ${form.department}
• Thành thạo: ${form.keySkills || 'các công nghệ liên quan'}
• Tư duy logic tốt, khả năng giải quyết vấn đề phức tạp
• Tiếng Anh đọc hiểu tài liệu kỹ thuật

**Là điểm cộng:**
• Kinh nghiệm startup hoặc product company
• Đóng góp open source
• Kinh nghiệm hệ thống microservices/cloud

## Quyền lợi
💰 Lương: ${form.salary || 'Cạnh tranh, thương lượng theo năng lực'}
🏥 Bảo hiểm sức khỏe cao cấp cho bản thân + gia đình
📚 Budget đào tạo 10.000.000 VNĐ/năm
🏖️ 15 ngày phép/năm + nghỉ lễ theo luật lao động
💻 Laptop MacBook Pro + thiết bị làm việc hiện đại
🎯 Review lương 2 lần/năm + bonus KPI hấp dẫn
🤝 Môi trường làm việc Agile, không chính trị

## Quy trình tuyển dụng
1. CV Screening (1-2 ngày)
2. HR Interview (30 phút)
3. Technical Assessment (1-2 giờ)
4. Manager Interview (1 giờ)
5. Offer Letter

📧 Gửi CV: hr@${form.companyName.toLowerCase().replace(/\s/g, '')}.com
📱 Hotline: 028-xxxx-xxxx

*${form.companyName} là nơi làm việc bình đẳng, hoan nghênh tất cả ứng viên bất kể giới tính, dân tộc hay tôn giáo.*`;
}
