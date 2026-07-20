// client/src/components/pages/Home.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Autoplay, Pagination } from 'swiper/modules';

// ✅ استيراد api المركزي بدلاً من axios
import api from '../services/api';

// ✅ استخدام متغير البيئة للرابط الأساسي (بدون /api)
const API_BASE_URL = process.env.REACT_APP_API_URL
  ? process.env.REACT_APP_API_URL.replace('/api', '')
  : 'http://localhost:5000';

const Home = () => {
  const [stats, setStats] = useState({ totalUsers: 0, totalDocuments: 0, totalWorkshops: 0, totalUpdates: 0 });
  const [news, setNews] = useState([]);
  const [events, setEvents] = useState([]);
  const [services, setServices] = useState([]);
  const [contributions, setContributions] = useState([]);
  const [policies, setPolicies] = useState([]);
  const [protocols, setProtocols] = useState([]);
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, newsRes, eventsRes, servicesRes, contribRes, policiesRes, protocolsRes, updatesRes] = await Promise.all([
          api.get('/stats'),
          api.get('/news?limit=5'),
          api.get('/events?limit=5'),
          api.get('/services'),
          api.get('/contributions?limit=3'),
          api.get('/documents?category=Policy&limit=10'),
          api.get('/documents?category=Protocol&limit=10'),
          api.get('/updates?limit=5'),
        ]);
        if (statsRes.data.success) setStats(statsRes.data.data);
        if (newsRes.data.success) setNews(newsRes.data.data);
        if (eventsRes.data.success) setEvents(eventsRes.data.data);
        if (servicesRes.data.success) setServices(servicesRes.data.data);
        if (contribRes.data.success) setContributions(contribRes.data.data);
        if (policiesRes.data.success) setPolicies(policiesRes.data.data);
        if (protocolsRes.data.success) setProtocols(protocolsRes.data.data);
        if (updatesRes.data.success) setUpdates(updatesRes.data.data);
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

  // SVG أيقونات
  const ProtocolIcon = () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#164A70" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4v16h16V4H4z" />
      <line x1="8" y1="9" x2="16" y2="9" />
      <line x1="8" y1="13" x2="13" y2="13" />
      <line x1="8" y1="17" x2="12" y2="17" />
    </svg>
  );

  const AnnouncementIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );

  const HealthIcon = () => (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 12h-4l-3 9-4-18-3 9H2" />
    </svg>
  );

  const DocumentIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  );

  const UserIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );

  const WorkshopIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
      <path d="M6 12v5c3 3 9 3 12 0v-5" />
    </svg>
  );

  const EventIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );

  const ContributionIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );

  const ArrowIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );

  return (
    <div style={styles.container}>
      {/* شريط الأخبار المتحرك */}
      <section style={styles.carouselSection}>
        {news.length > 0 ? (
          <Swiper {...newsSliderSettings} style={styles.swiperWrapper}>
            {news.map((item) => (
              <SwiperSlide key={item._id}>
                <div style={styles.slide}>
                  <img 
                    src={item.image ? `${API_BASE_URL}${item.image}` : ''} 
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

      {/* قسم التعريف بالمجمع */}
      <section style={styles.aboutSection}>
        <div style={styles.aboutContent}>
          <h2 style={styles.sectionTitle}>مرحباً بكم في مجمع صحي صحم</h2>
          <p style={styles.aboutText}>
            مجمع صحي صحم هو صرح طبي متكامل يقدم خدمات صحية متميزة للمجتمع. يضم المجمع أقساماً متعددة تشمل الطوارئ، والعناية المركزة، والمختبرات، والصيدلية، وأقسام العيادات الخارجية. نهدف إلى توفير رعاية صحية عالية الجودة وفق أحدث المعايير العالمية.
          </p>
          <div style={styles.statsRow}>
            <div style={styles.statBox}>
              <DocumentIcon />
              <span>{loading ? '...' : stats.totalDocuments}</span>
              <span>وثيقة طبية</span>
            </div>
            <div style={styles.statBox}>
              <WorkshopIcon />
              <span>{loading ? '...' : stats.totalWorkshops}</span>
              <span>دورة تدريبية</span>
            </div>
            <div style={styles.statBox}>
              <UserIcon />
              <span>{loading ? '...' : stats.totalUsers}</span>
              <span>مستخدم</span>
            </div>
          </div>
        </div>
      </section>

      {/* قسم الخدمات */}
      <section style={styles.servicesSection}>
        <h2 style={styles.sectionTitle}>خدماتنا</h2>
        <div style={styles.servicesGrid}>
          {services.map((service) => (
            <div key={service._id} style={styles.serviceCard}>
              <div style={styles.serviceIcon}><HealthIcon /></div>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== قسم البروتوكولات (عرض أفقي مع تمرير) ===== */}
      <section style={styles.protocolSection}>
        <div style={styles.sectionTitleWrapper}>
          <ProtocolIcon />
          <h2 style={styles.sectionTitleText}>البروتوكولات</h2>
        </div>
        {protocols.length === 0 ? (
          <p style={styles.emptyText}>لا توجد بروتوكولات حالياً</p>
        ) : (
          <div style={styles.protocolGrid}>
            {protocols.map((protocol) => (
              <div key={protocol._id} style={styles.protocolItem}>
                <div style={styles.protocolTitle}>{protocol.title}</div>
                <div style={styles.protocolDetails}>
                  <span style={styles.protocolBadge}>
                    {protocol.subCategory === 'ER' && 'الطوارئ'}
                    {protocol.subCategory === 'ICU' && 'العناية المركزة'}
                    {protocol.subCategory === 'Pharmacy' && 'الصيدلية'}
                    {protocol.subCategory === 'Lab' && 'المختبر'}
                    {!protocol.subCategory && 'عام'}
                  </span>
                  <span style={styles.protocolDesc}>
                    {protocol.description?.slice(0, 100)}...
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ===== قسم الإعلانات ===== */}
      <section style={styles.updateSection}>
        <div style={styles.sectionHeader}>
          <div style={styles.sectionTitleWrapper}>
            <AnnouncementIcon />
            <h2 style={styles.sectionTitleText}>الإعلانات</h2>
          </div>
          <Link to="/updates" style={styles.viewAllLink}>
            عرض الكل <ArrowIcon />
          </Link>
        </div>
        {updates.length === 0 ? (
          <p style={styles.emptyText}>لا توجد إعلانات حالياً.</p>
        ) : (
          <div style={styles.updateGrid}>
            {updates.map((update) => (
              <Link to={`/updates`} key={update._id} style={styles.updateCard}>
                <div style={styles.updateTitle}>{update.title}</div>
                <div style={styles.updateMeta}>
                  <span style={styles.updateBadge}>
                    {update.type === 'announcement' && 'إعلان'}
                    {update.type === 'update' && 'تحديث'}
                    {update.type === 'general' && 'عام'}
                    {!update.type && 'عام'}
                  </span>
                  <span style={styles.updateDate}>{new Date(update.date).toLocaleDateString('ar-EG')}</span>
                </div>
                <p style={styles.updateDesc}>{update.description?.slice(0, 100)}...</p>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* قسم الفعاليات */}
      <section style={styles.eventsSection}>
        <div style={styles.sectionHeader}>
          <div style={styles.sectionTitleWrapper}>
            <EventIcon />
            <h2 style={styles.sectionTitleText}>الفعاليات</h2>
          </div>
          <Link to="/admin/events" style={styles.viewAllLink}>
            عرض الكل <ArrowIcon />
          </Link>
        </div>
        {events.length > 0 ? (
          <Swiper {...eventsSliderSettings} style={styles.swiperWrapper}>
            {events.map((event) => (
              <SwiperSlide key={event._id}>
                <div style={styles.eventCard}>
                  {event.image && <img src={`${API_BASE_URL}${event.image}`} alt={event.title} style={styles.eventImage} />}
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

      {/* قسم المبادرات المجتمعية */}
      <section style={styles.contributionsSection}>
        <div style={styles.sectionHeader}>
          <div style={styles.sectionTitleWrapper}>
            <ContributionIcon />
            <h2 style={styles.sectionTitleText}>المبادرات المجتمعية</h2>
          </div>
          <Link to="/admin/contributions" style={styles.viewAllLink}>
            عرض الكل <ArrowIcon />
          </Link>
        </div>
        <div style={styles.contributionsGrid}>
          {contributions.map((item) => (
            <div key={item._id} style={styles.contributionCard}>
              {item.image && <img src={`${API_BASE_URL}${item.image}`} alt={item.title} style={styles.contribImage} />}
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

// ===== الأنماط =====
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
    textAlign: 'center',
  },
  sectionTitleText: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#0F172A',
    margin: 0,
    textAlign: 'center',
  },
  sectionTitleWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
    marginBottom: '16px',
  },
  aboutText: {
    fontSize: '18px',
    lineHeight: 1.8,
    color: '#334155',
    marginBottom: '20px',
    textAlign: 'center',
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
    gap: '6px',
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
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '12px',
  },

  // ===== أنماط البروتوكولات (عرض أفقي مع تمرير) =====
  protocolSection: {
    marginBottom: '40px',
  },
  protocolGrid: {
    display: 'flex',
    flexWrap: 'nowrap',
    overflowX: 'auto',
    gap: '24px',
    padding: '8px 4px 16px',
    scrollbarWidth: 'thin',
    scrollbarColor: '#CBD5E1 #F1F5F9',
    direction: 'rtl',
  },
  protocolItem: {
    flex: '0 0 auto',
    width: '280px',
    minWidth: '240px',
    borderBottom: '2px solid #E2E8F0',
    paddingBottom: '12px',
  },
  protocolTitle: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: '6px',
    lineHeight: 1.3,
  },
  protocolDetails: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    flexWrap: 'wrap',
  },
  protocolBadge: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#2563EB',
    background: 'rgba(37, 99, 235, 0.1)',
    padding: '2px 14px',
    borderRadius: '20px',
    border: '1px solid rgba(37, 99, 235, 0.15)',
    whiteSpace: 'nowrap',
  },
  protocolDesc: {
    fontSize: '15px',
    color: '#64748B',
    lineHeight: 1.6,
    flex: 1,
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  },

  // ===== أنماط الإعلانات =====
  updateSection: {
    marginBottom: '40px',
  },
  updateGrid: {
    display: 'flex',
    flexWrap: 'nowrap',
    overflowX: 'auto',
    gap: '20px',
    padding: '8px 4px 12px',
    scrollbarWidth: 'thin',
    scrollbarColor: '#CBD5E1 #F1F5F9',
  },
  updateCard: {
    flex: '0 0 auto',
    width: '280px',
    minWidth: '240px',
    background: '#FFFFFF',
    padding: '20px 22px',
    borderRadius: '16px',
    border: '1px solid #E2E8F0',
    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
    textDecoration: 'none',
    color: '#0F172A',
    transition: 'transform 0.25s, box-shadow 0.25s, border-color 0.25s',
    display: 'flex',
    flexDirection: 'column',
    cursor: 'pointer',
  },
  updateTitle: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: '6px',
    lineHeight: 1.3,
  },
  updateMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '10px',
    flexWrap: 'wrap',
  },
  updateBadge: {
    fontSize: '11px',
    fontWeight: '600',
    color: '#2563EB',
    background: 'rgba(37, 99, 235, 0.1)',
    padding: '2px 12px',
    borderRadius: '20px',
    border: '1px solid rgba(37, 99, 235, 0.15)',
  },
  updateDate: {
    fontSize: '12px',
    color: '#94A3B8',
  },
  updateDesc: {
    fontSize: '14px',
    color: '#64748B',
    lineHeight: 1.6,
    margin: 0,
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  },

  // ===== أنماط مشتركة =====
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
    flexWrap: 'wrap',
    gap: '8px',
  },
  viewAllLink: {
    color: '#2563EB',
    textDecoration: 'none',
    fontSize: '15px',
    fontWeight: '500',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    transition: 'color 0.2s',
  },

  // ===== أنماط الفعاليات =====
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

  // ===== أنماط المبادرات =====
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
  .view-all-link:hover {
    color: #1D4ED8;
  }
  .view-all-link:hover svg {
    transform: translateX(3px);
  }
  .view-all-link svg {
    transition: transform 0.2s;
  }

  .update-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 28px rgba(37, 99, 235, 0.10);
    border-color: rgba(37, 99, 235, 0.25);
  }

  .protocol-grid::-webkit-scrollbar,
  .update-grid::-webkit-scrollbar {
    height: 6px;
  }
  .protocol-grid::-webkit-scrollbar-track,
  .update-grid::-webkit-scrollbar-track {
    background: #F1F5F9;
    border-radius: 10px;
  }
  .protocol-grid::-webkit-scrollbar-thumb,
  .update-grid::-webkit-scrollbar-thumb {
    background: #CBD5E1;
    border-radius: 10px;
  }
  .protocol-grid::-webkit-scrollbar-thumb:hover,
  .update-grid::-webkit-scrollbar-thumb:hover {
    background: #94A3B8;
  }

  @media (max-width: 640px) {
    .slide-title { font-size: 22px; }
    .slide-desc { font-size: 14px; }
    .about-text { font-size: 16px; }
    .stats-row { gap: 16px; }
    .stat-box { min-width: 80px; padding: 12px 16px; }
    .protocol-item {
      width: 200px !important;
      min-width: 170px !important;
    }
    .protocol-title {
      font-size: 20px !important;
    }
    .protocol-desc {
      font-size: 14px !important;
    }
    .update-card {
      width: 200px;
      min-width: 170px;
      padding: 16px 18px;
    }
    .update-title {
      font-size: 18px;
    }
    .section-title-text {
      font-size: 22px;
    }
  }
`;
document.head.appendChild(styleSheet);

export default Home;