-- 为users表添加settings列
ALTER TABLE users ADD COLUMN IF NOT EXISTS settings JSONB DEFAULT '{}';