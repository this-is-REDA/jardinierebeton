-- Allow multiple product photos per family + finish (gallery per color).
-- sort_order defines gallery order within each finish group.

COMMENT ON TABLE product_photos IS
  'Product gallery images. Multiple rows per (family_id, finish) are allowed; sort_order orders the gallery for that finish.';

CREATE INDEX IF NOT EXISTS idx_photos_family_finish_sort
  ON product_photos (family_id, finish, sort_order);
