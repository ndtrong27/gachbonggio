export interface ArticleSection {
  heading: string;
  paragraphs: string[];
  quote?: string;
  highlight?: string;
}

export interface FeaturedProduct {
  name: string;
  code: string;
  size: string;
  color: string;
  image: string;
  link: string;
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  categoryColor: {
    bg: string;
    text: string;
    border: string;
  };
  coverImage: string;
  readingTime: string;
  publishedAt: string;
  author: string;
  targetSection: string;
  featuredProduct: FeaturedProduct;
  lead: string;
  sections: ArticleSection[];
  conclusion: string;
}

export const articles: Article[] = [
  {
    id: 'bai-viet-1',
    slug: 'giai-phap-chong-nong-thong-gio-gach-bong-gio-xi-mang',
    title: 'Giải Pháp Chống Nóng & Thông Gió Tự Nhiên Cho Nhà Phố Hướng Tây Bằng Gạch Bông Gió Xi Măng',
    excerpt: 'Khám phá bí quyết ứng dụng gạch bông gió xi măng mặt tiền giúp hạ nhiệt độ ngôi nhà từ 3-5°C, đón gió mát và cản bức xạ nắng gắt quanh năm.',
    category: 'Bông Gió Xi Măng',
    categoryColor: {
      bg: '#ebf8ff',
      text: '#2b6cb0',
      border: '#bee3f8',
    },
    coverImage: '/images/banners/banner-9.jpg',
    readingTime: '4 phút đọc',
    publishedAt: '12/10/2026',
    author: 'KTS. Vĩnh Cửu Sài Gòn',
    targetSection: '#xi-mang',
    featuredProduct: {
      name: 'Bông gió mỹ thuật',
      code: 'VCB30-029',
      size: '290x290x90 mm',
      color: 'Trắng xi măng cao cấp',
      image: 'https://gachbonggio.net/wp-content/uploads/2025/01/VCB-30-029-trang-1-300x300.jpg',
      link: '/#xi-mang',
    },
    lead: 'Đối với những căn nhà phố tại đô thị Việt Nam có mặt tiền hướng Tây, cái nắng oi bức buổi chiều luôn là bài toán đau đầu cho các gia chủ. Bức tường bê tông kín mít chỉ làm nhiệt lượng tích tụ, trong khi việc đóng kín rèm cửa lại khiến không gian ngột ngạt. Bức tường gạch bông gió xi măng nổi lên như một lớp rèm che chắn tự nhiên, bền bỉ và giàu tính điêu khắc.',
    sections: [
      {
        heading: '1. Cơ chế đối lưu không khí và hạ nhiệt thông minh',
        paragraphs: [
          'Gạch bông gió xi măng hoạt động như một hệ lam chắn nắng thông minh. Cấu trúc hoa văn rỗng cho phép những làn gió mát nhẹ nhàng luân chuyển qua khe hở, đẩy luồng khí nóng tù đọng trong nhà ra ngoài theo nguyên lý đối lưu nhiệt tự nhiên.',
          'Nhiều công trình thực tế ghi nhận, khi ứng dụng tường bông gió kép (kết hợp khoảng đệm đệm ban công hoặc sân vườn), nhiệt độ bề mặt bên trong phòng có thể giảm từ 3 đến 5 độ C so với việc xây tường đặc thông thường.'
        ],
        highlight: 'Tiết kiệm đến 30% chi phí điện năng làm mát điều hòa trong mùa nắng nóng cao điểm.'
      },
      {
        heading: '2. Độ bền kết cấu và khả năng chịu lực vượt trội',
        paragraphs: [
          'Khác với các dòng gạch trang trí mỏng nhẹ, gạch bông gió xi măng của Vĩnh Cửu Sài Gòn được sản xuất bằng công nghệ ép thủy lực cao tần từ hỗn hợp cát thạch anh và xi măng mác cao. Mỗi viên gạch đều có gờ rãnh liên kết thép, giúp mảng tường vững chắc trước áp lực gió bão.',
          'Bề mặt gạch được xử lý chống thấm 2 lớp, chống rêu mốc và chịu được sự khắc nghiệt của khí hậu nhiệt đới gió mùa tại Việt Nam.'
        ],
        quote: '"Gạch bông gió không chỉ là vật liệu xây dựng, mà là giải pháp kiến trúc bền vững mang hơi thở thiên nhiên vào không gian sống."'
      },
      {
        heading: '3. Hiệu ứng đổ bóng thị giác (Shadow Art)',
        paragraphs: [
          'Một nét quyến rũ đặc biệt của gạch bông gió chính là hiệu ứng ánh sáng. Khi ánh nắng mặt trời xiên qua từng ô thoáng, những vệt bóng đổ nghệ thuật liên tục chuyển động theo thời gian trong ngày, biến bức tường đơn điệu thành một tác phẩm tranh điêu khắc ánh sáng đầy sinh động.'
        ]
      }
    ],
    conclusion: 'Sử dụng gạch bông gió xi măng cho mặt tiền nhà phố là sự đầu tư thông minh, vừa giải quyết triệt để vấn đề vi khí hậu, vừa nâng tầm thẩm mỹ độc đáo cho mặt đứng công trình.'
  },
  {
    id: 'bai-viet-2',
    slug: 'kien-truc-indochine-gach-bong-gio-trang-men-gom-co',
    title: 'Nghệ Thuật Kiến Trúc Indochine: Đẳng Cấp Thẩm Mỹ Từ Gạch Bông Gió Tráng Men Gốm Cổ',
    excerpt: 'Tìm hiểu sức hút hoài niệm của gạch bông gió tráng men gốm cổ (men xanh đồng, men vàng da lươn) - điểm nhấn sang trọng cho biệt thự và công trình nghỉ dưỡng.',
    category: 'Bông Gió Tráng Men',
    categoryColor: {
      bg: '#f0fff4',
      text: '#276749',
      border: '#c6f6d5',
    },
    coverImage: '/images/banners/banner-6.jpg',
    readingTime: '5 phút đọc',
    publishedAt: '12/10/2026',
    author: 'KTS. Vĩnh Cửu Sài Gòn',
    targetSection: '#trang-men',
    featuredProduct: {
      name: 'Gạch thông gió hoa bưởi tráng men',
      code: 'VCSG-TG-B40',
      size: '400x400x50 mm',
      color: 'Men xanh đồng cổ / Vàng da lươn',
      image: 'https://gachbonggio.net/wp-content/uploads/2019/01/gach-thong-gio-hoa-buoi-men-xanh-dong-co-40x40x5-cm-1-300x300.jpg',
      link: '/#trang-men',
    },
    lead: 'Phong cách Indochine (Đông Dương) luôn có một chỗ đứng bất diệt trong lòng giới mộ điệu kiến trúc. Đó là bản giao hưởng tuyệt mỹ giữa nét lãng mạn nước Pháp và sự sâu lắng, tôn nghiêm của văn hóa bản địa phương Đông. Trong đó, gạch bông gió tráng men gốm cổ chính là chi tiết đắt giá tôn vinh trọn vẹn tinh thần ấy.',
    sections: [
      {
        heading: '1. Sắc men gốm nung cổ truyền và giá trị thời gian',
        paragraphs: [
          'Dòng gạch tráng men sở hữu hai tông màu kinh điển: xanh đồng cổ quý phái và vàng da lươn trầm ấm. Khác với màu sơn nhân tạo dễ phai, lớp men gốm được nung ở nhiệt độ trên 1200°C liên kết bền chặt với cốt đất sét nung.',
          'Bề mặt bóng ngọc với độ rạn vi mô đặc trưng mang lại cảm giác cổ kính, sâu lắng, càng nhuốm màu thời gian càng toát lên vẻ đẹp kiêu sa, vương giả.'
        ],
        quote: '"Mỗi viên gạch gốm tráng men là sự kết tinh của đất, lửa và bàn tay nghệ nhân tài hoa qua hàng thế kỷ truyền thừa."'
      },
      {
        heading: '2. Chống thấm nước tuyệt đối & Dễ dàng vệ sinh',
        paragraphs: [
          'Một trong những ưu điểm kỹ thuật vượt trội của gạch bông gió tráng men chính là bề mặt thủy tinh thể bóng mịn. Lớp men phủ ngăn hoàn toàn sự thâm nhập của nước mưa, bụi bẩn hay rong rêu.',
          'Đối với các khu vực tường bao biệt thự, vách ngăn phòng tắm lộ thiên hay lan can resort ven biển nơi có độ ẩm và muối cao, gạch tráng men vẫn giữ nguyên vẹn sắc màu ban đầu mà không đòi hỏi chi phí bảo dưỡng sơn sửa định kỳ.'
        ],
        highlight: 'Kháng bụi bẩn và rêu mốc 100%, dễ dàng làm sạch chỉ với nước sạch thông thường.'
      },
      {
        heading: '3. Họa tiết hoa bưởi, chữ thọ mang ý nghĩa phong thủy tốt lành',
        paragraphs: [
          'Những hoa văn như Hoa Bưởi thanh khiết, Chữ Thọ viên mãn hay Đồng Tiền chiêu tài không chỉ mang lại giá trị thẩm mỹ mà còn đem đến vượng khí, tài lộc và sự bình an cho gia chủ theo quan niệm phong thủy Á Đông.'
        ]
      }
    ],
    conclusion: 'Gạch bông gió tráng men không đơn thuần là chi tiết trang trí, mà là tuyên ngôn về gu thẩm mỹ tinh tế, sâu sắc của những gia chủ yêu chuộng nét đẹp văn hóa truyền thống.'
  },
  {
    id: 'bai-viet-3',
    slug: 'gach-thong-gio-dat-nung-san-vuon-nha-nghi-duong',
    title: 'Gạch Thông Gió Đất Nung: Nét Mộc Mạc Truyền Thống Trong Không Gian Sân Vườn & Nhà Nghỉ Dưỡng',
    excerpt: 'Sắc đỏ đất nung tự nhiên kết hợp cùng cây xanh và nắng gió tạo nên chốn an yên, mộc mạc và gần gũi với thiên nhiên cho các công trình nhà vườn sinh thái.',
    category: 'Bông Gió Đất Nung',
    categoryColor: {
      bg: '#fffaf0',
      text: '#c05621',
      border: '#feebc8',
    },
    coverImage: '/images/banners/banner-7.jpg',
    readingTime: '4 phút đọc',
    publishedAt: '12/10/2026',
    author: 'KTS. Vĩnh Cửu Sài Gòn',
    targetSection: '#dat-nung',
    featuredProduct: {
      name: 'Gạch thông gió hoa bưởi đất nung',
      code: 'VCSG-TG-B40',
      size: '400x400x50 mm',
      color: 'Đỏ đất sét nung tự nhiên',
      image: 'https://gachbonggio.net/wp-content/uploads/2019/01/gach-thong-gio-dat-nung-hoa-buoi-40x40x5-cm-1-300x300.jpg',
      link: '/#dat-nung',
    },
    lead: 'Giữa nhịp sống đô thị hối hả, con người ngày càng khao khát tìm về những điều giản dị, thuần khiết. Gạch thông gió đất nung với gam màu đỏ cam ấm áp, mộc mạc của đất mẹ đã trở thành linh hồn cho các công trình nhà vườn, homestay sinh thái và quán cafe sân vườn.',
    sections: [
      {
        heading: '1. Chất liệu thuần tự nhiên, thân thiện với môi trường',
        paragraphs: [
          'Được chế tác hoàn toàn từ đất sét tự nhiên nung chín ở nhiệt độ cao, gạch đất nung không chứa hóa chất độc hại, có khả năng thở tự nhiên giúp cân bằng độ ẩm môi trường xung quanh.',
          'Gam màu đỏ đất nung hài hòa kỳ lạ khi đặt cạnh những tán cây xanh mát, hồ cá koi hay nền đá cuội sỏi, mang lại cảm giác bình yên thư thái ngay khi bước chân vào ngôi nhà.'
        ],
        highlight: 'Chất liệu xanh 100% tự nhiên, thân thiện với sức khỏe và môi trường sinh thái.'
      },
      {
        heading: '2. Ứng dụng đa dạng từ tường rào đến vách ngăn nội thất',
        paragraphs: [
          'Trong thiết kế cảnh quan sân vườn, gạch đất nung thường được ứng dụng xây tường bao thông gió quanh vườn, vách ngăn khu vực bàn trà ngoài trời hay tường bao che giếng trời.',
          'Các ô thoáng hoa cúc, hoa mai, hoa bưởi cho phép ánh nắng nhẹ lọt qua và làn gió mát tự nhiên len lỏi, tạo nên khoảng không gian nửa kín nửa hở đầy thú vị.'
        ],
        quote: '"Vẻ đẹp mộc mạc của đất nung không phô trương nhưng để lại dư âm ấm áp và gợi nhớ ký ức tuổi thơ."'
      },
      {
        heading: '3. Chi phí kinh tế tối ưu cho mọi công trình',
        paragraphs: [
          'Bên cạnh giá trị thẩm mỹ, gạch bông gió đất nung còn sở hữu mức giá thành vô cùng kinh tế so với các vật liệu nhân tạo khác. Đây là sự lựa chọn hoàn hảo cho các chủ đầu tư chuỗi cafe, nhà hàng hay khu nghỉ dưỡng muốn tối ưu chi phí mà vẫn tạo dựng được nét đặc trưng riêng biệt.'
        ]
      }
    ],
    conclusion: 'Một bức tường gạch đất nung mộc mạc trong vườn nhà không chỉ là ranh giới kiến trúc, mà là khoảng lặng bình yên nuôi dưỡng tâm hồn sau những giờ làm việc mệt mỏi.'
  }
];

export function getArticleBySlug(slug: string): Article | undefined {
  return articles.find((a) => a.slug === slug);
}
