ALTER TABLE restaurant_info ADD COLUMN whatsapp TEXT DEFAULT '';
ALTER TABLE restaurant_info ADD COLUMN youtube TEXT DEFAULT '';
ALTER TABLE restaurant_info ADD COLUMN email TEXT DEFAULT '';

UPDATE restaurant_info SET
  instagram = 'https://www.instagram.com',
  facebook  = 'https://www.facebook.com',
  x         = 'https://x.com',
  tiktok    = 'https://www.tiktok.com/',
  linkedin  = 'https://www.linkedin.com',
  whatsapp  = 'https://web.whatsapp.com/',
  youtube   = 'https://www.youtube.com/',
  email     = 'contacto@barmenu.com.ar',
  updated_at = datetime('now')
WHERE id = 1;
