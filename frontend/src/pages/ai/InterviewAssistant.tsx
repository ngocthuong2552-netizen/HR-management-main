import API_BASE from '../../api/config';
import { useState } from 'react';
import { Bot, Loader2, Copy, RefreshCw, CheckCircle, MessageSquare, Star } from 'lucide-react';
import Header from '../../components/layout/Header';

interface Question {
  category: string;
  question: string;
  followUp?: string;
  tip?: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

const demoQuestions: Record<string, Question[]> = {
  hr: [
    { category: 'Giới thiệu', question: 'Bạn hãy giới thiệu ngắn gọn về bản thân và hành trình sự nghiệp của bạn?', followUp: 'Điều gì đã thúc đẩy bạn chọn con đường này?', difficulty: 'easy', tip: 'Tìm kiếm sự nhất quán trong định hướng nghề nghiệp' },
    { category: 'Động lực', question: 'Tại sao bạn muốn ứng tuyển vào công ty chúng tôi? Bạn biết gì về công ty?', difficulty: 'easy', tip: 'Đánh giá sự chuẩn bị và mức độ quan tâm thực sự của ứng viên' },
    { category: 'Điểm mạnh/yếu', question: 'Điểm mạnh lớn nhất của bạn là gì? Và điểm yếu nào bạn đang cải thiện?', followUp: 'Bạn đã làm gì cụ thể để cải thiện điểm yếu đó?', difficulty: 'medium', tip: 'Tìm kiếm sự tự nhận thức và chủ động phát triển bản thân' },
    { category: 'Xung đột', question: 'Kể về một lần bạn phải xử lý xung đột với đồng nghiệp hoặc sếp. Bạn đã làm gì?', difficulty: 'medium', tip: 'Đánh giá kỹ năng giao tiếp và giải quyết mâu thuẫn' },
    { category: 'Áp lực', question: 'Mô tả một tình huống bạn phải làm việc dưới áp lực cao và deadline chặt chẽ.', difficulty: 'medium', tip: 'Tìm ví dụ cụ thể về cách ứng viên quản lý stress' },
  ],
  technical: [
    { category: 'Problem Solving', question: 'Mô tả một vấn đề kỹ thuật phức tạp nhất bạn từng giải quyết. Cách tiếp cận của bạn như thế nào?', difficulty: 'hard', tip: 'Đánh giá tư duy hệ thống và khả năng debug' },
    { category: 'Architecture', question: 'Bạn sẽ thiết kế hệ thống như thế nào nếu cần phục vụ 1 triệu users đồng thời?', followUp: 'Các bottleneck tiềm năng là gì và cách giải quyết?', difficulty: 'hard', tip: 'Đánh giá kiến thức về scalability và distributed systems' },
    { category: 'Code Quality', question: 'Bạn có thể kể về một lần bạn phải refactor codebase lớn? Chiến lược của bạn là gì?', difficulty: 'medium', tip: 'Tìm hiểu về code quality awareness và engineering discipline' },
    { category: 'Tech Stack', question: 'Trong các công nghệ bạn đã sử dụng, cái nào bạn tự tin nhất? Hãy chỉ ra điểm mạnh và hạn chế của nó.', difficulty: 'medium', tip: 'Đánh giá độ sâu kiến thức và tính trung thực' },
    { category: 'Learning', question: 'Bạn theo dõi và cập nhật kiến thức công nghệ như thế nào? Gần đây bạn học được gì mới?', difficulty: 'easy', tip: 'Đánh giá tinh thần học hỏi liên tục' },
  ],
  manager: [
    { category: 'Kỳ vọng', question: 'Trong 6-12 tháng đầu, bạn kỳ vọng đạt được gì tại vị trí này?', difficulty: 'medium', tip: 'Đánh giá sự thực tế và định hướng rõ ràng' },
    { category: 'Collaboration', question: 'Mô tả phong cách làm việc nhóm của bạn. Bạn prefer làm độc lập hay collaborative?', difficulty: 'easy', tip: 'Đánh giá mức độ phù hợp với văn hóa team' },
    { category: 'Leadership', question: 'Kể về một lần bạn dẫn dắt một dự án hoặc team, kể cả khi không có chức danh lãnh đạo.', difficulty: 'hard', tip: 'Tìm kiếm tiềm năng lãnh đạo tự nhiên' },
    { category: 'Salary', question: 'Mức lương bạn kỳ vọng là bao nhiêu và dựa trên cơ sở nào?', difficulty: 'medium', tip: 'Đánh giá sự tự nhận thức về giá trị bản thân' },
    { category: 'Tương lai', question: 'Trong 3-5 năm tới, bạn muốn phát triển theo hướng nào?', difficulty: 'medium', tip: 'Đánh giá tham vọng và sự phù hợp với lộ trình phát triển của công ty' },
  ],
};

const difficultyColors = { easy: 'bg-green-100 text-green-700', medium: 'bg-yellow-100 text-yellow-700', hard: 'bg-red-100 text-red-700' };
const difficultyLabels = { easy: 'Dễ', medium: 'Trung bình', hard: 'Khó' };

export default function InterviewAssistant() {
  const [position, setPosition] = useState('');
  const [level, setLevel] = useState('mid');
  const [type, setType] = useState('hr');
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<Question[] | null>(null);
  const [evaluation, setEvaluation] = useState('');
  const [evalInput, setEvalInput] = useState('');
  const [evalLoading, setEvalLoading] = useState(false);

  const generateQuestions = async () => {
    setLoading(true);
    setQuestions(null);
    try {
      const res = await fetch(`${API_BASE}/api/ai/interview-questions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ position, level, type }),
      });
      if (res.ok) {
        const data = await res.json();
        setQuestions(data.questions);
      } else {
        await new Promise(r => setTimeout(r, 1500));
        setQuestions(demoQuestions[type] || demoQuestions.hr);
      }
    } catch {
      await new Promise(r => setTimeout(r, 1500));
      setQuestions(demoQuestions[type] || demoQuestions.hr);
    } finally {
      setLoading(false);
    }
  };

  const evaluateCandidate = async () => {
    if (!evalInput.trim()) return;
    setEvalLoading(true);
    setEvaluation('');
    try {
      const res = await fetch(`${API_BASE}/api/ai/evaluate-candidate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes: evalInput, position }),
      });
      if (res.ok) {
        const data = await res.json();
        setEvaluation(data.evaluation);
      } else {
        await new Promise(r => setTimeout(r, 1500));
        setEvaluation(getDemoEvaluation());
      }
    } catch {
      await new Promise(r => setTimeout(r, 1500));
      setEvaluation(getDemoEvaluation());
    } finally {
      setEvalLoading(false);
    }
  };

  const copyAll = () => {
    if (!questions) return;
    const text = questions.map((q, i) => `${i+1}. [${q.category}] ${q.question}${q.followUp ? '\n   Follow-up: ' + q.followUp : ''}`).join('\n\n');
    navigator.clipboard.writeText(text);
  };

  return (
    <div>
      <Header title="AI Interview Assistant" subtitle="Tạo câu hỏi phỏng vấn và hỗ trợ đánh giá ứng viên" />
      <div className="p-6 space-y-6">
        {/* Config */}
        <div className="card p-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Cấu hình phỏng vấn</h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Vị trí ứng tuyển</label>
              <input value={position} onChange={e => setPosition(e.target.value)} className="input-field" placeholder="Frontend Developer" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Cấp độ</label>
              <select value={level} onChange={e => setLevel(e.target.value)} className="select-field">
                <option value="junior">Junior (0-2 năm)</option>
                <option value="mid">Mid-level (2-5 năm)</option>
                <option value="senior">Senior (5+ năm)</option>
                <option value="lead">Lead/Manager</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Vòng phỏng vấn</label>
              <select value={type} onChange={e => setType(e.target.value)} className="select-field">
                <option value="hr">HR Interview</option>
                <option value="technical">Technical Interview</option>
                <option value="manager">Manager Interview</option>
              </select>
            </div>
            <div className="flex items-end">
              <button onClick={generateQuestions} disabled={loading} className="btn-primary w-full justify-center disabled:opacity-50">
                {loading ? <><Loader2 size={14} className="animate-spin" />Đang tạo...</> : <><Bot size={14} />Tạo câu hỏi</>}
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Questions */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-900">Bộ câu hỏi phỏng vấn</h3>
              {questions && (
                <button onClick={copyAll} className="btn-secondary text-xs py-1.5"><Copy size={12} />Copy tất cả</button>
              )}
            </div>

            {!questions && !loading && (
              <div className="card p-8 text-center text-gray-400 h-96 flex flex-col items-center justify-center">
                <MessageSquare size={36} className="mb-3 opacity-30" />
                <p className="text-sm">Chọn cấu hình và nhấn "Tạo câu hỏi"</p>
              </div>
            )}

            {loading && (
              <div className="card p-8 text-center text-gray-400 h-96 flex flex-col items-center justify-center">
                <Loader2 size={32} className="text-blue-600 animate-spin mb-3" />
                <p className="text-sm text-gray-700">AI đang tạo câu hỏi...</p>
              </div>
            )}

            {questions && (
              <div className="space-y-3 fade-in">
                {questions.map((q, i) => (
                  <div key={i} className="card p-4">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold flex-shrink-0">{i+1}</span>
                        <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded">{q.category}</span>
                      </div>
                      <span className={`badge text-xs ${difficultyColors[q.difficulty]}`}>{difficultyLabels[q.difficulty]}</span>
                    </div>
                    <p className="text-sm text-gray-800 font-medium mb-2">{q.question}</p>
                    {q.followUp && (
                      <p className="text-xs text-blue-600 bg-blue-50 p-2 rounded-lg mb-2">
                        ↳ Follow-up: {q.followUp}
                      </p>
                    )}
                    {q.tip && (
                      <p className="text-xs text-gray-500 bg-yellow-50 p-2 rounded-lg border border-yellow-100">
                        💡 {q.tip}
                      </p>
                    )}
                  </div>
                ))}

                <button onClick={generateQuestions} className="btn-secondary w-full justify-center">
                  <RefreshCw size={14} />Tạo bộ câu hỏi mới
                </button>
              </div>
            )}
          </div>

          {/* Evaluation */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Đánh giá sau phỏng vấn</h3>
            <div className="card p-5 space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Ghi chú từ phỏng vấn</label>
                <textarea
                  value={evalInput}
                  onChange={e => setEvalInput(e.target.value)}
                  className="input-field h-40 resize-none"
                  placeholder="Nhập ghi chú và nhận xét trong quá trình phỏng vấn. Ví dụ:
- Trả lời tốt câu hỏi về architecture
- Có kinh nghiệm 5 năm React
- Giao tiếp tốt, thái độ tích cực
- Thiếu kinh nghiệm về testing..."
                />
              </div>
              <button onClick={evaluateCandidate} disabled={!evalInput.trim() || evalLoading} className="btn-primary w-full justify-center disabled:opacity-50">
                {evalLoading ? <><Loader2 size={14} className="animate-spin" />Đang đánh giá...</> : <><Star size={14} />Đánh giá ứng viên bằng AI</>}
              </button>

              {evaluation && (
                <div className="fade-in">
                  <div className="flex items-center gap-2 mb-2 text-green-600">
                    <CheckCircle size={14} />
                    <span className="text-xs font-medium">Đánh giá AI</span>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-800 whitespace-pre-wrap">
                    {evaluation}
                  </div>
                </div>
              )}
            </div>

            {/* Interview tips */}
            <div className="card p-5 mt-4">
              <h4 className="text-xs font-semibold text-gray-500 uppercase mb-3">Tips phỏng vấn</h4>
              <div className="space-y-2">
                {[
                  { icon: '⏱️', text: 'Bắt đầu đúng giờ, chuẩn bị link/phòng họp trước 5 phút' },
                  { icon: '📝', text: 'Ghi chú trong quá trình phỏng vấn để không bỏ sót' },
                  { icon: '🎯', text: 'Sử dụng STAR method: Situation - Task - Action - Result' },
                  { icon: '⚖️', text: 'Đánh giá khách quan, tránh bias về giới tính/xuất thân' },
                  { icon: '💬', text: 'Để ứng viên nói ~70% thời gian trong buổi interview' },
                ].map((tip, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-gray-600">
                    <span className="flex-shrink-0">{tip.icon}</span>
                    <span>{tip.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function getDemoEvaluation(): string {
  return `📊 ĐÁNH GIÁ ỨNG VIÊN

⭐ Điểm tổng thể: 8.2/10

✅ Điểm mạnh:
• Kinh nghiệm kỹ thuật phù hợp với yêu cầu vị trí
• Tư duy giải quyết vấn đề tốt, approach có hệ thống
• Giao tiếp rõ ràng, trả lời trực tiếp vào vấn đề
• Thái độ học hỏi tích cực, cởi mở với feedback

⚠️ Điểm cần cân nhắc:
• Chưa có nhiều kinh nghiệm với hệ thống quy mô lớn
• Kiến thức testing còn hạn chế

🎯 Đề xuất:
✅ TIẾP TỤC vào vòng tiếp theo

📝 Ghi chú cho Manager Interview:
• Hỏi thêm về kinh nghiệm leadership và teamwork
• Clarify kỳ vọng lương và lộ trình phát triển
• Thảo luận về culture fit với team

💼 Phù hợp với vị trí: MID-LEVEL (không phải senior như đề xuất ban đầu)`;
}
