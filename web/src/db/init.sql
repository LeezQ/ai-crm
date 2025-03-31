-- 插入管理员用户
INSERT INTO users (username, password, name, email, role, status)
VALUES
  ('admin', '$2b$10$YourHashedPasswordHere', '系统管理员', 'admin@example.com', 'admin', 'active'),
  ('manager', '$2b$10$YourHashedPasswordHere', '销售经理', 'manager@example.com', 'manager', 'active'),
  ('sales1', '$2b$10$YourHashedPasswordHere', '销售代表1', 'sales1@example.com', 'user', 'active'),
  ('sales2', '$2b$10$YourHashedPasswordHere', '销售代表2', 'sales2@example.com', 'user', 'active');

-- 插入团队
INSERT INTO teams (name, description, leader_id)
VALUES
  ('销售团队A', '负责华东地区销售', 2),
  ('销售团队B', '负责华南地区销售', 2);

-- 插入团队成员
INSERT INTO team_members (team_id, user_id, role)
VALUES
  (1, 3, 'member'),
  (1, 4, 'member'),
  (2, 3, 'member'),
  (2, 4, 'member');

-- 插入商机
INSERT INTO opportunities (
  customer_name,
  contact_person,
  contact_phone,
  contact_email,
  expected_amount,
  status,
  priority,
  owner_id,
  team_id,
  description,
  source,
  expected_close_date
)
VALUES
  (
    '科技有限公司',
    '张三',
    '13800138000',
    'zhangsan@tech.com',
    100000.00,
    'new',
    'high',
    3,
    1,
    '企业管理系统项目',
    '客户推荐',
    NOW() + INTERVAL '30 days'
  ),
  (
    '互联网公司',
    '李四',
    '13800138001',
    'lisi@internet.com',
    50000.00,
    'negotiating',
    'medium',
    4,
    2,
    '网站开发项目',
    '电话营销',
    NOW() + INTERVAL '45 days'
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
    '与客户进行了初步沟通，了解了项目需求',
    '客户对产品表示兴趣',
    '准备详细的产品方案',
    3
  ),
  (
    2,
    '邮件沟通',
    '发送了产品介绍邮件',
    '等待客户反馈',
    '安排视频会议',
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
    '为科技有限公司准备详细的产品方案',
    'pending',
    'high',
    NOW() + INTERVAL '3 days',
    3,
    1,
    2
  ),
  (
    '安排视频会议',
    '与互联网公司安排产品演示视频会议',
    'pending',
    'medium',
    NOW() + INTERVAL '5 days',
    4,
    2,
    2
  );

-- 插入系统设置
INSERT INTO settings (key, value, description)
VALUES
  (
    'system.name',
    '{"value": "AI CRM系统"}',
    '系统名称'
  ),
  (
    'system.version',
    '{"value": "1.0.0"}',
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
    1,
    'create',
    'opportunity',
    1,
    '{"field": "customer_name", "old_value": null, "new_value": "科技有限公司"}',
    '127.0.0.1',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
  ),
  (
    2,
    'update',
    'opportunity',
    2,
    '{"field": "status", "old_value": "new", "new_value": "negotiating"}',
    '127.0.0.1',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
  );