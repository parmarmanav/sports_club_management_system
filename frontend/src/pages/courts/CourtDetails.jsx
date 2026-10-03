import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../../api/client';
import { ArrowLeft, MapPin, Clock } from 'lucide-react';

export default function CourtDetails() {
  const { id } = useParams();
  const [court, setCourt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourt = async () => {
      try {
        const res = await api.get(`/v1/courts/${id}`);
        setCourt(res.data?.data);
      } catch (err) {
        setError('Court not found or failed to load.');
      } finally {
        setLoading(false);
      }
    };
    
    if (id) fetchCourt();
  }, [id]);

  if (loading) return <div className="p-12 text-center animate-pulse">Loading court details...</div>;
  if (error || !court) return <div className="p-12 text-center text-red-500">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-fade-in w-full">
      <Link to="/courts" className="inline-flex items-center text-gray-600 hover:text-brand-dark mb-6 transition-colors">
        <ArrowLeft size={16} className="mr-2" /> Back to Courts
      </Link>
      
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="h-64 bg-brand-dark relative flex items-center justify-center">
          <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
          <h1 className="text-4xl font-bold text-white relative z-10">{court.name}</h1>
        </div>
        
        <div className="p-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-brand-dark mb-2">Court Information</h3>
                <p className="text-gray-600">Premium quality sports surface designed for professional and casual play alike.</p>
              </div>
              
              <div className="flex items-start gap-3 text-gray-600">
                <MapPin className="text-brand-gold mt-1 shrink-0" size={20} />
                <div>
                  <p className="font-medium">Location</p>
                  <p className="text-sm">Main Arena, Level 1</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 text-gray-600">
                <Clock className="text-brand-gold mt-1 shrink-0" size={20} />
                <div>
                  <p className="font-medium">Standard Walk-in Rate</p>
                  <p className="text-sm">₹{court.walk_in_rate}/hour</p>
                </div>
              </div>
            </div>
            
            <div className="bg-brand-bg p-6 rounded-lg border border-gray-100 text-center flex flex-col justify-center items-center">
              <h3 className="text-xl font-bold text-brand-dark mb-4">Ready to play?</h3>
              <p className="text-gray-600 mb-6 text-sm">Check availability and secure your slot instantly.</p>
              <Link to="/courts" className="bg-brand-dark hover:bg-opacity-90 text-white px-8 py-3 rounded font-medium transition-all shadow-md">
                View Availability
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
