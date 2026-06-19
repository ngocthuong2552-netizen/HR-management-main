import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Candidates from './pages/ats/Candidates';
import Pipeline from './pages/ats/Pipeline';
import TalentPool from './pages/ats/TalentPool';
import Jobs from './pages/recruitment/Jobs';
import Requests from './pages/recruitment/Requests';
import Analytics from './pages/Analytics';
import Courses from './pages/lms/Courses';
import LearningPaths from './pages/lms/LearningPaths';
import Chatbot from './pages/ai/Chatbot';
import CVParser from './pages/ai/CVParser';
import JDGenerator from './pages/ai/JDGenerator';
import InterviewAssistant from './pages/ai/InterviewAssistant';

export default function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/ats/candidates" element={<Candidates />} />
          <Route path="/ats/pipeline" element={<Pipeline />} />
          <Route path="/ats/talent-pool" element={<TalentPool />} />
          <Route path="/recruitment/jobs" element={<Jobs />} />
          <Route path="/recruitment/requests" element={<Requests />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/lms/courses" element={<Courses />} />
          <Route path="/lms/paths" element={<LearningPaths />} />
          <Route path="/ai/chatbot" element={<Chatbot />} />
          <Route path="/ai/cv-parser" element={<CVParser />} />
          <Route path="/ai/jd-generator" element={<JDGenerator />} />
          <Route path="/ai/interview" element={<InterviewAssistant />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
