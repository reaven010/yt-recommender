# 🚀 AI YouTube Recommender Agent

An advanced, agentic YouTube recommendation engine built with **CrewAI**, **FastAPI**, and **Next.js**. This application uses a specialized crew of AI agents to search, analyze transcripts, and rank the best YouTube videos for any given topic.

![Galaxy Background](https://www.reactbits.dev/backgrounds/galaxy)

## 🌟 Features

- **Agentic Workflow**: Four specialized agents (Search, Transcript Extractor, Content Analyst, and Evaluator) collaborate to find the highest quality content.
- **Deep Analysis**: Automatically extracts and summarizes video transcripts to understand the actual content before recommending.
- **Real-time Feedback**: Watch the agents' "thoughts" and reasoning steps live in the frontend Activity Log.
- **Premium UI**: Interactive 3D Galaxy background from React Bits with a sleek, modern dashboard.

## 🏗️ Architecture

- **Frontend**: Next.js 15, Tailwind CSS, Lucide React, OGL (3D Galaxy).
- **Backend**: FastAPI (Python), CrewAI (Agent Orchestration).
- **LLM**: Google Gemini 1.5 Flash / 2.0 Flash.
- **Tools**: Google YouTube Data API, YouTube Transcript API.

## 🛠️ Installation & Setup

### 1. Prerequisites
- Python 3.10+
- Node.js 18+
- [Google AI Studio API Key](https://aistudio.google.com/)
- [YouTube Data API v3 Key](https://console.cloud.google.com/)

### 2. Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: .\venv\Scripts\activate
pip install -r requirements.txt
```

Create a `backend/.env` file:
```env
GOOGLE_API_KEY=your_gemini_api_key
YOUTUBE_API_KEY=your_youtube_api_key
```

### 3. Frontend Setup
```bash
cd frontend
npm install
```

Create a `frontend/.env.local` file:
```env
NEXT_PUBLIC_API_URL=http://localhost:8001
```

## 🚀 Running the App

### Start Backend
```bash
cd backend
uvicorn main:app --reload --port 8001
```

### Start Frontend
```bash
cd frontend
npm run dev
```

Visit `http://localhost:3000` to start exploring!

## 🚢 Deployment

### Backend (Render/Railway)
- Root: `backend`
- Build: `pip install -r requirements.txt`
- Start: `uvicorn main:app --host 0.0.0.0 --port $PORT`

### Frontend (Vercel)
- Root: `frontend`
- Build: `npm run build`
- Environment Variable: `NEXT_PUBLIC_API_URL` (Point to your deployed backend)

## 📜 Credits

- **[No-as-a-Service](https://github.com/hotheadhacker/no-as-a-service)**: Special thanks to [Salman Qureshi (hotheadhacker)](https://github.com/hotheadhacker) for the satirical API used to handle system errors with style.

---
Built with ❤️ by [Reaven010](https://github.com/Reaven010)
