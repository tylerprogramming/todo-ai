import { useEffect, useState } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from './lib/supabase';
import { TaskList } from './components/TaskList';
import { useTasks } from './hooks/useTasks';
import { Auth } from './components/Auth';
import { ChatbotButton } from './components/Chatbot/ChatbotButton';
import { ChatbotWindow } from './components/Chatbot/ChatbotWindow';

function App() {
  const [session, setSession] = useState<Session | null>(null);
  const { tasks, loading, error, addTask, toggleTaskCompletion, editTask, removeTask } = useTasks();
  const [searchTerm, setSearchTerm] = useState('');
  const [isChatOpen, setIsChatOpen] = useState(false);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (!session) {
    return <Auth />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Tasks</h1>
          <button
            onClick={() => supabase.auth.signOut()}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Sign out
          </button>
        </div>
        <div className="mt-8">
          <TaskList
            tasks={tasks}
            loading={loading}
            error={error}
            searchTerm={searchTerm}
            onSearch={setSearchTerm}
            onAdd={addTask}
            onToggle={toggleTaskCompletion}
            onEdit={editTask}
            onDelete={removeTask}
          />
        </div>
      </div>

      <ChatbotButton onClick={() => setIsChatOpen(!isChatOpen)} isOpen={isChatOpen} />
      <ChatbotWindow isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </div>
  );
}

export default App;