import { Router } from 'express';
import { supabase } from '../../config/supabase.js';
import { verifySupabaseToken } from '../../middleware/auth.js';

const router = Router();

// GET /api/v1/courts
router.get('/', async (req, res) => {
  try {
    const { data: courts, error } = await supabase.from('courts').select('*');
    if (error) throw error;
    return res.json({ success: true, data: courts });
  } catch (error) {
    console.error('Error fetching courts:', error);
    return res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
});

// GET /api/v1/courts/:id
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { data: court, error } = await supabase.from('courts').select('*').eq('id', id).single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ success: false, message: 'Court not found' });
      }
      if (error.code === '22P02') { // Invalid UUID or type
         return res.status(400).json({ success: false, message: 'Invalid ID format' });
      }
      throw error;
    }
    
    return res.json({ success: true, data: court });
  } catch (error) {
    console.error('Error fetching court:', error);
    return res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
});

// POST /api/v1/courts
router.post('/', verifySupabaseToken, async (req, res) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0 || !req.body.name) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const { data: court, error } = await supabase.from('courts').insert(req.body).select().single();
    
    if (error) {
        return res.status(400).json({ success: false, message: error.message, code: error.code });
    }
    
    return res.status(201).json({ success: true, data: court });
  } catch (error) {
    console.error('Error creating court:', error);
    return res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
});

// PATCH /api/v1/courts/:id
router.patch('/:id', verifySupabaseToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ success: false, message: 'No fields provided for update' });
    }

    const { data: court, error } = await supabase
      .from('courts')
      .update(req.body)
      .eq('id', id)
      .select()
      .single();
      
    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ success: false, message: 'Court not found' });
      }
      if (error.code === '22P02') {
         return res.status(400).json({ success: false, message: 'Invalid ID format' });
      }
      return res.status(400).json({ success: false, message: error.message, code: error.code });
    }
    
    return res.json({ success: true, data: court });
  } catch (error) {
    console.error('Error updating court:', error);
    return res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
});

// DELETE /api/v1/courts/:id
router.delete('/:id', verifySupabaseToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase.from('courts').delete().eq('id', id).select();
    
    if (error) {
      if (error.code === '22P02') {
         return res.status(400).json({ success: false, message: 'Invalid ID format' });
      }
      throw error;
    }
    
    if (data && data.length === 0) {
       return res.status(404).json({ success: false, message: 'Court not found' });
    }
    
    return res.json({ success: true, message: 'Court deleted successfully' });
  } catch (error) {
    console.error('Error deleting court:', error);
    return res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
});

export default router;
