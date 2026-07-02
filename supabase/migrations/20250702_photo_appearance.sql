-- Apparence d'affichage des photos produit (cadrage, zoom, position)
ALTER TABLE product_photos
  ADD COLUMN IF NOT EXISTS appearance JSONB NOT NULL DEFAULT '{
    "fit": "contain",
    "scale": 100,
    "positionX": 50,
    "positionY": 50
  }'::jsonb;
