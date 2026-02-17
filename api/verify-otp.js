import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  const origin = req.headers.origin || '*';
  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { email, otp } = req.body;
  const allowedEmail = process.env.ALLOWED_EMAIL;
  if (!email || !otp) {
    return res.status(400).json({ error: 'Email and OTP are required' });
  }
  // Allow verification for any email, but only .env email will get Dark Lab access on frontend

  const hashedOtp = crypto.createHash('sha256').update(otp).digest('hex');

  const { data, error } = await supabase
    .from('otps')
    .select('*')
    .eq('email', email)
    .eq('otp', hashedOtp)
    .order('expiry', { ascending: false })
    .limit(1);

  if (error || !data || data.length === 0) {
    return res.status(400).json({ error: 'Invalid OTP' });
  }

  const record = data[0];

  if (new Date(record.expiry) < new Date()) {
    return res.status(400).json({ error: 'OTP has expired' });
  }

  await supabase.from('otps').delete().eq('id', record.id);

  // Check if this email is allowed for Dark Lab access
  const isDarkLabAllowed = email === allowedEmail;

  res.json({ 
    success: true, 
    message: 'OTP verified',
    darkLabAccess: isDarkLabAllowed
  });
}
