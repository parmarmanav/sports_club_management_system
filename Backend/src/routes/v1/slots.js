import { Router } from 'express';
import { supabase } from '../../config/supabase.js';

const router = Router();

// GET /api/v1/slots?date=YYYY-MM-DD
router.get('/', async (req, res) => {
  try {
    const { date, sport_id } = req.query;

    if (!date) {
      return res.status(400).json({ success: false, message: 'Missing required query parameter: date' });
    }

    // Basic date validation
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return res.status(400).json({ success: false, message: 'Invalid date format. Use YYYY-MM-DD' });
    }

    // Prepare timezone-aware date strings (assuming Indian Standard Time or local equivalent stored in UTC)
    // To be safe and broad, we will match the date part of the timestamp string.
    // Using gte and lt to capture the whole day
    const startOfDay = `${date}T00:00:00.000Z`;
    const endOfDay = `${date}T23:59:59.999Z`;

    // Query court_slots and associated courts and bookings
    let query = supabase
      .from('court_slots')
      .select(`
        *,
        courts!inner (*),
        bookings (*)
      `)
      .gte('start_time', startOfDay)
      .lte('start_time', endOfDay);

    if (sport_id) {
      query = query.eq('courts.sport_id', sport_id);
    }

    const { data: slotsData, error } = await query;

    if (error) {
      // If relations fail, we will fallback to a simpler query, but we assume schema is correct.
      console.error('Database error fetching slots:', error);
      return res.status(500).json({ success: false, message: 'Database error', error: error.message });
    }

    if (!slotsData || slotsData.length === 0) {
      return res.json({
        success: true,
        data: {
          date,
          courts: []
        }
      });
    }

    // Group slots by court
    const courtsMap = new Map();

    slotsData.forEach(slot => {
      const courtId = slot.court_id || (slot.courts && slot.courts.id);
      if (!courtId) return; // Skip if no court info

      if (!courtsMap.has(courtId)) {
        courtsMap.set(courtId, {
          court_id: courtId,
          court_name: slot.courts?.name || `Court ${courtId}`,
          slots: []
        });
      }

      // Check for confirmed bookings
      // Assuming a booking is confirmed if its status is not 'cancelled' etc.
      // If there's no status field, we assume the existence of a booking means it's confirmed
      const confirmedBookings = (slot.bookings || []).filter(b => {
        if (b.status) {
          return !['cancelled', 'refunded', 'failed'].includes(b.status.toLowerCase());
        }
        return true;
      });

      let available = true;

      // Rule: normal slot is available when there is no confirmed booking
      if (!slot.is_social) {
        available = confirmedBookings.length === 0;
      } else {
        // Rule: If is_social = true, follow the existing database/business rule
        // We check for fields that might indicate social play availability
        if (slot.hasOwnProperty('is_available')) {
          available = slot.is_available;
        } else if (slot.hasOwnProperty('available_spots')) {
          available = slot.available_spots > 0;
        } else if (slot.hasOwnProperty('max_players')) {
          const currentPlayers = slot.booked_players !== undefined ? slot.booked_players : confirmedBookings.length;
          available = currentPlayers < slot.max_players;
        } else {
          // fallback if we can't determine explicitly
          available = true;
        }
      }

      // Override if 'is_available' is explicitly returned from a view or table
      if (slot.hasOwnProperty('is_available') && !slot.is_social) {
        available = slot.is_available;
      }

      courtsMap.get(courtId).slots.push({
        slot_id: slot.id,
        start_time: slot.start_time,
        end_time: slot.end_time,
        is_social: slot.is_social || false,
        available: available,
        ...(slot.is_social && slot.max_players !== undefined && { max_players: slot.max_players }),
        ...(slot.is_social && slot.booked_players !== undefined && { booked_players: slot.booked_players }),
        ...(slot.is_social && slot.available_spots !== undefined && { available_spots: slot.available_spots })
      });
    });

    // Sort slots by start_time for each court
    const courtsList = Array.from(courtsMap.values()).map(court => {
      court.slots.sort((a, b) => {
        if (a.start_time < b.start_time) return -1;
        if (a.start_time > b.start_time) return 1;
        return 0;
      });
      return court;
    });

    return res.json({
      success: true,
      data: {
        date,
        courts: courtsList
      }
    });

  } catch (error) {
    console.error('Error fetching slots:', error);
    return res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
});

export default router;
