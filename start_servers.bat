@echo off
echo ================================================================
echo    PAWANSATYA // AI Forecast Bust Detection System (SIH)
echo ================================================================
echo Starting Backend (FastAPI on http://localhost:8000)...
start "PawanSatya Backend" cmd /k "cd /d %~dp0backend && python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload"

echo Starting Frontend (Vite on http://localhost:5173)...
start "PawanSatya Frontend" cmd /k "cd /d %~dp0frontend && npm run dev"

echo.
echo Both servers are starting!
echo Backend API Docs: http://localhost:8000/docs
echo Frontend Dashboard: http://localhost:5173
echo ================================================================
