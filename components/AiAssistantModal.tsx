'use client'
import React, { useState, useRef, useEffect } from 'react';
import { useAcademy } from '@/context/AcademyContext';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const PRESET_PROMPTS = [
  'How do I fetch documents in Next.js Server Components with getPayload?',
  'Generate an afterChange hook that sends a Discord/Slack webhook',
  'How to configure Role-Based Access Control (RBAC) on fields?',
  'What is the difference between Postgres, SQLite and MongoDB in Payload 3?',
  'How do Join Fields work compared to traditional relationships?',
];

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function formatMarkdown(content: string): string {
  const codeBlocks: string[] = [];
  let text = content.replace(/```(?:typescript|tsx|jsx|js|json|css|html|bash)?([\s\S]*?)```/g, (_, code) => {
    const rawCode = code.trim();
    const escapedCode = escapeHtml(rawCode);
    const placeholder = `___CB_${codeBlocks.length}___`;
    codeBlocks.push(
      `<div class="ai-code"><div class="ai-code-head"><span>TypeScript</span><button class="ai-copy-btn" onclick="navigator.clipboard.writeText(decodeURIComponent('${encodeURIComponent(rawCode)}')).then(() => { this.innerText = '✓ Copied'; setTimeout(() => this.innerText = 'Copy', 1500); })">Copy</button></div><pre><code>${escapedCode}</code></pre></div>`
    );
    return placeholder;
  });

  const inlineCodes: string[] = [];
  text = text.replace(/`([^`]+)`/g, (_, inline) => {
    const placeholder = `___IC_${inlineCodes.length}___`;
    inlineCodes.push(`<code class="ai-inline-code">${escapeHtml(inline)}</code>`);
    return placeholder;
  });

  // Escape raw markdown text
  text = escapeHtml(text);

  // Bold & Italic
  text = text.replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>');
  text = text.replace(/\*([^*]+)\*/g, '<i>$1</i>');
  text = text.replace(/\n/g, '<br/>');

  // Restore inline codes
  inlineCodes.forEach((ic, i) => {
    text = text.replace(`___IC_${i}___`, ic);
  });

  // Restore code blocks
  codeBlocks.forEach((cb, i) => {
    text = text.replace(`___CB_${i}___`, cb);
  });

  return text;
}

export const AiAssistantModal: React.FC = () => {
  const { activeModal, setActiveModal } = useAcademy();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: '👋 Hi! I am your **Payload 3.x AI Assistant**. Ask me anything about schemas, hooks, Next.js 15 Server Actions, database adapters, or access control!',
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [provider, setProvider] = useState<string>('Live AI');
  const endRef = useRef<HTMLDivElement>(null);
  const chatBodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeModal === 'ai') {
      endRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, activeModal]);

  if (activeModal !== 'ai') return null;

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim() || isTyping) return;

    const userMsg: Message = { role: 'user', content: text };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setIsTyping(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.provider) {
          setProvider(
            data.provider === 'gemini' ? 'Gemini 1.5' :
            data.provider === 'openai' ? 'OpenAI GPT-4o' :
            data.provider === 'groq' ? 'Groq Llama 3' : 'Payload Engine'
          );
        }
        setMessages(prev => [...prev, { role: 'assistant', content: data.reply || 'No response received.' }]);
      } else {
        throw new Error('API failed');
      }
    } catch {
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: '⚠️ Could not reach AI service. Please verify your connection or check `.env.local` for API keys.',
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={() => setActiveModal('none')}>
      <div
        className="modal-box ai-modal-box"
        style={{ maxWidth: 720, height: '82vh', maxHeight: '82vh', display: 'flex', flexDirection: 'column' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div className="ai-avatar">✨</div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span className="modal-title">Payload 3.x AI Assistant</span>
                <span className="ai-provider-badge">
                  <span className="ai-provider-dot" /> {provider}
                </span>
              </div>
              <div className="modal-sub">Ask questions, generate schema code &amp; troubleshoot Next.js 15</div>
            </div>
          </div>
          <button className="modal-close" onClick={() => setActiveModal('none')}>✕</button>
        </div>

        {/* Message Stream */}
        <div className="ai-chat-body" ref={chatBodyRef}>
          {messages.map((m, i) => (
            <div key={i} className={`ai-message-row ${m.role}`}>
              <div className="ai-bubble">
                <div
                  className="ai-bubble-content"
                  dangerouslySetInnerHTML={{
                    __html: formatMarkdown(m.content)
                  }}
                />
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="ai-message-row assistant">
              <div className="ai-bubble typing">
                <span className="dot" />
                <span className="dot" />
                <span className="dot" />
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>

        {/* Prompt Starters */}
        <div className="ai-presets">
          {PRESET_PROMPTS.slice(0, 3).map((p, i) => (
            <button key={i} className="ai-preset-chip" onClick={() => handleSend(p)}>
              💡 {p}
            </button>
          ))}
        </div>

        {/* Chat Input */}
        <div className="ai-input-bar">
          <input
            type="text"
            className="ai-input"
            placeholder="Ask about schemas, hooks, database adapters, Next.js Server Components…"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') handleSend();
            }}
          />
          <button className="sb-btn" onClick={() => handleSend()} disabled={!input.trim() || isTyping}>
            {isTyping ? 'Thinking…' : 'Send ↵'}
          </button>
        </div>
      </div>
    </div>
  );
};
