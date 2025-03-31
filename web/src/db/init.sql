BEGIN;

-- 清空所有表数据
DELETE FROM operation_logs;
DELETE FROM tasks;
DELETE FROM follow_ups;
DELETE FROM opportunities;
DELETE FROM team_members;
DELETE FROM teams;
DELETE FROM users;
DELETE FROM settings;

-- 插入管理员用户
INSERT INTO users (username, password, name, email, role, status)
VALUES
  ('admin', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '系统管理员', 'admin@aicrm.com', 'admin', 'active'),
  ('manager', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '销售总监', 'manager@aicrm.com', 'manager', 'active'),
  ('sales1', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '销售经理1', 'sales1@aicrm.com', 'user', 'active'),
  ('sales2', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '销售经理2', 'sales2@aicrm.com', 'user', 'active');

-- 插入团队
INSERT INTO teams (name, description, leader_id)
VALUES
  ('销售一部', '负责企业级客户销售', 2),
  ('销售二部', '负责中小企业客户销售', 2);

-- 插入团队成员
INSERT INTO team_members (team_id, user_id, role)
VALUES
  (1, 3, 'member'),
  (1, 4, 'member'),
  (2, 3, 'member'),
  (2, 4, 'member');

-- 插入商机
INSERT INTO opportunities (
  company_name,
  website,
  contact_person,
  contact_phone,
  contact_wechat,
  contact_department,
  contact_position,
  company_size,
  region,
  industry,
  progress,
  status,
  description,
  owner_id,
  team_id,
  expected_amount,
  priority,
  source,
  expected_close_date
)
VALUES
  (
    '云司',
    '',
    '谢志军',
    '13838078396',
    '13838078396',
    '运营',
    '运营',
    '50人以下',
    '郑州',
    '其他',
    'new',
    'active',
    '我想建知识库，必需本地部署才行吗？有没有简单一点的',
    3,
    2,
    50000.00,
    'medium',
    '客户咨询',
    '2025-03-31'
  ),
  (
    '中机六院',
    '',
    '薛刚',
    '18538713913',
    '18538713913',
    '',
    '研发经理',
    '200-500人',
    '河南郑州',
    '其他',
    'new',
    'active',
    '希望探讨业务合作，落地实际方案',
    4,
    1,
    100000.00,
    'high',
    '客户咨询',
    '2025-03-29'
  );

-- 插入跟进记录
INSERT INTO follow_ups (
  opportunity_id,
  type,
  content,
  result,
  next_plan,
  creator_id
)
VALUES
  (
    1,
    '电话沟通',
    '与客户沟通了知识库部署方案',
    '客户对云部署方案感兴趣',
    '准备详细的产品方案',
    3
  ),
  (
    2,
    '电话沟通',
    '与客户沟通了业务合作意向',
    '客户希望尽快见面详谈',
    '安排现场拜访',
    4
  );

-- 插入任务
INSERT INTO tasks (
  title,
  description,
  status,
  priority,
  due_date,
  assigned_to_id,
  opportunity_id,
  creator_id
)
VALUES
  (
    '准备产品方案',
    '为云司准备知识库产品方案',
    'pending',
    'medium',
    NOW() + INTERVAL '3 days',
    3,
    1,
    2
  ),
  (
    '安排现场拜访',
    '与中机六院安排现场拜访',
    'pending',
    'high',
    NOW() + INTERVAL '2 days',
    4,
    2,
    2
  );

-- 插入系统设置
INSERT INTO settings (key, value, description)
VALUES
  (
    'system.name',
    '{"value": "AI智能CRM系统"}',
    '系统名称'
  ),
  (
    'system.version',
    '{"value": "2.0.0"}',
    '系统版本'
  ),
  (
    'opportunity.status',
    '{"value": ["new", "contacted", "negotiating", "proposal", "closed_won", "closed_lost"]}',
    '商机状态选项'
  ),
  (
    'opportunity.priority',
    '{"value": ["low", "medium", "high"]}',
    '商机优先级选项'
  );

-- 插入操作日志
INSERT INTO operation_logs (
  user_id,
  action,
  target_type,
  target_id,
  details,
  ip,
  user_agent
)
VALUES
  (
    2,
    'create',
    'opportunity',
    1,
    '{"field": "company_name", "old_value": null, "new_value": "云司"}',
    '127.0.0.1',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
  ),
  (
    2,
    'create',
    'opportunity',
    2,
    '{"field": "company_name", "old_value": null, "new_value": "中机六院"}',
    '127.0.0.1',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
  );

COMMIT;