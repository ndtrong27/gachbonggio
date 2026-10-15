'use client';

import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, X, Bot, User, Sparkles, ChevronDown, CheckCheck, RefreshCw } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  time: string;
}

const QUICK_SUGGESTIONS = [
  'Báo giá gạch bánh ú xi măng',
  'Mẫu gạch thông gió chắn mưa tốt',
  'Kích thước gạch 190x190x65mm',
  'Chính sách giao hàng tại TP.HCM',
];

export default function FloatingWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'bot',
      text: 'Xin chào Quý khách! 👋 Em là trợ lý tư vấn sản phẩm trực tiếp của Vĩnh Cửu Sài Gòn.\n\nQuý khách đang tìm mẫu gạch bông gió nào (xi măng, tráng men, đất nung...) hay cần hỗ trợ thông số & báo giá công trình ạ?',
      time: 'Vừa xong',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [showCustomerInfo, setShowCustomerInfo] = useState(false);
  const [unreadCount, setUnreadCount] = useState(1);
  const [sessionId, setSessionId] = useState('');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize session ID for conversation logging
  useEffect(() => {
    if (typeof window !== 'undefined') {
      let stored = sessionStorage.getItem('vcsg_chat_session_id');
      if (!stored) {
        stored = `vcsg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
        sessionStorage.setItem('vcsg_chat_session_id', stored);
      }
      setSessionId(stored);
    }
  }, []);

  // Auto-scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setUnreadCount(0);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 200);
    }
  }, [isOpen, messages]);

  // Send message to chatbot API (routes through n8n & logs to Supabase)
  const handleSendMessage = async (textToSend?: string) => {
    const messageContent = (textToSend || input).trim();
    if (!messageContent || isLoading) return;

    const userMsgId = 'user-' + Date.now();
    const currentTime = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });

    const newMsg: ChatMessage = {
      id: userMsgId,
      sender: 'user',
      text: messageContent,
      time: currentTime,
    };

    setMessages((prev) => [...prev, newMsg]);
    if (!textToSend) setInput('');
    setIsLoading(true);

    try {
      const activeSession = sessionId || `vcsg_${Date.now()}`;
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: messageContent,
          name: customerName.trim() || 'Khách hàng',
          phone: customerPhone.trim() || '',
          sessionId: activeSession,
        }),
      });

      if (!response.ok) {
        throw new Error(`Webhook error: ${response.status}`);
      }

      const data = await response.json();
      let botReply = '';

      if (typeof data === 'string') {
        botReply = data;
      } else if (data?.reply) {
        botReply = data.reply;
      } else if (data?.message) {
        botReply = data.message;
      } else if (data?.text) {
        botReply = data.text;
      } else if (Array.isArray(data) && data[0]?.reply) {
        botReply = data[0].reply;
      } else if (Array.isArray(data) && data[0]?.text) {
        botReply = data[0].text;
      } else {
        botReply = JSON.stringify(data);
      }

      const botMsg: ChatMessage = {
        id: 'bot-' + Date.now(),
        sender: 'bot',
        text: botReply || 'Cảm ơn Quý khách! Em đã ghi nhận yêu cầu và sẽ hỗ trợ ngay ạ.',
        time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (error) {
      console.error('Lỗi khi gửi webhook tư vấn n8n:', error);
      const fallbackMsg: ChatMessage = {
        id: 'bot-err-' + Date.now(),
        sender: 'bot',
        text: 'Dạ hệ thống tư vấn trực tiếp đang xử lý nhiều lượt hỏi. Quý khách vui lòng để lại số điện thoại hoặc nhắn tin nhanh qua Zalo 0909.177.415 để kỹ thuật viên phản hồi ngay trong 5 phút nhé!',
        time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Live Chat Panel Dialog */}
      {isOpen && (
        <div className="live-chat-panel" role="dialog" aria-modal="true" aria-label="Hộp thoại tư vấn sản phẩm trực tiếp">
          {/* Header */}
          <div className="live-chat-header">
            <div className="live-chat-header-info">
              <div className="live-chat-avatar">
                <Bot size={22} color="#ffffff" />
                <span className="live-chat-status-dot" title="Trực tuyến" />
              </div>
              <div>
                <h3 className="live-chat-title">Tư Vấn Sản Phẩm Trực Tiếp</h3>
                <p className="live-chat-subtitle">
                  <span className="online-indicator" /> Trực tuyến 24/7 • n8n AI Assistant
                </p>
              </div>
            </div>
            <div className="live-chat-header-actions">
              <button
                type="button"
                className="live-chat-icon-btn"
                onClick={() => setShowCustomerInfo(!showCustomerInfo)}
                title="Cập nhật tên & SĐT liên hệ"
                aria-label="Thông tin khách hàng"
              >
                <User size={18} />
              </button>
              <button
                type="button"
                className="live-chat-icon-btn"
                onClick={() => setIsOpen(false)}
                title="Đóng cửa sổ chat"
                aria-label="Đóng chat"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Optional Customer Contact Bar */}
          {showCustomerInfo && (
            <div className="live-chat-customer-bar">
              <div className="customer-bar-desc">Để lại thông tin để kỹ sư Vĩnh Cửu Sài Gòn tiện liên hệ gửi bảng giá:</div>
              <div className="customer-bar-inputs">
                <input
                  type="text"
                  placeholder="Tên của bạn..."
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="customer-bar-input"
                />
                <input
                  type="tel"
                  placeholder="Số điện thoại / Zalo..."
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="customer-bar-input"
                />
              </div>
            </div>
          )}

          {/* Messages Body */}
          <div className="live-chat-body">
            <div className="live-chat-date-divider">
              <span>Hôm nay</span>
            </div>

            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`live-chat-msg-row ${msg.sender === 'user' ? 'msg-row-user' : 'msg-row-bot'}`}
              >
                {msg.sender === 'bot' && (
                  <div className="msg-avatar-small bot-avatar-small">
                    <Bot size={16} />
                  </div>
                )}
                <div className={`live-chat-bubble ${msg.sender === 'user' ? 'bubble-user' : 'bubble-bot'}`}>
                  <div className="bubble-text">{msg.text}</div>
                  <div className="bubble-meta">
                    <span className="bubble-time">{msg.time}</span>
                    {msg.sender === 'user' && <CheckCheck size={13} className="bubble-check" />}
                  </div>
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isLoading && (
              <div className="live-chat-msg-row msg-row-bot">
                <div className="msg-avatar-small bot-avatar-small">
                  <Bot size={16} />
                </div>
                <div className="live-chat-bubble bubble-bot typing-bubble">
                  <div className="typing-dots">
                    <span />
                    <span />
                    <span />
                  </div>
                  <span className="typing-label">Đang soạn câu trả lời...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestions Chips */}
          <div className="live-chat-suggestions">
            <div className="suggestions-scroll">
              {QUICK_SUGGESTIONS.map((sug, idx) => (
                <button
                  key={idx}
                  type="button"
                  className="suggestion-chip"
                  onClick={() => handleSendMessage(sug)}
                  disabled={isLoading}
                >
                  <Sparkles size={12} className="sug-icon" />
                  <span>{sug}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Input Footer */}
          <div className="live-chat-footer">
            <div className="live-chat-input-wrapper">
              <input
                ref={inputRef}
                type="text"
                placeholder="Nhập câu hỏi hoặc yêu cầu báo giá..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isLoading}
                className="live-chat-input"
                aria-label="Nội dung tin nhắn tư vấn"
              />
              <button
                type="button"
                className="live-chat-send-btn"
                onClick={() => handleSendMessage()}
                disabled={isLoading || !input.trim()}
                title="Gửi tin nhắn"
                aria-label="Gửi tin nhắn"
              >
                {isLoading ? <RefreshCw size={17} className="spin-icon" /> : <Send size={17} />}
              </button>
            </div>
            <div className="live-chat-hint">
              <span>Được kết nối tự động qua n8n AI webhook • Phản hồi tức thì</span>
            </div>
          </div>
        </div>
      )}

      {/* Floating Action Buttons */}
      <div className="floating-widget" aria-label="Kênh liên hệ và tư vấn trực tiếp">
        {/* Zalo Button (Positioned on top) */}
        <a
          href="https://zalo.me/0909177415"
          target="_blank"
          rel="noopener noreferrer"
          className="float-btn float-btn-zalo"
          title="Chat Zalo với chúng tôi"
          aria-label="Liên hệ qua Zalo"
        >
          <span style={{ fontWeight: 800, fontSize: '0.85rem' }}>Zalo</span>
        </a>

        {/* Prominent Live Chat Button (Positioned at bottom) */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`float-btn float-btn-chat ${isOpen ? 'active' : ''}`}
          title="Tư vấn sản phẩm trực tiếp (n8n Live Chat)"
          aria-label="Mở tư vấn sản phẩm trực tiếp"
        >
          {isOpen ? (
            <X size={24} />
          ) : (
            <>
              <div className="chat-btn-inner">
                <MessageSquare size={22} className="chat-icon-main" />
                <span className="chat-pulse-ring" />
                <span className="chat-pulse-ring delay" />
              </div>
              {unreadCount > 0 && (
                <span className="float-badge" title={`${unreadCount} tin nhắn mới`}>
                  1
                </span>
              )}
            </>
          )}
          {/* Tooltip label: hidden by default, reveals smoothly on hover */}
          {!isOpen && (
            <span className="float-chat-tag">
              <span className="tag-dot" />
              Tư vấn trực tiếp
            </span>
          )}
        </button>
      </div>
    </>
  );
}
