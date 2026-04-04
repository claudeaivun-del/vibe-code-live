import { useCallback } from 'react';

interface CodeEditorProps {
  content: string;
  language: string;
  onChange: (content: string) => void;
}

const CodeEditor = ({ content, onChange }: CodeEditorProps) => {
  const lines = content.split('\n');

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      onChange(e.target.value);
    },
    [onChange]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Tab') {
        e.preventDefault();
        const target = e.currentTarget;
        const start = target.selectionStart;
        const end = target.selectionEnd;
        const newValue = content.substring(0, start) + '  ' + content.substring(end);
        onChange(newValue);
        requestAnimationFrame(() => {
          target.selectionStart = target.selectionEnd = start + 2;
        });
      }
    },
    [content, onChange]
  );

  return (
    <div className="flex h-full bg-[hsl(var(--editor-bg))] overflow-hidden">
      {/* Line numbers */}
      <div className="flex flex-col items-end py-4 px-3 select-none border-r border-border/50 bg-[hsl(var(--editor-bg))]">
        {lines.map((_, i) => (
          <span key={i} className="line-number text-xs leading-6 font-mono">
            {i + 1}
          </span>
        ))}
      </div>

      {/* Editor area */}
      <div className="relative flex-1">
        <textarea
          value={content}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          spellCheck={false}
          className="absolute inset-0 w-full h-full bg-transparent text-foreground font-mono text-sm leading-6 p-4 resize-none outline-none caret-primary"
          style={{ tabSize: 2 }}
        />
      </div>
    </div>
  );
};

export default CodeEditor;
