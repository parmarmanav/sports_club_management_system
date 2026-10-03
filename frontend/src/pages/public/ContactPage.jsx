import { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';
import api from '../../api/client';

export default function ContactPage() {
  const [form, setForm] = useState({ full_name: '', phone: '', email: '', message: '', source: 'website' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await api.post('/v1/leads', form);
      setSubmitted(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page-enter">
      <section className="relative py-24 bg-brand-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-brand-accent-light font-medium text-sm tracking-widest uppercase mb-3">Get in Touch</p>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">Contact Us</h1>
          <p className="text-slate-400 max-w-lg mx-auto">Have a question or want to schedule a visit? We'd love to hear from you.</p>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact info */}
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-slate-800 mb-6">Visit Us</h2>
                <div className="space-y-5">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-brand-accent/10 flex items-center justify-center shrink-0">
                      <MapPin className="w-5 h-5 text-brand-accent" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-800">Address</p>
                      <p className="text-sm text-brand-muted">123 Sports Lane, City, State 400001</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-brand-accent/10 flex items-center justify-center shrink-0">
                      <Phone className="w-5 h-5 text-brand-accent" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-800">Phone</p>
                      <p className="text-sm text-brand-muted">+91 98765 43210</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-brand-accent/10 flex items-center justify-center shrink-0">
                      <Mail className="w-5 h-5 text-brand-accent" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-800">Email</p>
                      <p className="text-sm text-brand-muted">info@championsclub.com</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-brand-accent/10 flex items-center justify-center shrink-0">
                      <Clock className="w-5 h-5 text-brand-accent" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-800">Hours</p>
                      <p className="text-sm text-brand-muted">Mon–Sat: 6:00 AM – 10:00 PM</p>
                      <p className="text-sm text-brand-muted">Sunday: 7:00 AM – 8:00 PM</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Enquiry form */}
            <div className="bg-brand-surface rounded-2xl border border-brand-border p-8">
              {submitted ? (
                <div className="text-center py-16">
                  <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-4">
                    <Send className="w-7 h-7 text-emerald-600" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-2">Enquiry Submitted!</h3>
                  <p className="text-brand-muted">Thank you for your interest. Our team will reach out within 24 hours.</p>
                </div>
              ) : (
                <>
                  <h3 className="text-xl font-bold text-slate-800 mb-1">Send an Enquiry</h3>
                  <p className="text-sm text-brand-muted mb-6">We'll get back to you within 24 hours.</p>

                  {error && (
                    <div className="mb-4 px-4 py-3 bg-rose-50 border border-rose-200 rounded-xl text-sm text-rose-700">{error}</div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="text" required placeholder="Full Name *" value={form.full_name}
                      onChange={(e) => setForm(p => ({ ...p, full_name: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl border border-brand-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-accent" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <input type="tel" required placeholder="Phone *" value={form.phone}
                        onChange={(e) => setForm(p => ({ ...p, phone: e.target.value }))}
                        className="w-full px-4 py-3 rounded-xl border border-brand-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-accent" />
                      <input type="email" placeholder="Email" value={form.email}
                        onChange={(e) => setForm(p => ({ ...p, email: e.target.value }))}
                        className="w-full px-4 py-3 rounded-xl border border-brand-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-accent" />
                    </div>
                    <textarea placeholder="How can we help you?" value={form.message} rows={4}
                      onChange={(e) => setForm(p => ({ ...p, message: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl border border-brand-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-accent resize-none" />
                    <button type="submit" disabled={submitting}
                      className="w-full py-3 bg-brand-accent text-white rounded-xl text-sm font-semibold hover:bg-brand-accent/90 disabled:opacity-50 transition-colors">
                      {submitting ? 'Sending...' : 'Submit Enquiry'}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
