import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

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
    desc: 'Two glass-walled padel courts — the latest addition to our facilities, bringing one of the world\'s fastest-growing sports to the club.',
    image: '/images/facilities.jpg',
    features: ['Glass walls', 'LED lighting', 'Equipment rental', 'Intro sessions'],
  },
  {
    title: 'Members\' Lounge & Bar',
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

export default function FacilitiesPage() {
  return (
    <div className="page-enter">
      {/* Hero */}
      <section className="relative py-24 bg-brand-primary overflow-hidden">
        <img src="/images/facilities.jpg" alt="Facilities" className="absolute inset-0 w-full h-full object-cover opacity-20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-brand-accent-light font-medium text-sm tracking-widest uppercase mb-3">World-Class</p>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">Our Facilities</h1>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg">
            Every detail designed for performance, comfort, and an exceptional sporting experience.
          </p>
        </div>
      </section>

      {/* Facilities grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {FACILITIES.map((f, i) => (
            <div key={f.title} className={`flex flex-col lg:flex-row gap-8 items-center ${i % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
              <div className="w-full lg:w-1/2">
                <img src={f.image} alt={f.title} className="rounded-2xl w-full h-64 lg:h-80 object-cover shadow-lg" />
              </div>
              <div className="w-full lg:w-1/2 space-y-4">
                <h3 className="text-2xl font-bold text-slate-800">{f.title}</h3>
                <p className="text-brand-muted leading-relaxed">{f.desc}</p>
                <div className="flex flex-wrap gap-2">
                  {f.features.map(feat => (
                    <span key={feat} className="text-xs font-medium px-3 py-1.5 rounded-full bg-brand-accent/5 text-brand-accent border border-brand-accent/10">
                      {feat}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-brand-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-slate-800 mb-4">Ready to experience it for yourself?</h2>
          <p className="text-brand-muted mb-6 max-w-lg mx-auto">Book a court or schedule a tour to see our facilities in person.</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/courts" className="inline-flex items-center gap-2 bg-brand-accent text-white px-7 py-3.5 rounded-xl text-sm font-semibold hover:bg-brand-accent/90 transition-all">
              Book a Court <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/contact" className="inline-flex items-center gap-2 border border-brand-border text-slate-700 px-7 py-3.5 rounded-xl text-sm font-semibold hover:bg-white transition-all">
              Schedule a Tour
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
