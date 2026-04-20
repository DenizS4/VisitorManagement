-- Create trigger to auto-create guard profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.guards (
    id,
    first_name,
    last_name,
    badge_number,
    position
  )
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data ->> 'first_name', 'Guard'),
    COALESCE(new.raw_user_meta_data ->> 'last_name', 'New'),
    COALESCE(new.raw_user_meta_data ->> 'badge_number', 'BADGE' || SUBSTRING(new.id::TEXT, 1, 8)),
    COALESCE(new.raw_user_meta_data ->> 'position', 'Security Guard')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
