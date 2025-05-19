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
  - Python FastAPI (Chatbot API)

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or yarn
- Supabase account
- Python 3.8+ (for chatbot API)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/todo-app-chatbot.git
   cd todo-app-chatbot
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

### Database Setup

The application uses Supabase as its database with the following schema:

- `todos` table:
  - `id`: UUID (Primary Key)
  - `user_id`: UUID (Foreign Key to auth.users)
  - `title`: Text
  - `completed`: Boolean
  - `created_at`: Timestamp
  - `updated_at`: Timestamp

Row Level Security (RLS) policies are implemented to ensure users can only access their own data.

## Development

### Project Structure

```
src/
├── components/     # React components
├── hooks/         # Custom React hooks
├── lib/           # Utility functions and configurations
├── services/      # API and service functions
└── types/         # TypeScript type definitions
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Supabase](https://supabase.com/) for the backend infrastructure
- [Tailwind CSS](https://tailwindcss.com/) for the styling
- [Lucide React](https://lucide.dev/) for the icons