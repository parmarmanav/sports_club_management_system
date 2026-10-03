import { Router } from 'express';
import { supabase } from '../../config/supabase.js';
import { verifySupabaseToken } from '../../middleware/auth.js';

const router = Router();

// POST /api/v1/bookings
router.post('/', verifySupabaseToken, async (req, res) => {
  try {
    const {
      slot_id,
      member_id,
      walk_in_name,
      walker_name,
      payment_method
    } = req.body;

    if (!slot_id) {
      return res.status(400).json({ success: false, message: 'Missing required field: slot_id' });
    }
    
    if (!payment_method) {
      return res.status(400).json({ success: false, message: 'Missing required field: payment_method' });
    }

    // Call the RPC to book the court
    const { data: bookingResult, error: bookingError } = await supabase.rpc('book_court', {
      p_slot_id: slot_id,
      p_member_id: member_id || null,
      p_walk_in_name: walk_in_name || walker_name || null,
      p_payment_method: payment_method,
      p_staff_id: req.user.id
    });

    if (bookingError) {
      // Handle known conflict errors from the RPC
      if (bookingError.message === 'SLOT_TAKEN' || bookingError.code === 'SLOT_TAKEN') {
        return res.status(409).json({ success: false, message: 'Conflict: Slot is already taken' });
      }
      if (bookingError.message === 'DAILY_LIMIT_REACHED' || bookingError.code === 'DAILY_LIMIT_REACHED') {
        return res.status(409).json({ success: false, message: 'Conflict: Daily booking limit reached' });
      }
      return res.status(400).json({ success: false, message: bookingError.message, code: bookingError.code });
    }

    // Determine booking ID and amount from the RPC result
    // The RPC might return an object with booking_id and amount, or just the ID.
    let bookingId = null;
    let bookingAmount = null;

    if (typeof bookingResult === 'object' && bookingResult !== null) {
      bookingId = bookingResult.booking_id || bookingResult.id;
      bookingAmount = bookingResult.amount ?? bookingResult.total_amount ?? bookingResult.price ?? bookingResult.booking_amount;
    } else {
      // If the RPC returned a scalar, assume it's the booking ID
      bookingId = bookingResult;
    }

    if (!bookingId) {
      return res.status(500).json({ success: false, message: 'Failed to retrieve booking ID from RPC response' });
    }

    // If the amount was not returned by the RPC, fetch the newly created booking record
    if (bookingAmount === null || bookingAmount === undefined) {
      const { data: bookingRecord, error: fetchError } = await supabase
        .from('bookings')
        .select('*')
        .eq('id', bookingId)
        .single();

      if (!fetchError && bookingRecord) {
        bookingAmount = bookingRecord.amount ?? bookingRecord.total_amount ?? bookingRecord.price;
      }
    }

    // Blocker Check: Do not invent a price if the DB doesn't provide one
    if (bookingAmount === null || bookingAmount === undefined) {
      console.error('Blocker: The existing schema/RPC does not provide enough information to determine the correct amount.');
      return res.status(500).json({ 
        success: false, 
        message: 'Blocker: Unable to determine booking amount from database schema/RPC. Inventing prices is not allowed.' 
      });
    }

    // Record the payment
    const { error: paymentError } = await supabase.rpc('record_payment', {
      p_source: 'court',
      p_reference_id: bookingId,
      p_amount: bookingAmount,
      p_method: payment_method
    });

    if (paymentError) {
      console.error('Payment recording failed:', paymentError);
      return res.status(500).json({ success: false, message: 'Booking successful but failed to record payment', error: paymentError.message });
    }

    return res.status(201).json({
      success: true,
      message: 'Booking created and payment recorded successfully',
      data: {
        booking_id: bookingId,
        amount: bookingAmount,
        payment_status: 'recorded',
        payment_method: payment_method
      }
    });

  } catch (error) {
    console.error('Error creating booking:', error);
    return res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
});

// POST /api/v1/bookings/:id/cancel
router.post('/:id/cancel', verifySupabaseToken, async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ success: false, message: 'Missing booking ID' });
    }

    const { data, error } = await supabase.rpc('cancel_booking', {
      p_booking_id: id
    });

    if (error) {
      if (error.message.includes('NOT_FOUND') || error.code === 'PGRST116') {
        return res.status(404).json({ success: false, message: 'Booking not found' });
      }
      if (error.message.includes('ALREADY_CANCELLED')) {
         return res.status(400).json({ success: false, message: 'Booking is already cancelled' });
      }
      if (error.message.includes('UNAUTHORIZED') || error.code === '403') {
         return res.status(403).json({ success: false, message: 'Unauthorized request' });
      }
      if (error.code === '22P02') {
         return res.status(400).json({ success: false, message: 'Invalid booking ID format' });
      }
      return res.status(400).json({ success: false, message: error.message, code: error.code });
    }

    return res.json({ success: true, message: 'Booking cancelled successfully', data });
  } catch (error) {
    console.error('Error cancelling booking:', error);
    return res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
});

export default router;
