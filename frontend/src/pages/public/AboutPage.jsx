export default function AboutPage() {
  return (
    <div className="page-enter">
      {/* Hero */}
      <section className="relative py-24 bg-brand-primary overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-brand-accent-light font-medium text-sm tracking-widest uppercase mb-3">Our Story</p>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">About Champions Club</h1>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg">
            A legacy of excellence in sports, community, and the pursuit of greatness.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-slate max-w-none">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
              <div>
                <h2 className="text-2xl font-bold text-slate-800 mb-4">The Beginning</h2>
                <p className="text-brand-muted leading-relaxed mb-4">
                  Champions Club was founded with a simple vision: to create a space where sport, community, and excellence intersect. What began as a modest facility with a single tennis court has grown into a premier multi-sport destination.
                </p>
                <p className="text-brand-muted leading-relaxed">
                  Today, we serve over 500 active members across four world-class disciplines — Tennis, Cricket, Badminton, and Padel — with facilities that rival the best in the country.
                </p>
              </div>
              <div className="rounded-2xl overflow-hidden">
                <img src="/images/hero.jpg" alt="Champions Club" className="w-full h-64 object-cover" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="order-2 md:order-1 rounded-2xl overflow-hidden">
                <img src="/images/lounge.jpg" alt="Members Lounge" className="w-full h-64 object-cover" />
              </div>
              <div className="order-1 md:order-2">
                <h2 className="text-2xl font-bold text-slate-800 mb-4">More Than a Club</h2>
                <p className="text-brand-muted leading-relaxed mb-4">
                  We believe sport is about more than competition. It's about building relationships, developing character, and pursuing personal growth. Our members' lounge, pro shop, and dining facilities ensure that every visit is an experience worth savouring.
                </p>
                <p className="text-brand-muted leading-relaxed">
                  Whether you're a seasoned athlete or picking up a racquet for the first time, Champions Club is your home court.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-brand-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-slate-800">Our Values</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: 'Excellence', desc: 'We maintain the highest standards in every aspect — from court surfaces to member services.', icon: '🏆' },
              { title: 'Community', desc: 'Sport brings people together. We foster a welcoming, inclusive environment for all skill levels.', icon: '🤝' },
              { title: 'Integrity', desc: 'Fair play on and off the court. We believe in transparency, respect, and sportsmanship.', icon: '⚡' },
            ].map(v => (
              <div key={v.title} className="bg-white rounded-2xl p-8 border border-brand-border text-center">
                <span className="text-4xl block mb-4">{v.icon}</span>
                <h3 className="text-lg font-bold text-slate-800 mb-2">{v.title}</h3>
                <p className="text-sm text-brand-muted leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
