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
  whatsapp TEXT DEFAULT '',
  youtube TEXT DEFAULT '',
  email TEXT DEFAULT '',
  updated_at TEXT DEFAULT (datetime('now'))
);
