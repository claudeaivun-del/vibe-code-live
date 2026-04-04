import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface CodeFile {
  id: string;
  name: string;
  language: string;
  content: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

const defaultFiles: CodeFile[] = [
  {
    id: '1',
    name: 'index.html',
    language: 'html',
    content: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My App</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <div id="app">
    <h1>Hello, Vibe Coder! 🚀</h1>
    <p>Start editing to see live changes</p>
    <button onclick="greet()">Click Me</button>
  </div>
  <script src="app.js"></script>
</body>
</html>`,
  },
  {
    id: '2',
    name: 'style.css',
    language: 'css',
    content: `* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Inter', sans-serif;
  background: linear-gradient(135deg, #0f172a, #1e293b);
  color: #e2e8f0;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

#app {
  text-align: center;
  padding: 2rem;
}

h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  background: linear-gradient(90deg, #22d3ee, #a78bfa);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

p {
  color: #94a3b8;
  margin-bottom: 2rem;
}

button {
  padding: 0.75rem 2rem;
  background: #22d3ee;
  color: #0f172a;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(34, 211, 238, 0.3);
}`,
  },
  {
    id: '3',
    name: 'app.js',
    language: 'javascript',
    content: `function greet() {
  const names = ['Vibe Coder', 'Developer', 'Creator', 'Builder'];
  const random = names[Math.floor(Math.random() * names.length)];
  
  const h1 = document.querySelector('h1');
  h1.textContent = \`Hello, \${random}! 🎉\`;
  
  // Add a fun animation
  h1.style.transform = 'scale(1.1)';
  setTimeout(() => {
    h1.style.transform = 'scale(1)';
  }, 200);
}

console.log('App loaded successfully! 🚀');`,
  },
];

export function useCodeStore() {
  const [files, setFiles] = useState<CodeFile[]>(defaultFiles);
  const [activeFileId, setActiveFileId] = useState(defaultFiles[0].id);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'ai',
      content: 'مرحباً! 👋 أنا مساعدك الذكي المدعوم بـ Gemini. يمكنك سؤالي عن أي شيء يتعلق بالكود أو طلب تعديلات.',
      timestamp: new Date(),
    },
  ]);

  const activeFile = files.find((f) => f.id === activeFileId) || files[0];

  const updateFileContent = useCallback((fileId: string, content: string) => {
    setFiles((prev) => prev.map((f) => (f.id === fileId ? { ...f, content } : f)));
  }, []);

  const addFile = useCallback((name: string, language: string) => {
    const newFile: CodeFile = {
      id: Date.now().toString(),
      name,
      language,
      content: '',
    };
    setFiles((prev) => [...prev, newFile]);
    setActiveFileId(newFile.id);
  }, []);

  const deleteFile = useCallback(
    (fileId: string) => {
      setFiles((prev) => {
        const next = prev.filter((f) => f.id !== fileId);
        if (activeFileId === fileId && next.length > 0) {
          setActiveFileId(next[0].id);
        }
        return next;
      });
    },
    [activeFileId]
  );

  const sendMessage = useCallback((content: string) => {
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date(),
    };
    setChatMessages((prev) => [...prev, userMsg]);
    setIsAiLoading(true);

    supabase.functions
      .invoke('gemini-chat', { body: { message: content } })
      .then(({ data, error }) => {
        const reply = error
          ? `⚠️ خطأ: ${error.message}`
          : data?.reply || 'لم أتمكن من الحصول على رد.';

        const aiMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'ai',
          content: reply,
          timestamp: new Date(),
        };
        setChatMessages((prev) => [...prev, aiMsg]);
      })
      .catch((err) => {
        const aiMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'ai',
          content: `⚠️ خطأ في الاتصال: ${err.message}`,
          timestamp: new Date(),
        };
        setChatMessages((prev) => [...prev, aiMsg]);
      })
      .finally(() => setIsAiLoading(false));
  }, []);

  return {
    files,
    activeFile,
    activeFileId,
    setActiveFileId,
    updateFileContent,
    addFile,
    deleteFile,
    chatMessages,
    sendMessage,
    isAiLoading,
  };
}
