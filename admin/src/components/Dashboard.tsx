import { TrendingUp, DollarSign, ShoppingCart, Users, ArrowUp, ArrowDown } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import type { LucideIcon } from 'lucide-react';

import { useEffect, useState } from 'react';
import axios from 'axios';

// Type for data from Backend
type Stat = {
  title: string;
  value: number;
  change: number;
  trend: 'up' | 'down';
};

type RevenueData = {
  name: string;
  revenue: number;
};

type CategoryData = {
  name: string;
  value: number;
};

type BestSellingProduct = {
  id: number;
  name: string;
  sales: number;
  revenue: number;
  trend: 'up' | 'down';
  change: number;
}

type DashboardResponse = {
  stats: Stat[];
  revenueData: RevenueData[];
  categoryData: CategoryData[];
  bestSellingProducts: BestSellingProduct[];
};

// Type for data in Frontend

// Stat 
type StatUI = {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon: LucideIcon;
  color: string;
}

const statConfig: Record<
  string,
  {
    icon: LucideIcon;
    color: string;
    formatValue: (v: number) => string;
  }
> = {
  'Total Revenue': {
    icon: DollarSign,
    color: 'from-[#A0826D] to-[#8B6F47]',
    formatValue: (v) => `$${v.toLocaleString()}`
  },
  'Total Orders': {
    icon: ShoppingCart,
    color: 'from-[#B8956A] to-[#9B7653]',
    formatValue: (v) => v.toLocaleString()
  },
  'Total Customers': {
    icon: Users,
    color: 'from-[#C19A6B] to-[#A0826D]',
    formatValue: (v) => v.toLocaleString()
  },
  'Conversion Rate': {
    icon: TrendingUp,
    color: 'from-[#9B7653] to-[#8B6F47]',
    formatValue: (v) => `${v}%`
  }
};

// CategoryData
const CATEGORY_COLORS = [
  '#A0826D',
  '#8B6F47',
  '#9B7653',
  '#B8956A',
  '#6F4E37'
];

type CategoryDataUI = {
  name: string;
  value: number;
  color: string;
};

export function Dashboard() {
  const [stats, setStats] = useState<StatUI[]>([]);
  const [revenueData, setRevenueData] = useState<RevenueData[]>([]);
  const [categoryData, setCategoryData] = useState<CategoryDataUI[]>([]);
  const [bestSellingProducts, setBestSellingProducts] = useState<BestSellingProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getDashboardData = async () => {
      try {
        const response = await axios.get<DashboardResponse>('/api/dashboard');

        // Transform backend -> UI stats
        const statUIs: StatUI[] = response.data.stats.map(
          (stat: Stat) => {
            const config = statConfig[stat.title];

            if (!config) {
              throw new Error(`Missing statConfig for "${stat.title}"`);
            }

            return {
              title: stat.title,
              value: config.formatValue(stat.value),
              change: `${stat.change > 0 ? '+' : ''}${stat.change}%`,
              trend: stat.trend,
              icon: config.icon,
              color: config.color
            };
          }
        );

        const categoryDataUI: CategoryDataUI[] = response.data.categoryData.map(
          (item, index) => ({
            ...item,
            color: CATEGORY_COLORS[index % CATEGORY_COLORS.length]
          })
        )

        setStats(statUIs);
        setRevenueData(response.data.revenueData);
        setCategoryData(categoryDataUI);
        setBestSellingProducts(response.data.bestSellingProducts);
      } catch (error) {
        console.error('Failed to load dashboard data', error);
      } finally {
        setLoading(false);
      }
    };

    getDashboardData();
  }, []);

  if (loading) {
    return <div className="p-6">Loading dashboard...</div>;
  }

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
                label={({ name, percent }) =>
                  percent !== undefined
                    ? `${name} ${(percent * 100).toFixed(0)}%`
                    : name
                }
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
