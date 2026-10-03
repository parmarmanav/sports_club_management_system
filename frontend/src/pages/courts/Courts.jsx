import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../../api/client';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';

export default function Courts() {
  const [sports, setSports] = useState([]);
  const [courts, setCourts] = useState([]);
  const [slots, setSlots] = useState([]);
  
  const [selectedSport, setSelectedSport] = useState(null);
  const [selectedDate, setSelectedDate] = useState(() => {
    const d = new Date();
    return d.toISOString().split('T')[0];
  });
  
  const [loading, setLoading] = useState(true);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const navigate = useNavigate();

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    fetchSlots();
  }, [selectedDate, selectedSport]);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [sportsRes, courtsRes] = await Promise.all([
        api.get('/v1/sports').catch(() => ({ data: { data: [] } })),
        api.get('/v1/courts').catch(() => ({ data: { data: [] } }))
      ]);
      setSports(sportsRes.data?.data || []);
      setCourts(courtsRes.data?.data || []);
    } catch (err) {
      setError('Failed to load courts data.');
    } finally {
      setLoading(false);
    }
  };

  const fetchSlots = async () => {
    try {
      setSlotsLoading(true);
      // Construct query URL matching backend expected formats
      let url = `/v1/slots?date=${selectedDate}`;
      if (selectedSport) url += `&sport_id=${selectedSport}`;
      
      const res = await api.get(url);
      setSlots(res.data?.data || []);
    } catch (err) {
      // Don't override main error, just show empty or a small toast ideally
      setSlots([]);
    } finally {
      setSlotsLoading(false);
    }
  };

  const handleDateChange = (days) => {
    const current = new Date(selectedDate);
    current.setDate(current.getDate() + days);
    setSelectedDate(current.toISOString().split('T')[0]);
  };

  const handleSlotClick = (slot, court) => {
    if (slot.is_booked) return;
    navigate('/book', { state: { slot, court, date: selectedDate } });
  };

  // Process data for the grid view
  const filteredCourts = selectedSport ? courts.filter(c => c.sport_id === selectedSport) : courts;
  
  // Get all unique timeslots across all courts to form the columns
  const allStartTimes = [...new Set(slots.map(s => s.start_time))].sort();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-fade-in w-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-brand-dark mb-2">Court Availability</h1>
          <p className="text-gray-600">Select a sport and date to view available courts.</p>
        </div>

        <div className="flex items-center gap-4 bg-white p-2 rounded-lg shadow-sm border border-gray-100">
          <button onClick={() => handleDateChange(-1)} className="p-2 hover:bg-gray-100 rounded transition-colors"><ChevronLeft size={20}/></button>
          <div className="flex items-center gap-2 font-medium text-brand-dark min-w-[140px] justify-center">
            <CalendarIcon size={18} className="text-brand-gold" />
            <input 
              type="date" 
              value={selectedDate} 
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-transparent outline-none cursor-pointer"
            />
          </div>
          <button onClick={() => handleDateChange(1)} className="p-2 hover:bg-gray-100 rounded transition-colors"><ChevronRight size={20}/></button>
        </div>
      </div>

      {/* Sports Filter */}
      {!loading && sports.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8">
          <button 
            onClick={() => setSelectedSport(null)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${!selectedSport ? 'bg-brand-dark text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
          >
            All Sports
          </button>
          {sports.map(sport => (
            <button 
              key={sport.id}
              onClick={() => setSelectedSport(sport.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${selectedSport === sport.id ? 'bg-brand-dark text-white' : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'}`}
            >
              {sport.name}
            </button>
          ))}
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded mb-8 text-center">{error}</div>
      )}

      {/* Availability Grid */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        {loading || slotsLoading ? (
          <div className="p-12 text-center text-gray-500 animate-pulse">Loading availability...</div>
        ) : filteredCourts.length === 0 ? (
          <div className="p-12 text-center text-gray-500">No courts available for the selected filters.</div>
        ) : allStartTimes.length === 0 ? (
          <div className="p-12 text-center text-gray-500">No slots available for this date.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="p-4 font-semibold text-brand-dark min-w-[200px] sticky left-0 bg-gray-50 border-r border-gray-200 z-10">Court</th>
                  {allStartTimes.map(time => (
                    <th key={time} className="p-4 font-medium text-gray-600 text-center min-w-[100px]">{time.substring(0,5)}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredCourts.map(court => {
                  const courtSlots = slots.filter(s => s.court_id === court.id);
                  // Only show courts that actually have slots configured for the day
                  if (courtSlots.length === 0) return null;

                  return (
                    <tr key={court.id} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                      <td className="p-4 font-medium sticky left-0 bg-white border-r border-gray-100 z-10">
                        <div className="flex flex-col">
                          <Link to={`/courts/${court.id}`} className="text-brand-dark hover:text-brand-gold transition-colors">{court.name}</Link>
                          <span className="text-xs text-gray-500 mt-1 capitalize">{sports.find(s => s.id === court.sport_id)?.name || 'Sport'}</span>
                        </div>
                      </td>
                      {allStartTimes.map(time => {
                        const slot = courtSlots.find(s => s.start_time === time);
                        if (!slot) return <td key={time} className="p-4 text-center text-gray-300">-</td>;

                        let statusClass = "bg-green-100 text-green-700 hover:bg-green-200 cursor-pointer";
                        let label = "OPEN";

                        if (slot.is_booked) {
                          statusClass = "bg-gray-100 text-gray-400 cursor-not-allowed";
                          label = "BOOKED";
                        } else if (slot.is_social) {
                          statusClass = "bg-brand-gold-light text-brand-dark hover:bg-brand-gold cursor-pointer";
                          label = "SOCIAL";
                        }

                        return (
                          <td key={time} className="p-2">
                            <div 
                              onClick={() => handleSlotClick(slot, court)}
                              className={`rounded py-2 px-1 text-xs font-bold text-center transition-colors ${statusClass}`}
                            >
                              {label}
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
