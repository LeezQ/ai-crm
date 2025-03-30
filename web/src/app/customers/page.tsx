export default function CustomersPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">客户管理</h1>
        <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg flex items-center">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
          添加客户
        </button>
      </div>

      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 space-y-3 sm:space-y-0">
          <div className="relative w-full sm:w-64">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
            <input type="text" placeholder="搜索客户..." className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="flex space-x-2 w-full sm:w-auto">
            <select className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>所有客户</option>
              <option>活跃客户</option>
              <option>潜在客户</option>
              <option>流失风险</option>
            </select>
            <select className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>所有行业</option>
              <option>互联网</option>
              <option>制造业</option>
              <option>金融业</option>
              <option>教育行业</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  客户名称
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  行业
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  状态
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  客户价值
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  上次互动
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  负责人
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">操作</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {Array.from({ length: 10 }).map((_, index) => {
                // 随机数据生成
                const company = ['北京数字科技有限公司', '上海科技有限公司', '广州电子科技有限公司', '深圳互联网科技有限公司', '杭州科技有限公司'][index % 5];
                const firstChar = company.charAt(0);
                const industry = ['互联网', '制造业', '电子行业', '金融业', '教育行业'][index % 5];
                const status = [
                  { name: '活跃', color: 'green' },
                  { name: '潜在', color: 'blue' },
                  { name: '流失风险', color: 'red' },
                  { name: '新客户', color: 'purple' },
                  { name: '沉睡', color: 'yellow' }
                ][index % 5];
                const value = ['高', '中', '低'][index % 3];
                const valueColor = {
                  '高': 'text-green-600',
                  '中': 'text-yellow-600',
                  '低': 'text-gray-600'
                }[value];
                const lastContact = ['今天', '昨天', '3天前', '1周前', '2周前'][index % 5];
                const manager = ['王经理', '李经理', '张经理', '赵经理', '陈经理'][index % 5];

                return (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className={`flex-shrink-0 h-10 w-10 flex items-center justify-center bg-${['blue', 'purple', 'red', 'green', 'yellow'][index % 5]}-100 rounded-full`}>
                          <span className={`text-${['blue', 'purple', 'red', 'green', 'yellow'][index % 5]}-800 font-semibold`}>{firstChar}</span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{company}</div>
                          <div className="text-sm text-gray-500">客户ID: CRM-{1000 + index}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {industry}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-${status.color}-100 text-${status.color}-800`}>
                        {status.name}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <span className={valueColor}>{value}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {lastContact}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {manager}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <a href={`/customers/${1000 + index}`} className="text-blue-600 hover:text-blue-900 mr-3">详情</a>
                      <button className="text-gray-600 hover:text-gray-900">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"></path>
                        </svg>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="flex justify-between items-center mt-4">
          <div className="text-sm text-gray-500">
            显示 1-10 条，共 50 条
          </div>
          <div className="flex">
            <button className="border border-gray-300 rounded-l-lg px-3 py-1 bg-white hover:bg-gray-50 text-gray-500">上一页</button>
            <button className="border-t border-b border-r border-gray-300 px-3 py-1 bg-blue-600 text-white">1</button>
            <button className="border-t border-b border-r border-gray-300 px-3 py-1 bg-white hover:bg-gray-50 text-gray-500">2</button>
            <button className="border-t border-b border-r border-gray-300 px-3 py-1 bg-white hover:bg-gray-50 text-gray-500">3</button>
            <button className="border-t border-b border-r border-gray-300 px-3 py-1 bg-white hover:bg-gray-50 text-gray-500">4</button>
            <button className="border-t border-b border-r border-gray-300 px-3 py-1 bg-white hover:bg-gray-50 text-gray-500">5</button>
            <button className="border-t border-b border-r border-gray-300 rounded-r-lg px-3 py-1 bg-white hover:bg-gray-50 text-gray-500">下一页</button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-medium mb-4">客户按行业分布</h2>
          <div className="space-y-4">
            <div className="relative pt-1">
              <div className="flex mb-2 items-center justify-between">
                <div className="text-sm font-medium text-gray-900">互联网</div>
                <div className="text-sm font-medium text-gray-500">32%</div>
              </div>
              <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
                <div style={{ width: "32%" }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"></div>
              </div>
            </div>
            <div className="relative pt-1">
              <div className="flex mb-2 items-center justify-between">
                <div className="text-sm font-medium text-gray-900">制造业</div>
                <div className="text-sm font-medium text-gray-500">28%</div>
              </div>
              <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
                <div style={{ width: "28%" }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500"></div>
              </div>
            </div>
            <div className="relative pt-1">
              <div className="flex mb-2 items-center justify-between">
                <div className="text-sm font-medium text-gray-900">金融业</div>
                <div className="text-sm font-medium text-gray-500">18%</div>
              </div>
              <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
                <div style={{ width: "18%" }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-yellow-500"></div>
              </div>
            </div>
            <div className="relative pt-1">
              <div className="flex mb-2 items-center justify-between">
                <div className="text-sm font-medium text-gray-900">医疗健康</div>
                <div className="text-sm font-medium text-gray-500">12%</div>
              </div>
              <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
                <div style={{ width: "12%" }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-red-500"></div>
              </div>
            </div>
            <div className="relative pt-1">
              <div className="flex mb-2 items-center justify-between">
                <div className="text-sm font-medium text-gray-900">其他</div>
                <div className="text-sm font-medium text-gray-500">10%</div>
              </div>
              <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
                <div style={{ width: "10%" }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-purple-500"></div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-medium mb-4">客户状态统计</h2>
          <div className="space-y-4">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              <div className="text-sm text-gray-900">活跃客户</div>
              <div className="text-sm font-medium text-gray-900 ml-auto">45%</div>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
              <div className="text-sm text-gray-900">潜在客户</div>
              <div className="text-sm font-medium text-gray-900 ml-auto">30%</div>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
              <div className="text-sm text-gray-900">新客户</div>
              <div className="text-sm font-medium text-gray-900 ml-auto">15%</div>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
              <div className="text-sm text-gray-900">流失风险</div>
              <div className="text-sm font-medium text-gray-900 ml-auto">5%</div>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
              <div className="text-sm text-gray-900">沉睡客户</div>
              <div className="text-sm font-medium text-gray-900 ml-auto">5%</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-medium mb-4">AI客户洞察</h2>
          <div className="space-y-4">
            <div className="border-l-4 border-blue-500 pl-3 py-1">
              <p className="text-sm">3个重点客户近期有升级需求，点击查看详情</p>
            </div>
            <div className="border-l-4 border-green-500 pl-3 py-1">
              <p className="text-sm">本月新增客户同比增长12%，转化率提高</p>
            </div>
            <div className="border-l-4 border-red-500 pl-3 py-1">
              <p className="text-sm">5个客户存在流失风险，需要主动跟进</p>
            </div>
            <div className="border-l-4 border-yellow-500 pl-3 py-1">
              <p className="text-sm">客户"北京数字科技"有扩大合作意向</p>
            </div>
            <div className="border-l-4 border-purple-500 pl-3 py-1">
              <p className="text-sm">客户"上海科技有限公司"推荐了2个新潜在客户</p>
            </div>
          </div>
          <button className="w-full mt-4 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-200 text-sm font-medium">查看更多洞察</button>
        </div>
      </div>
    </div>
  );
}