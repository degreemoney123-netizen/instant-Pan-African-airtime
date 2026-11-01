DROP POLICY IF EXISTS app_settings_read ON public.app_settings;
REVOKE SELECT ON public.app_settings FROM anon;
CREATE POLICY app_settings_read_public_keys ON public.app_settings
  FOR SELECT TO authenticated
  USING (key IN ('referral_rate_percent'));