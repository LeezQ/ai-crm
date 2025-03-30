export default function MarketingPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">营销中心</h1>
        <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg flex items-center">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
          创建营销活动
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-gray-500 text-sm font-medium">活跃营销活动</h2>
          <p className="text-2xl font-bold mt-2">8</p>
          <div className="flex items-center mt-2">
            <span className="text-green-500 text-sm font-medium">↑ 2</span>
            <span className="text-gray-400 text-sm ml-2">同比上月</span>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-gray-500 text-sm font-medium">本月营销投入</h2>
          <p className="text-2xl font-bold mt-2">¥85,200</p>
          <div className="flex items-center mt-2">
            <span className="text-green-500 text-sm font-medium">↑ 15%</span>
            <span className="text-gray-400 text-sm ml-2">同比上月</span>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-gray-500 text-sm font-medium">转化率</h2>
          <p className="text-2xl font-bold mt-2">4.2%</p>
          <div className="flex items-center mt-2">
            <span className="text-green-500 text-sm font-medium">↑ 0.8%</span>
            <span className="text-gray-400 text-sm ml-2">同比上月</span>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-gray-500 text-sm font-medium">营销ROI</h2>
          <p className="text-2xl font-bold mt-2">3.5x</p>
          <div className="flex items-center mt-2">
            <span className="text-green-500 text-sm font-medium">↑ 0.2x</span>
            <span className="text-gray-400 text-sm ml-2">同比上月</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-medium">营销活动</h2>
              <div className="flex space-x-2">
                <div className="relative">
                  <input type="text" placeholder="搜索..." className="pl-8 pr-4 py-1 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                  <svg className="w-4 h-4 absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                  </svg>
                </div>
                <select className="text-sm border border-gray-300 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option>所有状态</option>
                  <option>活跃</option>
                  <option>计划中</option>
                  <option>已结束</option>
                </select>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">活动名称</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">渠道</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">状态</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">开始日期</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">预算</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">转化</th>
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">操作</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {[
                    {
                      name: "2023年终促销",
                      channel: "电子邮件",
                      status: { name: "活跃", color: "green" },
                      date: "2023-12-01",
                      budget: "¥25,000",
                      conversion: "5.2%"
                    },
                    {
                      name: "新品上市推广",
                      channel: "社交媒体",
                      status: { name: "活跃", color: "green" },
                      date: "2023-11-15",
                      budget: "¥18,000",
                      conversion: "3.8%"
                    },
                    {
                      name: "行业展会推广",
                      channel: "线下活动",
                      status: { name: "计划中", color: "yellow" },
                      date: "2024-01-10",
                      budget: "¥35,000",
                      conversion: "-"
                    },
                    {
                      name: "客户回馈活动",
                      channel: "短信/微信",
                      status: { name: "活跃", color: "green" },
                      date: "2023-11-20",
                      budget: "¥12,000",
                      conversion: "6.5%"
                    },
                    {
                      name: "品牌知名度提升",
                      channel: "广告投放",
                      status: { name: "活跃", color: "green" },
                      date: "2023-10-01",
                      budget: "¥50,000",
                      conversion: "2.1%"
                    }
                  ].map((campaign, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-blue-600 hover:text-blue-900 cursor-pointer">{campaign.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{campaign.channel}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-${campaign.status.color}-100 text-${campaign.status.color}-800`}>
                          {campaign.status.name}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {campaign.date}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {campaign.budget}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {campaign.conversion}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <a href="#" className="text-blue-600 hover:text-blue-900 mr-3">详情</a>
                        <button className="text-gray-600 hover:text-gray-900">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"></path>
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-6 py-3 flex justify-between items-center border-t border-gray-200">
              <div className="text-sm text-gray-500">
                显示 1-5 条，共 12 条
              </div>
              <div className="flex">
                <button className="border border-gray-300 rounded-l-lg px-3 py-1 bg-white hover:bg-gray-50 text-gray-500">上一页</button>
                <button className="border-t border-b border-r border-gray-300 px-3 py-1 bg-blue-600 text-white">1</button>
                <button className="border-t border-b border-r border-gray-300 px-3 py-1 bg-white hover:bg-gray-50 text-gray-500">2</button>
                <button className="border-t border-b border-r border-gray-300 px-3 py-1 bg-white hover:bg-gray-50 text-gray-500">3</button>
                <button className="border-t border-b border-r border-gray-300 rounded-r-lg px-3 py-1 bg-white hover:bg-gray-50 text-gray-500">下一页</button>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="bg-white rounded-lg shadow mb-6">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-medium">渠道绩效</h2>
            </div>
            <div className="p-4">
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">电子邮件</span>
                    <span className="text-sm font-medium">5.2%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '78%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">社交媒体</span>
                    <span className="text-sm font-medium">3.8%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-purple-600 h-2.5 rounded-full" style={{ width: '57%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">线下活动</span>
                    <span className="text-sm font-medium">8.5%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-green-600 h-2.5 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">短信/微信</span>
                    <span className="text-sm font-medium">6.5%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-yellow-500 h-2.5 rounded-full" style={{ width: '65%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">广告投放</span>
                    <span className="text-sm font-medium">2.1%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-red-500 h-2.5 rounded-full" style={{ width: '35%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-medium">AI营销洞察</h2>
            </div>
            <div className="p-4 space-y-4">
              <div className="border-l-4 border-blue-500 pl-3 py-1">
                <p className="text-sm">电子邮件营销在B2B客户中效果最佳，建议增加预算投入</p>
              </div>
              <div className="border-l-4 border-green-500 pl-3 py-1">
                <p className="text-sm">周二和周四9-11点发送邮件的打开率最高</p>
              </div>
              <div className="border-l-4 border-red-500 pl-3 py-1">
                <p className="text-sm">广告投放ROI低于平均水平，建议调整目标受众</p>
              </div>
              <div className="border-l-4 border-yellow-500 pl-3 py-1">
                <p className="text-sm">《新品上市推广》活动可通过个性化内容提高转化率</p>
              </div>
              <div className="border-l-4 border-purple-500 pl-3 py-1">
                <p className="text-sm">建议将制造业客户作为下一季度的重点营销对象</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-medium">受众细分</h2>
          </div>
          <div className="p-4">
            <div className="space-y-4">
              <div className="border p-3 rounded-lg hover:bg-gray-50">
                <div className="flex justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">高价值客户</h3>
                    <p className="text-xs text-gray-500 mt-1">年采购额超过50万的客户</p>
                  </div>
                  <div className="text-sm text-gray-900">68位客户</div>
                </div>
                <div className="mt-2 flex justify-between text-xs text-gray-500">
                  <span>上次更新: 昨天</span>
                  <span>转化率: 12.5%</span>
                </div>
              </div>
              <div className="border p-3 rounded-lg hover:bg-gray-50">
                <div className="flex justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">潜在大客户</h3>
                    <p className="text-xs text-gray-500 mt-1">有升级潜力的中型客户</p>
                  </div>
                  <div className="text-sm text-gray-900">124位客户</div>
                </div>
                <div className="mt-2 flex justify-between text-xs text-gray-500">
                  <span>上次更新: 3天前</span>
                  <span>转化率: 8.2%</span>
                </div>
              </div>
              <div className="border p-3 rounded-lg hover:bg-gray-50">
                <div className="flex justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">互联网行业</h3>
                    <p className="text-xs text-gray-500 mt-1">所有互联网行业的客户</p>
                  </div>
                  <div className="text-sm text-gray-900">215位客户</div>
                </div>
                <div className="mt-2 flex justify-between text-xs text-gray-500">
                  <span>上次更新: 1周前</span>
                  <span>转化率: 5.8%</span>
                </div>
              </div>
              <div className="border p-3 rounded-lg hover:bg-gray-50">
                <div className="flex justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">新增客户</h3>
                    <p className="text-xs text-gray-500 mt-1">过去3个月新增的客户</p>
                  </div>
                  <div className="text-sm text-gray-900">93位客户</div>
                </div>
                <div className="mt-2 flex justify-between text-xs text-gray-500">
                  <span>上次更新: 今天</span>
                  <span>转化率: 4.2%</span>
                </div>
              </div>
            </div>
            <button className="w-full mt-4 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-200 text-sm font-medium">查看所有细分</button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-medium">内容库</h2>
          </div>
          <div className="p-4">
            <div className="mb-4 flex justify-between items-center">
              <input type="text" placeholder="搜索内容..." className="pl-3 pr-4 py-2 border border-gray-300 rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <select className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>所有类型</option>
                <option>电子邮件</option>
                <option>社交媒体</option>
                <option>白皮书</option>
                <option>案例研究</option>
              </select>
            </div>
            <div className="space-y-4">
              <div className="border rounded-lg overflow-hidden">
                <div className="p-3 bg-gray-50 border-b flex justify-between items-center">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                    </svg>
                    <span className="text-sm font-medium">电子邮件</span>
                  </div>
                  <span className="text-xs text-gray-500">2023-12-01</span>
                </div>
                <div className="p-3">
                  <h3 className="text-sm font-medium text-gray-900">年终促销邮件模板</h3>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">面向所有客户的年终促销活动邮件，包含折扣信息和限时优惠。</p>
                  <div className="mt-2 flex justify-between">
                    <div className="flex space-x-2">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">促销</span>
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">已审核</span>
                    </div>
                    <button className="text-blue-600 hover:text-blue-900 text-xs">查看</button>
                  </div>
                </div>
              </div>
              <div className="border rounded-lg overflow-hidden">
                <div className="p-3 bg-gray-50 border-b flex justify-between items-center">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-purple-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"></path>
                    </svg>
                    <span className="text-sm font-medium">社交媒体</span>
                  </div>
                  <span className="text-xs text-gray-500">2023-11-25</span>
                </div>
                <div className="p-3">
                  <h3 className="text-sm font-medium text-gray-900">新品发布海报</h3>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">新产品系列的社交媒体宣传图片和文案，适用于微信、微博等平台。</p>
                  <div className="mt-2 flex justify-between">
                    <div className="flex space-x-2">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">新品</span>
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">已审核</span>
                    </div>
                    <button className="text-blue-600 hover:text-blue-900 text-xs">查看</button>
                  </div>
                </div>
              </div>
              <div className="border rounded-lg overflow-hidden">
                <div className="p-3 bg-gray-50 border-b flex justify-between items-center">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-yellow-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                    <span className="text-sm font-medium">白皮书</span>
                  </div>
                  <span className="text-xs text-gray-500">2023-11-15</span>
                </div>
                <div className="p-3">
                  <h3 className="text-sm font-medium text-gray-900">行业趋势分析报告</h3>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">2024年行业发展趋势预测，包含市场分析和战略建议。</p>
                  <div className="mt-2 flex justify-between">
                    <div className="flex space-x-2">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">分析</span>
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">待审核</span>
                    </div>
                    <button className="text-blue-600 hover:text-blue-900 text-xs">查看</button>
                  </div>
                </div>
              </div>
            </div>
            <button className="w-full mt-4 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-200 text-sm font-medium">查看所有内容</button>
          </div>
        </div>
      </div>
    </div>
  );
}