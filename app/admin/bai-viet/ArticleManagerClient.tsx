'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Tables } from '@/types/database.types';

interface ArticleSectionItem {
  heading: string;
  paragraphs: string[];
  quote?: string;
  highlight?: string;
}

interface ArticleManagerClientProps {
  initialArticles: Tables<'articles'>[];
}

const CATEGORY_OPTIONS = [
  'Bông Gió Xi Măng',
  'Gốm Đất Nung',
  'Men Sứ Cao Cấp',
  'Tư Vấn Thiết Kế',
  'Kỹ Thuật Thi Công',
];

export default function ArticleManagerClient({ initialArticles }: ArticleManagerClientProps) {
  const [articles, setArticles] = useState<Tables<'articles'>[]>(initialArticles);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PUBLISHED' | 'DRAFT'>('ALL');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Tables<'articles'> | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Form Fields
  const [formTitle, setFormTitle] = useState('');
  const [formSlug, setFormSlug] = useState('');
  const [formCategory, setFormCategory] = useState(CATEGORY_OPTIONS[0]);
  const [formExcerpt, setFormExcerpt] = useState('');
  const [formCoverImage, setFormCoverImage] = useState('/images/banners/banner-9.jpg');
  const [formReadingTime, setFormReadingTime] = useState('4 phút đọc');
  const [formAuthor, setFormAuthor] = useState('KTS. Vĩnh Cửu Sài Gòn');
  const [formLead, setFormLead] = useState('');
  const [formSections, setFormSections] = useState<ArticleSectionItem[]>([
    { heading: '', paragraphs: [''] },
  ]);
  const [formConclusion, setFormConclusion] = useState('');
  const [formPublished, setFormPublished] = useState(true);

  // Image Upload State
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Toast
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // Auto generate slug from title
  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[đĐ]/g, 'd')
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-');
  };

  // Open Create
  const handleOpenCreate = () => {
    setEditingArticle(null);
    setFormTitle('');
    setFormSlug('');
    setFormCategory(CATEGORY_OPTIONS[0]);
    setFormExcerpt('');
    setFormCoverImage('/images/banners/banner-9.jpg');
    setFormReadingTime('4 phút đọc');
    setFormAuthor('KTS. Vĩnh Cửu Sài Gòn');
    setFormLead('');
    setFormSections([
      { heading: '1. Đặc tính kỹ thuật nổi bật', paragraphs: ['Nội dung phần 1...'] },
      { heading: '2. Giải pháp ứng dụng thực tế', paragraphs: ['Nội dung phần 2...'] },
    ]);
    setFormConclusion('');
    setFormPublished(true);
    setFormError(null);
    setIsModalOpen(true);
  };

  // Open Edit
  const handleOpenEdit = (a: Tables<'articles'>) => {
    setEditingArticle(a);
    setFormTitle(a.title);
    setFormSlug(a.slug);
    setFormCategory(a.category);
    setFormExcerpt(a.excerpt || '');
    setFormCoverImage(a.cover_image || '/images/banners/banner-9.jpg');
    setFormReadingTime(a.reading_time || '4 phút đọc');
    setFormAuthor(a.author || 'KTS. Vĩnh Cửu Sài Gòn');
    setFormLead(a.lead || '');

    // Parse sections
    let parsedSections: ArticleSectionItem[] = [];
    if (Array.isArray(a.sections)) {
      parsedSections = a.sections as any;
    } else if (typeof a.sections === 'string') {
      try {
        parsedSections = JSON.parse(a.sections);
      } catch {
        parsedSections = [];
      }
    }
    if (parsedSections.length === 0) {
      parsedSections = [{ heading: '', paragraphs: [''] }];
    }
    setFormSections(parsedSections);

    setFormConclusion(a.conclusion || '');
    setFormPublished(a.published !== false);
    setFormError(null);
    setIsModalOpen(true);
  };

  // Handle Cover Upload via /api/admin/upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadError(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Lỗi tải ảnh');

      setFormCoverImage(data.url);
      showToast('✓ Tải ảnh bìa lên Supabase Storage thành công!');
    } catch (err: any) {
      setUploadError(err.message);
    } finally {
      setIsUploading(false);
    }
  };

  // Section manipulation
  const handleAddSection = () => {
    setFormSections([...formSections, { heading: '', paragraphs: [''] }]);
  };

  const handleRemoveSection = (index: number) => {
    setFormSections(formSections.filter((_, idx) => idx !== index));
  };

  const handleSectionHeadingChange = (index: number, val: string) => {
    const next = [...formSections];
    next[index] = { ...next[index], heading: val };
    setFormSections(next);
  };

  const handleSectionParagraphsChange = (index: number, text: string) => {
    const next = [...formSections];
    // Split by newlines or keep paragraph array
    const paras = text.split('\n\n').filter(p => p.trim().length > 0);
    next[index] = { ...next[index], paragraphs: paras.length > 0 ? paras : [text] };
    setFormSections(next);
  };

  // Quick toggle publish status
  const handleTogglePublish = async (a: Tables<'articles'>) => {
    const newStatus = !a.published;
    try {
      const res = await fetch(`/api/admin/articles/${a.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ published: newStatus }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setArticles(prev =>
        prev.map(item => (item.id === a.id ? { ...item, published: newStatus } : item))
      );
      showToast(newStatus ? '✓ Đã xuất bản bài viết!' : '✓ Đã ẩn bài viết thành bản nháp!');
    } catch (err: any) {
      alert(`Lỗi: ${err.message}`);
    }
  };

  // Submit modal (Create or Edit)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError(null);

    const payload = {
      title: formTitle,
      slug: formSlug || generateSlug(formTitle),
      category: formCategory,
      excerpt: formExcerpt || formLead.slice(0, 160) + '...',
      cover_image: formCoverImage,
      reading_time: formReadingTime,
      author: formAuthor,
      lead: formLead,
      sections: formSections,
      conclusion: formConclusion,
      published: formPublished,
    };

    try {
      if (editingArticle) {
        // PUT update
        const res = await fetch(`/api/admin/articles/${editingArticle.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Cập nhật thất bại');

        setArticles(prev =>
          prev.map(item => (item.id === editingArticle.id ? data.article : item))
        );
        showToast('✓ Cập nhật bài viết thành công!');
      } else {
        // POST create
        const res = await fetch('/api/admin/articles', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Tạo bài viết thất bại');

        setArticles(prev => [data.article, ...prev]);
        showToast('✓ Thêm mới bài viết thành công!');
      }
      setIsModalOpen(false);
    } catch (err: any) {
      setFormError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete article
  const handleDelete = async (a: Tables<'articles'>) => {
    if (!confirm(`Bạn có chắc muốn xóa bài viết "${a.title}"? Thao tác này không thể hoàn tác.`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/articles/${a.id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Xóa thất bại');

      setArticles(prev => prev.filter(item => item.id !== a.id));
      showToast('✓ Đã xóa bài viết khỏi cơ sở dữ liệu!');
    } catch (err: any) {
      alert(`Lỗi xóa: ${err.message}`);
    }
  };

  // Filtered articles
  const filteredArticles = useMemo(() => {
    return articles.filter(a => {
      // Category filter
      if (selectedCategory !== 'ALL' && a.category !== selectedCategory) {
        return false;
      }
      // Status filter
      if (statusFilter === 'PUBLISHED' && !a.published) return false;
      if (statusFilter === 'DRAFT' && a.published) return false;
      // Search
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchTitle = a.title.toLowerCase().includes(q);
        const matchSlug = a.slug.toLowerCase().includes(q);
        const matchAuthor = a.author?.toLowerCase().includes(q) || false;
        if (!matchTitle && !matchSlug && !matchAuthor) return false;
      }
      return true;
    });
  }, [articles, selectedCategory, statusFilter, search]);

  return (
    <div>
      {/* Toast */}
      {toastMsg && (
        <div className="admin-toast">
          {toastMsg}
        </div>
      )}

      {/* Header bar */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-title">Quản Lý Bài Viết & Kiến Thức</h1>
          <p className="admin-subtitle">
            Soạn thảo, cập nhật cẩm nang kỹ thuật, bài tư vấn bông gió và đồng bộ tức thì lên website.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <Link href="/bai-viet" target="_blank" className="admin-btn admin-btn-secondary">
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
              <polyline points="15 3 21 3 21 9"></polyline>
              <line x1="10" y1="14" x2="21" y2="3"></line>
            </svg>
            Xem Trang Tin Tức
          </Link>
          <button onClick={handleOpenCreate} className="admin-btn admin-btn-primary">
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Viết Bài Mới
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="admin-card" style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Search box */}
          <div style={{ position: 'relative', flex: '1', minWidth: '280px' }}>
            <svg
              style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}
              width="18"
              height="18"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input
              type="text"
              placeholder="Tìm theo tiêu đề, slug, tác giả..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="admin-input"
              style={{ paddingLeft: '40px' }}
            />
          </div>

          {/* Filters */}
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
            {/* Category filter */}
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="admin-select"
            >
              <option value="ALL">Tất cả chuyên mục</option>
              {CATEGORY_OPTIONS.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>

            {/* Status filter */}
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value as any)}
              className="admin-select"
            >
              <option value="ALL">Tất cả trạng thái</option>
              <option value="PUBLISHED">Đã xuất bản</option>
              <option value="DRAFT">Bản nháp / Đang ẩn</option>
            </select>
          </div>
        </div>

        {/* Counter */}
        <div style={{ marginTop: '14px', fontSize: '13px', color: '#64748b' }}>
          Hiển thị <strong>{filteredArticles.length}</strong> / <strong>{articles.length}</strong> bài viết trong cơ sở dữ liệu Supabase.
        </div>
      </div>

      {/* Articles Table */}
      <div className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: '80px' }}>Ảnh bìa</th>
                <th>Tiêu đề & Chuyên mục</th>
                <th style={{ width: '160px' }}>Tác giả & Thời lượng</th>
                <th style={{ width: '130px', textAlign: 'center' }}>Trạng thái</th>
                <th style={{ width: '140px', textAlign: 'right' }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredArticles.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '48px', color: '#64748b' }}>
                    Không tìm thấy bài viết nào phù hợp với bộ lọc hiện tại.
                  </td>
                </tr>
              ) : (
                filteredArticles.map(a => (
                  <tr key={a.id}>
                    <td>
                      <div className="admin-table-thumb">
                        <Image
                          src={a.cover_image || '/images/banners/banner-9.jpg'}
                          alt={a.title}
                          fill
                          sizes="70px"
                          style={{ objectFit: 'cover' }}
                          unoptimized={a.cover_image?.startsWith('http')}
                        />
                      </div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, color: '#0f172a', fontSize: '15px', marginBottom: '4px' }}>
                        {a.title}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        <span className="admin-badge admin-badge-blue">
                          {a.category}
                        </span>
                        <span style={{ fontSize: '12px', color: '#94a3b8' }}>
                          slug: /{a.slug}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div style={{ fontSize: '13px', color: '#334155', fontWeight: 500 }}>
                        {a.author || 'Vĩnh Cửu Sài Gòn'}
                      </div>
                      <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                        ⏱ {a.reading_time || '4 phút đọc'}
                      </div>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <button
                        onClick={() => handleTogglePublish(a)}
                        className={`admin-stock-toggle ${a.published ? 'active' : 'inactive'}`}
                        title="Bấm để bật / tắt trạng thái xuất bản"
                      >
                        <span className="toggle-bullet"></span>
                        {a.published ? 'Đã xuất bản' : 'Bản nháp'}
                      </button>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '6px', alignItems: 'center' }}>
                        <Link
                          href={`/bai-viet/${a.slug}`}
                          target="_blank"
                          className="admin-action-btn"
                          title="Xem bài viết thực tế"
                        >
                          <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                            <circle cx="12" cy="12" r="3"></circle>
                          </svg>
                        </Link>
                        <button
                          onClick={() => handleOpenEdit(a)}
                          className="admin-action-btn edit"
                          title="Sửa bài viết"
                        >
                          <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(a)}
                          className="admin-action-btn delete"
                          title="Xóa bài viết"
                        >
                          <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Add / Edit */}
      {isModalOpen && (
        <div className="admin-modal-backdrop" onClick={() => !isSubmitting && setIsModalOpen(false)}>
          <div className="admin-modal-card" style={{ maxWidth: '850px' }} onClick={e => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h2 className="admin-modal-title">
                {editingArticle ? 'Chỉnh Sửa Bài Viết' : 'Soạn Bài Viết Mới'}
              </h2>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="admin-modal-close"
                disabled={isSubmitting}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="admin-modal-body" style={{ maxHeight: 'calc(85vh - 140px)', overflowY: 'auto' }}>
                {formError && (
                  <div className="admin-alert-error" style={{ marginBottom: '16px' }}>
                    {formError}
                  </div>
                )}

                {/* Tiêu đề & Slug */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '14px', marginBottom: '16px' }}>
                  <div>
                    <label className="admin-label">
                      Tiêu đề bài viết <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formTitle}
                      onChange={e => {
                        setFormTitle(e.target.value);
                        if (!editingArticle) {
                          setFormSlug(generateSlug(e.target.value));
                        }
                      }}
                      placeholder="VD: Giải Pháp Chống Nóng & Thông Gió Tự Nhiên Cho Nhà Phố..."
                      className="admin-input"
                    />
                  </div>
                  <div>
                    <label className="admin-label">
                      Slug đường dẫn (URL) <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formSlug}
                      onChange={e => setFormSlug(e.target.value)}
                      placeholder="giai-phap-chong-nong-thong-gio"
                      className="admin-input"
                    />
                  </div>
                </div>

                {/* Chuyên mục & Tác giả & Thời lượng */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', marginBottom: '16px' }}>
                  <div>
                    <label className="admin-label">Chuyên mục</label>
                    <select
                      value={formCategory}
                      onChange={e => setFormCategory(e.target.value)}
                      className="admin-select"
                    >
                      {CATEGORY_OPTIONS.map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="admin-label">Tác giả</label>
                    <input
                      type="text"
                      value={formAuthor}
                      onChange={e => setFormAuthor(e.target.value)}
                      placeholder="KTS. Vĩnh Cửu Sài Gòn"
                      className="admin-input"
                    />
                  </div>
                  <div>
                    <label className="admin-label">Thời lượng đọc</label>
                    <input
                      type="text"
                      value={formReadingTime}
                      onChange={e => setFormReadingTime(e.target.value)}
                      placeholder="4 phút đọc"
                      className="admin-input"
                    />
                  </div>
                </div>

                {/* Ảnh bìa & Upload Storage */}
                <div style={{ marginBottom: '18px', padding: '14px', background: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                  <label className="admin-label" style={{ marginBottom: '8px' }}>
                    Ảnh bìa bài viết (Supabase Storage)
                  </label>
                  <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                    <div style={{ width: '140px', height: '90px', position: 'relative', borderRadius: '8px', overflow: 'hidden', background: '#e2e8f0', flexShrink: 0, border: '1px solid #cbd5e1' }}>
                      <Image
                        src={formCoverImage || '/images/banners/banner-9.jpg'}
                        alt="Preview"
                        fill
                        sizes="140px"
                        style={{ objectFit: 'cover' }}
                        unoptimized={formCoverImage.startsWith('http')}
                      />
                    </div>
                    <div style={{ flex: 1, minWidth: '240px' }}>
                      <input
                        type="text"
                        value={formCoverImage}
                        onChange={e => setFormCoverImage(e.target.value)}
                        placeholder="https://... hoặc /images/banners/banner-9.jpg"
                        className="admin-input"
                        style={{ marginBottom: '8px' }}
                      />
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <label className="admin-upload-btn">
                          <input
                            type="file"
                            accept="image/*"
                            style={{ display: 'none' }}
                            onChange={handleFileUpload}
                            disabled={isUploading}
                          />
                          <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                            <polyline points="17 8 12 3 7 8"></polyline>
                            <line x1="12" y1="3" x2="12" y2="15"></line>
                          </svg>
                          {isUploading ? 'Đang tải lên Supabase...' : 'Tải ảnh mới từ máy'}
                        </label>
                        <span style={{ fontSize: '12px', color: '#64748b' }}>
                          Lưu trữ an toàn trên Supabase Storage
                        </span>
                      </div>
                      {uploadError && (
                        <div style={{ color: '#ef4444', fontSize: '12px', marginTop: '6px' }}>
                          ✕ {uploadError}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Đoạn mở đầu (Lead) & Tóm tắt (Excerpt) */}
                <div style={{ marginBottom: '16px' }}>
                  <label className="admin-label">
                    Đoạn mở đầu (Lead paragraph) <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={formLead}
                    onChange={e => setFormLead(e.target.value)}
                    placeholder="Mở đầu bài viết, đặt vấn đề nhu cầu kiến trúc..."
                    className="admin-textarea"
                  />
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label className="admin-label">
                    Tóm tắt hiển thị ngoài danh sách (Excerpt)
                  </label>
                  <textarea
                    rows={2}
                    value={formExcerpt}
                    onChange={e => setFormExcerpt(e.target.value)}
                    placeholder="Để trống sẽ tự động lấy từ đoạn mở đầu..."
                    className="admin-textarea"
                  />
                </div>

                {/* Danh sách các phần bài viết (Sections) */}
                <div style={{ marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <label className="admin-label" style={{ margin: 0 }}>
                      Nội dung các mục (Sections)
                    </label>
                    <button
                      type="button"
                      onClick={handleAddSection}
                      className="admin-btn admin-btn-secondary"
                      style={{ padding: '4px 10px', fontSize: '12px' }}
                    >
                      + Thêm Mục
                    </button>
                  </div>

                  {formSections.map((sec, idx) => (
                    <div
                      key={idx}
                      style={{
                        padding: '14px',
                        background: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        marginBottom: '12px',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <span style={{ fontWeight: 600, fontSize: '13px', color: '#475569' }}>
                          Mục #{idx + 1}
                        </span>
                        {formSections.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveSection(idx)}
                            style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '12px', fontWeight: 600 }}
                          >
                            Xóa mục này
                          </button>
                        )}
                      </div>
                      <input
                        type="text"
                        placeholder="Tiêu đề mục (VD: 1. Nguyên lý đối lưu không khí)"
                        value={sec.heading}
                        onChange={e => handleSectionHeadingChange(idx, e.target.value)}
                        className="admin-input"
                        style={{ marginBottom: '8px' }}
                      />
                      <textarea
                        rows={4}
                        placeholder="Nội dung chi tiết mục này (cách các đoạn bằng 2 lần xuống dòng)..."
                        value={sec.paragraphs.join('\n\n')}
                        onChange={e => handleSectionParagraphsChange(idx, e.target.value)}
                        className="admin-textarea"
                      />
                    </div>
                  ))}
                </div>

                {/* Đoạn kết luận (Conclusion) */}
                <div style={{ marginBottom: '16px' }}>
                  <label className="admin-label">
                    Đoạn kết luận (Conclusion)
                  </label>
                  <textarea
                    rows={3}
                    value={formConclusion}
                    onChange={e => setFormConclusion(e.target.value)}
                    placeholder="Tổng kết lời khuyên của chuyên gia..."
                    className="admin-textarea"
                  />
                </div>

                {/* Trạng thái xuất bản */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingTop: '6px' }}>
                  <input
                    type="checkbox"
                    id="published-toggle"
                    checked={formPublished}
                    onChange={e => setFormPublished(e.target.checked)}
                    style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                  />
                  <label htmlFor="published-toggle" style={{ fontWeight: 600, color: '#1e293b', cursor: 'pointer', fontSize: '14px' }}>
                    Xuất bản ngay lập tức (hiển thị trên trang chủ & trang bài viết)
                  </label>
                </div>
              </div>

              <div className="admin-modal-footer">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="admin-btn admin-btn-secondary"
                  disabled={isSubmitting}
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="admin-btn admin-btn-primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Đang lưu...' : editingArticle ? 'Cập Nhật Bài Viết' : 'Đăng Bài Viết'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
