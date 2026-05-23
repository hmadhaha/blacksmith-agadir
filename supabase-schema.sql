-- Blacksmith Agadir Database Schema
-- Run this in your Supabase SQL Editor

-- Categories table
CREATE TABLE categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  image TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Menu items table
CREATE TABLE menu_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  image TEXT,
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  featured BOOLEAN DEFAULT false,
  popular BOOLEAN DEFAULT false,
  ingredients TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Reservations table
CREATE TABLE reservations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  date DATE NOT NULL,
  time TIME NOT NULL,
  guests INTEGER NOT NULL,
  notes TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Gallery table
CREATE TABLE gallery (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  image TEXT,
  type TEXT DEFAULT 'image' CHECK (type IN ('image', 'video')),
  category TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Contact messages table
CREATE TABLE contact_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Settings table
CREATE TABLE settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  value TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default settings
INSERT INTO settings (key, value) VALUES
  ('restaurant_name', 'The Blacksmith'),
  ('address', '2 Rue des Orangers, Agadir 80000'),
  ('phone', '+212 8086 00401'),
  ('email', 'info@blacksmith-agadir.com'),
  ('opening_hours', '8:30 AM - 1:00 AM'),
  ('instagram', 'instagram.com/blacksmithagadir');

-- Create RLS policies
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Public read access for categories and menu_items
CREATE POLICY "Public can view categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Public can view menu items" ON menu_items FOR SELECT USING (true);
CREATE POLICY "Public can view gallery" ON gallery FOR SELECT USING (true);

-- Authenticated users can manage everything
CREATE POLICY "Authenticated can manage categories" ON categories FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated can manage menu items" ON menu_items FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated can manage reservations" ON reservations FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated can manage gallery" ON gallery FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated can manage messages" ON contact_messages FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated can manage settings" ON settings FOR ALL USING (auth.role() = 'authenticated');

-- Public can insert reservations and contact messages
CREATE POLICY "Public can create reservations" ON reservations FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can create messages" ON contact_messages FOR INSERT WITH CHECK (true);
