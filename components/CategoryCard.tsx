import Link from 'next/link';

interface CategoryCardProps {
  id: string;
  name: string;
  count: number;
  description: string;
  badge: string;
  iconBg: string;
  icon: string;
}

export default function CategoryCard({
  id,
  name,
  count,
  description,
  badge,
  iconBg,
  icon
}: CategoryCardProps) {
  return (
    <div className="category-card">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
        <div className="category-icon" style={{ backgroundColor: iconBg, margin: 0 }}>
          <span>{icon}</span>
        </div>
        {badge && (
          <span style={{ fontSize: '0.72rem', fontWeight: 600, color: '#0f766e', backgroundColor: '#f0fdfa', border: '1px solid #ccfbf1', padding: '3px 8px', borderRadius: '12px' }}>
            {badge}
          </span>
        )}
      </div>
      <span className="category-count">{count} Mẫu Sản Phẩm</span>
      <h3 className="category-name">{name}</h3>
      <p className="category-desc">{description}</p>
      <Link href={`#${id}`} className="btn btn-outline" style={{ marginTop: 'auto', alignSelf: 'flex-start' }}>
        Xem {name} →
      </Link>
    </div>
  );
}
