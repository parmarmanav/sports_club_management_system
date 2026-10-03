import { useState } from 'react';
import { api } from '../api/client';
import heroImg from '../assets/hero.png';
import landingVideo from '../assets/landing page animation.mp4';
import { ChevronRight, Calendar, Users, Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Home() {
  const [leadForm, setLeadForm] = useState({ full_name: '', phone: '', email: '', message: '' });
  const [leadStatus, setLeadStatus] = useState({ loading: false, success: false, error: null });

  const handleBookTrial = async (e) => {
    e.preventDefault();
    setLeadStatus({ loading: true, success: false, error: null });
    try {
      await api.post('/v1/leads', leadForm);
      setLeadStatus({ loading: false, success: true, error: null });
      setLeadForm({ full_name: '', phone: '', email: '', message: '' });
    } catch (err) {
      setLeadStatus({ loading: false, success: false, error: 'Failed to book trial. Please try again.' });
    }
  };

  return (
    <div className="w-full flex flex-col">
      {/* Hero Section */}
      <section className="relative w-full h-[85vh] overflow-hidden bg-brand-dark flex items-center justify-center">
        <video 
          src={landingVideo} 
          autoPlay 
          loop 
          muted 
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-60 pointer-events-none"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/90 to-transparent"></div>
        <div className="relative z-10 text-center px-4 max-w-4xl animate-slide-up">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
            Elevate Your <span className="text-brand-gold">Game</span>
          </h1>
          <p className="text-lg md:text-2xl text-gray-200 mb-8 font-light">
            Premium facilities. Professional courts. The ultimate sports club experience.
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/courts" className="bg-brand-gold hover:bg-brand-gold-light text-brand-dark px-8 py-3 rounded font-medium text-lg transition-all shadow-lg hover:shadow-brand-gold/20 flex items-center gap-2">
              Explore Courts <ChevronRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* Facilities & Features */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 animate-slide-up">
            <h2 className="text-3xl md:text-4xl font-bold text-brand-dark mb-4">World-Class Facilities</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Experience sports like never before with our professionally maintained courts and premium amenities.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center group">
              <div className="w-16 h-16 bg-brand-bg rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-brand-gold transition-colors duration-300">
                <Trophy className="text-brand-dark w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-brand-dark">Premium Courts</h3>
              <p className="text-gray-600">Indoor and outdoor courts maintained to international tournament standards.</p>
            </div>
            <div className="text-center group">
              <div className="w-16 h-16 bg-brand-bg rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-brand-gold transition-colors duration-300">
                <Users className="text-brand-dark w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-brand-dark">Expert Coaching</h3>
              <p className="text-gray-600">Learn from certified professionals with customized training programs.</p>
            </div>
            <div className="text-center group">
              <div className="w-16 h-16 bg-brand-bg rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-brand-gold transition-colors duration-300">
                <Calendar className="text-brand-dark w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-brand-dark">Easy Booking</h3>
              <p className="text-gray-600">Seamlessly book your favorite courts and timeslots through our app.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Editorial Image Section */}
      <section className="py-20 bg-brand-dark text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-1/2">
            <img src={heroImg} alt="Club Facilities" className="rounded-lg shadow-2xl hover:scale-105 transition-transform duration-700" />
          </div>
          <div className="md:w-1/2 space-y-6">
            <h2 className="text-4xl font-bold text-brand-gold">More Than Just a Court</h2>
            <p className="text-lg text-gray-300">
              Champions Club offers a comprehensive sports experience. Beyond our premium courts, enjoy our exclusive sports shop for top-tier gear, and unwind at our café and bar after an intense match.
            </p>
            <Link to="/register" className="inline-block bg-white text-brand-dark hover:bg-brand-gold hover:text-brand-dark px-6 py-3 rounded font-medium transition-colors mt-4">
              Become a Member
            </Link>
          </div>
        </div>
      </section>

      {/* Book Trial / Leads Section */}
      <section className="py-24 px-4 bg-brand-bg">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-xl overflow-hidden flex flex-col md:flex-row">
          <div className="md:w-2/5 bg-brand-dark text-white p-10 flex flex-col justify-center">
            <h2 className="text-3xl font-bold mb-4 text-brand-gold">Book a Free Trial</h2>
            <p className="text-gray-300 mb-8">
              Experience our facilities first-hand. Leave your details and our team will arrange a guided tour and court trial for you.
            </p>
          </div>
          <div className="md:w-3/5 p-10">
            {leadStatus.success ? (
              <div className="h-full flex flex-col items-center justify-center text-center animate-fade-in">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Request Received</h3>
                <p className="text-gray-600">Our team will contact you shortly.</p>
                <button onClick={() => setLeadStatus({...leadStatus, success: false})} className="mt-6 text-brand-dark font-medium hover:text-brand-gold">Book another trial</button>
              </div>
            ) : (
              <form onSubmit={handleBookTrial} className="space-y-4 animate-fade-in">
                {leadStatus.error && <div className="p-3 bg-red-50 text-red-600 text-sm rounded">{leadStatus.error}</div>}
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2 md:col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                    <input type="text" required value={leadForm.full_name} onChange={e => setLeadForm({...leadForm, full_name: e.target.value})} className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-brand-gold outline-none" />
                  </div>
                  <div className="col-span-2 md:col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                    <input type="tel" required value={leadForm.phone} onChange={e => setLeadForm({...leadForm, phone: e.target.value})} className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-brand-gold outline-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input type="email" value={leadForm.email} onChange={e => setLeadForm({...leadForm, email: e.target.value})} className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-brand-gold outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sport Preference</label>
                  <input type="text" value={leadForm.message} onChange={e => setLeadForm({...leadForm, message: e.target.value})} placeholder="E.g. Tennis, Basketball..." className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-brand-gold outline-none" />
                </div>
                <button type="submit" disabled={leadStatus.loading} className="w-full bg-brand-gold hover:bg-brand-gold-light text-brand-dark font-medium py-3 rounded transition-colors mt-4 disabled:opacity-50">
                  {leadStatus.loading ? 'Sending...' : 'Request Trial'}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
