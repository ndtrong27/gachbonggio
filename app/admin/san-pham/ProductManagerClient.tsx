'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Tables } from '@/types/database.types';

interface ProductManagerClientProps {
  initialProducts: Tables<'products'>[];
}

export default function ProductManagerClient({ initialProducts }: ProductManagerClientProps) {
  const [products, setProducts] = useState<Tables<'products'>[]>(initialProducts);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [stockFilter, setStockFilter] = useState<'ALL' | 'IN_STOCK' | 'OUT_OF_STOCK'>('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Tables<'products'> | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Form Fields
  const [formName, setFormName] = useState('');
  const [formCode, setFormCode] = useState('');
  const [formCategory, setFormCategory] = useState('Bông gió xi măng');
  const [formSize, setFormSize] = useState('290x290x90 mm');
  const [formColor, setFormColor] = useState('Trắng');
  const [formPriceDisplay, setFormPriceDisplay] = useState('Liên hệ');
  const [formImageUrl, setFormImageUrl] = useState('');
  const [formInStock, setFormInStock] = useState(true);

  // Upload state
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Toast / notification message
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // Open modal for Create
  const handleOpenCreate = () => {
    setEditingProduct(null);
    setFormName('Bông gió mỹ thuật');
    setFormCode('');
    setFormCategory('Bông gió xi măng');
    setFormSize('290x290x90 mm');
    setFormColor('Trắng');
    setFormPriceDisplay('Liên hệ');
    setFormImageUrl('');
    setFormInStock(true);
    setFormError(null);
    setIsModalOpen(true);
  };

  // Open modal for Edit
  const handleOpenEdit = (p: Tables<'products'>) => {
    setEditingProduct(p);
    setFormName(p.name);
    setFormCode(p.code);
    setFormCategory(p.category);
    setFormSize(p.size);
    setFormColor(p.color);
    setFormPriceDisplay(p.price_display || 'Liên hệ');
    setFormImageUrl(p.image_url || '');
    setFormInStock(p.in_stock !== false);
    setFormError(null);
    setIsModalOpen(true);
  };

  // Handle Image Upload to Supabase Storage via /api/admin/upload
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

      setFormImageUrl(data.url);
      showToast('✓ Tải ảnh lên Supabase Storage thành công!');
    } catch (err: any) {
      setUploadError(err.message);
    } finally {
      setIsUploading(false);
    }
  };

  // Quick Stock Toggle
  const handleToggleStock = async (p: Tables<'products'>) => {
    const nextStatus = !p.in_stock;
    // Optimistic update
    setProducts((prev) =>
      prev.map((item) => (item.id === p.id ? { ...item, in_stock: nextStatus } : item))
    );

    try {
      const res = await fetch(`/api/admin/products/${p.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ in_stock: nextStatus }),
      });

      if (!res.ok) throw new Error('Không thể cập nhật tồn kho');
      showToast(`✓ Đã đổi trạng thái mã ${p.code}: ${nextStatus ? 'Có sẵn kho' : 'Hết hàng'}`);
    } catch (err: any) {
      // Revert on error
      setProducts((prev) =>
        prev.map((item) => (item.id === p.id ? { ...item, in_stock: p.in_stock } : item))
      );
      alert(err.message);
    }
  };

  // Submit Create or Update
  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError(null);

    try {
      if (editingProduct) {
        // UPDATE
        const res = await fetch(`/api/admin/products/${editingProduct.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: formName,
            code: formCode,
            category: formCategory,
            size: formSize,
            color: formColor,
            price_display: formPriceDisplay,
            image_url: formImageUrl,
            in_stock: formInStock,
          }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Lỗi cập nhật sản phẩm');

        setProducts((prev) =>
          prev.map((item) => (item.id === editingProduct.id ? data.product : item))
        );
        showToast(`✓ Đã cập nhật sản phẩm ${formCode} thành công!`);
      } else {
        // CREATE
        const res = await fetch('/api/admin/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: formName,
            code: formCode,
            category: formCategory,
            size: formSize,
            color: formColor,
            price_display: formPriceDisplay,
            image_url: formImageUrl,
            in_stock: formInStock,
          }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Lỗi thêm sản phẩm');

        setProducts((prev) => [data.product, ...prev]);
        showToast(`✓ Đã thêm sản phẩm mới ${formCode} thành công!`);
      }

      setIsModalOpen(false);
    } catch (err: any) {
      setFormError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete product
  const handleDeleteProduct = async (p: Tables<'products'>) => {
    const confirmDel = window.confirm(
      `Bạn có chắc chắn muốn xóa sản phẩm "${p.name}" (Mã: ${p.code}) khỏi cơ sở dữ liệu không?`
    );
    if (!confirmDel) return;

    try {
      const res = await fetch(`/api/admin/products/${p.id}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Không thể xóa sản phẩm');

      setProducts((prev) => prev.filter((item) => item.id !== p.id));
      showToast(`✓ Đã xóa sản phẩm ${p.code}`);
    } catch (err: any) {
      alert(err.message);
    }
  };

  // Filtered products list
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (selectedCategory !== 'ALL' && p.category !== selectedCategory) return false;
      if (stockFilter === 'IN_STOCK' && p.in_stock === false) return false;
      if (stockFilter === 'OUT_OF_STOCK' && p.in_stock !== false) return false;

      if (search.trim()) {
        const q = search.toLowerCase().trim();
        const codeMatch = (p.code || '').toLowerCase().includes(q);
        const nameMatch = (p.name || '').toLowerCase().includes(q);
        if (!codeMatch && !nameMatch) return false;
      }

      return true;
    });
  }, [products, selectedCategory, stockFilter, search]);

  const totalPages = Math.ceil(filteredProducts.length / pageSize) || 1;
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="admin-page-content">
      {/* Toast Alert */}
      {toastMsg && <div className="admin-toast">{toastMsg}</div>}

      {/* Header Bar */}
      <div className="admin-page-header">
        <div>
          <span className="admin-section-tag">Quản Trị Cơ Sở Dữ Liệu</span>
          <h1 className="admin-page-title">Quản Lý Danh Mục Sản Phẩm ({products.length} Mẫu)</h1>
        </div>

        <button
          type="button"
          onClick={handleOpenCreate}
          className="btn btn-primary admin-cta-btn"
        >
          ➕ Thêm Mẫu Gạch Mới
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="admin-filter-bar">
        <div className="admin-search-wrap">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Tìm theo mã SP (vd: VCB30-029) hoặc tên mẫu hoa văn..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="admin-search-input"
          />
          {search && (
            <button
              type="button"
              className="admin-clear-search"
              onClick={() => setSearch('')}
            >
              ✕
            </button>
          )}
        </div>

        <div className="admin-filter-pills">
          {['ALL', 'Bông gió xi măng', 'Bông gió tráng men', 'Bông gió đất nung'].map((cat) => (
            <button
              key={cat}
              type="button"
              className={`admin-filter-pill ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => {
                setSelectedCategory(cat);
                setCurrentPage(1);
              }}
            >
              {cat === 'ALL' ? `Tất Cả (${products.length})` : cat}
            </button>
          ))}
        </div>

        <div className="admin-stock-filter">
          <select
            value={stockFilter}
            onChange={(e) => {
              setStockFilter(e.target.value as any);
              setCurrentPage(1);
            }}
            className="admin-select"
          >
            <option value="ALL">Tất cả trạng thái kho</option>
            <option value="IN_STOCK">Chỉ mẫu có sẵn kho</option>
            <option value="OUT_OF_STOCK">Chỉ mẫu tạm hết</option>
          </select>
        </div>
      </div>

      {/* Products Data Table */}
      <div className="admin-card">
        <div className="admin-table-info">
          <span>
            Tìm thấy <strong>{filteredProducts.length}</strong> sản phẩm phù hợp • Đang hiển thị trang {currentPage} / {totalPages}
          </span>
        </div>

        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: '60px' }}>Ảnh</th>
                <th style={{ width: '130px' }}>Mã SP</th>
                <th>Tên Sản Phẩm</th>
                <th>Dòng Gạch</th>
                <th>Quy Cách</th>
                <th>Màu Sắc</th>
                <th>Giá Bán</th>
                <th style={{ width: '130px' }}>Tồn Kho</th>
                <th style={{ width: '160px', textAlign: 'right' }}>Thao Tác</th>
              </tr>
            </thead>
            <tbody>
              {paginatedProducts.length === 0 ? (
                <tr>
                  <td colSpan={9} style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
                    🔍 Không tìm thấy mẫu gạch nào phù hợp với bộ lọc hiện tại.
                  </td>
                </tr>
              ) : (
                paginatedProducts.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <div className="admin-table-thumb">
                        <Image
                          src={p.image_url || '/images/logo.png'}
                          alt={p.name}
                          width={44}
                          height={44}
                          style={{ objectFit: 'cover', borderRadius: '4px' }}
                        />
                      </div>
                    </td>
                    <td>
                      <span className="admin-table-code">{p.code}</span>
                    </td>
                    <td>
                      <strong className="admin-p-name">{p.name}</strong>
                    </td>
                    <td>
                      <span className="admin-cat-badge">{p.category}</span>
                    </td>
                    <td>
                      <span className="admin-dim-text">{p.size}</span>
                    </td>
                    <td>
                      <span className="admin-color-tag">{p.color}</span>
                    </td>
                    <td>
                      <span className="admin-price-badge">{p.price_display || 'Liên hệ'}</span>
                    </td>
                    <td>
                      <button
                        type="button"
                        onClick={() => handleToggleStock(p)}
                        className={`admin-stock-toggle ${p.in_stock !== false ? 'in-stock' : 'out-stock'}`}
                        title="Bấm để đổi nhanh trạng thái tồn kho"
                      >
                        {p.in_stock !== false ? '● Có sẵn' : '○ Tạm hết'}
                      </button>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div className="admin-row-actions">
                        <Link
                          href={`/san-pham/${p.code || p.id}`}
                          target="_blank"
                          className="admin-action-btn view-btn"
                          title="Xem trang hiển thị cho khách hàng"
                        >
                          👁️
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(p)}
                          className="admin-action-btn edit-btn"
                          title="Chỉnh sửa thông tin mẫu gạch này"
                        >
                          ✏️ Sửa
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteProduct(p)}
                          className="admin-action-btn del-btn"
                          title="Xóa mẫu gạch này"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        {totalPages > 1 && (
          <div className="admin-pagination">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              className="admin-page-btn"
            >
              &larr; Trang Trước
            </button>
            <span className="admin-page-indicator">
              Trang <strong>{currentPage}</strong> / {totalPages}
            </span>
            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
              className="admin-page-btn"
            >
              Trang Sau &rarr;
            </button>
          </div>
        )}
      </div>

      {/* =========================================================
          MODAL: THÊM / CHỈNH SỬA SẢN PHẨM
          ========================================================= */}
      {isModalOpen && (
        <div
          className="admin-modal-backdrop"
          onClick={() => setIsModalOpen(false)}
          role="dialog"
          aria-modal="true"
        >
          <div className="admin-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3 className="admin-modal-title">
                {editingProduct ? `✏️ Chỉnh Sửa Sản Phẩm: ${editingProduct.code}` : '➕ Thêm Mẫu Gạch Mới Vào Hệ Thống'}
              </h3>
              <button
                type="button"
                className="admin-modal-close"
                onClick={() => setIsModalOpen(false)}
              >
                ✕
              </button>
            </div>

            {formError && <div className="admin-modal-error">{formError}</div>}

            <form onSubmit={handleSubmitForm} className="admin-modal-form">
              <div className="admin-form-row">
                <div className="admin-form-col">
                  <label>Mã Sản Phẩm (*):</label>
                  <input
                    type="text"
                    value={formCode}
                    onChange={(e) => setFormCode(e.target.value)}
                    placeholder="vd: VCB30-029, VCSG-TG-B40"
                    required
                    className="admin-input"
                  />
                </div>

                <div className="admin-form-col">
                  <label>Tên Sản Phẩm (*):</label>
                  <input
                    type="text"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="vd: Bông gió mỹ thuật bọt nước"
                    required
                    className="admin-input"
                  />
                </div>
              </div>

              <div className="admin-form-row">
                <div className="admin-form-col">
                  <label>Dòng Sản Phẩm:</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="admin-select"
                  >
                    <option value="Bông gió xi măng">Bông gió xi măng</option>
                    <option value="Bông gió tráng men">Bông gió tráng men</option>
                    <option value="Bông gió đất nung">Bông gió đất nung</option>
                  </select>
                </div>

                <div className="admin-form-col">
                  <label>Quy Cách Kích Thước:</label>
                  <input
                    type="text"
                    value={formSize}
                    onChange={(e) => setFormSize(e.target.value)}
                    placeholder="vd: 290x290x90 mm"
                    className="admin-input"
                  />
                </div>
              </div>

              <div className="admin-form-row">
                <div className="admin-form-col">
                  <label>Màu Sắc Hoàn Thiện:</label>
                  <input
                    type="text"
                    value={formColor}
                    onChange={(e) => setFormColor(e.target.value)}
                    placeholder="vd: Trắng, Xám xi măng, Men xanh đồng"
                    className="admin-input"
                  />
                </div>

                <div className="admin-form-col">
                  <label>Giá Bán Hiển Thị:</label>
                  <input
                    type="text"
                    value={formPriceDisplay}
                    onChange={(e) => setFormPriceDisplay(e.target.value)}
                    placeholder="vd: Liên hệ, 25.000 đ/viên"
                    className="admin-input"
                  />
                </div>
              </div>

              {/* Image Upload directly to Supabase Storage */}
              <div className="admin-form-section">
                <label className="admin-label-bold">Ảnh Sản Phẩm (Supabase Storage):</label>
                
                <div className="admin-upload-box">
                  <div className="admin-upload-preview">
                    {formImageUrl ? (
                      <Image
                        src={formImageUrl}
                        alt="Preview"
                        width={90}
                        height={90}
                        style={{ objectFit: 'cover', borderRadius: '8px' }}
                      />
                    ) : (
                      <div className="admin-no-img">Chưa có ảnh</div>
                    )}
                  </div>

                  <div className="admin-upload-actions">
                    <label className="admin-file-btn">
                      <span>📁 Tải Ảnh Mới Lên Supabase Storage</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        disabled={isUploading}
                        style={{ display: 'none' }}
                      />
                    </label>
                    {isUploading && <span className="uploading-text">Đang tải ảnh lên Cloud...</span>}
                    {uploadError && <span className="upload-err-text">{uploadError}</span>}

                    <div className="admin-url-direct">
                      <span className="or-text">Hoặc nhập link URL ảnh:</span>
                      <input
                        type="text"
                        value={formImageUrl}
                        onChange={(e) => setFormImageUrl(e.target.value)}
                        placeholder="https://..."
                        className="admin-input"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="admin-stock-checkbox">
                <label>
                  <input
                    type="checkbox"
                    checked={formInStock}
                    onChange={(e) => setFormInStock(e.target.checked)}
                  />
                  <span>Mẫu này đang có sẵn trong kho (Sẵn sàng xuất xưởng)</span>
                </label>
              </div>

              <div className="admin-modal-footer">
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setIsModalOpen(false)}
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || isUploading}
                  className="btn btn-primary"
                >
                  {isSubmitting ? 'Đang lưu vào Supabase...' : editingProduct ? 'Lưu Cập Nhật' : 'Tạo Mẫu Gạch Mới'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
