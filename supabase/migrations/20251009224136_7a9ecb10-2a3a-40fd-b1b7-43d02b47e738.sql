-- Phase 2: Add database constraints for input validation
ALTER TABLE public.orders 
  ADD CONSTRAINT valid_email CHECK (customer_email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  ADD CONSTRAINT valid_phone CHECK (LENGTH(customer_phone) >= 10 AND LENGTH(customer_phone) <= 20),
  ADD CONSTRAINT valid_name CHECK (LENGTH(customer_name) >= 2 AND LENGTH(customer_name) <= 100),
  ADD CONSTRAINT valid_address CHECK (LENGTH(delivery_address) >= 10 AND LENGTH(delivery_address) <= 500);

-- Phase 3: Update update_order_payment_status to include 24-hour token expiration
CREATE OR REPLACE FUNCTION public.update_order_payment_status(
  p_order_id UUID,
  p_guest_token TEXT,
  p_payment_status TEXT,
  p_status TEXT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  order_user_id UUID;
  order_guest_token TEXT;
  order_created_at TIMESTAMPTZ;
BEGIN
  -- Get order details including creation time
  SELECT user_id, guest_token, created_at 
  INTO order_user_id, order_guest_token, order_created_at
  FROM orders
  WHERE id = p_order_id;
  
  IF NOT FOUND THEN
    RETURN FALSE;
  END IF;
  
  -- Validate access with token expiration check
  IF (order_user_id IS NOT NULL AND auth.uid() = order_user_id) OR
     (order_user_id IS NULL AND 
      order_guest_token IS NOT NULL AND 
      order_guest_token = p_guest_token AND
      order_created_at > NOW() - INTERVAL '24 hours') THEN
    
    UPDATE orders
    SET 
      payment_status = p_payment_status,
      status = p_status,
      updated_at = NOW()
    WHERE id = p_order_id;
    
    RETURN TRUE;
  END IF;
  
  RETURN FALSE;
END;
$$;

-- Phase 4: Create security_logs table for monitoring
CREATE TABLE IF NOT EXISTS public.security_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT NOT NULL,
  details JSONB,
  ip_address INET,
  user_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on security_logs
ALTER TABLE public.security_logs ENABLE ROW LEVEL SECURITY;

-- Only system can insert logs
CREATE POLICY "System can insert logs"
ON public.security_logs
FOR INSERT
WITH CHECK (true);

-- No direct SELECT access (for future admin panel)
CREATE POLICY "No direct access"
ON public.security_logs
FOR SELECT
USING (false);

-- Add logging to update_order_payment_status
CREATE OR REPLACE FUNCTION public.update_order_payment_status(
  p_order_id UUID,
  p_guest_token TEXT,
  p_payment_status TEXT,
  p_status TEXT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  order_user_id UUID;
  order_guest_token TEXT;
  order_created_at TIMESTAMPTZ;
  access_granted BOOLEAN := FALSE;
BEGIN
  -- Get order details
  SELECT user_id, guest_token, created_at 
  INTO order_user_id, order_guest_token, order_created_at
  FROM orders
  WHERE id = p_order_id;
  
  IF NOT FOUND THEN
    -- Log failed attempt
    INSERT INTO security_logs (event_type, details)
    VALUES ('failed_order_update', jsonb_build_object(
      'order_id', p_order_id,
      'reason', 'order_not_found'
    ));
    RETURN FALSE;
  END IF;
  
  -- Validate access with token expiration
  IF (order_user_id IS NOT NULL AND auth.uid() = order_user_id) OR
     (order_user_id IS NULL AND 
      order_guest_token IS NOT NULL AND 
      order_guest_token = p_guest_token AND
      order_created_at > NOW() - INTERVAL '24 hours') THEN
    access_granted := TRUE;
  ELSE
    -- Log unauthorized attempt
    INSERT INTO security_logs (event_type, details, user_id)
    VALUES ('unauthorized_order_update', jsonb_build_object(
      'order_id', p_order_id,
      'token_match', order_guest_token = p_guest_token,
      'token_expired', order_created_at <= NOW() - INTERVAL '24 hours'
    ), auth.uid());
  END IF;
  
  IF access_granted THEN
    UPDATE orders
    SET 
      payment_status = p_payment_status,
      status = p_status,
      updated_at = NOW()
    WHERE id = p_order_id;
    RETURN TRUE;
  END IF;
  
  RETURN FALSE;
END;
$$;