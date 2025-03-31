import { NextResponse } from "next/server";

// 模拟数据
const mockOpportunities = [
  {
    id: "1",
    customerName: "阿里巴巴",
    contactPerson: "马云",
    expectedAmount: 1000000,
    status: "following",
    priority: "high",
    owner: "张三",
    createTime: "2024-03-20T10:00:00Z",
  },
  {
    id: "2",
    customerName: "腾讯科技",
    contactPerson: "马化腾",
    expectedAmount: 800000,
    status: "proposal",
    priority: "medium",
    owner: "李四",
    createTime: "2024-03-19T15:30:00Z",
  },
  {
    id: "3",
    customerName: "字节跳动",
    contactPerson: "张一鸣",
    expectedAmount: 1200000,
    status: "negotiation",
    priority: "high",
    owner: "王五",
    createTime: "2024-03-18T09:15:00Z",
  },
];

export async function GET() {
  return NextResponse.json(mockOpportunities);
}
