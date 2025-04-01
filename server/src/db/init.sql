-- 插入初始测试数据（不包含表创建）

-- 插入初始管理员用户
INSERT INTO users (username, name, email, password, role, status)
VALUES
  ('admin', '系统管理员', 'admin@example.com', '$2b$10$uOo5.C6z3qFtYJZwQHHUOurW6KFnO3OgrHvUxnH3z2PTgQe5Z4fHK', 'admin', 'active'),
  ('sales1', '销售一', 'sales1@example.com', '$2b$10$uOo5.C6z3qFtYJZwQHHUOurW6KFnO3OgrHvUxnH3z2PTgQe5Z4fHK', 'user', 'active'),
  ('sales2', '销售二', 'sales2@example.com', '$2b$10$uOo5.C6z3qFtYJZwQHHUOurW6KFnO3OgrHvUxnH3z2PTgQe5Z4fHK', 'user', 'active'),
  ('sales3', '销售三', 'sales3@example.com', '$2b$10$uOo5.C6z3qFtYJZwQHHUOurW6KFnO3OgrHvUxnH3z2PTgQe5Z4fHK', 'user', 'active'),
  ('manager1', '销售经理', 'manager1@example.com', '$2b$10$uOo5.C6z3qFtYJZwQHHUOurW6KFnO3OgrHvUxnH3z2PTgQe5Z4fHK', 'manager', 'active')
ON CONFLICT (email) DO NOTHING;

-- 插入测试团队
INSERT INTO teams (name, description)
VALUES
  ('销售一组', '负责华东区域客户'),
  ('销售二组', '负责华南区域客户'),
  ('销售三组', '负责华北区域客户')
ON CONFLICT DO NOTHING;

-- 插入测试团队成员
-- 销售一组 - 销售经理
INSERT INTO team_members (team_id, user_id, role)
SELECT t.id, u.id, 'admin'
FROM teams t, users u
WHERE t.name = '销售一组' AND u.email = 'manager1@example.com'
ON CONFLICT (team_id, user_id) DO NOTHING;

-- 销售一组 - 销售一
INSERT INTO team_members (team_id, user_id, role)
SELECT t.id, u.id, 'member'
FROM teams t, users u
WHERE t.name = '销售一组' AND u.email = 'sales1@example.com'
ON CONFLICT (team_id, user_id) DO NOTHING;

-- 销售二组 - 销售二
INSERT INTO team_members (team_id, user_id, role)
SELECT t.id, u.id, 'member'
FROM teams t, users u
WHERE t.name = '销售二组' AND u.email = 'sales2@example.com'
ON CONFLICT (team_id, user_id) DO NOTHING;

-- 销售三组 - 销售三
INSERT INTO team_members (team_id, user_id, role)
SELECT t.id, u.id, 'member'
FROM teams t, users u
WHERE t.name = '销售三组' AND u.email = 'sales3@example.com'
ON CONFLICT (team_id, user_id) DO NOTHING;

-- 所有团队 - 管理员
INSERT INTO team_members (team_id, user_id, role)
SELECT t.id, u.id, 'admin'
FROM teams t, users u
WHERE u.email = 'admin@example.com'
ON CONFLICT (team_id, user_id) DO NOTHING;