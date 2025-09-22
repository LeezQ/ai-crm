import "dotenv/config";
import { db } from "./index";
import { users, teams, teamMembers, opportunities, followUps } from "./schema";
import bcrypt from "bcryptjs";

async function seed() {
  console.log("🌱 开始初始化数据...");

  try {
    // 创建用户
    console.log("创建用户...");
    const hashedPassword = await bcrypt.hash("123456", 10);

    const insertedUsers = await db.insert(users).values([
      {
        name: "管理员",
        email: "admin@example.com",
        password: hashedPassword,
        role: "admin",
        phone: "13800138000",
        status: "active",
      },
      {
        name: "张三",
        email: "zhangsan@example.com",
        password: hashedPassword,
        role: "user",
        phone: "13800138001",
        status: "active",
      },
      {
        name: "李四",
        email: "lisi@example.com",
        password: hashedPassword,
        role: "user",
        phone: "13800138002",
        status: "active",
      },
      {
        name: "王五",
        email: "wangwu@example.com",
        password: hashedPassword,
        role: "user",
        phone: "13800138003",
        status: "active",
      },
    ]).returning();

    // 创建团队
    console.log("创建团队...");
    const insertedTeams = await db.insert(teams).values([
      {
        name: "销售一部",
        description: "负责华东地区的销售业务",
      },
      {
        name: "销售二部",
        description: "负责华南地区的销售业务",
      },
      {
        name: "客户成功部",
        description: "负责客户售后服务和续约",
      },
    ]).returning();

    // 创建团队成员关系
    console.log("分配团队成员...");
    await db.insert(teamMembers).values([
      {
        teamId: insertedTeams[0].id,
        userId: insertedUsers[1].id, // 张三
        role: "admin",
      },
      {
        teamId: insertedTeams[0].id,
        userId: insertedUsers[2].id, // 李四
        role: "member",
      },
      {
        teamId: insertedTeams[1].id,
        userId: insertedUsers[3].id, // 王五
        role: "admin",
      },
      {
        teamId: insertedTeams[2].id,
        userId: insertedUsers[2].id, // 李四
        role: "member",
      },
    ]);

    // 创建商机
    console.log("创建商机数据...");
    const insertedOpportunities = await db.insert(opportunities).values([
      {
        companyName: "阿里巴巴集团",
        website: "https://www.alibaba.com",
        contactPerson: "马云",
        contactPhone: "13900000001",
        contactWechat: "mayun_ali",
        contactDepartment: "战略部",
        contactPosition: "总监",
        companySize: "10000+",
        region: "浙江",
        industry: "电子商务",
        progress: "proposal",
        status: "active",
        priority: "high",
        description: "阿里巴巴集团CRM系统升级项目，预计包含供应链、客户管理、数据分析等模块",
        source: "主动开发",
        expectedAmount: "5000000",
        expectedCloseDate: new Date("2024-06-30"),
        nextFollowUpAt: new Date("2024-02-15"),
        nextFollowUpNote: "确认技术方案细节",
        ownerId: insertedUsers[1].id,
        teamId: insertedTeams[0].id,
      },
      {
        companyName: "腾讯科技",
        website: "https://www.tencent.com",
        contactPerson: "张小龙",
        contactPhone: "13900000002",
        contactWechat: "zhangxiaolong_wx",
        contactDepartment: "微信事业部",
        contactPosition: "产品经理",
        companySize: "10000+",
        region: "广东",
        industry: "互联网",
        progress: "negotiation",
        status: "active",
        priority: "high",
        description: "微信生态商户管理系统，整合小程序、公众号、企业微信等渠道",
        source: "合作伙伴推荐",
        expectedAmount: "3000000",
        expectedCloseDate: new Date("2024-05-31"),
        nextFollowUpAt: new Date("2024-02-10"),
        nextFollowUpNote: "商务条款谈判",
        ownerId: insertedUsers[1].id,
        teamId: insertedTeams[0].id,
      },
      {
        companyName: "字节跳动",
        website: "https://www.bytedance.com",
        contactPerson: "张一鸣",
        contactPhone: "13900000003",
        contactWechat: "zhangyiming_byte",
        contactDepartment: "商业化部门",
        contactPosition: "副总裁",
        companySize: "10000+",
        region: "北京",
        industry: "互联网",
        progress: "initial",
        status: "active",
        priority: "medium",
        description: "抖音电商CRM平台建设，包含商家管理、用户分析、营销自动化等功能",
        source: "市场活动",
        expectedAmount: "2000000",
        expectedCloseDate: new Date("2024-07-31"),
        nextFollowUpAt: new Date("2024-02-08"),
        nextFollowUpNote: "初步需求沟通",
        ownerId: insertedUsers[2].id,
        teamId: insertedTeams[0].id,
      },
      {
        companyName: "美团",
        website: "https://www.meituan.com",
        contactPerson: "王兴",
        contactPhone: "13900000004",
        contactWechat: "wangxing_mt",
        contactDepartment: "到店事业部",
        contactPosition: "总经理",
        companySize: "10000+",
        region: "北京",
        industry: "生活服务",
        progress: "closed_won",
        status: "closed",
        priority: "high",
        description: "美团商家CRM系统一期已完成交付",
        source: "老客户",
        expectedAmount: "1500000",
        expectedCloseDate: new Date("2024-01-31"),
        ownerId: insertedUsers[1].id,
        teamId: insertedTeams[0].id,
      },
      {
        companyName: "京东集团",
        website: "https://www.jd.com",
        contactPerson: "刘强东",
        contactPhone: "13900000005",
        contactWechat: "liuqiangdong_jd",
        contactDepartment: "技术部",
        contactPosition: "CTO",
        companySize: "10000+",
        region: "北京",
        industry: "电子商务",
        progress: "qualification",
        status: "active",
        priority: "medium",
        description: "京东物流客户管理系统升级",
        source: "招投标",
        expectedAmount: "2500000",
        expectedCloseDate: new Date("2024-08-31"),
        nextFollowUpAt: new Date("2024-02-20"),
        nextFollowUpNote: "准备投标材料",
        ownerId: insertedUsers[3].id,
        teamId: insertedTeams[1].id,
      },
      {
        companyName: "小米科技",
        website: "https://www.mi.com",
        contactPerson: "雷军",
        contactPhone: "13900000006",
        contactWechat: "leijun_mi",
        contactDepartment: "IoT部门",
        contactPosition: "总监",
        companySize: "5000-10000",
        region: "北京",
        industry: "消费电子",
        progress: "initial",
        status: "active",
        priority: "low",
        description: "小米智能家居用户管理平台",
        source: "电话营销",
        expectedAmount: "800000",
        expectedCloseDate: new Date("2024-09-30"),
        nextFollowUpAt: new Date("2024-02-25"),
        nextFollowUpNote: "发送产品资料",
        ownerId: insertedUsers[2].id,
        teamId: insertedTeams[2].id,
      },
    ]).returning();

    // 创建跟进记录
    console.log("创建跟进记录...");
    await db.insert(followUps).values([
      {
        opportunityId: insertedOpportunities[0].id,
        type: "phone",
        content: "与马总电话沟通，确认了项目预算和时间节点",
        result: "客户对方案很感兴趣，要求提供详细的技术架构",
        nextPlan: "下周二进行技术方案演示",
        creatorId: insertedUsers[1].id,
      },
      {
        opportunityId: insertedOpportunities[0].id,
        type: "meeting",
        content: "在阿里总部进行了技术交流会",
        result: "技术方案得到认可，进入商务谈判阶段",
        nextPlan: "准备商务标书",
        creatorId: insertedUsers[1].id,
      },
      {
        opportunityId: insertedOpportunities[1].id,
        type: "email",
        content: "发送了详细的产品介绍和案例",
        result: "客户要求补充金融行业的成功案例",
        nextPlan: "整理金融行业案例，下周一发送",
        creatorId: insertedUsers[1].id,
      },
      {
        opportunityId: insertedOpportunities[2].id,
        type: "wechat",
        content: "微信初步沟通需求",
        result: "客户表示有兴趣，约定下周详谈",
        nextPlan: "准备需求调研问卷",
        creatorId: insertedUsers[2].id,
      },
      {
        opportunityId: insertedOpportunities[4].id,
        type: "visit",
        content: "拜访京东总部，了解详细需求",
        result: "需求明确，准备参与招投标",
        nextPlan: "组建投标团队，准备标书",
        creatorId: insertedUsers[3].id,
      },
    ]);

    console.log("✅ 数据初始化完成！");
    console.log("\n📊 初始化数据统计:");
    console.log(`- 用户: ${insertedUsers.length} 个`);
    console.log(`- 团队: ${insertedTeams.length} 个`);
    console.log(`- 商机: ${insertedOpportunities.length} 个`);
    console.log("\n🔑 测试账号:");
    console.log("- 管理员: admin@example.com / 123456");
    console.log("- 用户1: zhangsan@example.com / 123456");
    console.log("- 用户2: lisi@example.com / 123456");
    console.log("- 用户3: wangwu@example.com / 123456");

  } catch (error) {
    console.error("❌ 初始化数据失败:", error);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

seed();