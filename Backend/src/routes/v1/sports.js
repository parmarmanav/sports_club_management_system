import { Router } from 'express';
import { supabase } from '../../config/supabase.js';
import { verifySupabaseToken } from '../../middleware/auth.js';

const router = Router();

// GET /api/v1/sports
router.get('/', async (req, res) => {
  try {
    const { data: sports, error } = await supabase.from('sports').select('*');
    if (error) throw error;
    return res.json({ success: true, data: sports });
  } catch (error) {
    console.error('Error fetching sports:', error);
    return res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
});

// GET /api/v1/sports/:id
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { data: sport, error } = await supabase.from('sports').select('*').eq('id', id).single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ success: false, message: 'Sport not found' });
      }
      if (error.code === '22P02') { // Invalid UUID or type
         return res.status(400).json({ success: false, message: 'Invalid ID format' });
      }
      throw error;
    }
    
    return res.json({ success: true, data: sport });
  } catch (error) {
    console.error('Error fetching sport:', error);
    return res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
});

// POST /api/v1/sports
router.post('/', verifySupabaseToken, async (req, res) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0 || !req.body.name) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const { data: sport, error } = await supabase.from('sports').insert(req.body).select().single();
    
    if (error) {
        return res.status(400).json({ success: false, message: error.message, code: error.code });
    }
    
    return res.status(201).json({ success: true, data: sport });
  } catch (error) {
    console.error('Error creating sport:', error);
    return res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
});

// PATCH /api/v1/sports/:id
router.patch('/:id', verifySupabaseToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ success: false, message: 'No fields provided for update' });
    }

    const { data: sport, error } = await supabase
      .from('sports')
      .update(req.body)
      .eq('id', id)
      .select()
      .single();
      
    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ success: false, message: 'Sport not found' });
      }
      if (error.code === '22P02') {
         return res.status(400).json({ success: false, message: 'Invalid ID format' });
      }
      return res.status(400).json({ success: false, message: error.message, code: error.code });
    }
    
    return res.json({ success: true, data: sport });
  } catch (error) {
    console.error('Error updating sport:', error);
    return res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
});

// DELETE /api/v1/sports/:id
router.delete('/:id', verifySupabaseToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase.from('sports').delete().eq('id', id).select();
    
    if (error) {
      if (error.code === '22P02') {
         return res.status(400).json({ success: false, message: 'Invalid ID format' });
      }
      throw error;
    }
    
    if (data && data.length === 0) {
       return res.status(404).json({ success: false, message: 'Sport not found' });
    }
    
    return res.json({ success: true, message: 'Sport deleted successfully' });
  } catch (error) {
    console.error('Error deleting sport:', error);
    return res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
});

export default router;
