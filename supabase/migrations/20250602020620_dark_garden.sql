-- Enable PostGIS extension if not already enabled
CREATE EXTENSION IF NOT EXISTS postgis;

-- Create emergency_alerts table
CREATE TABLE IF NOT EXISTS emergency_alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users,
  location geometry(POINT, 4326),
  status text NOT NULL DEFAULT 'active',
  type text NOT NULL,
  description text,
  created_at timestamptz DEFAULT now(),
  resolved_at timestamptz,
  CONSTRAINT valid_status CHECK (status IN ('active', 'resolved', 'false_alarm'))
);

-- Create alert_zones table
CREATE TABLE IF NOT EXISTS alert_zones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  boundary geometry(POLYGON, 4326),
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE emergency_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE alert_zones ENABLE ROW LEVEL SECURITY;

-- Policies for emergency_alerts
CREATE POLICY "Users can create emergency alerts"
  ON emergency_alerts
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view alerts in their vicinity"
  ON emergency_alerts
  FOR SELECT
  TO authenticated
  USING (
    status = 'active' AND 
    ST_DWithin(
      location::geometry,
      ST_SetSRID(ST_MakePoint(
        cast(current_setting('app.user_longitude', true) as float),
        cast(current_setting('app.user_latitude', true) as float)
      ), 4326)::geometry,
      5000 -- 5km radius
    )
  );

-- Policies for alert_zones
CREATE POLICY "Anyone can view alert zones"
  ON alert_zones
  FOR SELECT
  TO authenticated
  USING (true);

-- Function to find nearby alerts
CREATE OR REPLACE FUNCTION find_nearby_alerts(
  user_lat float,
  user_lon float,
  radius_meters float DEFAULT 5000
)
RETURNS SETOF emergency_alerts
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT *
  FROM emergency_alerts
  WHERE status = 'active'
  AND ST_DWithin(
    location::geometry,
    ST_SetSRID(ST_MakePoint(user_lon, user_lat), 4326)::geometry,
    radius_meters
  )
  ORDER BY created_at DESC;
END;
$$;