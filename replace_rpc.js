const fs = require('fs');
const path = 'Backend/src/routes/v1/bookings.js';
let content = fs.readFileSync(path, 'utf8');

const regex = /\s*\/\/\s*Call the RPC to book the court[\s\S]*?p_staff_id:\s*req\.user\.id\s*\}\);/;

const replacement = `    const isStaff = req.user.type === 'staff';
    const isMember = req.user.type === 'member';

    const finalMemberId = isMember ? req.user.id : (member_id || null);
    const finalStaffId = isStaff ? req.user.id : null;

    // Call the RPC to book the court
    const { data: bookingResult, error: bookingError } = await supabase.rpc('book_court', {
      p_is_trial: req.body.is_trial || false,
      p_member_id: finalMemberId,
      p_slot_id: slot_id,
      p_staff_id: finalStaffId,
      p_walker_name: walk_in_name || walker_name || null,
      p_walker_phone: req.body.walker_phone || req.body.walk_in_phone || null
    });`;

if (regex.test(content)) {
    content = content.replace(regex, '\n' + replacement);
    fs.writeFileSync(path, content);
    console.log("Replaced successfully.");
} else {
    console.log("Regex not found!");
}
