import { TrendingUp, DollarSign, ShoppingCart, Users, ArrowUp, ArrowDown } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import type { LucideIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import axios from 'axios';

/* =======================
   Types
======================= */

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
};

type DashboardResponse = {
  stats: Stat[];
  revenueData: RevenueData[];
  categoryData: CategoryData[];
  bestSellingProducts: BestSellingProduct[];
};

type StatUI = {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon: LucideIcon;
  iconColor: string;
};

type CategoryDataUI = {
  name: string;
  value: number;
  color: string;
};

/* =======================
   Config
======================= */

const statConfig: Record<
  string,
  {
    icon: LucideIcon;
    iconColor: string;
    formatValue: (v: number) => string;
  }
> = {
  'Total Revenue': {
    icon: DollarSign,
    iconColor: 'bg-blue-500',
    formatValue: (v) => `$${v.toLocaleString()}`,
  },
  'Total Orders': {
    icon: ShoppingCart,
    iconColor: 'bg-green-500',
    formatValue: (v) => v.toLocaleString(),
  },
  'Total Customers': {
    icon: Users,
    iconColor: 'bg-purple-500',
    formatValue: (v) => v.toLocaleString(),
  },
  'Conversion Rate': {
    icon: TrendingUp,
    iconColor: 'bg-orange-500',
    formatValue: (v) => `${v}%`,
  },
};

const CATEGORY_COLORS = [
  '#ef4444',
  '#3b82f6',
  '#f97316',
  '#10b981',
  '#8b5cf6',
];

/* =======================
   Component
======================= */

export function Dashboard() {
  const [stats, setStats] = useState<StatUI[]>([]);
  const [revenueData, setRevenueData] = useState<RevenueData[]>([]);
  const [categoryData, setCategoryData] = useState<CategoryDataUI[]>([]);
  const [bestSellingProducts, setBestSellingProducts] = useState<
    BestSellingProduct[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getDashboardData = async () => {
      try {
        const response = await axios.get<DashboardResponse>('/api/dashboard');

        const statUIs: StatUI[] = response.data.stats.map((stat) => {
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
            iconColor: config.iconColor,
          };
        });

        const categoryDataUI: CategoryDataUI[] =
          response.data.categoryData.map((item, index) => ({
            ...item,
            color: CATEGORY_COLORS[index % CATEGORY_COLORS.length],
          }));

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
      <div>
        <h1 className="text-gray-900">Dashboard</h1>
        <p className="text-gray-500">
          Welcome back! Here's what's happening with your store.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;

          return (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${stat.iconColor}`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>

                <div
                  className={`flex items-center gap-1 text-sm ${
                    stat.trend === 'up'
                      ? 'text-green-600'
                      : 'text-red-600'
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

              <p className="text-sm text-gray-500 mb-1">{stat.title}</p>
              <p className="text-gray-900">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="mb-6 text-gray-900">Monthly Revenue</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={revenueData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#e5e7eb"
                vertical={false}
              />
              <XAxis
                dataKey="name"
                stroke="#6b7280"
                tick={{ fontSize: 12 }}
              />
              <YAxis stroke="#6b7280" tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow:
                    '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                }}
                cursor={{ fill: '#f3f4f6' }}
              />
              <Bar
                dataKey="revenue"
                fill="#1a1d29"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="mb-6 text-gray-900">Revenue by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                }}
              />
            </PieChart>
          </ResponsiveContainer>

          <div className="mt-4 space-y-2">
            {categoryData.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between text-sm"
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-gray-600">
                    {item.name}
                  </span>
                </div>
                <span className="text-gray-900">
                  {item.value}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h3 className="mb-6 text-gray-900">
          Top Selling Products
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-gray-600">
                  Product
                </th>
                <th className="text-left py-3 px-4 text-gray-600">
                  Sales
                </th>
                <th className="text-left py-3 px-4 text-gray-600">
                  Revenue
                </th>
                <th className="text-left py-3 px-4 text-gray-600">
                  Trend
                </th>
              </tr>
            </thead>
            <tbody>
              {bestSellingProducts.map((product) => (
                <tr
                  key={product.id}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <td className="py-4 px-4 text-gray-900">
                    {product.name}
                  </td>
                  <td className="py-4 px-4 text-gray-700">
                    {product.sales}
                  </td>
                  <td className="py-4 px-4 text-gray-700">
                    ${product.revenue.toLocaleString()}
                  </td>
                  <td className="py-4 px-4">
                    <div
                      className={`flex items-center gap-1 ${
                        product.trend === 'up'
                          ? 'text-green-600'
                          : 'text-red-600'
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
