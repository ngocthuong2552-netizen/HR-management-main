import API_BASE from '../../api/config';
import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, RefreshCw, Sparkles, FileText, HelpCircle } from 'lucide-react';
import Header from '../../components/layout/Header';
import type { ChatMessage } from '../../types';

const quickQuestions = [
  'Quy trình tuyển dụng của công ty như thế nào?',
  'Chính sách nghỉ phép quy định bao nhiêu ngày?',
  'Làm thế nào để ứng tuyển vào công ty?',
  'Các chương trình đào tạo nào đang mở?',
  'Trạng thái ứng tuyển của tôi đang ở đâu?',
  'Các phúc lợi của nhân viên bao gồm những gì?',
];


export default function Chatbot() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '0', role: 'assistant', timestamp: new Date().toISOString(),
      content: 'Xin chào! Tôi là HR AI Assistant 🤖\n\nTôi có thể giúp bạn giải đáp các câu hỏi về quy định công ty, quy trình tuyển dụng, chính sách nhân sự và chương trình đào tạo.\n\nBạn cần hỏi gì hôm nay?',
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (text?: string) => {
    const content = text || input.trim();
    if (!content || loading) return;
    setInput('');

    const userMsg: ChatMessage = {
      id: Date.now().toString(), role: 'user',
      content, timestamp: new Date().toISOString(),
    };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/ai/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: content,
          history: messages.map(m => ({ role: m.role, content: m.content })),
        }),
      });

      let replyContent: string;
      if (res.ok) {
        const data = await res.json();
        replyContent = data.reply;
      } else {
        // Fallback responses for demo
        replyContent = getFallbackReply(content);
      }

      const assistantMsg: ChatMessage = {
        id: (Date.now() + 1).toString(), role: 'assistant',
        content: replyContent, timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, assistantMsg]);
    } catch {
      const assistantMsg: ChatMessage = {
        id: (Date.now() + 1).toString(), role: 'assistant',
        content: getFallbackReply(content), timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, assistantMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <Header title="HR AI Chatbot" subtitle="Giải đáp mọi thắc mắc về nhân sự & tuyển dụng" />
      <div className="flex flex-1 overflow-hidden">
        {/* Chat area */}
        <div className="flex-1 flex flex-col">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map(msg => (
              <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                    <Bot size={16} className="text-white" />
                  </div>
                )}
                <div className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm ${
                  msg.role === 'user'
                    ? 'bg-blue-600 text-white rounded-tr-sm'
                    : 'bg-white border border-gray-200 text-gray-800 rounded-tl-sm shadow-sm'
                }`}>
                  <div className="whitespace-pre-wrap">{msg.content}</div>
                  <p className={`text-xs mt-1 ${msg.role === 'user' ? 'text-blue-200' : 'text-gray-400'}`}>
                    {new Date(msg.timestamp).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                {msg.role === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0">
                    <User size={16} className="text-gray-600" />
                  </div>
                )}
              </div>
            ))}
            {loading && (
              <div className="flex gap-3 justify-start">
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                  <Bot size={16} className="text-white" />
                </div>
                <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
                  <Loader2 size={16} className="text-gray-400 animate-spin" />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-200 bg-white">
            <div className="flex gap-2">
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                placeholder="Nhập câu hỏi của bạn... (Enter để gửi)"
                className="input-field flex-1"
                disabled={loading}
              />
              <button
                onClick={() => sendMessage()}
                disabled={!input.trim() || loading}
                className="btn-primary px-4 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-72 border-l border-gray-200 bg-gray-50 p-4 overflow-y-auto">
          <div className="mb-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-semibold text-gray-500 uppercase">Câu hỏi gợi ý</h3>
              <Sparkles size={14} className="text-yellow-500" />
            </div>
            <div className="space-y-2">
              {quickQuestions.map(q => (
                <button
                  key={q}
                  onClick={() => sendMessage(q)}
                  className="w-full text-left text-xs p-2.5 bg-white rounded-lg border border-gray-200 hover:border-blue-400 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <h3 className="text-xs font-semibold text-gray-500 uppercase mb-3">Chủ đề hỗ trợ</h3>
            <div className="grid grid-cols-2 gap-2">
              {[
                { icon: <FileText size={14} />, label: 'Tuyển dụng' },
                { icon: <HelpCircle size={14} />, label: 'Quy định' },
                { icon: <Bot size={14} />, label: 'Đào tạo' },
                { icon: <User size={14} />, label: 'Nhân sự' },
              ].map(item => (
                <button key={item.label} className="flex items-center gap-1.5 p-2 bg-white rounded-lg border border-gray-200 text-xs text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-colors">
                  {item.icon}{item.label}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => setMessages([{
              id: '0', role: 'assistant', timestamp: new Date().toISOString(),
              content: 'Xin chào! Tôi là HR AI Assistant. Bạn cần hỏi gì hôm nay?',
            }])}
            className="btn-secondary w-full justify-center text-xs"
          >
            <RefreshCw size={12} />Bắt đầu lại
          </button>
        </div>
      </div>
    </div>
  );
}

function getFallbackReply(question: string): string {
  const q = question.toLowerCase();
  if (q.includes('nghỉ phép') || q.includes('nghỉ lễ')) {
    return 'Chính sách nghỉ phép:\n• **12 ngày phép năm** cho nhân viên chính thức (tăng 1 ngày/năm, tối đa 18 ngày)\n• Nghỉ lễ theo quy định Nhà nước (12 ngày/năm)\n• Nghỉ ốm có bảo hiểm xã hội\n• Nghỉ cưới: 3 ngày\n• Nghỉ tang: 3 ngày\n\nBạn cần thông tin thêm về phép nào không?';
  }
  if (q.includes('tuyển dụng') || q.includes('ứng tuyển') || q.includes('quy trình')) {
    return 'Quy trình tuyển dụng gồm **7 bước**:\n\n1. 📋 **Applied** – Nộp hồ sơ\n2. 📄 **CV Screening** – HR xem xét CV\n3. 🗣️ **HR Interview** – Phỏng vấn văn hóa\n4. 💻 **Technical Interview** – Phỏng vấn chuyên môn\n5. 👔 **Manager Interview** – Gặp trưởng bộ phận\n6. 📨 **Offer** – Nhận offer letter\n7. ✅ **Hired** – Gia nhập công ty\n\nThời gian trung bình: **28 ngày** từ lúc nộp hồ sơ.';
  }
  if (q.includes('phúc lợi') || q.includes('lương') || q.includes('thưởng')) {
    return 'Phúc lợi nhân viên bao gồm:\n\n💰 **Lương & Thưởng**\n• Lương cạnh tranh, review 2 lần/năm\n• Thưởng tháng 13 + KPI bonus\n• Hỗ trợ xăng xe, ăn trưa\n\n🏥 **Bảo hiểm**\n• BHXH, BHYT, BHTN đầy đủ\n• Bảo hiểm sức khỏe Bảo Việt (cả gia đình)\n\n📚 **Phát triển**\n• Budget đào tạo 10tr/năm\n• Học ngoại ngữ miễn phí\n• Tham dự conference trong nước & quốc tế';
  }
  if (q.includes('đào tạo') || q.includes('khóa học') || q.includes('training')) {
    return 'Các chương trình đào tạo hiện có:\n\n🎓 **Onboarding** (bắt buộc cho nhân viên mới)\n• Văn hóa & quy trình công ty\n• An toàn thông tin\n\n💻 **Technical Training**\n• React Advanced, Machine Learning, DevOps...\n\n🤝 **Soft Skills**\n• Giao tiếp, thuyết trình, leadership\n\n📱 Truy cập LMS tại: menu **Learning** → **Khóa học**\n\nBạn muốn biết thêm về khóa học nào?';
  }
  return 'Cảm ơn câu hỏi của bạn! Tôi đang xử lý để cung cấp thông tin chính xác nhất.\n\nBạn có thể hỏi tôi về:\n• Quy trình tuyển dụng\n• Chính sách nghỉ phép\n• Phúc lợi nhân viên\n• Chương trình đào tạo\n• Quy định công ty\n\nNếu cần hỗ trợ cụ thể hơn, vui lòng liên hệ HR team qua email: hr@company.vn';
}
