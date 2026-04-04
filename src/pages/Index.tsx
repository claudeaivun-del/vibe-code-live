import { useState } from 'react';
import { Code2, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import ChatPanel from '@/components/ChatPanel';
import FileTabs from '@/components/FileTabs';
import CodeEditor from '@/components/CodeEditor';
import LivePreview from '@/components/LivePreview';
import { useCodeStore } from '@/hooks/useCodeStore';

const Index = () => {
  const {
    files,
    activeFile,
    activeFileId,
    setActiveFileId,
    updateFileContent,
    addFile,
    deleteFile,
    chatMessages,
    sendMessage,
  } = useCodeStore();

  const [chatOpen, setChatOpen] = useState(true);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background">
      {/* Chat Sidebar */}
      {chatOpen && (
        <div className="w-80 flex-shrink-0 border-r border-border flex flex-col">
          <ChatPanel messages={chatMessages} onSendMessage={sendMessage} />
        </div>
      )}

      {/* Main Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <div className="flex items-center gap-3 px-4 py-2 bg-card border-b border-border">
          <button
            onClick={() => setChatOpen(!chatOpen)}
            className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            title={chatOpen ? 'Hide chat' : 'Show chat'}
          >
            {chatOpen ? <PanelLeftClose className="w-4 h-4" /> : <PanelLeftOpen className="w-4 h-4" />}
          </button>
          <Code2 className="w-5 h-5 text-primary" />
          <span className="text-sm font-bold text-foreground tracking-tight">
            Vibe<span className="text-primary">Code</span>
          </span>
          <span className="text-xs text-muted-foreground ml-1">Platform</span>
        </div>

        {/* Editor + Preview */}
        <div className="flex-1 flex min-h-0">
          {/* Editor */}
          <div className="flex-1 flex flex-col min-w-0 border-r border-border">
            <FileTabs
              files={files}
              activeFileId={activeFileId}
              onSelectFile={setActiveFileId}
              onAddFile={addFile}
              onDeleteFile={deleteFile}
            />
            <div className="flex-1 min-h-0 overflow-auto">
              <CodeEditor
                content={activeFile.content}
                language={activeFile.language}
                onChange={(c) => updateFileContent(activeFile.id, c)}
              />
            </div>
          </div>

          {/* Preview */}
          <div className="w-[45%] flex-shrink-0 flex flex-col">
            <LivePreview files={files} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
