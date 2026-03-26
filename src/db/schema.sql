-- Users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role VARCHAR(20) DEFAULT 'user',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Samples table
CREATE TABLE IF NOT EXISTS samples (
  id SERIAL PRIMARY KEY,
  sample_id VARCHAR(100) UNIQUE NOT NULL,
  
  -- Metadata (searchable columns)
  sample_name VARCHAR(255),
  sample_type VARCHAR(50),
  project_type VARCHAR(10),
  project_number VARCHAR(50),
  sample_number VARCHAR(50),
  dive_site VARCHAR(255),
  collector_name VARCHAR(255),
  collection_date DATE,
  latitude DECIMAL(10, 7),
  longitude DECIMAL(10, 7),
  storage_location VARCHAR(100),
  kingdom VARCHAR(100),
  genus VARCHAR(100),
  family VARCHAR(100),
  species VARCHAR(255),
  depth DECIMAL(6, 2),
  temperature DECIMAL(5, 2),
  substrate VARCHAR(100),
  sample_length DECIMAL(6, 2),

  -- Complex nested sections stored as JSONB
  morphology JSONB DEFAULT '{}',
  microbiology JSONB DEFAULT '{}',
  molecular JSONB DEFAULT '{}',
  publication JSONB DEFAULT '{"links": []}',

  -- Timestamps
  created_by INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Index for fast search
CREATE INDEX IF NOT EXISTS idx_samples_kingdom ON samples(kingdom);
CREATE INDEX IF NOT EXISTS idx_samples_project ON samples(project_type);
CREATE INDEX IF NOT EXISTS idx_samples_date ON samples(collection_date);
CREATE INDEX IF NOT EXISTS idx_samples_sample_type ON samples(sample_type);