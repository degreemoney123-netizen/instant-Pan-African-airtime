REVOKE ALL ON FUNCTION public.award_order_points(UUID, TEXT, INTEGER) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.award_order_points(UUID, TEXT, INTEGER) TO service_role;