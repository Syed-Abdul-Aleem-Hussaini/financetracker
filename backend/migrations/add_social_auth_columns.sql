-- Add provider and uid columns to tbluser table
ALTER TABLE tbluser
ADD COLUMN IF NOT EXISTS provider VARCHAR(50) DEFAULT 'local',
ADD COLUMN IF NOT EXISTS uid VARCHAR(255) DEFAULT NULL; 