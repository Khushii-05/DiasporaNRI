CREATE TABLE IF NOT EXISTS admins (
  id SERIAL PRIMARY KEY,
  uid VARCHAR(128) UNIQUE,
  email VARCHAR(255) UNIQUE NOT NULL,
  role VARCHAR(64) DEFAULT 'admin',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS content_blocks (
  id SERIAL PRIMARY KEY,
  page VARCHAR(64) NOT NULL,
  key VARCHAR(128) NOT NULL,
  value TEXT DEFAULT '',
  value_type VARCHAR(32) DEFAULT 'text',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE (page, key)
);

CREATE TABLE IF NOT EXISTS contact_submissions (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(64),
  subject VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  media_name VARCHAR(255),
  media_type VARCHAR(128),
  media_size BIGINT,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Seed example admin (replace email/uid as needed)
-- INSERT INTO admins (uid, email, role, is_active)
-- VALUES ('FIREBASE_UID', 'tiwarihemant9@gmail.com', 'admin', true)
-- ON CONFLICT (email) DO NOTHING;
