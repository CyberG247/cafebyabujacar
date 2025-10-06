-- Add RLS policy for guest orders SELECT using security definer function
-- This prevents anyone from directly querying guest order data

-- First, ensure authenticated users can still see their own orders (existing policy)
-- Now add protection for guest orders by creating a secure function to update payment status

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
BEGIN
  -- Get order details
  SELECT user_id, guest_token INTO order_user_id, order_guest_token
  FROM orders
  WHERE id = p_order_id;
  
  -- Check if order doesn't exist
  IF NOT FOUND THEN
    RETURN FALSE;
  END IF;
  
  -- Validate access: either authenticated user owns it OR guest token matches
  IF (order_user_id IS NOT NULL AND auth.uid() = order_user_id) OR
     (order_user_id IS NULL AND order_guest_token IS NOT NULL AND order_guest_token = p_guest_token) THEN
    
    -- Update the order
    UPDATE orders
    SET 
      payment_status = p_payment_status,
      status = p_status,
      updated_at = NOW()
    WHERE id = p_order_id;
    
    RETURN TRUE;
  END IF;
  
  -- Access denied
  RETURN FALSE;
END;
$$;

-- Add RLS policy to allow SELECT for guest orders via the security definer function
-- Guest orders can only be accessed through get_guest_order function which validates token
-- This policy keeps direct table access restricted

CREATE POLICY "Guest orders require token validation"
ON public.orders
FOR SELECT
USING (
  -- Allow if user is authenticated and owns the order
  (auth.uid() IS NOT NULL AND auth.uid() = user_id)
  -- Guest orders can only be accessed via security definer functions
  -- Direct SELECT is blocked to prevent data theft
);

-- Add similar protection for order_items
CREATE POLICY "Guest order items require token validation"
ON public.order_items
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM orders o
    WHERE o.id = order_items.order_id
    AND (
      -- Allow if user is authenticated and owns the order
      (auth.uid() IS NOT NULL AND auth.uid() = o.user_id)
      -- Guest order items can only be accessed via security definer functions
    )
  )
);

-- Drop the old overly permissive policies
DROP POLICY IF EXISTS "Authenticated users can view own orders" ON public.orders;
DROP POLICY IF EXISTS "Authenticated users can view own order items" ON public.order_items;