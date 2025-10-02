-- Create table for contact messages
CREATE TABLE public.contact_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  read_status BOOLEAN NOT NULL DEFAULT false
);

-- Enable Row Level Security
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to insert contact messages (public contact form)
CREATE POLICY "Anyone can submit contact messages" 
ON public.contact_messages 
FOR INSERT 
WITH CHECK (true);

-- Create policy to allow only admin to read messages (you can later add admin role)
-- For now, this will prevent unauthorized access but won't allow reading until you implement admin auth
CREATE POLICY "Only admin can read contact messages" 
ON public.contact_messages 
FOR SELECT 
USING (false); -- This will be updated later when you add admin authentication