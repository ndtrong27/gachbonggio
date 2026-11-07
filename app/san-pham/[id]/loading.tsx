export default function ProductDetailLoading() {
  return (
    <div className="product-detail-page" aria-busy="true" aria-label="Đang tải chi tiết sản phẩm">
      <div className="container">
        {/* Breadcrumb Skeleton */}
        <div className="detail-breadcrumb" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div className="detail-skeleton-pulse" style={{ width: '5rem', height: '1rem', borderRadius: '4px' }} />
          <span className="crumb-sep">/</span>
          <div className="detail-skeleton-pulse" style={{ width: '8rem', height: '1rem', borderRadius: '4px' }} />
          <span className="crumb-sep">/</span>
          <div className="detail-skeleton-pulse" style={{ width: '10rem', height: '1rem', borderRadius: '4px' }} />
        </div>

        {/* 2-Column Skeleton matching .product-detail-layout */}
        <div className="product-detail-layout">
          {/* Left Column: Main Image + Trust Badges */}
          <div className="detail-media-column">
            <div className="detail-main-image-wrap detail-skeleton-pulse" style={{ cursor: 'default' }} />
            <div className="detail-trust-badges">
              <div className="detail-skeleton-pulse" style={{ width: '75%', height: '1.15rem', borderRadius: '4px' }} />
              <div className="detail-skeleton-pulse" style={{ width: '85%', height: '1.15rem', borderRadius: '4px' }} />
              <div className="detail-skeleton-pulse" style={{ width: '65%', height: '1.15rem', borderRadius: '4px' }} />
            </div>
          </div>

          {/* Right Column: Title, Specs, Quick Calculator, Actions */}
          <div className="detail-info-column">
            <div className="detail-header-group">
              <div
                className="detail-skeleton-pulse"
                style={{ width: '9.5rem', height: '1.75rem', borderRadius: '9999px', marginBottom: '0.75rem' }}
              />
              <div
                className="detail-skeleton-pulse"
                style={{ width: '82%', height: '2.4rem', borderRadius: '8px', marginBottom: '0.85rem' }}
              />
              <div className="detail-code-row">
                <div className="detail-skeleton-pulse" style={{ width: '7.5rem', height: '1.75rem', borderRadius: '6px' }} />
                <div className="detail-skeleton-pulse" style={{ width: '6.5rem', height: '1.75rem', borderRadius: '6px' }} />
              </div>
            </div>

            {/* Specs Card Skeleton */}
            <div className="detail-specs-card">
              <div
                className="detail-skeleton-pulse"
                style={{ width: '15rem', height: '1.25rem', borderRadius: '4px', marginBottom: '1.25rem' }}
              />
              <div className="specs-table">
                {[1, 2, 3, 4, 5, 6].map((idx) => (
                  <div key={idx} className="spec-row">
                    <div className="detail-skeleton-pulse" style={{ width: '38%', height: '1rem', borderRadius: '4px' }} />
                    <div className="detail-skeleton-pulse" style={{ width: '44%', height: '1rem', borderRadius: '4px' }} />
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Calculator Skeleton */}
            <div className="detail-quick-calc-card">
              <div
                className="detail-skeleton-pulse"
                style={{ width: '65%', height: '1.35rem', borderRadius: '4px', marginBottom: '0.5rem' }}
              />
              <div
                className="detail-skeleton-pulse"
                style={{ width: '85%', height: '0.95rem', borderRadius: '4px', marginBottom: '1.25rem' }}
              />
              <div className="quick-calc-inputs">
                <div className="detail-skeleton-pulse" style={{ height: '2.75rem', borderRadius: '8px' }} />
                <div className="detail-skeleton-pulse" style={{ height: '2.75rem', borderRadius: '8px' }} />
                <div className="detail-skeleton-pulse" style={{ height: '2.75rem', borderRadius: '8px' }} />
              </div>
              <div className="detail-skeleton-pulse" style={{ height: '3.25rem', borderRadius: '8px' }} />
            </div>

            {/* Action Buttons Skeleton */}
            <div className="detail-action-bar">
              <div className="detail-skeleton-pulse" style={{ flex: 1.5, height: '3.1rem', borderRadius: '8px' }} />
              <div className="detail-skeleton-pulse" style={{ flex: 1, height: '3.1rem', borderRadius: '8px' }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
