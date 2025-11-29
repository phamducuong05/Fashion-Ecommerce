import { TrendingUp, DollarSign, ShoppingCart, Users, ArrowUp, ArrowDown } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const revenueData = [
  { name: 'Jan', revenue: 4200 },
  { name: 'Feb', revenue: 5100 },
  { name: 'Mar', revenue: 4800 },
  { name: 'Apr', revenue: 6200 },
  { name: 'May', revenue: 7100 },
  { name: 'Jun', revenue: 8400 },
  { name: 'Jul', revenue: 7800 },
  { name: 'Aug', revenue: 9200 },
  { name: 'Sep', revenue: 8900 },
  { name: 'Oct', revenue: 10100 },
  { name: 'Nov', revenue: 11200 },
  { name: 'Dec', revenue: 12400 },
];

const categoryData = [
  { name: 'Men Fashion', value: 4200, color: '#A0826D' },
  { name: 'Women Fashion', value: 5800, color: '#8B6F47' },
  { name: 'Kids', value: 2100, color: '#9B7653' },
  { name: 'Accessories', value: 1800, color: '#B8956A' },
  { name: 'Bags & Wallets', value: 2900, color: '#6F4E37' },
];

const bestSellingProducts = [
  { id: 1, name: 'Floral Summer Dress', sales: 342, revenue: 30780, trend: 'up', change: 12 },
  { id: 2, name: 'Classic Cotton T-Shirt', sales: 298, revenue: 8942, trend: 'up', change: 8 },
  { id: 3, name: 'Leather Crossbody Bag', sales: 276, revenue: 35880, trend: 'down', change: -3 },
  { id: 4, name: 'Slim Fit Jeans', sales: 245, revenue: 19600, trend: 'up', change: 15 },
  { id: 5, name: 'Kids Running Shoes', sales: 198, revenue: 9900, trend: 'up', change: 5 },
];

export function Dashboard() {
  const stats = [
    {
      title: 'Total Revenue',
      value: '$94,200',
      change: '+12.5%',
      trend: 'up',
      icon: DollarSign,
      color: 'from-[#A0826D] to-[#8B6F47]',
    },
    {
      title: 'Total Orders',
      value: '1,842',
      change: '+8.2%',
      trend: 'up',
      icon: ShoppingCart,
      color: 'from-[#B8956A] to-[#9B7653]',
    },
    {
      title: 'Total Customers',
      value: '3,254',
      change: '+15.3%',
      trend: 'up',
      icon: Users,
      color: 'from-[#C19A6B] to-[#A0826D]',
    },
    {
      title: 'Conversion Rate',
      value: '3.8%',
      change: '-2.1%',
      trend: 'down',
      icon: TrendingUp,
      color: 'from-[#9B7653] to-[#8B6F47]',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-[#FFFEF9] rounded-xl shadow-lg p-6 border border-[#D4A574] hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg bg-gradient-to-br ${stat.color} shadow-md`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div
                  className={`flex items-center gap-1 text-sm ${
                    stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {stat.trend === 'up' ? (
                    <ArrowUp className="w-4 h-4" />
                  ) : (
                    <ArrowDown className="w-4 h-4" />
                  )}
                  <span>{stat.change}</span>
                </div>
              </div>
              <p className="text-sm text-[#6F4E37] mb-1">{stat.title}</p>
              <p className="text-[#3E2723]">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-[#FFFEF9] rounded-xl shadow-lg p-6 border border-[#D4A574]">
          <h3 className="mb-6 text-[#3E2723]">Revenue Overview</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E8D4B0" />
              <XAxis dataKey="name" stroke="#6F4E37" />
              <YAxis stroke="#6F4E37" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#FFFEF9',
                  border: '1px solid #D4A574',
                  borderRadius: '8px',
                }}
              />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#8B6F47"
                strokeWidth={3}
                dot={{ fill: '#6F4E37', r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Category Distribution */}
        <div className="bg-[#FFFEF9] rounded-xl shadow-lg p-6 border border-[#D4A574]">
          <h3 className="mb-6 text-[#3E2723]">Sales by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Best Selling Products */}
      <div className="bg-[#FFFEF9] rounded-xl shadow-lg p-6 border border-[#D4A574]">
        <h3 className="mb-6 text-[#3E2723]">Best Selling Products</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#D4A574]">
                <th className="text-left py-3 px-4 text-[#6F4E37]">Product</th>
                <th className="text-left py-3 px-4 text-[#6F4E37]">Sales</th>
                <th className="text-left py-3 px-4 text-[#6F4E37]">Revenue</th>
                <th className="text-left py-3 px-4 text-[#6F4E37]">Trend</th>
              </tr>
            </thead>
            <tbody>
              {bestSellingProducts.map((product) => (
                <tr key={product.id} className="border-b border-[#F5EBD7] hover:bg-[#FFF8E7] transition-colors">
                  <td className="py-4 px-4 text-[#3E2723]">{product.name}</td>
                  <td className="py-4 px-4 text-[#4E342E]">{product.sales}</td>
                  <td className="py-4 px-4 text-[#4E342E]">${product.revenue.toLocaleString()}</td>
                  <td className="py-4 px-4">
                    <div
                      className={`flex items-center gap-1 ${
                        product.trend === 'up' ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {product.trend === 'up' ? (
                        <ArrowUp className="w-4 h-4" />
                      ) : (
                        <ArrowDown className="w-4 h-4" />
                      )}
                      <span>{Math.abs(product.change)}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
