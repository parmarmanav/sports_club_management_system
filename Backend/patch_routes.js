import fs from 'fs';

const appendTo = (file, code) => {
  let content = fs.readFileSync(file, 'utf8');
  if (content.includes(code.trim().substring(0, 30))) return;
  content = content.replace('export default router;', code + '\nexport default router;');
  fs.writeFileSync(file, content);
};

appendTo('src/routes/v1/bookings.js', `
router.get('/', async (req, res) => {
  const { data } = await supabase.from('bookings').select('*, members(full_name), staff(full_name)');
  res.json({ success: true, data: data || [] });
});
`);

appendTo('src/routes/v1/shop.js', `
router.get('/orders', async (req, res) => {
  const { data } = await supabase.from('shop_orders').select('*, members(full_name), staff(full_name)');
  res.json({ success: true, data: data || [] });
});
`);

appendTo('src/routes/v1/invoices.js', `
router.get('/', async (req, res) => {
  const { data } = await supabase.from('invoices').select('*, members(full_name)');
  res.json({ success: true, data: data || [] });
});
`);

appendTo('src/routes/v1/payroll.js', `
router.get('/', async (req, res) => {
  const { data } = await supabase.from('payroll').select('*, staff(full_name)');
  res.json({ success: true, data: data || [] });
});
`);

appendTo('src/routes/v1/bar.js', `
router.get('/kitchen', async (req, res) => {
  const { data } = await supabase.from('bar_orders').select('*, members(full_name), staff(full_name)');
  res.json({ success: true, data: data || [] });
});
`);
