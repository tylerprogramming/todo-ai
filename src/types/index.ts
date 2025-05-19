export interface Task {
  id: string;
  title: string;
  completed: boolean;
}

export interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export interface Database {
  public: {
    Tables: {
      todos: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          completed: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string;
          title: string;
          completed?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          completed?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}