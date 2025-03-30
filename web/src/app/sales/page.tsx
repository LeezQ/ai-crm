export default function SalesPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">销售管理</h1>
        <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg flex items-center">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
          新建销售机会
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-gray-500 text-sm font-medium">本月销售额</h2>
          <p className="text-2xl font-bold mt-2">¥128,430</p>
          <div className="flex items-center mt-2">
            <span className="text-green-500 text-sm font-medium">↑ 12%</span>
            <span className="text-gray-400 text-sm ml-2">同比上月</span>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-gray-500 text-sm font-medium">销售机会数</h2>
          <p className="text-2xl font-bold mt-2">48</p>
          <div className="flex items-center mt-2">
            <span className="text-green-500 text-sm font-medium">↑ 8</span>
            <span className="text-gray-400 text-sm ml-2">本月新增</span>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-gray-500 text-sm font-medium">平均成交周期</h2>
          <p className="text-2xl font-bold mt-2">24天</p>
          <div className="flex items-center mt-2">
            <span className="text-green-500 text-sm font-medium">↓ 2天</span>
            <span className="text-gray-400 text-sm ml-2">同比上月</span>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-gray-500 text-sm font-medium">转化率</h2>
          <p className="text-2xl font-bold mt-2">18.6%</p>
          <div className="flex items-center mt-2">
            <span className="text-red-500 text-sm font-medium">↓ 2%</span>
            <span className="text-gray-400 text-sm ml-2">同比上月</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-medium">销售漏斗</h2>
        </div>
        <div className="p-5">
          <div className="flex space-x-2 text-sm text-gray-500 mb-5">
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">按金额</span>
            <span className="bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded cursor-pointer">按数量</span>
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">线索获取</span>
                <span className="text-sm font-medium">¥1,520,000</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-5">
                <div className="bg-blue-600 h-5 rounded-full" style={{ width: '100%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">需求确认</span>
                <span className="text-sm font-medium">¥980,000</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-5">
                <div className="bg-blue-600 h-5 rounded-full" style={{ width: '64%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">方案制定</span>
                <span className="text-sm font-medium">¥760,000</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-5">
                <div className="bg-blue-600 h-5 rounded-full" style={{ width: '50%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">商务谈判</span>
                <span className="text-sm font-medium">¥420,000</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-5">
                <div className="bg-blue-600 h-5 rounded-full" style={{ width: '28%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">成交</span>
                <span className="text-sm font-medium">¥280,000</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-5">
                <div className="bg-blue-600 h-5 rounded-full" style={{ width: '18%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-lg shadow">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-medium">销售机会</h2>
            <div className="flex space-x-2">
              <div className="relative">
                <input type="text" placeholder="搜索..." className="pl-8 pr-4 py-1 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                <svg className="w-4 h-4 absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </div>
              <select className="text-sm border border-gray-300 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option>所有阶段</option>
                <option>线索获取</option>
                <option>需求确认</option>
                <option>方案制定</option>
                <option>商务谈判</option>
                <option>成交</option>
              </select>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    机会名称
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    客户
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    阶段
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    金额
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    成交概率
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
                {Array.from({ length: 5 }).map((_, index) => {
                  const opportunity = [
                    '产品升级需求',
                    '新客户拓展项目',
                    '系统集成方案',
                    '云服务迁移项目',
                    '数字化转型方案'
                  ][index % 5];

                  const company = [
                    '北京数字科技有限公司',
                    '上海科技有限公司',
                    '广州电子科技有限公司',
                    '深圳互联网科技有限公司',
                    '杭州科技有限公司'
                  ][index % 5];

                  const stage = [
                    { name: '线索获取', color: 'blue' },
                    { name: '需求确认', color: 'indigo' },
                    { name: '方案制定', color: 'purple' },
                    { name: '商务谈判', color: 'yellow' },
                    { name: '成交', color: 'green' }
                  ][index % 5];

                  const amount = [
                    '¥120,000',
                    '¥85,000',
                    '¥250,000',
                    '¥75,000',
                    '¥180,000'
                  ][index % 5];

                  const probability = [
                    '30%',
                    '50%',
                    '75%',
                    '90%',
                    '100%'
                  ][index % 5];

                  const manager = [
                    '王经理',
                    '李经理',
                    '张经理',
                    '赵经理',
                    '陈经理'
                  ][index % 5];

                  return (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-blue-600 hover:text-blue-900 cursor-pointer">{opportunity}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{company}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-${stage.color}-100 text-${stage.color}-800`}>
                          {stage.name}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {amount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {probability}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {manager}
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
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-3 flex justify-between items-center border-t border-gray-200">
            <div className="text-sm text-gray-500">
              显示 1-5 条，共 48 条
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

        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-medium">AI销售助手</h2>
          </div>
          <div className="p-4 space-y-4">
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">重点关注</h3>
                  <div className="mt-2 text-sm text-yellow-700">
                    <p>《产品升级需求》项目需及时跟进，有望提前完成</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border-l-4 border-blue-400 p-3">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">行动建议</h3>
                  <div className="mt-2 text-sm text-blue-700">
                    <p>应邀请技术团队参与《系统集成方案》的下一轮沟通</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-green-50 border-l-4 border-green-400 p-3">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-green-800">成功机率分析</h3>
                  <div className="mt-2 text-sm text-green-700">
                    <p>《数字化转型方案》项目预计成功率提升至85%</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-red-50 border-l-4 border-red-400 p-3">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">风险提醒</h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>《云服务迁移项目》价格因素可能导致谈判延长</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4">
              <h3 className="text-sm font-medium text-gray-900 mb-3">优先跟进机会</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                  <div>
                    <div className="text-sm font-medium text-gray-900">产品升级需求</div>
                    <div className="text-xs text-gray-500">北京数字科技有限公司</div>
                  </div>
                  <div className="text-sm font-medium text-green-600">90%</div>
                </div>
                <div className="flex justify-between items-center p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                  <div>
                    <div className="text-sm font-medium text-gray-900">系统集成方案</div>
                    <div className="text-xs text-gray-500">广州电子科技有限公司</div>
                  </div>
                  <div className="text-sm font-medium text-green-600">75%</div>
                </div>
                <div className="flex justify-between items-center p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                  <div>
                    <div className="text-sm font-medium text-gray-900">数字化转型方案</div>
                    <div className="text-xs text-gray-500">杭州科技有限公司</div>
                  </div>
                  <div className="text-sm font-medium text-yellow-600">65%</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}