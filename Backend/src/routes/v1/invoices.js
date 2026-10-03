import { Router } from 'express';
import { supabase } from '../../config/supabase.js';
import { verifySupabaseToken, authorizeRoles } from '../../middleware/auth.js';

const router = Router();

router.use(verifySupabaseToken);
router.use(authorizeRoles('admin', 'owner'));

// POST /api/v1/invoices
router.post('/', async (req, res) => {
  try {
    const { member_id, client_name, items, tax_amount = 0, due_date, notes } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Invoice must contain at least one item' });
    }

    if (!member_id && !client_name) {
      return res.status(400).json({ success: false, message: 'Must provide either member_id or client_name' });
    }

    // Generate simple invoice number
    const invoice_number = `INV-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    // Calculate totals
    let subtotal = 0;
    const validatedItems = items.map(item => {
      if (!item.description || !item.quantity || !item.unit_price) {
        throw new Error('Each item must have description, quantity, and unit_price');
      }
      const line_total = item.quantity * item.unit_price;
      subtotal += line_total;
      return {
        description: item.description,
        quantity: item.quantity,
        unit_price: item.unit_price,
        line_total
      };
    });

    const total = subtotal + Number(tax_amount);

    // Insert Invoice
    const newInvoice = {
      invoice_number,
      member_id,
      client_name,
      status: 'draft',
      subtotal,
      tax_amount,
      total,
      due_date,
      notes
    };

    const { data: invoice, error: invoiceError } = await supabase
      .from('invoices')
      .insert(newInvoice)
      .select()
      .single();

    if (invoiceError) throw invoiceError;

    // Attach invoice_id to items
    const insertItems = validatedItems.map(item => ({
      ...item,
      invoice_id: invoice.id
    }));

    // Bulk insert items
    const { error: itemsError } = await supabase
      .from('invoice_items')
      .insert(insertItems);

    if (itemsError) {
      // Cleanup invoice if items fail
      await supabase.from('invoices').delete().eq('id', invoice.id);
      throw itemsError;
    }

    return res.status(201).json({ success: true, data: invoice });
  } catch (error) {
    console.error('Error creating invoice:', error);
    if (error.message === 'Each item must have description, quantity, and unit_price') {
      return res.status(400).json({ success: false, message: error.message });
    }
    return res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
});

// POST /api/v1/invoices/:id/pay
router.post('/:id/pay', async (req, res) => {
  try {
    const { id } = req.params;
    const { method, notes } = req.body;

    if (!method) {
      return res.status(400).json({ success: false, message: 'Payment method is required' });
    }

    // 1. Retrieve invoice and confirm it exists
    const { data: invoice, error: findError } = await supabase
      .from('invoices')
      .select('*')
      .eq('id', id)
      .single();

    if (findError) {
      if (findError.code === 'PGRST116') return res.status(404).json({ success: false, message: 'Invoice not found' });
      throw findError;
    }

    // 2. Confirm it is not already paid
    if (invoice.status === 'paid') {
      return res.status(409).json({ success: false, message: 'Invoice is already paid' });
    }

    // 3. Call record_payment RPC
    const { data: paymentId, error: rpcError } = await supabase.rpc('record_payment', {
      p_source: 'invoice',
      p_reference_id: id,
      p_amount: invoice.total,
      p_method: method,
      p_member_id: invoice.member_id,
      p_staff_id: req.user.id,
      p_notes: notes
    });

    if (rpcError) {
       return res.status(400).json({ success: false, message: 'Payment failed to record', error: rpcError.message });
    }

    // 4. Mark invoice as paid
    const { data: updatedInvoice, error: updateError } = await supabase
      .from('invoices')
      .update({
        status: 'paid',
        paid_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (updateError) throw updateError;

    return res.json({ success: true, message: 'Invoice paid successfully', data: updatedInvoice, payment_id: paymentId });
  } catch (error) {
    console.error('Error paying invoice:', error);
    return res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
});

export default router;
