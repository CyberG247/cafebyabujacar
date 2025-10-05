-- Drop the previous policies that won't work for guest users
DROP POLICY IF EXISTS "Users can view own orders" ON public.orders;
DROP POLICY IF EXISTS "Users can create orders" ON public.orders;
DROP POLICY IF EXISTS "Users can view own order items" ON public.order_items;
DROP POLICY IF EXISTS "Users can create order items" ON public.order_items;

-- Create updated policies that allow authenticated users full access
-- and guest orders to be created (but not queried directly via SELECT)
CREATE POLICY "Authenticated users can view own orders"
ON public.orders
FOR SELECT
USING (auth.uid() IS NOT NULL AND auth.uid() = user_id);

CREATE POLICY "Anyone can create orders"
ON public.orders
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Authenticated users can view own order items"
ON public.order_items
FOR SELECT
USING (
  EXISTS (
    SELECT 1
    FROM public.orders o
    WHERE o.id = order_items.order_id
    AND auth.uid() IS NOT NULL 
    AND auth.uid() = o.user_id
  )
);

CREATE POLICY "Anyone can create order items"
ON public.order_items
FOR INSERT
WITH CHECK (true);

-- Create a public function to retrieve guest orders with token validation
CREATE OR REPLACE FUNCTION public.get_guest_order(p_order_id UUID, p_token TEXT)
RETURNS TABLE (
  id UUID,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ,
  status TEXT,
  payment_status TEXT,
  customer_name TEXT,
  customer_email TEXT,
  customer_phone TEXT,
  delivery_address TEXT,
  subtotal NUMERIC,
  delivery_fee NUMERIC,
  total NUMERIC,
  notes TEXT
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Verify the token matches and return the order
  RETURN QUERY
  SELECT 
    o.id,
    o.created_at,
    o.updated_at,
    o.status,
    o.payment_status,
    o.customer_name,
    o.customer_email,
    o.customer_phone,
    o.delivery_address,
    o.subtotal,
    o.delivery_fee,
    o.total,
    o.notes
  FROM public.orders o
  WHERE o.id = p_order_id
  AND o.user_id IS NULL
  AND o.guest_token IS NOT NULL
  AND o.guest_token = p_token;
END;
$$;

-- Create a function to retrieve guest order items
CREATE OR REPLACE FUNCTION public.get_guest_order_items(p_order_id UUID, p_token TEXT)
RETURNS TABLE (
  id UUID,
  order_id UUID,
  product_id UUID,
  product_name TEXT,
  product_price NUMERIC,
  quantity INTEGER,
  subtotal NUMERIC,
  created_at TIMESTAMPTZ
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- First verify the token is valid for this order
  IF NOT EXISTS (
    SELECT 1 FROM public.orders o
    WHERE o.id = p_order_id
    AND o.user_id IS NULL
    AND o.guest_token IS NOT NULL
    AND o.guest_token = p_token
  ) THEN
    RETURN;
  END IF;

  -- Return the order items
  RETURN QUERY
  SELECT 
    oi.id,
    oi.order_id,
    oi.product_id,
    oi.product_name,
    oi.product_price,
    oi.quantity,
    oi.subtotal,
    oi.created_at
  FROM public.order_items oi
  WHERE oi.order_id = p_order_id;
END;
$$;