# VedaAI – AI Assessment Creator

VedaAI is a comprehensive full-stack application designed for teachers to generate professional, exam-ready question papers using AI.

## 🏗 Architecture

- **Monorepo**: `/frontend` (Next.js) and `/backend` (Express).
- **Frontend**: Next.js 14, Tailwind CSS, Zustand, Framer Motion.
- **Backend**: Express, MongoDB, Redis, BullMQ, WebSocket.
- **AI**: Anthropic Claude 3.5 Sonnet.
- **PDF**: Puppeteer.

## 🚀 Setup Steps

### 1. Prerequisites
- Node.js 18+
- MongoDB
- Redis

### 2. Backend Setup
1. `cd backend`
2. `npm install`
3. Create `.env` with:
   - `PORT=4000`
   - `MONGODB_URI=mongodb://localhost:27017/vedaai`
   - `REDIS_URL=redis://localhost:6379`
   - `ANTHROPIC_API_KEY=your_key`
4. `npm run dev` (API Server)
5. `npm run worker` (Background Workers)

### 3. Frontend Setup
1. `cd frontend`
2. `npm install`
3. Create `.env.local` with:
   - `NEXT_PUBLIC_API_URL=http://localhost:4000/api`
   - `NEXT_PUBLIC_WS_URL=ws://localhost:4000`
4. `npm run dev`

## 📑 API Table

| Method | Endpoint | Description | Cache |
| :--- | :--- | :--- | :--- |
| GET | `/api/assignments` | List all assignments | 60s |
| POST | `/api/assignments` | Create assignment & queue job | - |
| DELETE | `/api/assignments/:id` | Delete assignment & clear cache | - |
| POST | `/api/assignments/:id/regenerate` | Re-queue generation job | - |
| GET | `/api/papers/:id` | Get generated paper | 300s |
| GET | `/api/papers/:id/pdf` | Stream PDF buffer | - |
| GET | `/api/jobs/:id/status` | Polling job status | - |

## 🔌 WebSocket Events

| Event Type | Payload | Description |
| :--- | :--- | :--- |
| `subscribe` | `{ "type": "subscribe", "jobId": "..." }` | Client subscribes to job updates |
| `progress` | `{ "type": "progress", "percent": 40, "message": "..." }` | Server sends progress updates |
| `complete` | `{ "type": "complete", "paperId": "..." }` | Server signals job completion |
| `error` | `{ "type": "error", "message": "..." }` | Server signals job failure |

## 🎨 Design System
- **Theme**: Light Mode
- **Colors**: Background `#F0F0F0`, Card `#FFFFFF`, Primary `#1A1A1A`
- **Logo**: Gradient square "V" (`#FF6B35` to `#E8420A`)
