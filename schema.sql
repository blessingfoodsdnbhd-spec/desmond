-- 阿发水晶阁 CRM · Cloudflare D1 数据库结构
-- 在 Cloudflare 控制台 D1 的「Console」里整段粘贴执行，或用 wrangler d1 execute 导入。

CREATE TABLE IF NOT EXISTS products (
  id          TEXT PRIMARY KEY,
  name        TEXT NOT NULL,
  name_en     TEXT,
  image       TEXT,              -- base64 dataURL 或图片链接
  badge       TEXT,
  badge_en    TEXT,
  element     TEXT,
  keywords    TEXT,              -- JSON 数组字符串
  energy      TEXT,
  energy_en   TEXT,
  sizes       TEXT,              -- JSON: [{size, price}]
  crystal_id  TEXT,
  stock       INTEGER DEFAULT 0, -- 库存
  hidden      INTEGER DEFAULT 0,
  sort        INTEGER DEFAULT 0,
  updated_at  INTEGER
);

CREATE TABLE IF NOT EXISTS beads (
  id          TEXT PRIMARY KEY,
  name        TEXT NOT NULL,
  name_en     TEXT,
  photo       TEXT,
  category    TEXT,              -- JSON 数组
  element     TEXT,
  base_price  REAL,
  density     REAL,
  keywords    TEXT,              -- JSON 数组
  energy      TEXT,
  energy_en   TEXT,
  gradient    TEXT,              -- JSON
  stock       INTEGER DEFAULT 0,
  hidden      INTEGER DEFAULT 0,
  updated_at  INTEGER
);

-- 默认珠子/产品的编辑与隐藏（叠加在内置数据上）
CREATE TABLE IF NOT EXISTS overrides (
  scope   TEXT NOT NULL,   -- 'bead' | 'product'
  ref_id  TEXT NOT NULL,   -- 内置项 id
  patch   TEXT,            -- JSON，编辑内容
  hidden  INTEGER DEFAULT 0,
  PRIMARY KEY (scope, ref_id)
);

CREATE TABLE IF NOT EXISTS orders (
  id          TEXT PRIMARY KEY,
  name        TEXT,
  phone       TEXT,
  address     TEXT,
  items       TEXT,              -- JSON: 手链设计/产品明细
  summary     TEXT,              -- 文字摘要
  total       REAL DEFAULT 0,
  channel     TEXT,              -- 'web' | 'whatsapp'
  status      TEXT DEFAULT 'new',-- new | confirmed | paid | shipped | done | cancelled
  note        TEXT,
  created_at  INTEGER
);

CREATE TABLE IF NOT EXISTS customers (
  phone       TEXT PRIMARY KEY,
  name        TEXT,
  address     TEXT,
  note        TEXT,
  orders_count INTEGER DEFAULT 0,
  total_spent REAL DEFAULT 0,
  first_at    INTEGER,
  last_at     INTEGER
);

CREATE TABLE IF NOT EXISTS settings (
  key   TEXT PRIMARY KEY,
  value TEXT
);

-- 默认设置：WhatsApp 号码
INSERT OR IGNORE INTO settings (key, value) VALUES ('wa', '60127718812');

CREATE INDEX IF NOT EXISTS idx_orders_created ON orders (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_products_sort ON products (sort ASC);
