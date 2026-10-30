# Todo Application with Chatbot

A modern, minimalist todo application built with React, TypeScript, and Supabase, featuring a built-in chatbot assistant.

## Features

- ✨ User authentication with email and password
- 📝 Create, read, update, and delete todos
- 🔍 Real-time search functionality
- 🤖 AI-powered chatbot assistant
- 📊 Task completion metrics and progress tracking
- 🎨 Beautiful, responsive UI with Tailwind CSS
- 🔒 Secure data handling with Row Level Security
- 🔄 Real-time updates with Supabase

## Tech Stack

- **Frontend:**
  - React 18
  - TypeScript
  - Tailwind CSS
  - Lucide React Icons
  - Vite

- **Backend:**
  - Supabase (Authentication & Database)
  - PostgreSQL with RLS
  - [fastapi-backend](https://github.com/tylerprogramming/fastapi-backend) for the chatbot and recommended todos (FastAPI + OpenAI Agents SDK)

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/tylerprogramming/todo-ai.git
   cd todo-ai
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy `.env.example` to `.env` and fill in your Supabase URL and anon key. `VITE_API_BASE_URL` points at the backend and defaults to `http://localhost:8000`.

4. Start the backend: follow the [fastapi-backend README](https://github.com/tylerprogramming/fastapi-backend#readme) (`uvicorn main:app --reload` serves `POST /chatbot/`, `POST /recommendations/` and `POST /thumbs`). To use a tunnel such as ngrok instead, set `VITE_API_BASE_URL` to its URL.

5. Start the development server:
   ```bash
   npm run dev
   ```

`backend/main.py` in this repo is an early stub with sample data. It has no `/chatbot/` route, and its `/recommendations` route is a GET, so the app does not work against it. Use fastapi-backend.

## License

This project is licensed under the MIT License.