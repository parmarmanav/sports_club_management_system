import { Link } from 'react-router-dom';
import { Check, ArrowRight } from 'lucide-react';
import useApi from '../../hooks/useApi';
import { plansApi } from '../../api/members';
import { formatCurrency } from '../../utils/formatters';

export default function PlansPage() {
  const { data, loading } = useApi(() => plansApi.getAll());
  const plans = data || [];

  return (
    <div className="page-enter">
      <section className="relative py-24 bg-brand-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-brand-accent-light font-medium text-sm tracking-widest uppercase mb-3">Membership</p>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">Plans & Pricing</h1>
          <p className="text-slate-400 max-w-lg mx-auto">Choose the plan that fits your game. Every membership includes access to all facilities.</p>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex items-center justify-center h-64 text-brand-muted text-sm">Loading plans...</div>
          ) : plans.length === 0 ? (
            <div className="text-center py-20 text-brand-muted">
              <p className="text-4xl mb-4">📋</p>
              <p>Membership plans will be available soon.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {plans.map((plan, i) => {
                const isPopular = i === 1;
                return (
                  <div key={plan.id} className={`relative rounded-2xl border p-8 transition-all hover:shadow-lg ${
                    isPopular ? 'border-brand-accent shadow-md scale-[1.02]' : 'border-brand-border'
                  }`}>
                    {isPopular && (
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-accent text-white text-xs font-semibold px-4 py-1 rounded-full">
                        Most Popular
                      </span>
                    )}
                    <h3 className="text-xl font-bold text-slate-800 mb-2">{plan.name}</h3>
                    <div className="mb-5">
                      <span className="text-3xl font-bold text-slate-800">{formatCurrency(plan.price)}</span>
                      <span className="text-brand-muted text-sm ml-1">/ {plan.duration_months} month{plan.duration_months > 1 ? 's' : ''}</span>
                    </div>

                    <div className="space-y-3 mb-8">
                      {plan.court_rate != null && (
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <Check className="w-4 h-4 text-brand-accent shrink-0" />
                          <span>Court rate: {formatCurrency(plan.court_rate)}/hr</span>
                        </div>
                      )}
                      {plan.shop_discount_pct > 0 && (
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <Check className="w-4 h-4 text-brand-accent shrink-0" />
                          <span>{plan.shop_discount_pct}% shop discount</span>
                        </div>
                      )}
                      {plan.bar_discount_pct > 0 && (
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <Check className="w-4 h-4 text-brand-accent shrink-0" />
                          <span>{plan.bar_discount_pct}% bar discount</span>
                        </div>
                      )}
                      {plan.daily_booking_limit && (
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <Check className="w-4 h-4 text-brand-accent shrink-0" />
                          <span>{plan.daily_booking_limit} bookings/day</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Check className="w-4 h-4 text-brand-accent shrink-0" />
                        <span>Access to all facilities</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Check className="w-4 h-4 text-brand-accent shrink-0" />
                        <span>Members' lounge access</span>
                      </div>
                    </div>

                    <Link to="/contact"
                      className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all ${
                        isPopular
                          ? 'bg-brand-accent text-white hover:bg-brand-accent/90'
                          : 'bg-brand-surface text-slate-800 border border-brand-border hover:bg-slate-100'
                      }`}>
                      Enquire Now <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
