// client/src/components/pages/Home.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Autoplay, Pagination } from 'swiper/modules';

// ✅ إضافة BASE_URL
const BASE_URL = 'http://localhost:5000';

const Home = () => {
  const [stats, setStats] = useState({ totalUsers: 0, totalDocuments: 0, totalWorkshops: 0, totalUpdates: 0 });
  const [news, setNews] = useState([]);
  const [events, setEvents] = useState([]);
  const [services, setServices] = useState([]);
  const [contributions, setContributions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, newsRes, eventsRes, servicesRes, contribRes] = await Promise.all([
          axios.get(`${BASE_URL}/api/stats`),
          axios.get(`${BASE_URL}/api/news?limit=5`),
          axios.get(`${BASE_URL}/api/events?limit=5`),
          axios.get(`${BASE_URL}/api/services`),
          axios.get(`${BASE_URL}/api/contributions?limit=3`),
        ]);
        if (statsRes.data.success) setStats(statsRes.data.data);
        if (newsRes.data.success) setNews(newsRes.data.data);
        if (eventsRes.data.success) setEvents(eventsRes.data.data);
        if (servicesRes.data.success) setServices(servicesRes.data.data);
        if (contribRes.data.success) setContributions(contribRes.data.data);
      } catch (error) {
        console.error('Error fetching home data:', error);
        setServices([
          { _id: '1', title: 'الطوارئ', description: 'خدمة الطوارئ على مدار الساعة' },
          { _id: '2', title: 'المختبر', description: 'تحاليل طبية متكاملة' },
          { _id: '3', title: 'الصيدلية', description: 'توفير الأدوية والمستلزمات' },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const newsSliderSettings = {
    modules: [Autoplay, Pagination],
    autoplay: { delay: 4000, disableOnInteraction: false },
    pagination: { clickable: true },
    loop: true,
    slidesPerView: 1,
  };

  const eventsSliderSettings = {
    modules: [Autoplay, Pagination],
    autoplay: { delay: 5000, disableOnInteraction: false },
    pagination: { clickable: true },
    loop: true,
    slidesPerView: 2,
    breakpoints: {
      640: { slidesPerView: 1 },
      768: { slidesPerView: 2 },
      1024: { slidesPerView: 3 },
    },
  };

  return (
    <div style={styles.container}>
      {/* ===== شريط الأخبار المتحرك (كاروسيل) ===== */}
      <section style={styles.carouselSection}>
        {news.length > 0 ? (
          <Swiper {...newsSliderSettings} style={styles.swiperWrapper}>
            {news.map((item) => (
              <SwiperSlide key={item._id}>
                <div style={styles.slide}>
                  {/* ✅ إضافة BASE_URL أمام مسار الصورة */}
                  <img 
                    src={item.image ? `${BASE_URL}${item.image}` : ''} 
                    alt={item.title} 
                    style={styles.slideImage} 
                  />
                  <div style={styles.slideOverlay}>
                    <h2 style={styles.slideTitle}>{item.title}</h2>
                    <p style={styles.slideDesc}>{item.description}</p>
                    <span style={styles.slideDate}>{new Date(item.date).toLocaleDateString('ar-EG')}</span>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <div style={styles.placeholderSlider}>لا توجد أخبار حالياً</div>
        )}
      </section>

      {/* ===== قسم التعريف بالمجمع ===== */}
      <section style={styles.aboutSection}>
        <div style={styles.aboutContent}>
          <h2 style={styles.sectionTitle}>مرحباً بكم في مجمع صحي صحم</h2>
          <p style={styles.aboutText}>
            مجمع صحي صحم هو صرح طبي متكامل يقدم خدمات صحية متميزة للمجتمع. يضم المجمع أقساماً متعددة تشمل الطوارئ، والعناية المركزة، والمختبرات، والصيدلية، وأقسام العيادات الخارجية. نهدف إلى توفير رعاية صحية عالية الجودة وفق أحدث المعايير العالمية.
          </p>
          <div style={styles.statsRow}>
            <div style={styles.statBox}>
              <span>{loading ? '...' : stats.totalDocuments}</span>
              <span>وثيقة طبية</span>
            </div>
            <div style={styles.statBox}>
              <span>{loading ? '...' : stats.totalWorkshops}</span>
              <span>دورة تدريبية</span>
            </div>
            <div style={styles.statBox}>
              <span>{loading ? '...' : stats.totalUsers}</span>
              <span>مستخدم</span>
            </div>
          </div>
        </div>
      </section>

      {/* ===== قسم الخدمات ===== */}
      <section style={styles.servicesSection}>
        <h2 style={styles.sectionTitle}>خدماتنا</h2>
        <div style={styles.servicesGrid}>
          {services.map((service) => (
            <div key={service._id} style={styles.serviceCard}>
              <div style={styles.serviceIcon}>🩺</div>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== قسم الفعاليات والإعلانات (كاروسيل) ===== */}
      <section style={styles.eventsSection}>
        <h2 style={styles.sectionTitle}>الفعاليات والإعلانات</h2>
        {events.length > 0 ? (
          <Swiper {...eventsSliderSettings} style={styles.swiperWrapper}>
            {events.map((event) => (
              <SwiperSlide key={event._id}>
                <div style={styles.eventCard}>
                  {/* ✅ إضافة BASE_URL أمام مسار الصورة */}
                  {event.image && <img src={`${BASE_URL}${event.image}`} alt={event.title} style={styles.eventImage} />}
                  <div style={styles.eventInfo}>
                    <h4>{event.title}</h4>
                    <p>{event.description}</p>
                    <span style={styles.eventDate}>{new Date(event.date).toLocaleDateString('ar-EG')}</span>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <p style={styles.emptyText}>لا توجد فعاليات حالياً</p>
        )}
      </section>

      {/* ===== قسم المبادرات المجتمعية ===== */}
      <section style={styles.contributionsSection}>
        <h2 style={styles.sectionTitle}>المبادرات المجتمعية</h2>
        <div style={styles.contributionsGrid}>
          {contributions.map((item) => (
            <div key={item._id} style={styles.contributionCard}>
              {/* ✅ إضافة BASE_URL أمام مسار الصورة */}
              {item.image && <img src={`${BASE_URL}${item.image}`} alt={item.title} style={styles.contribImage} />}
              <h4>{item.title}</h4>
              <p>{item.description}</p>
              <span style={styles.contribType}>{item.type}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

// ===== الأنماط (نفسها بدون تغيير) =====
const styles = {
  container: {
    minHeight: 'calc(100vh - 64px)',
    background: '#F8FAFC',
    padding: '0 24px 48px',
    fontFamily: 'Inter, Roboto, sans-serif',
  },
  carouselSection: {
    marginBottom: '32px',
    borderRadius: '16px',
    overflow: 'hidden',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  },
  swiperWrapper: {
    height: '400px',
  },
  slide: {
    position: 'relative',
    height: '400px',
    overflow: 'hidden',
  },
  slideImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  slideOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: '20px 30px',
    background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)',
    color: '#FFFFFF',
  },
  slideTitle: {
    fontSize: '28px',
    fontWeight: '700',
    marginBottom: '6px',
  },
  slideDesc: {
    fontSize: '16px',
    opacity: 0.9,
    marginBottom: '4px',
  },
  slideDate: {
    fontSize: '14px',
    opacity: 0.7,
  },
  placeholderSlider: {
    height: '400px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#E2E8F0',
    color: '#64748B',
    fontSize: '20px',
  },
  aboutSection: {
    padding: '40px 30px',
    background: 'linear-gradient(135deg, #DBEAFE, #EFF6FF)',
    borderRadius: '16px',
    marginBottom: '32px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
  },
  aboutContent: {
    maxWidth: '900px',
    margin: '0 auto',
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: '16px',
  },
  aboutText: {
    fontSize: '18px',
    lineHeight: 1.8,
    color: '#334155',
    marginBottom: '20px',
  },
  statsRow: {
    display: 'flex',
    justifyContent: 'center',
    gap: '32px',
    flexWrap: 'wrap',
  },
  statBox: {
    background: '#FFFFFF',
    padding: '16px 28px',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    minWidth: '120px',
  },
  servicesSection: {
    marginBottom: '32px',
  },
  servicesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px',
  },
  serviceCard: {
    background: '#FFFFFF',
    padding: '24px 16px',
    borderRadius: '14px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    textAlign: 'center',
    transition: 'transform 0.2s',
    border: '1px solid #E2E8F0',
  },
  serviceIcon: {
    fontSize: '40px',
    marginBottom: '12px',
  },
  eventsSection: {
    marginBottom: '32px',
  },
  eventCard: {
    background: '#FFFFFF',
    borderRadius: '14px',
    overflow: 'hidden',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    margin: '0 8px',
    border: '1px solid #E2E8F0',
  },
  eventImage: {
    width: '100%',
    height: '180px',
    objectFit: 'cover',
  },
  eventInfo: {
    padding: '16px',
  },
  eventDate: {
    display: 'block',
    marginTop: '8px',
    color: '#64748B',
    fontSize: '14px',
  },
  contributionsSection: {
    marginBottom: '32px',
  },
  contributionsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px',
  },
  contributionCard: {
    background: '#FFFFFF',
    padding: '16px',
    borderRadius: '14px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    border: '1px solid #E2E8F0',
  },
  contribImage: {
    width: '100%',
    height: '140px',
    objectFit: 'cover',
    borderRadius: '8px',
    marginBottom: '12px',
  },
  contribType: {
    display: 'inline-block',
    marginTop: '8px',
    padding: '4px 14px',
    background: '#DBEAFE',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600',
    color: '#2563EB',
  },
  emptyText: {
    textAlign: 'center',
    color: '#94A3B8',
    fontSize: '16px',
    padding: '20px 0',
  },
};

// ===== CSS إضافية =====
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  .swiper-pagination-bullet-active {
    background: #2563EB !important;
  }
  .service-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0,0,0,0.1);
    border-color: #2563EB;
  }
  .event-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0,0,0,0.1);
  }
  .contribution-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0,0,0,0.08);
  }
  @media (max-width: 640px) {
    .slide-title { font-size: 22px; }
    .slide-desc { font-size: 14px; }
    .about-text { font-size: 16px; }
    .stats-row { gap: 16px; }
    .stat-box { min-width: 80px; padding: 12px 16px; }
  }
`;
document.head.appendChild(styleSheet);

export default Home;