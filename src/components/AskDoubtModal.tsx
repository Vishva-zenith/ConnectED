import React, { useRef, useState } from 'react';
import { useApp } from '../context/AppContext';
import { askAIDoubt, AISolveResult } from '../api/ai';
import { X, Sparkles, Bot, Send, Code, Copy, ImagePlus } from 'lucide-react';

function renderAnswerMarkdown(answer: string): React.ReactNode[] {
  const blocks = answer.replace(/\r\n/g, '\n').split(/```([a-zA-Z0-9+#.-]*)\n?/);
  const rendered: React.ReactNode[] = [];

  blocks.forEach((block, index) => {
    if (index % 2 === 1) {
      rendered.push(
        <pre key={`code-${index}`} className="my-3 max-w-full overflow-x-auto rounded-xl bg-slate-900 p-3 text-xs leading-relaxed text-slate-100">
          <code>{blocks[index + 1] || ''}</code>
        </pre>
      );
      return;
    }

    const content: React.ReactNode[] = [];
    let bullets: string[] = [];
    const flushBullets = () => {
      if (bullets.length === 0) return;
      content.push(
        <ul key={`list-${content.length}`} className="my-2 list-disc space-y-1 pl-5 text-slate-700">
          {bullets.map((item, itemIndex) => <li key={itemIndex}>{item}</li>)}
        </ul>
      );
      bullets = [];
    };

    block.split('\n').forEach((line, lineIndex) => {
      const trimmed = line.trim();
      const heading = trimmed.match(/^#{1,3}\s+(.+)$/);
      const bullet = trimmed.match(/^[-*]\s+(.+)$/);

      if (bullet) bullets.push(bullet[1]);
      else if (heading) {
        flushBullets();
        content.push(<h3 key={`heading-${lineIndex}`} className="mt-4 mb-1 text-sm font-black text-slate-900 first:mt-0">{heading[1]}</h3>);
      } else if (trimmed) {
        flushBullets();
        content.push(<p key={`paragraph-${lineIndex}`} className="my-2 leading-7 text-slate-700">{line}</p>);
      }
    });

    flushBullets();
    rendered.push(<div key={`text-${index}`}>{content}</div>);
  });

  return rendered;
}

export const AskDoubtModal: React.FC = () => {
  const { isAskDoubtModalOpen, setIsAskDoubtModalOpen } = useApp();
  const [question, setQuestion] = useState('');
  const [submittedQuestion, setSubmittedQuestion] = useState('');
  const [codeContext, setCodeContext] = useState('');
  const [showCode, setShowCode] = useState(false);
  const [imageName, setImageName] = useState('');
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [aiResult, setAiResult] = useState<AISolveResult | null>(null);
  const [error, setError] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const requestIdRef = useRef(0);

  if (!isAskDoubtModalOpen) return null;

  const closeModal = () => {
    if (isLoadingAI) return;
    setIsAskDoubtModalOpen(false);
    setQuestion('');
    setSubmittedQuestion('');
    setCodeContext('');
    setShowCode(false);
    setImageName('');
    setAiResult(null);
    setError('');
  };

  const handleAskAI = async () => {
    const currentQuestion = question.trim();
    if (!currentQuestion || isLoadingAI) return;

    const requestId = requestIdRef.current + 1;
    requestIdRef.current = requestId;
    const currentCodeContext = codeContext.trim();
    const currentImageName = imageName;
    setSubmittedQuestion(currentQuestion);
    setIsLoadingAI(true);
    setAiResult(null);
    setError('');

    try {
      const context = [currentCodeContext, currentImageName ? `Attached image: ${currentImageName}` : '']
        .filter(Boolean)
        .join('\n');
      const result = await askAIDoubt(currentQuestion, 'General Engineering', context);
      if (requestId === requestIdRef.current) {
        setAiResult(result);
      }
    } catch (requestError) {
      if (requestId === requestIdRef.current) {
        setError(requestError instanceof Error
          ? requestError.message
          : 'ConnectED AI could not respond. Please try again.');
      }
    } finally {
      setIsLoadingAI(false);
    }
  };

  const copyToClipboard = async () => {
    if (!aiResult?.answer) return;
    await navigator.clipboard.writeText(aiResult.answer);
    setIsCopied(true);
    window.setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white border border-slate-200 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col min-h-0 max-h-[88vh] animate-in fade-in zoom-in-95 duration-200 text-slate-900">
        <div className="px-6 py-5 bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black">Ask ConnectED AI</h2>
              <p className="text-xs text-blue-100">Ask any question and get a clear explanation.</p>
            </div>
          </div>
          <button onClick={closeModal} aria-label="Close AI question dialog" className="p-2 rounded-xl hover:bg-white/10">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 sm:p-6 min-h-0 min-w-0 overflow-y-auto overflow-x-hidden space-y-4">
          {!aiResult && !isLoadingAI && (
            <div className="rounded-2xl border border-blue-100 bg-blue-50/60 p-4 text-sm text-slate-700">
              Ask about a concept, error, circuit, formula, or code problem. You can add technical context when useful.
            </div>
          )}

          {submittedQuestion && aiResult && (
            <div className="ml-auto max-w-[88%] rounded-2xl rounded-br-md bg-blue-600 px-4 py-3 text-sm text-white whitespace-pre-wrap">
              {submittedQuestion}
            </div>
          )}

          {isLoadingAI && (
            <div className="flex items-center gap-3 rounded-2xl border border-blue-200 bg-blue-50 p-4 animate-pulse">
              <Bot className="w-5 h-5 text-blue-600 animate-spin" />
              <div>
                <p className="text-sm font-bold text-blue-900">ConnectED AI is thinking...</p>
                <p className="text-xs text-blue-700">Preparing a clear explanation from the AI service.</p>
              </div>
            </div>
          )}

          {error && (
            <div role="alert" className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
              {error}
            </div>
          )}

          {aiResult && (
            <div className="rounded-2xl rounded-bl-md border border-slate-200 bg-slate-50 p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div className="flex items-center gap-2">
                  <Bot className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm font-black text-slate-900">ConnectED AI</p>
                    <p className="text-[10px] text-slate-500">{aiResult.source}</p>
                  </div>
                </div>
                <button onClick={copyToClipboard} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-600 hover:text-blue-600">
                  <Copy className="w-3.5 h-3.5" />
                  <span>{isCopied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <div className="w-full max-w-full min-w-0 max-h-80 overflow-y-auto overflow-x-hidden rounded-xl bg-white p-4 text-sm">
                {renderAnswerMarkdown(aiResult.answer)}
              </div>
            </div>
          )}

          <div className="space-y-3 border-t border-slate-200 pt-4">
            {showCode && (
              <textarea
                rows={4}
                value={codeContext}
                onChange={event => setCodeContext(event.target.value)}
                placeholder="Paste code or an error message (optional)"
                className="w-full rounded-xl border border-slate-300 bg-slate-50 p-3 font-mono text-xs text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            )}
            {imageName && <p className="text-xs text-slate-600">Image attached: {imageName}</p>}
            <textarea
              rows={3}
              value={question}
              onChange={event => setQuestion(event.target.value)}
              onKeyDown={event => {
                if (event.key === 'Enter' && !event.shiftKey) {
                  event.preventDefault();
                  void handleAskAI();
                }
              }}
              placeholder="What are you stuck on?"
              className="w-full rounded-2xl border border-slate-300 bg-white p-4 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              disabled={isLoadingAI}
            />
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-600 hover:border-blue-300 hover:text-blue-600">
                  <ImagePlus className="w-3.5 h-3.5" /> Add image
                  <input type="file" accept="image/*" className="sr-only" onChange={event => setImageName(event.target.files?.[0]?.name || '')} />
                </label>
                <button type="button" onClick={() => setShowCode(current => !current)} className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold ${showCode ? 'border-blue-300 bg-blue-50 text-blue-600' : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-blue-300 hover:text-blue-600'}`}>
                  <Code className="w-3.5 h-3.5" /> {showCode ? 'Hide code' : 'Add code'}
                </button>
              </div>
              <button type="button" onClick={() => void handleAskAI()} disabled={isLoadingAI || !question.trim()} className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-blue-600/20 hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50">
                <Send className="w-4 h-4" /> Ask ConnectED
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
