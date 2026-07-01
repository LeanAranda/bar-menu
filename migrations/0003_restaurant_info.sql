CREATE TABLE IF NOT EXISTS restaurant_info (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  address TEXT NOT NULL DEFAULT '',
  phone TEXT NOT NULL DEFAULT '',
  hours TEXT NOT NULL DEFAULT '',
  instagram TEXT DEFAULT '',
  facebook TEXT DEFAULT '',
  x TEXT DEFAULT '',
  tiktok TEXT DEFAULT '',
  linkedin TEXT DEFAULT '',
  updated_at TEXT DEFAULT (datetime('now'))
);

INSERT INTO restaurant_info (name, description, address, phone, hours)
VALUES (
  'Bar Menu',
  'Descubrí nuestra propuesta gastronómica con los mejores platos y bebidas en un ambiente único.',
  'Av. Siempre Viva 123, Buenos Aires',
  '+54 11 5555-0123',
  'Lun–Jue 18:00–01:00 | Vie–Sáb 18:00–03:00 | Dom cerrado'
);