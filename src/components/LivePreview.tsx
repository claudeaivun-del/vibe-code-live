import { useMemo } from 'react';
import { Monitor, RefreshCw } from 'lucide-react';
import type { CodeFile } from '@/hooks/useCodeStore';

interface LivePreviewProps {
  files: CodeFile[];
}

const LivePreview = ({ files }: LivePreviewProps) => {
  const htmlFile = files.find((f) => f.name.endsWith('.html'));
  const cssFile = files.find((f) => f.name.endsWith('.css'));
  const jsFile = files.find((f) => f.name.endsWith('.js'));

  const srcDoc = useMemo(() => {
    if (!htmlFile) {
      return `<html><body style="background:#0f172a;color:#e2e8f0;display:flex;align-items:center;justify-content:center;height:100vh;font-family:sans-serif"><p>No HTML file found</p></body></html>`;
    }

    let html = htmlFile.content;

    // Inject CSS
    if (cssFile) {
      const styleTag = `<style>${cssFile.content}</style>`;
      html = html.replace('</head>', `${styleTag}\n</head>`);
    }

    // Inject JS
    if (jsFile) {
      const scriptTag = `<script>${jsFile.content}<\/script>`;
      html = html.replace('</body>', `${scriptTag}\n</body>`);
    }

    return html;
  }, [htmlFile, cssFile, jsFile]);

  const handleRefresh = () => {
    const iframe = document.getElementById('preview-frame') as HTMLIFrameElement;
    if (iframe) {
      iframe.srcdoc = '';
      requestAnimationFrame(() => {
        iframe.srcdoc = srcDoc;
      });
    }
  };

  return (
    <div className="flex flex-col h-full bg-card">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-2 border-b border-border">
        <Monitor className="w-4 h-4 text-primary" />
        <span className="text-xs font-semibold text-foreground">Live Preview</span>
        <div className="ml-auto flex items-center gap-2">
          <div className="flex gap-1">
            <span className="w-2 h-2 rounded-full bg-success animate-pulse-glow" />
          </div>
          <span className="text-xs text-muted-foreground">Live</span>
          <button
            onClick={handleRefresh}
            className="p-1 text-muted-foreground hover:text-primary transition-colors"
            title="Refresh"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Preview */}
      <div className="flex-1 bg-background">
        <iframe
          id="preview-frame"
          srcDoc={srcDoc}
          title="Live Preview"
          className="w-full h-full border-none"
          sandbox="allow-scripts"
        />
      </div>
    </div>
  );
};

export default LivePreview;
