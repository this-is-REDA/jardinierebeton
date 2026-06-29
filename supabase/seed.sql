-- Données initiales — catalogue Jardinière Béton
-- Exécutez après schema.sql

INSERT INTO product_families (name, slug, sort_order) VALUES
  ('Jardinière Rectangle', 'jardiniere-rectangle', 1),
  ('Jardinière Carrée', 'jardiniere-carree', 2)
ON CONFLICT (slug) DO NOTHING;

-- Rectangle variants
INSERT INTO product_variants (family_id, model, length_cm, width_cm, height_cm, thickness_cm, weight_kg, price, sort_order)
SELECT f.id, v.model, v.length_cm, v.width_cm, v.height_cm, v.thickness_cm, v.weight_kg, v.price, v.sort_order
FROM product_families f
CROSS JOIN (VALUES
  ('Jardinière basse M', 80, 30, 40, 3, 46.2, 1386, 1),
  ('Jardinière basse L', 120, 30, 40, 3, 65, 1950, 2),
  ('Jardinière Standard S', 80, 35, 60, 3, 69, 2070, 3),
  ('Jardinière Standard M', 100, 35, 60, 3, 83, 2490, 4),
  ('Jardinière Standard L', 120, 35, 60, 3, 96, 2880, 5),
  ('Jardinière Ecran', 120, 40, 80, 3, 129, 3870, 6)
) AS v(model, length_cm, width_cm, height_cm, thickness_cm, weight_kg, price, sort_order)
WHERE f.slug = 'jardiniere-rectangle'
ON CONFLICT DO NOTHING;

-- Carrée variants
INSERT INTO product_variants (family_id, model, length_cm, width_cm, height_cm, thickness_cm, weight_kg, price, sort_order)
SELECT f.id, v.model, v.length_cm, v.width_cm, v.height_cm, v.thickness_cm, v.weight_kg, v.price, v.sort_order
FROM product_families f
CROSS JOIN (VALUES
  ('Jardinière carré M', 60, 60, 40, 3, 55, 1650, 1),
  ('Jardinière carré L', 80, 80, 40, 3, 81, 2430, 2)
) AS v(model, length_cm, width_cm, height_cm, thickness_cm, weight_kg, price, sort_order)
WHERE f.slug = 'jardiniere-carree'
ON CONFLICT DO NOTHING;

-- Photos
INSERT INTO product_photos (family_id, finish, image_url, sort_order)
SELECT f.id, p.finish, p.image_url, p.sort_order
FROM product_families f
CROSS JOIN (VALUES
  ('Gris Ciment', '/images/products/rectangle-gris-ciment.jpg', 1),
  ('Terracotta', '/images/products/rectangle-terracotta.jpg', 2),
  ('Sable', '/images/products/rectangle-sable.jpg', 3),
  ('Anthracite', '/images/products/rectangle-anthracite.jpg', 4),
  ('Ocre', '/images/products/rectangle-ocre.jpg', 5)
) AS p(finish, image_url, sort_order)
WHERE f.slug = 'jardiniere-rectangle'
ON CONFLICT DO NOTHING;

INSERT INTO product_photos (family_id, finish, image_url, sort_order)
SELECT f.id, 'Gris Ciment', '/images/products/carree-gris-ciment.jpg', 1
FROM product_families f
WHERE f.slug = 'jardiniere-carree'
ON CONFLICT DO NOTHING;

-- Finitions
INSERT INTO finishes (name, hex, sort_order) VALUES
  ('Gris Ciment', '#B8B2A7', 1),
  ('Anthracite', '#2A2A2A', 2),
  ('Terracotta', '#A85A3E', 3),
  ('Sable', '#C8B89A', 4),
  ('Ocre', '#C4A35A', 5),
  ('Bleu Atlas', '#4A6FA5', 6)
ON CONFLICT (name) DO NOTHING;

-- Paramètres site
INSERT INTO site_settings (key, value) VALUES
  ('brand', '{
    "email": "contact@jardinierebeton.ma",
    "whatsapp": "+212600000000",
    "whatsappMessage": "Bonjour, je souhaite des informations sur vos jardinières en béton.",
    "delivery": "Livraison partout au Maroc"
  }'::jsonb)
ON CONFLICT (key) DO NOTHING;
