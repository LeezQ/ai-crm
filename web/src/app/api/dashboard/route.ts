import { NextResponse } from "next/server";

export async function GET() {
  try {
    // TODO: 从数据库获取仪表盘数据
    const data = {
      totalCustomers: 0,
      totalOrders: 0,
      totalRevenue: 0,
      recentOrders: [],
      recentCustomers: [],
    };

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
