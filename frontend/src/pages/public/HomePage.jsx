import { Link } from 'react-router-dom';
import { ArrowRight, Trophy, Users, Calendar, ShieldCheck } from 'lucide-react';

const SPORTS = [
  { name: 'Tennis', desc: 'Professional-grade hard courts with floodlighting for day and night play.', emoji: '🎾' },
  { name: 'Cricket', desc: 'Practice nets and turf wickets maintained to club-cricket standard.', emoji: '🏏' },
  { name: 'Badminton', desc: 'Indoor courts with sprung flooring and tournament-grade shuttlecocks.', emoji: '🏸' },
  { name: 'Padel', desc: 'Glass-walled courts for the fastest-growing racquet sport in the world.', emoji: '🎾' },
];

const STATS = [
  { icon: Trophy, value: '4', label: 'Sports' },
  { icon: Users, value: '500+', label: 'Members' },
  { icon: Calendar, value: '12+', label: 'Courts' },
  { icon: ShieldCheck, value: '15+', label: 'Years' },
];

export default function HomePage() {
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
              <Link to="/about" className="inline-flex items-center gap-2 bg-white/10 backdrop-blur text-white px-7 py-3.5 rounded-xl text-sm font-semibold hover:bg-white/20 transition-all border border-white/20">
                Our Story
              </Link>
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

      {/* ─── Facilities image + CTA ─── */}
      <section className="relative py-24 overflow-hidden">
        <img src="/images/facilities.jpg" alt="Facilities" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-slate-900/70" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-brand-accent-light font-medium text-sm tracking-widest uppercase mb-3">Explore</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Premium Facilities</h2>
          <p className="text-slate-300 max-w-lg mx-auto mb-8">
            From our meticulously maintained courts to the elegant members' lounge and pro shop — every detail is designed for your comfort.
          </p>
          <Link to="/facilities" className="inline-flex items-center gap-2 bg-white text-slate-800 px-7 py-3.5 rounded-xl text-sm font-semibold hover:bg-slate-100 transition-all">
            View Facilities <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* ─── Membership CTA ─── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-brand-primary to-slate-800 rounded-3xl p-10 sm:p-16 flex flex-col lg:flex-row items-center gap-10">
            <div className="flex-1">
              <p className="text-brand-accent-light font-medium text-sm tracking-widest uppercase mb-3">Become a Member</p>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Join Champions Club Today</h2>
              <p className="text-slate-400 leading-relaxed mb-6">
                Unlock exclusive access to all courts, member discounts on the pro shop and bar, priority booking, and a community of passionate sportspeople.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/plans" className="inline-flex items-center gap-2 bg-brand-accent text-white px-7 py-3.5 rounded-xl text-sm font-semibold hover:bg-brand-accent/90 transition-all">
                  View Plans <ArrowRight className="w-4 h-4" />
                </Link>
                <Link to="/contact" className="inline-flex items-center gap-2 text-white border border-white/20 px-7 py-3.5 rounded-xl text-sm font-semibold hover:bg-white/10 transition-all">
                  Enquire Now
                </Link>
              </div>
            </div>
            <div className="w-full lg:w-80 shrink-0">
              <img src="/images/lounge.jpg" alt="Members Lounge" className="rounded-2xl shadow-2xl w-full h-48 lg:h-64 object-cover" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
