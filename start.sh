#!/bin/bash
echo "🚀 Starting AI-Powered HR Management System..."

# Start backend
echo "📡 Starting Backend (FastAPI) on port 8000..."
cd backend
venv/bin/uvicorn app.main:app --reload --port 8000 &
BACKEND_PID=$!

# Start frontend
echo "🌐 Starting Frontend (React) on port 5173..."
cd ../frontend
npm run dev &
FRONTEND_PID=$!

echo ""
echo "✅ System started!"
echo "   Frontend: http://localhost:5173"
echo "   Backend:  http://localhost:8000"
echo "   API Docs: http://localhost:8000/docs"
echo ""
echo "Press Ctrl+C to stop all services"

trap "kill $BACKEND_PID $FRONTEND_PID; exit" INT
wait
