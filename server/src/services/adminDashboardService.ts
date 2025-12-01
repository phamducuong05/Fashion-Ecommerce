import prisma from "../utils/prisma";

// Helper function to get month name
const getMonthName = (month: number): string => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return months[month];
};

// Helper function to calculate percentage change
const calculateChange = (current: number, previous: number): number => {
  if (previous === 0) return current > 0 ? 100 : 0;
  return Number((((current - previous) / previous) * 100).toFixed(1));
};

// Get start and end of a year
const getYearRange = (year: number) => {
  return {
    start: new Date(year, 0, 1),
    end: new Date(year, 11, 31, 23, 59, 59, 999)
  };
};

// Get start and end of a month
const getMonthRange = (year: number, month: number) => {
  return {
    start: new Date(year, month, 1),
    end: new Date(year, month + 1, 0, 23, 59, 59, 999)
  };
};

// Stats
export const getStats = async () => {
  const now = new Date();
  const currentYear = now.getFullYear();
  const previousYear = currentYear - 1;

  const currentYearRange = getYearRange(currentYear);
  const previousYearRange = getYearRange(previousYear);

  // Current year up to now
  const currentYearEnd = now;

  // Same period last year (Jan 1 to same month/day)
  const samePeriodLastYear = new Date(previousYear, now.getMonth(), now.getDate(), 23, 59, 59, 999);

  // --- Total Revenue ---
  const currentRevenue = await prisma.order.aggregate({
    _sum: { finalAmount: true },
    where: {
      createdAt: {
        gte: currentYearRange.start,
        lte: currentYearEnd
      },
      status: { not: 'CANCELLED' }
    }
  });

  const previousRevenue = await prisma.order.aggregate({
    _sum: { finalAmount: true },
    where: {
      createdAt: {
        gte: previousYearRange.start,
        lte: samePeriodLastYear
      },
      status: { not: 'CANCELLED' }
    }
  });

  const totalRevenue = Number(currentRevenue._sum.finalAmount || 0);
  const prevTotalRevenue = Number(previousRevenue._sum.finalAmount || 0);
  const revenueChange = calculateChange(totalRevenue, prevTotalRevenue);

  // Total Orders 
  const currentOrders = await prisma.order.count({
    where: {
      createdAt: {
        gte: currentYearRange.start,
        lte: currentYearEnd
      },
      status: { not: 'CANCELLED' }
    }
  });

  const previousOrders = await prisma.order.count({
    where: {
      createdAt: {
        gte: previousYearRange.start,
        lte: samePeriodLastYear
      },
      status: { not: 'CANCELLED' }
    }
  });

  const ordersChange = calculateChange(currentOrders, previousOrders);

  // Total Customers (users who placed at least 1 order) 
  const currentCustomers = await prisma.user.count({
    where: {
      role: 'USER',
      orders: {
        some: {
          createdAt: {
            gte: currentYearRange.start,
            lte: currentYearEnd
          }
        }
      }
    }
  });

  const previousCustomers = await prisma.user.count({
    where: {
      role: 'USER',
      orders: {
        some: {
          createdAt: {
            gte: previousYearRange.start,
            lte: samePeriodLastYear
          }
        }
      }
    }
  });

  const customersChange = calculateChange(currentCustomers, previousCustomers);

  // Conversion Rate (Orders / Total Users * 100) 
  const totalUsersCurrentYear = await prisma.user.count({
    where: {
      role: 'USER',
      createdAt: { lte: currentYearEnd }
    }
  });

  const totalUsersPreviousYear = await prisma.user.count({
    where: {
      role: 'USER',
      createdAt: { lte: samePeriodLastYear }
    }
  });

  const currentConversionRate = totalUsersCurrentYear > 0 
    ? Number(((currentOrders / totalUsersCurrentYear) * 100).toFixed(1)) 
    : 0;

  const previousConversionRate = totalUsersPreviousYear > 0 
    ? Number(((previousOrders / totalUsersPreviousYear) * 100).toFixed(1)) 
    : 0;

  const conversionChange = calculateChange(currentConversionRate, previousConversionRate);

  return [
    {
      title: "Total Revenue",
      value: totalRevenue,
      change: revenueChange,
      trend: revenueChange >= 0 ? "up" : "down"
    },
    {
      title: "Total Orders",
      value: currentOrders,
      change: ordersChange,
      trend: ordersChange >= 0 ? "up" : "down"
    },
    {
      title: "Total Customers",
      value: currentCustomers,
      change: customersChange,
      trend: customersChange >= 0 ? "up" : "down"
    },
    {
      title: "Conversion Rate",
      value: currentConversionRate,
      unit: "%",
      change: conversionChange,
      trend: conversionChange >= 0 ? "up" : "down"
    }
  ];
};

// Revenue Data (Monthly) 
export const getRevenueData = async () => {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth(); // 0-indexed

  const revenueData = [];

  for (let month = 0; month <= currentMonth; month++) {
    const { start, end } = getMonthRange(currentYear, month);

    const monthRevenue = await prisma.order.aggregate({
      _sum: { finalAmount: true },
      where: {
        createdAt: {
          gte: start,
          lte: end
        },
        status: { not: 'CANCELLED' }
      }
    });

    revenueData.push({
      name: getMonthName(month),
      revenue: Number(monthRevenue._sum.finalAmount || 0)
    });
  }

  return revenueData;
};

// Category Data (Current Month)
export const getCategoryData = async () => {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();
  const { start, end } = getMonthRange(currentYear, currentMonth);

  // Get all categories (parent categories only)
  const categories = await prisma.category.findMany({
    where: { parentId: null },
    include: {
      children: true
    }
  });

  const categoryData = [];

  for (const category of categories) {
    // Get all category IDs (parent + children)
    const categoryIds = [category.id, ...category.children.map((c: { id: number }) => c.id)];

    // Get revenue for products in this category
    const revenue = await prisma.orderItem.aggregate({
      _sum: {
        price: true
      },
      where: {
        order: {
          createdAt: {
            gte: start,
            lte: end
          },
          status: { not: 'CANCELLED' }
        },
        variant: {
          product: {
            categories: {
              some: {
                id: { in: categoryIds }
              }
            }
          }
        }
      }
    });

    // Calculate total revenue (price * quantity)
    const orderItems = await prisma.orderItem.findMany({
      where: {
        order: {
          createdAt: {
            gte: start,
            lte: end
          },
          status: { not: 'CANCELLED' }
        },
        variant: {
          product: {
            categories: {
              some: {
                id: { in: categoryIds }
              }
            }
          }
        }
      },
      select: {
        price: true,
        quantity: true
      }
    });

    const totalRevenue = orderItems.reduce((sum: number, item: { price: any; quantity: number }) => {
      return sum + Number(item.price) * item.quantity;
    }, 0);

    categoryData.push({
      name: category.name,
      value: totalRevenue
    });
  }

  return categoryData;
};

// Best Selling Product (Current Month)
export const getBestSellingProducts = async () => {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();
  const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  const previousMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

  const currentMonthRange = getMonthRange(currentYear, currentMonth);
  const previousMonthRange = getMonthRange(previousMonthYear, previousMonth);

  // Get current month sales grouped by product
  const currentMonthSales = await prisma.orderItem.groupBy({
    by: ['variantId'],
    _sum: {
      quantity: true,
      price: true
    },
    where: {
      order: {
        createdAt: {
          gte: currentMonthRange.start,
          lte: currentMonthRange.end
        },
        status: { not: 'CANCELLED' }
      }
    }
  });

  // Get variant to product mapping
  const variantIds = currentMonthSales.map((s: { variantId: number }) => s.variantId);
  const variants = await prisma.productVariant.findMany({
    where: { id: { in: variantIds } },
    include: { product: true }
  });

  const variantToProduct = new Map<number, typeof variants[0]['product']>();
  for (const v of variants) {
    variantToProduct.set(v.id, v.product);
  }

  // Aggregate by product
  const productSalesMap = new Map<number, { sales: number; revenue: number; name: string }>();

  for (const sale of currentMonthSales) {
    const product = variantToProduct.get(sale.variantId);
    if (!product) continue;

    const existing = productSalesMap.get(product.id) || { sales: 0, revenue: 0, name: product.name };
    
    // Calculate revenue (price * quantity for each order item)
    const orderItems = await prisma.orderItem.findMany({
      where: {
        variantId: sale.variantId,
        order: {
          createdAt: {
            gte: currentMonthRange.start,
            lte: currentMonthRange.end
          },
          status: { not: 'CANCELLED' }
        }
      },
      select: { price: true, quantity: true }
    });

    const itemRevenue = orderItems.reduce((sum: number, item: { price: any; quantity: number }) => sum + Number(item.price) * item.quantity, 0);

    productSalesMap.set(product.id, {
      sales: existing.sales + (sale._sum.quantity || 0),
      revenue: existing.revenue + itemRevenue,
      name: product.name
    });
  }

  // Get previous month sales for comparison
  const previousMonthSales = await prisma.orderItem.groupBy({
    by: ['variantId'],
    _sum: { quantity: true },
    where: {
      order: {
        createdAt: {
          gte: previousMonthRange.start,
          lte: previousMonthRange.end
        },
        status: { not: 'CANCELLED' }
      }
    }
  });

  const previousProductSalesMap = new Map<number, number>();
  for (const sale of previousMonthSales) {
    const product = variantToProduct.get(sale.variantId);
    if (!product) continue;

    const existing = previousProductSalesMap.get(product.id) || 0;
    previousProductSalesMap.set(product.id, existing + (sale._sum.quantity || 0));
  }

  // Convert to array and sort by sales
  const productsArray = Array.from(productSalesMap.entries()).map(([id, data]) => {
    const previousSales = previousProductSalesMap.get(id) || 0;
    const change = calculateChange(data.sales, previousSales);

    return {
      id,
      name: data.name,
      sales: data.sales,
      revenue: data.revenue,
      trend: change >= 0 ? 'up' as const : 'down' as const,
      change
    };
  });

  // Sort by sales descending and take top 5
  return productsArray
    .sort((a, b) => b.sales - a.sales)
    .slice(0, 5);
};

// Get all dashboard data
export const getDashboardData = async () => {
  const [stats, revenueData, categoryData, bestSellingProducts] = await Promise.all([
    getStats(),
    getRevenueData(),
    getCategoryData(),
    getBestSellingProducts()
  ]);

  return {
    stats,
    revenueData,
    categoryData,
    bestSellingProducts
  };
};
