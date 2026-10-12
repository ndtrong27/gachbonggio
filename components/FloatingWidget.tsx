export default function FloatingWidget() {
  return (
    <div className="floating-widget" aria-label="Kênh liên hệ nhanh">
      {/* Zalo Button */}
      <a
        href="https://zalo.me/0909177415"
        target="_blank"
        rel="noopener noreferrer"
        className="float-btn float-btn-zalo"
        title="Chat Zalo với chúng tôi"
      >
        <span style={{ fontWeight: 800, fontSize: '0.85rem' }}>Zalo</span>
      </a>

      {/* Hotline Call Button */}
      <a
        href="tel:0909177415"
        className="float-btn float-btn-hotline"
        title="Gọi hotline ngay"
      >
        <span style={{ fontSize: '1.25rem' }}>📞</span>
      </a>
    </div>
  );
}
