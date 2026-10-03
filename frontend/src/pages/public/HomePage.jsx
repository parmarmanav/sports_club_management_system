import { Link, Navigate } from 'react-router-dom';
import { ArrowRight, Trophy, Users, Calendar as CalendarIcon, ShieldCheck, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useState } from 'react';

const SPORTS = [
  { name: 'Tennis', desc: 'Professional-grade hard courts with floodlighting for day and night play.', emoji: '🎾' },
  { name: 'Cricket', desc: 'Practice nets and turf wickets maintained to club-cricket standard.', emoji: '🏏' },
  { name: 'Badminton', desc: 'Indoor courts with sprung flooring and tournament-grade shuttlecocks.', emoji: '🏸' },
  { name: 'Padel', desc: 'Glass-walled courts for the fastest-growing racquet sport in the world.', emoji: '🎾' },
];

const STATS = [
  { icon: Trophy, value: '4', label: 'Sports' },
  { icon: Users, value: '500+', label: 'Members' },
  { icon: CalendarIcon, value: '12+', label: 'Courts' },
  { icon: ShieldCheck, value: '15+', label: 'Years' },
];

const FACILITIES = [
  {
    title: 'Tennis Courts',
    desc: 'Four professional hard courts with premium Plexicushion surfaces. Floodlit for evening play with tournament-grade nets and equipment.',
    image: '/images/hero.jpg',
    features: ['Hard court surface', 'Floodlighting', 'Ball machine', 'Coaching available'],
  },
  {
    title: 'Cricket Nets',
    desc: 'Three fully enclosed practice nets with both synthetic and turf wickets, plus a bowling machine for solo sessions.',
    image: '/images/facilities.jpg',
    features: ['Turf & synthetic', 'Bowling machine', 'Video analysis', 'Coaching available'],
  },
  {
    title: 'Badminton Courts',
    desc: 'Two indoor courts with sprung wooden flooring, climate control, and professional-grade lighting for optimal play.',
    image: '/images/facilities.jpg',
    features: ['Indoor courts', 'Sprung flooring', 'Climate controlled', 'Tournament ready'],
  },
  {
    title: 'Padel Courts',
    desc: "Two glass-walled padel courts — the latest addition to our facilities, bringing one of the world's fastest-growing sports to the club.",
    image: '/images/facilities.jpg',
    features: ['Glass walls', 'LED lighting', 'Equipment rental', 'Intro sessions'],
  },
  {
    title: "Members' Lounge & Bar",
    desc: 'An elegant, contemporary lounge with a full-service bar, offering premium beverages and a curated menu. The perfect space to unwind after a match.',
    image: '/images/lounge.jpg',
    features: ['Full bar', 'Kitchen dining', 'Court views', 'Private events'],
  },
  {
    title: 'Pro Shop',
    desc: 'Our on-site shop stocks equipment, apparel, and accessories from leading brands. Expert stringing and racquet fitting services available.',
    image: '/images/hero.jpg',
    features: ['Top brands', 'Racquet stringing', 'Apparel', 'Accessories'],
  },
];

const GALLERY_ITEMS = [
  { src: '/images/hero.jpg', caption: 'Tennis court at golden hour' },
  { src: '/images/facilities.jpg', caption: 'Aerial view of our sports complex' },
  { src: '/images/lounge.jpg', caption: "The Members' Lounge & Bar" },
  { src: '/images/hero.jpg', caption: 'Professional coaching sessions' },
  { src: '/images/lounge.jpg', caption: 'Private dining area' },
  { src: '/images/facilities.jpg', caption: 'Multi-sport facilities' },
  { src: '/images/hero.jpg', caption: 'Evening tennis under lights' },
  { src: '/images/lounge.jpg', caption: 'Bar & social area' },
];

export default function HomePage() {
  const { user } = useAuth();
  const [lightbox, setLightbox] = useState(null);

  if (user) {
    return <Navigate to="/courts" replace />;
  }

  return (
    <div className="page-enter">
      {/* ─── Hero ─── */}
      <section className="relative h-[85vh] min-h-[600px] flex items-center">
        <img src="/images/hero.jpg" alt="Champions Club" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 via-slate-900/50 to-transparent" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-xl">
            <p className="text-brand-accent-light font-medium text-sm tracking-widest uppercase mb-4">
              Premium Sports Club
            </p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              Where Champions<br />
              <span className="text-brand-accent-light">Come to Play</span>
            </h1>
            <p className="text-lg text-slate-300 mb-8 leading-relaxed">
              World-class Tennis, Cricket, Badminton, and Padel facilities. Join a community that values excellence, sportsmanship, and the joy of competition.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/courts" className="inline-flex items-center gap-2 bg-brand-accent text-white px-7 py-3.5 rounded-xl text-sm font-semibold hover:bg-brand-accent/90 transition-all hover:translate-y-[-1px] shadow-lg shadow-brand-accent/20">
                Book a Court <ArrowRight className="w-4 h-4" />
              </Link>
              <a href="#about" className="inline-flex items-center gap-2 bg-white/10 backdrop-blur text-white px-7 py-3.5 rounded-xl text-sm font-semibold hover:bg-white/20 transition-all border border-white/20">
                Our Story
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Stats bar ─── */}
      <section className="bg-brand-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {STATS.map(s => (
              <div key={s.label} className="text-center">
                <s.icon className="w-6 h-6 text-brand-accent-light mx-auto mb-2" />
                <p className="text-3xl font-bold text-white">{s.value}</p>
                <p className="text-sm text-slate-400 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Sports showcase ─── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-brand-accent font-medium text-sm tracking-widest uppercase mb-2">Our Sports</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-800">Four World-Class Disciplines</h2>
            <p className="text-brand-muted mt-3 max-w-lg mx-auto">From racquet to bat, our facilities are designed for athletes of every level.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {SPORTS.map(sport => (
              <div key={sport.name} className="group bg-brand-surface rounded-2xl p-7 border border-brand-border hover:border-brand-accent/30 hover:shadow-lg transition-all duration-300 hover:translate-y-[-2px]">
                <span className="text-4xl mb-4 block">{sport.emoji}</span>
                <h3 className="text-lg font-bold text-slate-800 mb-2">{sport.name}</h3>
                <p className="text-sm text-brand-muted leading-relaxed">{sport.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Integrated About Section ─── */}
      <section id="about" className="py-24 bg-brand-surface border-t border-brand-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-brand-accent font-medium text-sm tracking-widest uppercase mb-3">Our Story</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-4">About Champions Club</h2>
            <p className="text-brand-muted max-w-2xl mx-auto text-lg">
              A legacy of excellence in sports, community, and the pursuit of greatness.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <h3 className="text-2xl font-bold text-slate-800 mb-4">The Beginning</h3>
              <p className="text-brand-muted leading-relaxed mb-4">
                Champions Club was founded with a simple vision: to create a space where sport, community, and excellence intersect. What began as a modest facility with a single tennis court has grown into a premier multi-sport destination.
              </p>
              <p className="text-brand-muted leading-relaxed">
                Today, we serve over 500 active members across four world-class disciplines — Tennis, Cricket, Badminton, and Padel — with facilities that rival the best in the country.
              </p>
            </div>
            <div className="rounded-2xl overflow-hidden shadow-xl">
              <img src="/images/hero.jpg" alt="Champions Club" className="w-full h-72 object-cover" />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
            {[
              { title: 'Excellence', desc: 'We maintain the highest standards in every aspect — from court surfaces to member services.', icon: '🏆' },
              { title: 'Community', desc: 'Sport brings people together. We foster a welcoming, inclusive environment for all skill levels.', icon: '🤝' },
              { title: 'Integrity', desc: 'Fair play on and off the court. We believe in transparency, respect, and sportsmanship.', icon: '⚡' },
            ].map(v => (
              <div key={v.title} className="bg-white rounded-2xl p-8 border border-brand-border text-center hover:shadow-lg transition-all">
                <span className="text-4xl block mb-4">{v.icon}</span>
                <h4 className="text-lg font-bold text-slate-800 mb-2">{v.title}</h4>
                <p className="text-sm text-brand-muted leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Integrated Facilities Section ─── */}
      <section id="facilities" className="py-24 bg-white border-t border-brand-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-brand-accent font-medium text-sm tracking-widest uppercase mb-3">World-Class</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-4">Our Facilities</h2>
            <p className="text-brand-muted max-w-2xl mx-auto text-lg">
              Every detail designed for performance, comfort, and an exceptional sporting experience.
            </p>
          </div>
          
          <div className="space-y-16">
            {FACILITIES.map((f, i) => (
              <div key={f.title} className={`flex flex-col lg:flex-row gap-10 items-center ${i % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
                <div className="w-full lg:w-1/2">
                  <img src={f.image} alt={f.title} className="rounded-3xl w-full h-72 lg:h-96 object-cover shadow-xl" />
                </div>
                <div className="w-full lg:w-1/2 space-y-5">
                  <h3 className="text-2xl font-bold text-slate-800">{f.title}</h3>
                  <p className="text-brand-muted leading-relaxed text-lg">{f.desc}</p>
                  <div className="flex flex-wrap gap-2 pt-2">
                    {f.features.map(feat => (
                      <span key={feat} className="text-sm font-semibold px-4 py-2 rounded-xl bg-brand-accent/10 text-brand-accent">
                        {feat}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Integrated Gallery Section ─── */}
      <section id="gallery" className="py-24 bg-brand-surface border-t border-brand-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-brand-accent font-medium text-sm tracking-widest uppercase mb-3">Gallery</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-4">Life at the Club</h2>
            <p className="text-brand-muted max-w-lg mx-auto">A glimpse into the Champions Club experience.</p>
          </div>
          
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
            {GALLERY_ITEMS.map((item, i) => (
              <button
                key={i}
                onClick={() => setLightbox(item)}
                className="block w-full rounded-2xl overflow-hidden group cursor-pointer break-inside-avoid shadow-sm hover:shadow-xl transition-all"
              >
                <div className="relative">
                  <img
                    src={item.src}
                    alt={item.caption}
                    className={`w-full object-cover transition-transform duration-700 group-hover:scale-105 ${
                      i % 3 === 0 ? 'h-80' : i % 3 === 1 ? 'h-60' : 'h-72'
                    }`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                    <p className="text-white text-sm font-medium px-6 py-4">
                      {item.caption}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Membership CTA ─── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-slate-900 to-brand-primary rounded-3xl p-10 sm:p-16 flex flex-col lg:flex-row items-center gap-10 shadow-2xl relative overflow-hidden">
            <div className="absolute -right-20 -top-20 w-64 h-64 bg-brand-accent/20 rounded-full blur-3xl"></div>
            
            <div className="flex-1 relative z-10">
              <p className="text-brand-accent-light font-bold text-sm tracking-widest uppercase mb-3">Become a Member</p>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-5 tracking-tight">Join Champions Club Today</h2>
              <p className="text-slate-300 leading-relaxed mb-8 text-lg">
                Unlock exclusive access to all courts, member discounts on the pro shop and bar, priority booking, and a community of passionate sportspeople.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/plans" className="inline-flex items-center gap-2 bg-brand-accent text-white px-8 py-4 rounded-xl text-sm font-bold hover:bg-brand-accent-light transition-all shadow-lg shadow-brand-accent/30 hover:-translate-y-1">
                  View Plans <ArrowRight className="w-4 h-4" />
                </Link>
                <Link to="/contact" className="inline-flex items-center gap-2 text-white border-2 border-white/20 px-8 py-4 rounded-xl text-sm font-bold hover:bg-white/10 hover:border-white/40 transition-all">
                  Enquire Now
                </Link>
              </div>
            </div>
            <div className="w-full lg:w-96 shrink-0 relative z-10">
              <img src="/images/lounge.jpg" alt="Members Lounge" className="rounded-2xl shadow-2xl w-full h-64 lg:h-72 object-cover border-4 border-white/5" />
            </div>
          </div>
        </div>
      </section>
      
      {/* Lightbox for Gallery */}
      {lightbox && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/95 backdrop-blur-sm" onClick={() => setLightbox(null)}>
          <button className="absolute top-6 right-6 text-white/70 hover:text-white p-2 bg-white/10 rounded-full hover:bg-white/20 transition-all"><X className="w-6 h-6" /></button>
          <div className="max-w-5xl w-full animate-[pageEnter_0.3s_ease-out_forwards]" onClick={(e) => e.stopPropagation()}>
            <img src={lightbox.src} alt={lightbox.caption} className="w-full max-h-[85vh] object-contain rounded-xl shadow-2xl" />
            <p className="text-center text-white/90 font-medium text-lg mt-6">{lightbox.caption}</p>
          </div>
        </div>
      )}
    </div>
  );
}
