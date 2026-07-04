-- Schéma Supabase pour Jardinière Béton
-- Exécutez ce script dans l'éditeur SQL de votre projet Supabase

-- Familles de produits (Rectangle, Carrée)
CREATE TABLE IF NOT EXISTS product_families (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Variantes / tarifs catalogue
CREATE TABLE IF NOT EXISTS product_variants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id UUID NOT NULL REFERENCES product_families(id) ON DELETE CASCADE,
  model TEXT NOT NULL,
  length_cm NUMERIC(8, 1) NOT NULL,
  width_cm NUMERIC(8, 1) NOT NULL,
  height_cm NUMERIC(8, 1) NOT NULL,
  thickness_cm NUMERIC(8, 1) NOT NULL DEFAULT 3,
  weight_kg NUMERIC(8, 1) NOT NULL,
  price NUMERIC(10, 2) NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Photos produits par finition
CREATE TABLE IF NOT EXISTS product_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id UUID NOT NULL REFERENCES product_families(id) ON DELETE CASCADE,
  finish TEXT NOT NULL,
  image_url TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  appearance JSONB NOT NULL DEFAULT '{
    "fit": "contain",
    "scale": 100,
    "positionX": 50,
    "positionY": 50
  }'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Finitions (footer, référence)
CREATE TABLE IF NOT EXISTS finishes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  hex TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0
);

-- Paramètres site (email, whatsapp, etc.)
CREATE TABLE IF NOT EXISTS site_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Demandes de contact
CREATE TABLE IF NOT EXISTS contact_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT NOT NULL,
  product_id UUID,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Index
CREATE INDEX IF NOT EXISTS idx_variants_family ON product_variants(family_id);
CREATE INDEX IF NOT EXISTS idx_photos_family ON product_photos(family_id);
CREATE INDEX IF NOT EXISTS idx_variants_sort ON product_variants(sort_order);
CREATE INDEX IF NOT EXISTS idx_photos_sort ON product_photos(sort_order);

-- RLS
ALTER TABLE product_families ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE finishes ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_requests ENABLE ROW LEVEL SECURITY;

-- Lecture publique
CREATE POLICY "Public read families" ON product_families FOR SELECT USING (true);
CREATE POLICY "Public read variants" ON product_variants FOR SELECT USING (true);
CREATE POLICY "Public read photos" ON product_photos FOR SELECT USING (true);
CREATE POLICY "Public read finishes" ON finishes FOR SELECT USING (true);
CREATE POLICY "Public read settings" ON site_settings FOR SELECT USING (true);

-- Insertion contact (site public)
CREATE POLICY "Public insert contact" ON contact_requests FOR INSERT WITH CHECK (true);

-- Admin : utilisateurs authentifiés Supabase Auth
CREATE POLICY "Admin all families" ON product_families FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin all variants" ON product_variants FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin all photos" ON product_photos FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin all finishes" ON finishes FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin all settings" ON site_settings FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin read contacts" ON contact_requests FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admin delete contacts" ON contact_requests FOR DELETE TO authenticated USING (true);

-- Storage : bucket pour images produits
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public read product images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'product-images');

CREATE POLICY "Admin upload product images"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'product-images');

CREATE POLICY "Admin update product images"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'product-images');

CREATE POLICY "Admin delete product images"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'product-images');
