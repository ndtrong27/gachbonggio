'use client';

import { useState, useEffect } from 'react';
import { Tables } from '@/types/database.types';
import { ChatMarkdown } from '@/components/ChatMarkdown';

type ChatLog = Tables<'ai_chat_logs'>;
type Guideline = Tables<'ai_guidelines'>;

export default function AiAgentManagerClient() {
  const [activeTab, setActiveTab] = useState<'logs' | 'guidelines' | 'playground'>('logs');

  // Logs state
  const [logs, setLogs] = useState<ChatLog[]>([]);
  const [logsLoading, setLogsLoading] = useState(true);
  const [filterRating, setFilterRating] = useState<string>('all');
  const [selectedLog, setSelectedLog] = useState<ChatLog | null>(null);
  const [adminNoteInput, setAdminNoteInput] = useState<{ [id: string]: string }>({});
  const [actionSuccessMsg, setActionSuccessMsg] = useState('');

  // Guidelines state
  const [guidelines, setGuidelines] = useState<Guideline[]>([]);
  const [guidelinesLoading, setGuidelinesLoading] = useState(true);
  const [isGuidelineModalOpen, setIsGuidelineModalOpen] = useState(false);
  const [editingGuideline, setEditingGuideline] = useState<Guideline | null>(null);
  const [guidelineForm, setGuidelineForm] = useState({
    title: '',
    rule_content: '',
    category: 'Sản phẩm',
    priority: 1,
    is_active: true,
  });

  // Playground state
  const [testInput, setTestInput] = useState('');
  const [testMessages, setTestMessages] = useState<Array<{ sender: 'user' | 'bot'; text: string; time: string }>>([
    {
      sender: 'bot',
      text: 'Xin chào Admin! Đây là môi trường Live Playground thử nghiệm AI Agent n8n với toàn bộ các quy tắc cập nhật từ Supabase. Admin hãy thử đặt câu hỏi để kiểm tra câu trả lời nhé!',
      time: 'Hệ thống',
    },
  ]);
  const [testLoading, setTestLoading] = useState(false);

  // Fetch Logs
  const fetchLogs = async () => {
    try {
      setLogsLoading(true);
      const url = filterRating === 'all' ? '/api/admin/ai/logs' : `/api/admin/ai/logs?rating=${filterRating}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setLogs(data.logs || []);
      }
    } catch (err) {
      console.error('Lỗi tải logs:', err);
    } finally {
      setLogsLoading(false);
    }
  };

  // Fetch Guidelines
  const fetchGuidelines = async () => {
    try {
      setGuidelinesLoading(true);
      const res = await fetch('/api/admin/ai/guidelines');
      if (res.ok) {
        const data = await res.json();
        setGuidelines(data.guidelines || []);
      }
    } catch (err) {
      console.error('Lỗi tải guidelines:', err);
    } finally {
      setGuidelinesLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [filterRating]);

  useEffect(() => {
    fetchGuidelines();
  }, []);

  const showNotification = (msg: string) => {
    setActionSuccessMsg(msg);
    setTimeout(() => setActionSuccessMsg(''), 4000);
  };

  // Handle Rate Log
  const handleRateLog = async (id: string, rating: 'positive' | 'negative') => {
    try {
      const note = adminNoteInput[id] !== undefined ? adminNoteInput[id] : '';
      const res = await fetch('/api/admin/ai/logs', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, rating, admin_notes: note }),
      });

      if (res.ok) {
        const data = await res.json();
        setLogs((prev) => prev.map((l) => (l.id === id ? data.log : l)));
        showNotification(rating === 'positive' ? 'Đã đánh giá: 👍 Chuẩn xác' : 'Đã đánh giá: 👎 Cần cải thiện');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Save Admin Note only
  const handleSaveNote = async (id: string) => {
    try {
      const note = adminNoteInput[id] || '';
      const res = await fetch('/api/admin/ai/logs', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, admin_notes: note }),
      });

      if (res.ok) {
        const data = await res.json();
        setLogs((prev) => prev.map((l) => (l.id === id ? data.log : l)));
        showNotification('Đã lưu ghi chú thành công!');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Open modal to turn log into a permanent guideline
  const handleCreateRuleFromLog = (log: ChatLog) => {
    setEditingGuideline(null);
    setGuidelineForm({
      title: `Lưu ý từ câu hỏi: "${log.user_message.slice(0, 40)}..."`,
      rule_content: log.admin_notes
        ? log.admin_notes
        : `Khi khách hàng hỏi về: "${log.user_message}", hãy lưu ý:\n- Câu trả lời đúng chuẩn: [Ghi chú nội dung đúng vào đây]`,
      category: 'Sản phẩm',
      priority: 1,
      is_active: true,
    });
    setIsGuidelineModalOpen(true);
  };

  // Toggle Guideline Active Status
  const handleToggleGuideline = async (g: Guideline) => {
    try {
      const newStatus = !g.is_active;
      const res = await fetch('/api/admin/ai/guidelines', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: g.id, is_active: newStatus }),
      });

      if (res.ok) {
        const data = await res.json();
        setGuidelines((prev) => prev.map((item) => (item.id === g.id ? data.guideline : item)));
        showNotification(`Đã ${newStatus ? 'BẬT' : 'TẮT'} quy tắc: "${g.title}"`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Delete Guideline
  const handleDeleteGuideline = async (id: string, title: string) => {
    if (!confirm(`Bạn có chắc muốn xóa quy tắc: "${title}"?`)) return;
    try {
      const res = await fetch(`/api/admin/ai/guidelines?id=${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setGuidelines((prev) => prev.filter((item) => item.id !== id));
        showNotification('Đã xóa quy tắc thành công!');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Save or Create Guideline Submit
  const handleSaveGuidelineSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guidelineForm.title.trim() || !guidelineForm.rule_content.trim()) {
      alert('Vui lòng điền đầy đủ tiêu đề và nội dung quy tắc.');
      return;
    }

    try {
      if (editingGuideline) {
        // Edit existing
        const res = await fetch('/api/admin/ai/guidelines', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: editingGuideline.id,
            ...guidelineForm,
          }),
        });
        if (res.ok) {
          const data = await res.json();
          setGuidelines((prev) => prev.map((item) => (item.id === editingGuideline.id ? data.guideline : item)));
          setIsGuidelineModalOpen(false);
          showNotification('Đã cập nhật quy tắc thành công!');
        }
      } else {
        // Create new
        const res = await fetch('/api/admin/ai/guidelines', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(guidelineForm),
        });
        if (res.ok) {
          const data = await res.json();
          setGuidelines((prev) => [data.guideline, ...prev]);
          setIsGuidelineModalOpen(false);
          showNotification('Đã thêm quy tắc mới cho AI Agent thành công!');
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Handle Live Playground Send
  const handlePlaygroundSend = async () => {
    if (!testInput.trim() || testLoading) return;
    const msg = testInput.trim();
    setTestInput('');

    const userEntry = {
      sender: 'user' as const,
      text: msg,
      time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
    };
    setTestMessages((prev) => [...prev, userEntry]);
    setTestLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: msg,
          name: 'Admin Tester',
          phone: '0909177415',
          sessionId: 'test-admin-' + Date.now(),
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setTestMessages((prev) => [
          ...prev,
          {
            sender: 'bot',
            text: data.reply || 'Không có phản hồi.',
            time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
      } else {
        setTestMessages((prev) => [
          ...prev,
          {
            sender: 'bot',
            text: 'Lỗi gọi API chat. Vui lòng kiểm tra lại.',
            time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
      }
    } catch (err) {
      setTestMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: 'Exception khi kết nối tới bot.',
          time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setTestLoading(false);
      // Refresh logs
      fetchLogs();
    }
  };

  // Stats calculation
  const totalLogs = logs.length;
  const positiveLogs = logs.filter((l) => l.rating === 'positive').length;
  const negativeLogs = logs.filter((l) => l.rating === 'negative').length;
  const unratedLogs = logs.filter((l) => !l.rating).length;
  const activeGuidelinesCount = guidelines.filter((g) => g.is_active).length;

  return (
    <div className="admin-page-container">
      {/* Toast Notification */}
      {actionSuccessMsg && (
        <div className="admin-toast-alert" role="alert">
          <span>✨ {actionSuccessMsg}</span>
        </div>
      )}

      {/* Header bar */}
      <div className="admin-header-row">
        <div>
          <h1 className="admin-page-title">🤖 Đào Tạo & Đánh Giá AI Agent</h1>
          <p className="admin-page-subtitle">
            Mô hình Human-in-the-Loop: Giám sát câu trả lời thực tế, đánh giá chất lượng và cập nhật trực tiếp quy tắc vào System Prompt của n8n.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => {
              setEditingGuideline(null);
              setGuidelineForm({
                title: '',
                rule_content: '',
                category: 'Sản phẩm',
                priority: 1,
                is_active: true,
              });
              setIsGuidelineModalOpen(true);
            }}
          >
            + Thêm Quy Tắc Mới
          </button>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="admin-stats-grid">
        <div className="stat-card">
          <div className="stat-label">Tổng lượt tương tác</div>
          <div className="stat-value">{totalLogs}</div>
          <div className="stat-desc">Được ghi nhận từ tiện ích Live Chat</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Đánh giá chuẩn xác 👍</div>
          <div className="stat-value" style={{ color: '#2e7d32' }}>{positiveLogs}</div>
          <div className="stat-desc">Đã được Admin xác nhận đạt chuẩn</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Cần cải thiện 👎</div>
          <div className="stat-value" style={{ color: '#c62828' }}>{negativeLogs}</div>
          <div className="stat-desc">{unratedLogs} câu chưa đánh giá</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Quy tắc đang hiệu lực</div>
          <div className="stat-value" style={{ color: 'var(--primary)' }}>{activeGuidelinesCount} / {guidelines.length}</div>
          <div className="stat-desc">Tự động nạp vào System Message n8n</div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="admin-tabs-nav">
        <button
          type="button"
          className={`admin-tab-btn ${activeTab === 'logs' ? 'active' : ''}`}
          onClick={() => setActiveTab('logs')}
        >
          💬 Lịch Sử Chat & Đánh Giá ({logs.length})
        </button>
        <button
          type="button"
          className={`admin-tab-btn ${activeTab === 'guidelines' ? 'active' : ''}`}
          onClick={() => setActiveTab('guidelines')}
        >
          📜 Sổ Tay Quy Tắc AI ({guidelines.length})
        </button>
        <button
          type="button"
          className={`admin-tab-btn ${activeTab === 'playground' ? 'active' : ''}`}
          onClick={() => setActiveTab('playground')}
        >
          🧪 Live Playground (Test Trực Tiếp)
        </button>
      </div>

      {/* ===================================================================
          TAB 1: CHAT LOGS & EVALUATION
          =================================================================== */}
      {activeTab === 'logs' && (
        <div className="admin-section-card">
          {/* Filters Bar */}
          <div className="logs-filter-bar">
            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--secondary)' }}>Lọc đánh giá:</span>
            <div className="filter-pills-wrap">
              <button
                type="button"
                className={`filter-pill ${filterRating === 'all' ? 'active' : ''}`}
                onClick={() => setFilterRating('all')}
              >
                Tất cả ({totalLogs})
              </button>
              <button
                type="button"
                className={`filter-pill ${filterRating === 'unrated' ? 'active' : ''}`}
                onClick={() => setFilterRating('unrated')}
              >
                Chưa đánh giá ({unratedLogs})
              </button>
              <button
                type="button"
                className={`filter-pill ${filterRating === 'positive' ? 'active' : ''}`}
                onClick={() => setFilterRating('positive')}
              >
                👍 Chuẩn xác ({positiveLogs})
              </button>
              <button
                type="button"
                className={`filter-pill ${filterRating === 'negative' ? 'active' : ''}`}
                onClick={() => setFilterRating('negative')}
              >
                👎 Cần cải thiện ({negativeLogs})
              </button>
            </div>
            <button
              type="button"
              className="btn btn-outline"
              style={{ marginLeft: 'auto', padding: '0.35rem 0.75rem', fontSize: '0.8125rem' }}
              onClick={fetchLogs}
            >
              🔄 Làm mới
            </button>
          </div>

          {logsLoading ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
              Đang tải danh sách lịch sử hội thoại...
            </div>
          ) : logs.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3.5rem', color: 'var(--text-muted)' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>💬</div>
              <p>Chưa có cuộc trò chuyện nào trong danh mục này.</p>
              <p style={{ fontSize: '0.8125rem', marginTop: '0.25rem' }}>
                Khi khách hàng nhắn tin ở góc dưới website hoặc Admin thử ở tab "Live Playground", các đoạn hội thoại sẽ xuất hiện tại đây.
              </p>
            </div>
          ) : (
            <div className="chat-logs-list">
              {logs.map((log) => {
                const isPositive = log.rating === 'positive';
                const isNegative = log.rating === 'negative';
                const noteVal = adminNoteInput[log.id] !== undefined ? adminNoteInput[log.id] : (log.admin_notes || '');

                return (
                  <div
                    key={log.id}
                    className={`chat-log-item ${isPositive ? 'log-positive' : ''} ${isNegative ? 'log-negative' : ''}`}
                  >
                    {/* Meta info header */}
                    <div className="log-meta-header">
                      <div className="log-user-badge">
                        <span className="user-icon">👤</span>
                        <strong>{log.customer_name || 'Khách hàng'}</strong>
                        {log.customer_phone && <span className="user-phone">📞 {log.customer_phone}</span>}
                        <span className="log-session-tag">Phiên: {log.session_id.slice(0, 14)}...</span>
                      </div>
                      <div className="log-time">
                        {new Date(log.created_at).toLocaleString('vi-VN', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                    </div>

                    {/* Chat dialog preview */}
                    <div className="log-dialog-box">
                      <div className="dialog-row user-row">
                        <span className="bubble-label">Khách:</span>
                        <div className="bubble-text user-bubble">{log.user_message}</div>
                      </div>
                      <div className="dialog-row bot-row">
                        <span className="bubble-label">AI Agent:</span>
                        <div className="bubble-text bot-bubble">
                          <ChatMarkdown content={log.bot_response} />
                        </div>
                      </div>
                    </div>

                    {/* Actions and Rating bar */}
                    <div className="log-actions-bar">
                      <div className="rating-buttons-group">
                        <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Đánh giá:</span>
                        <button
                          type="button"
                          className={`btn-rate ${isPositive ? 'active-positive' : ''}`}
                          onClick={() => handleRateLog(log.id, 'positive')}
                          title="Đánh giá câu trả lời chuẩn xác"
                        >
                          👍 Chuẩn ({isPositive ? 'Đã duyệt' : 'Duyệt'})
                        </button>
                        <button
                          type="button"
                          className={`btn-rate ${isNegative ? 'active-negative' : ''}`}
                          onClick={() => handleRateLog(log.id, 'negative')}
                          title="Đánh giá câu trả lời cần sửa đổi hoặc chưa đúng thực tế"
                        >
                          👎 Cần sửa ({isNegative ? 'Đã gắn cờ' : 'Gắn cờ'})
                        </button>
                      </div>

                      <button
                        type="button"
                        className="btn-create-rule"
                        onClick={() => handleCreateRuleFromLog(log)}
                        title="Tạo quy tắc mới vào Sổ tay AI từ cuộc trò chuyện này"
                      >
                        🎓 Biến câu này thành bài học cho AI
                      </button>
                    </div>

                    {/* Admin notes input field */}
                    <div className="log-note-row">
                      <input
                        type="text"
                        className="admin-input-compact"
                        placeholder="Thêm ghi chú/lưu ý của Admin (ví dụ: cần báo lại mã VCB30-029 còn hàng trắng)..."
                        value={noteVal}
                        onChange={(e) =>
                          setAdminNoteInput((prev) => ({ ...prev, [log.id]: e.target.value }))
                        }
                      />
                      <button
                        type="button"
                        className="btn-save-note"
                        onClick={() => handleSaveNote(log.id)}
                      >
                        Lưu ghi chú
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ===================================================================
          TAB 2: AI GUIDELINES MANAGEMENT
          =================================================================== */}
      {activeTab === 'guidelines' && (
        <div className="admin-section-card">
          <div className="guidelines-header-bar">
            <div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--secondary)' }}>
                Sổ Tay Quy Tắc AI Đang Áp Dụng
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                Tất cả quy tắc có trạng thái <strong>Đang Bật</strong> sẽ được tự động tiêm động vào System Prompt của n8n ở mỗi lượt chat.
              </p>
            </div>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                setEditingGuideline(null);
                setGuidelineForm({
                  title: '',
                  rule_content: '',
                  category: 'Sản phẩm',
                  priority: 1,
                  is_active: true,
                });
                setIsGuidelineModalOpen(true);
              }}
            >
              + Tạo Quy Tắc Mới
            </button>
          </div>

          {guidelinesLoading ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
              Đang tải danh sách quy tắc...
            </div>
          ) : guidelines.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3.5rem', color: 'var(--text-muted)' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>📜</div>
              <p>Chưa có quy tắc nào trong Sổ tay.</p>
              <button
                type="button"
                className="btn btn-outline"
                style={{ marginTop: '0.75rem' }}
                onClick={() => setIsGuidelineModalOpen(true)}
              >
                + Bổ sung quy tắc đầu tiên
              </button>
            </div>
          ) : (
            <div className="guidelines-table-wrap">
              <table className="admin-custom-table">
                <thead>
                  <tr>
                    <th style={{ width: '80px' }}>Trạng thái</th>
                    <th style={{ width: '120px' }}>Danh mục</th>
                    <th>Tiêu đề & Nội dung chỉ dẫn cho AI</th>
                    <th style={{ width: '90px' }}>Ưu tiên</th>
                    <th style={{ width: '140px' }}>Cập nhật</th>
                    <th style={{ width: '120px', textAlign: 'center' }}>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {guidelines.map((g) => (
                    <tr key={g.id} className={g.is_active ? '' : 'row-disabled'}>
                      <td>
                        <label className="switch-toggle" title={g.is_active ? 'Bấm để tắt quy tắc này' : 'Bấm để bật quy tắc này'}>
                          <input
                            type="checkbox"
                            checked={g.is_active}
                            onChange={() => handleToggleGuideline(g)}
                          />
                          <span className="slider round"></span>
                        </label>
                      </td>
                      <td>
                        <span className="guideline-category-badge">{g.category || 'Chung'}</span>
                      </td>
                      <td>
                        <div style={{ fontWeight: 700, color: 'var(--secondary-dark)', marginBottom: '0.25rem' }}>
                          {g.title}
                        </div>
                        <div className="guideline-content-preview">
                          {g.rule_content}
                        </div>
                      </td>
                      <td>
                        <span className="priority-badge">Mức {g.priority}</span>
                      </td>
                      <td style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                        {new Date(g.updated_at).toLocaleDateString('vi-VN')}
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.35rem', justifyContent: 'center' }}>
                          <button
                            type="button"
                            className="btn-icon-action"
                            title="Sửa nội dung"
                            onClick={() => {
                              setEditingGuideline(g);
                              setGuidelineForm({
                                title: g.title,
                                rule_content: g.rule_content,
                                category: g.category || 'Sản phẩm',
                                priority: g.priority,
                                is_active: g.is_active,
                              });
                              setIsGuidelineModalOpen(true);
                            }}
                          >
                            ✏️
                          </button>
                          <button
                            type="button"
                            className="btn-icon-action btn-delete"
                            title="Xóa quy tắc"
                            onClick={() => handleDeleteGuideline(g.id, g.title)}
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ===================================================================
          TAB 3: LIVE PLAYGROUND (TEST INTERFACE)
          =================================================================== */}
      {activeTab === 'playground' && (
        <div className="admin-section-card playground-card">
          <div className="playground-header">
            <div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--secondary)' }}>
                🧪 Thử Nghiệm Chatbot AI Trực Tiếp
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                Gửi câu hỏi thử nghiệm để xem AI Agent vận dụng các quy tắc trong Sổ tay vừa cập nhật. Lượt test sẽ tự động ghi log vào Tab 1 để bạn tiếp tục đánh giá.
              </p>
            </div>
            <button
              type="button"
              className="btn btn-outline"
              onClick={() =>
                setTestMessages([
                  {
                    sender: 'bot',
                    text: 'Đã làm mới khung test! Hãy đặt câu hỏi bất kỳ về sản phẩm, giá bán, hoặc chính sách.',
                    time: 'Hệ thống',
                  },
                ])
              }
            >
              🧹 Xóa đoạn chat test
            </button>
          </div>

          <div className="playground-chat-viewport">
            {testMessages.map((msg, idx) => (
              <div key={idx} className={`playground-bubble-row ${msg.sender === 'user' ? 'user' : 'bot'}`}>
                <div className={`playground-bubble ${msg.sender === 'user' ? 'user-bg' : 'bot-bg'}`}>
                  {msg.sender === 'bot' ? (
                    <ChatMarkdown content={msg.text} />
                  ) : (
                    <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>{msg.text}</div>
                  )}
                  <div className="playground-time">{msg.time}</div>
                </div>
              </div>
            ))}
            {testLoading && (
              <div className="playground-bubble-row bot">
                <div className="playground-bubble bot-bg" style={{ fontStyle: 'italic', color: 'var(--text-muted)' }}>
                  🤖 AI Agent đang tra cứu Supabase & suy nghĩ câu trả lời...
                </div>
              </div>
            )}
          </div>

          <div className="playground-input-row">
            <input
              type="text"
              className="admin-input-text"
              placeholder="Nhập câu hỏi test (Ví dụ: Gạch bông gió VCB30-029 còn màu xám không em?)..."
              value={testInput}
              onChange={(e) => setTestInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handlePlaygroundSend();
                }
              }}
            />
            <button
              type="button"
              className="btn btn-primary"
              disabled={testLoading || !testInput.trim()}
              onClick={handlePlaygroundSend}
            >
              {testLoading ? 'Đang gửi...' : 'Gửi Test 🚀'}
            </button>
          </div>
        </div>
      )}

      {/* ===================================================================
          MODAL: THÊM / SỬA QUY TẮC AI GUIDELINE
          =================================================================== */}
      {isGuidelineModalOpen && (
        <div className="admin-modal-backdrop" onClick={() => setIsGuidelineModalOpen(false)}>
          <div className="admin-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--secondary)' }}>
                {editingGuideline ? '✏️ Chỉnh Sửa Quy Tắc AI' : '🎓 Thêm Bài Học / Quy Tắc Mới Cho AI'}
              </h3>
              <button
                type="button"
                className="admin-modal-close"
                onClick={() => setIsGuidelineModalOpen(false)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveGuidelineSubmit} className="admin-modal-body">
              <div className="form-group-item">
                <label className="form-label">Tiêu đề quy tắc (ngắn gọn):</label>
                <input
                  type="text"
                  className="admin-input-text"
                  placeholder="Ví dụ: Chính sách tồn kho gạch màu xám VCB30-029"
                  value={guidelineForm.title}
                  onChange={(e) => setGuidelineForm({ ...guidelineForm, title: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group-item">
                  <label className="form-label">Phân loại danh mục:</label>
                  <select
                    className="admin-input-text"
                    value={guidelineForm.category}
                    onChange={(e) => setGuidelineForm({ ...guidelineForm, category: e.target.value })}
                  >
                    <option value="Sản phẩm">Sản phẩm & Tồn kho</option>
                    <option value="Báo giá">Báo giá & Chiết khấu</option>
                    <option value="Vận chuyển">Vận chuyển & Chành xe</option>
                    <option value="Kỹ thuật">Kỹ thuật thi công & Chống mưa</option>
                    <option value="Chính sách">Chính sách chung</option>
                  </select>
                </div>

                <div className="form-group-item">
                  <label className="form-label">Mức độ ưu tiên (1 = Cao nhất):</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    className="admin-input-text"
                    value={guidelineForm.priority}
                    onChange={(e) => setGuidelineForm({ ...guidelineForm, priority: parseInt(e.target.value, 10) || 1 })}
                  />
                </div>
              </div>

              <div className="form-group-item">
                <label className="form-label">Nội dung chỉ dẫn cụ thể cho AI (Prompt Rule):</label>
                <textarea
                  className="admin-textarea"
                  rows={5}
                  placeholder="Ghi rõ hành vi mong muốn. Ví dụ: Nếu khách hỏi mẫu VCB30-029 màu xám, thông báo xưởng hiện tạm hết màu xám, đang có sẵn nhiều màu trắng và nhận giao ngay trong ngày. Không được tự nhận còn màu xám."
                  value={guidelineForm.rule_content}
                  onChange={(e) => setGuidelineForm({ ...guidelineForm, rule_content: e.target.value })}
                  required
                />
                <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: '0.25rem', display: 'block' }}>
                  💡 Mẹo: Viết rõ ràng, súc tích để AI nắm bắt chính xác ngữ cảnh và trả lời nhất quán.
                </span>
              </div>

              <div className="form-group-item" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <label className="switch-toggle">
                  <input
                    type="checkbox"
                    checked={guidelineForm.is_active}
                    onChange={(e) => setGuidelineForm({ ...guidelineForm, is_active: e.target.checked })}
                  />
                  <span className="slider round"></span>
                </label>
                <span style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--secondary)' }}>
                  {guidelineForm.is_active ? 'Kích hoạt ngay lập tức (BẬT)' : 'Tạm tắt (Chưa áp dụng)'}
                </span>
              </div>

              <div className="admin-modal-footer">
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setIsGuidelineModalOpen(false)}
                >
                  Hủy bỏ
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingGuideline ? 'Lưu Thay Đổi' : 'Xác Nhận & Lưu Quy Tắc'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
