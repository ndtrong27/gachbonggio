'use client';

import React, { useState } from 'react';
import { ExternalLink, X, Image as ImageIcon, ZoomIn } from 'lucide-react';

interface ChatMarkdownProps {
  content: string;
  className?: string;
}

interface ImageModalState {
  url: string;
  alt: string;
}

export function ChatMarkdown({ content, className = '' }: ChatMarkdownProps) {
  const [modalImage, setModalImage] = useState<ImageModalState | null>(null);

  if (!content) return null;

  // Split lines while preserving intent
  const lines = content.split('\n');

  // Helper to parse inline markdown: **bold**, [link](url), `code`
  const renderInline = (text: string): React.ReactNode => {
    // Regex matching bold, link, code
    const tokenRegex = /(\*\*[^*]+\*\*|\[[^\]]+\]\(https?:\/\/[^\s\)]+\)|`[^`]+`)/g;
    const parts = text.split(tokenRegex);

    return parts.map((part, idx) => {
      if (!part) return null;

      // Bold **text**
      if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
        return <strong key={idx}>{part.slice(2, -2)}</strong>;
      }

      // Markdown Link [text](url)
      const linkMatch = part.match(/^\[([^\]]+)\]\((https?:\/\/[^\s\)]+)\)$/);
      if (linkMatch) {
        return (
          <a
            key={idx}
            href={linkMatch[2]}
            target="_blank"
            rel="noopener noreferrer"
            className="chat-md-inline-link"
          >
            {linkMatch[1]}
            <ExternalLink size={11} style={{ display: 'inline', marginLeft: 3, verticalAlign: 'middle' }} />
          </a>
        );
      }

      // Inline code `code`
      if (part.startsWith('`') && part.endsWith('`') && part.length > 2) {
        return (
          <code
            key={idx}
            style={{
              background: 'rgba(0,0,0,0.06)',
              padding: '2px 5px',
              borderRadius: 4,
              fontSize: '0.875em',
              fontFamily: 'monospace',
            }}
          >
            {part.slice(1, -1)}
          </code>
        );
      }

      return <span key={idx}>{part}</span>;
    });
  };

  return (
    <>
      <div className={`chat-markdown ${className}`}>
        {lines.map((rawLine, lineIdx) => {
          const trimmed = rawLine.trim();

          // Empty line -> spacing spacer
          if (!trimmed) {
            return <div key={lineIdx} style={{ height: '0.35rem' }} />;
          }

          // Case 1: The line is an image (with or without bullet "- ![alt](url)")
          // Matches: "- ![Mẫu](https://...)", "* ![...](...)", or "![...](...)"
          const imageLineMatch = trimmed.match(/^[-*•]?\s*!\[([^\]]*)\]\((https?:\/\/[^\s\)]+)\)$/);
          if (imageLineMatch) {
            const alt = imageLineMatch[1].trim() || 'Hình ảnh sản phẩm';
            const url = imageLineMatch[2].trim();

            return (
              <div key={lineIdx} className="chat-md-image-card">
                <div
                  className="chat-md-image-wrapper"
                  onClick={() => setModalImage({ url, alt })}
                  title="Nhấp để xem ảnh to chi tiết"
                >
                  <img
                    src={url}
                    alt={alt}
                    loading="lazy"
                    className="chat-md-image"
                    onError={(e) => {
                      // Fallback placeholder if image fails to load
                      const target = e.currentTarget;
                      target.style.display = 'none';
                      const parent = target.parentElement;
                      if (parent && !parent.querySelector('.img-error-fallback')) {
                        const fallback = document.createElement('div');
                        fallback.className = 'img-error-fallback';
                        fallback.style.cssText =
                          'padding: 1rem; color: #64748b; font-size: 0.8125rem; display: flex; align-items: center; gap: 6px;';
                        fallback.innerHTML = '<span>⚠️ Không thể tải ảnh trực tiếp</span>';
                        parent.appendChild(fallback);
                      }
                    }}
                  />
                  <div className="chat-md-image-badge">
                    <ZoomIn size={12} />
                    <span>Phóng to</span>
                  </div>
                </div>
                {alt && <div className="chat-md-image-caption">{alt}</div>}
              </div>
            );
          }

          // Case 2: Numbered list item e.g. "1. **Gạch bông gió**"
          const numberedMatch = trimmed.match(/^(\d+)\.\s+(.*)$/);
          if (numberedMatch) {
            return (
              <div key={lineIdx} className="chat-markdown-item" style={{ marginTop: '0.25rem' }}>
                <span className="chat-markdown-bullet" style={{ minWidth: '1.25rem' }}>
                  {numberedMatch[1]}.
                </span>
                <div style={{ flex: 1 }}>{renderInline(numberedMatch[2])}</div>
              </div>
            );
          }

          // Case 3: Bullet list item e.g. "- **Mã sản phẩm:** VCB-01"
          const bulletMatch = trimmed.match(/^[-*•]\s+(.*)$/);
          if (bulletMatch) {
            return (
              <div
                key={lineIdx}
                className="chat-markdown-item"
                style={{ paddingLeft: '0.5rem', marginTop: '0.15rem' }}
              >
                <span className="chat-markdown-bullet">•</span>
                <div style={{ flex: 1 }}>{renderInline(bulletMatch[1])}</div>
              </div>
            );
          }

          // Case 4: Standard text paragraph
          return (
            <p key={lineIdx} style={{ margin: 0 }}>
              {renderInline(rawLine)}
            </p>
          );
        })}
      </div>

      {/* Lightbox Modal for High Resolution Image Preview */}
      {modalImage && (
        <div
          className="chat-lightbox-backdrop"
          onClick={() => setModalImage(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="chat-lightbox-container"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="chat-lightbox-bar">
              <span className="chat-lightbox-title">
                {modalImage.alt || 'Hình ảnh sản phẩm Vĩnh Cửu Sài Gòn'}
              </span>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <a
                  href={modalImage.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="chat-md-image-badge"
                  style={{ position: 'static', background: '#0284c7' }}
                  title="Mở trong tab mới"
                >
                  <ExternalLink size={12} />
                  <span>Mở tab mới</span>
                </a>
                <button
                  type="button"
                  className="chat-lightbox-close"
                  onClick={() => setModalImage(null)}
                  title="Đóng (ESC)"
                  aria-label="Đóng"
                >
                  <X size={18} />
                </button>
              </div>
            </div>
            <img
              src={modalImage.url}
              alt={modalImage.alt}
              className="chat-lightbox-img"
            />
          </div>
        </div>
      )}
    </>
  );
}
