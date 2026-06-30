-- ============================================
-- SCHEMA: Bar Menu DB (Cloudflare D1)
-- ============================================

-- Admin users table (login to the panel, username + password only)
CREATE TABLE IF NOT EXISTS admin_users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now')),
  last_login TEXT
);

-- Categories table (Starters, Main courses, Drinks, Desserts, etc.)
CREATE TABLE IF NOT EXISTS categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,   -- controls display order in the menu
  active BOOLEAN DEFAULT 1,       -- allows hiding a whole category without deleting it
  created_at TEXT DEFAULT (datetime('now'))
);

-- Products/menu items table
CREATE TABLE IF NOT EXISTS products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  category_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  price REAL NOT NULL,
  old_price REAL,                 -- optional: previous price, shown crossed-out to signal a deal
  is_offer BOOLEAN DEFAULT 0,     -- flags the product as an offer/deal, for filtering
  image_url TEXT,
  available BOOLEAN DEFAULT 1,    -- marks "out of stock" without deleting the product
  featured BOOLEAN DEFAULT 0,     -- optional: highlight as "dish of the day" or special
  sort_order INTEGER DEFAULT 0,   -- order within its category
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);

-- Indexes for the most common queries
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_available ON products(available);
CREATE INDEX IF NOT EXISTS idx_products_offer ON products(is_offer);
CREATE INDEX IF NOT EXISTS idx_categories_active ON categories(active);

-- ============================================
-- SAMPLE DATA (optional, for testing)
-- ============================================

INSERT INTO categories (name, sort_order) VALUES
  ('Starters', 1),
  ('Main courses', 2),
  ('Drinks', 3),
  ('Desserts', 4);

INSERT INTO products (category_id, name, description, price, old_price, is_offer, sort_order) VALUES
  (1, 'Empanadas (x3)', 'Beef, chicken or ham and cheese', 4500, NULL, 0, 1),
  (1, 'Cold cuts board', 'Selection of cheeses and cured meats', 8900, NULL, 0, 2),
  (2, 'Milanesa napolitana', 'Served with fries', 12500, 14000, 1, 1),
  (2, 'Full burger', 'Double patty, cheddar, bacon', 11000, NULL, 0, 2),
  (3, 'Craft IPA beer', '500ml', 3500, NULL, 0, 1),
  (3, 'Lemonade', 'With mint and ginger', 2800, NULL, 0, 2),
  (4, 'Homemade flan', 'With dulce de leche and cream', 3200, NULL, 0, 1);