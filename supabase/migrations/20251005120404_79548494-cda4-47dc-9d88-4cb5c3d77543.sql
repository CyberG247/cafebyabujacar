-- Add guest_token column to orders table for secure guest checkout
ALTER TABLE public.orders ADD COLUMN guest_token TEXT;

-- Create index for faster token lookups
CREATE INDEX idx_orders_guest_token ON public.orders(guest_token) WHERE guest_token IS NOT NULL;

-- Create a security definer function to validate guest order access
CREATE OR REPLACE FUNCTION public.can_access_order(order_id UUID, provided_token TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  order_user_id UUID;
  order_guest_token TEXT;
BEGIN
  -- Get the order details
  SELECT user_id, guest_token INTO order_user_id, order_guest_token
  FROM public.orders
  WHERE id = order_id;
  
  -- If order doesn't exist, return false
  IF NOT FOUND THEN
    RETURN FALSE;
  END IF;
  
  -- If user is authenticated and owns the order
  IF auth.uid() IS NOT NULL AND auth.uid() = order_user_id THEN
    RETURN TRUE;
  END IF;
  
  -- If it's a guest order and token matches
  IF order_user_id IS NULL AND order_guest_token IS NOT NULL AND order_guest_token = provided_token THEN
    RETURN TRUE;
  END IF;
  
  RETURN FALSE;
END;
$$;

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view own orders" ON public.orders;
DROP POLICY IF EXISTS "Authenticated users can create orders" ON public.orders;
DROP POLICY IF EXISTS "Users can view own order items" ON public.order_items;
DROP POLICY IF EXISTS "Users can create order items" ON public.order_items;

-- Create new secure policies for orders
CREATE POLICY "Users can view own orders"
ON public.orders
FOR SELECT
USING (
  (auth.uid() IS NOT NULL AND auth.uid() = user_id) OR
  (user_id IS NULL AND guest_token IS NOT NULL AND guest_token = current_setting('request.jwt.claims', true)::json->>'guest_token')
);

CREATE POLICY "Users can create orders"
ON public.orders
FOR INSERT
WITH CHECK (
  (auth.uid() IS NOT NULL AND auth.uid() = user_id) OR
  (user_id IS NULL AND guest_token IS NOT NULL)
);

-- Create new secure policies for order_items
CREATE POLICY "Users can view own order items"
ON public.order_items
FOR SELECT
USING (
  EXISTS (
    SELECT 1
    FROM public.orders o
    WHERE o.id = order_items.order_id
    AND (
      (auth.uid() IS NOT NULL AND auth.uid() = o.user_id) OR
      (o.user_id IS NULL AND o.guest_token IS NOT NULL AND o.guest_token = current_setting('request.jwt.claims', true)::json->>'guest_token')
    )
  )
);

CREATE POLICY "Users can create order items"
ON public.order_items
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.orders o
    WHERE o.id = order_items.order_id
    AND (
      (auth.uid() IS NOT NULL AND auth.uid() = o.user_id) OR
      (o.user_id IS NULL AND o.guest_token IS NOT NULL)
    )
  )
);