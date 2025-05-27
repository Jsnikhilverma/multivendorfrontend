import { useEffect, useState } from "react";
import { 
  Package, 
  ShoppingCart, 
  DollarSign, 
  TrendingUp,
  TrendingDown,
  Eye,
  Star,
  Clock,
  Calendar,

  Users,
  AlertCircle,
  CheckCircle,

  Truck,
  MessageSquare,
  BarChart3,
  Plus,
 
  Award,
  ShoppingBag,

  Zap
} from "lucide-react";

// Premium Statistics Card Component
const VendorStatCard = ({ title, value, icon: Icon, trend, trendValue, colorScheme, subtitle }) => {
  const gradients = {
    blue: "bg-gradient-to-br from-blue-500 to-blue-700",
    green: "bg-gradient-to-br from-green-500 to-green-700",
    purple: "bg-gradient-to-br from-purple-500 to-purple-700",
    orange: "bg-gradient-to-br from-orange-500 to-orange-700",
    indigo: "bg-gradient-to-br from-indigo-500 to-indigo-700",
    pink: "bg-gradient-to-br from-pink-500 to-pink-700"
  };

  return (
    <div className={`relative overflow-hidden rounded-2xl ${gradients[colorScheme]} p-6 shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-105`}>
      <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
        <div className="w-full h-full bg-white rounded-full transform translate-x-8 -translate-y-8"></div>
      </div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 rounded-xl bg-white bg-opacity-20 backdrop-blur-sm">
            <Icon className="w-6 h-6 text-black" />
          </div>
          {trend && (
            <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
              trend === 'up' 
                ? 'bg-green-500 bg-opacity-20 text-green-100' 
                : 'bg-red-500 bg-opacity-20 text-red-100'
            }`}>
              {trend === 'up' ? (
                <TrendingUp className="w-3 h-3" />
              ) : (
                <TrendingDown className="w-3 h-3" />
              )}
              <span>{trendValue}</span>
            </div>
          )}
        </div>
        
        <div className="text-3xl font-bold text-white mb-1">{value}</div>
        <div className="text-white text-opacity-80 text-sm font-medium">{title}</div>
        {subtitle && (
          <div className="text-white text-opacity-60 text-xs mt-1">{subtitle}</div>
        )}
      </div>
    </div>
  );
};

// Recent Orders Component
const RecentOrders = () => {
  const orders = [
    { 
      id: '#12345', 
      customer: 'John Smith', 
      product: 'Wireless Headphones', 
      amount: '$129.99', 
      status: 'delivered',
      time: '2 hours ago',
      quantity: 1
    },
    { 
      id: '#12344', 
      customer: 'Sarah Johnson', 
      product: 'Smart Watch', 
      amount: '$299.99', 
      status: 'shipped',
      time: '4 hours ago',
      quantity: 2
    },
    { 
      id: '#12343', 
      customer: 'Mike Davis', 
      product: 'Bluetooth Speaker', 
      amount: '$79.99', 
      status: 'processing',
      time: '6 hours ago',
      quantity: 1
    },
    { 
      id: '#12342', 
      customer: 'Emma Wilson', 
      product: 'Phone Case', 
      amount: '$24.99', 
      status: 'pending',
      time: '8 hours ago',
      quantity: 3
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'shipped': return 'bg-blue-100 text-blue-800';
      case 'processing': return 'bg-yellow-100 text-yellow-800';
      case 'pending': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'delivered': return CheckCircle;
      case 'shipped': return Truck;
      case 'processing': return Clock;
      case 'pending': return AlertCircle;
      default: return Clock;
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-800">Recent Orders</h3>
        <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">View All</button>
      </div>
      
      <div className="space-y-4">
        {orders.map((order, index) => {
          const StatusIcon = getStatusIcon(order.status);
          return (
            <div key={index} className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 transition-colors duration-200 border border-gray-100">
              <div className="flex items-center space-x-4">
                <div className="p-2 rounded-lg bg-blue-50">
                  <StatusIcon className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-800">{order.id}</p>
                  <p className="text-sm text-gray-600">{order.customer}</p>
                  <p className="text-xs text-gray-500">{order.product} (×{order.quantity})</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-800">{order.amount}</p>
                <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                  {order.status}
                </span>
                <p className="text-xs text-gray-500 mt-1">{order.time}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Quick Actions Component for Vendors
const VendorQuickActions = () => {
  const actions = [
    { title: 'Add Product', icon: Plus, color: 'bg-green-500', description: 'List new item' },
    { title: 'Manage Orders', icon: ShoppingCart, color: 'bg-blue-500', description: 'Process orders' },
    { title: 'View Analytics', icon: BarChart3, color: 'bg-purple-500', description: 'Sales insights' },
    { title: 'Customer Support', icon: MessageSquare, color: 'bg-orange-500', description: 'Help customers' },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
      <h3 className="text-xl font-bold text-gray-800 mb-6">Quick Actions</h3>
      
      <div className="grid grid-cols-1 gap-4">
        {actions.map((action, index) => (
          <button
            key={index}
            className="flex items-center p-4 rounded-xl border-2 border-gray-100 hover:border-blue-200 hover:bg-blue-50 transition-all duration-200 group text-left"
          >
            <div className={`p-3 rounded-xl ${action.color} group-hover:scale-110 transition-transform duration-200`}>
              <action.icon className="w-5 h-5 text-white" />
            </div>
            <div className="ml-4">
              <span className="font-medium text-gray-800 block">{action.title}</span>
              <span className="text-sm text-gray-500">{action.description}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

// Sales Performance Chart
const SalesPerformance = () => {
  const salesData = [
    { month: 'Jan', sales: 12500 },
    { month: 'Feb', sales: 15300 },
    { month: 'Mar', sales: 18700 },
    { month: 'Apr', sales: 16200 },
    { month: 'May', sales: 21800 },
    { month: 'Jun', sales: 24500 },
  ];

  const maxSales = Math.max(...salesData.map(d => d.sales));

  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-xl p-6 text-white">
      <h3 className="text-xl font-bold mb-6">Sales Performance</h3>
      
      <div className="space-y-4">
        {salesData.map((data, index) => (
          <div key={index} className="flex items-center justify-between">
            <span className="text-gray-300 text-sm w-8">{data.month}</span>
            <div className="flex-1 mx-4">
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(data.sales / maxSales) * 100}%` }}
                ></div>
              </div>
            </div>
            <span className="text-white font-semibold text-sm">${data.sales.toLocaleString()}</span>
          </div>
        ))}
      </div>
      
      <div className="mt-6 pt-4 border-t border-gray-700">
        <div className="flex justify-between text-sm">
          <span className="text-gray-300">Total Revenue</span>
          <span className="font-bold text-green-400">${salesData.reduce((sum, d) => sum + d.sales, 0).toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};

// Top Products Component
const TopProducts = () => {
  const products = [
    { name: 'Wireless Headphones', sold: 156, revenue: '$20,280', rating: 4.8 },
    { name: 'Smart Watch', sold: 89, revenue: '$26,670', rating: 4.6 },
    { name: 'Bluetooth Speaker', sold: 234, revenue: '$18,720', rating: 4.7 },
    { name: 'Phone Case', sold: 445, revenue: '$11,125', rating: 4.5 },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
      <h3 className="text-xl font-bold text-gray-800 mb-6">Top Products</h3>
      
      <div className="space-y-4">
        {products.map((product, index) => (
          <div key={index} className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                <Package className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-medium text-gray-800">{product.name}</p>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">{product.sold} sold</span>
                  <div className="flex items-center">
                    <Star className="w-3 h-3 text-yellow-400 fill-current" />
                    <span className="text-xs text-gray-500 ml-1">{product.rating}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="font-semibold text-gray-800">{product.revenue}</p>
              <p className="text-xs text-green-600">Revenue</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Loading Skeleton Component
const LoadingSkeleton = () => (
  <div className="animate-pulse">
    <div className="h-8 bg-gray-200 rounded w-16"></div>
  </div>
);

export function Home() {
  const [productsCount, setProductsCount] = useState(0);
  const [ordersCount, setOrdersCount] = useState(0);
  const [customersCount, setCustomersCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

useEffect(() => {
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch products count
      const productsResponse = await fetch(`${import.meta.env.VITE_BASE_URL}products/allproduct`);
      if (!productsResponse.ok) throw new Error('Failed to fetch products');
      const productsData = await productsResponse.json();
      if (Array.isArray(productsData.products)) {
        setProductsCount(productsData.products.length);
      }

      // Fetch vendors (assuming ordersCount comes from this)
      const vendorsResponse = await fetch(`${import.meta.env.VITE_BASE_URL}vendors`);
      if (!vendorsResponse.ok) throw new Error('Failed to fetch vendors');
      const vendorsData = await vendorsResponse.json();
      // Assuming vendorsData is an array or object that contains orders count
      // Adjust this depending on the API response structure
      // Example: setOrdersCount(vendorsData.length);
      if (Array.isArray(vendorsData)) {
        setOrdersCount(vendorsData.length);
      } else if (vendorsData.ordersCount) {
        setOrdersCount(vendorsData.ordersCount);
      } else {
        // fallback or default value
        setOrdersCount(0);
      }

      // Fetch customers count
      const usersResponse = await fetch(`${import.meta.env.VITE_BASE_URL}users/alluser`);
      if (!usersResponse.ok) throw new Error('Failed to fetch users');
      const usersData = await usersResponse.json();
      // Assuming usersData is an array or has users array
      if (Array.isArray(usersData)) {
        setCustomersCount(usersData.length);
      } else if (Array.isArray(usersData.users)) {
        setCustomersCount(usersData.users.length);
      } else {
        setCustomersCount(0);
      }

    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to load vendor data");
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, []);


  const vendorStats = [
   {
      title: "Total Users",
      value: loading ? <LoadingSkeleton /> : customersCount.toLocaleString(),
      icon: Users,
      trend: "up",
      trendValue: "+12%",
      colorScheme: "orange",
      subtitle: "Total buyers"
    },
    {
      title: "Total Products",
      value: loading ? <LoadingSkeleton /> : productsCount.toLocaleString(),
      icon: Package,
      trend: "up",
      trendValue: "+8%",
      colorScheme: "blue",
      subtitle: "Active listings"
    },
    {
      title: "Total Vendors",
      value: loading ? <LoadingSkeleton /> : ordersCount.toLocaleString(),
      icon: ShoppingCart,
      trend: "up",
      trendValue: "+23%",
      colorScheme: "green",
      subtitle: "This month"
    },
    {
      title: "Revenue",
      value: "$47,520",
      icon: DollarSign,
      trend: "up",
      trendValue: "+15%",
      colorScheme: "purple",
      subtitle: "Monthly earnings"
    },
   
    // {
    //   title: "Avg. Rating",
    //   value: "4.8",
    //   icon: Star,
    //   trend: "up",
    //   trendValue: "+0.2",
    //   colorScheme: "indigo",
    //   subtitle: "Customer satisfaction"
    // },
    // {
    //   title: "Conversion Rate",
    //   value: "3.2%",
    //   icon: Target,
    //   trend: "up",
    //   trendValue: "+0.8%",
    //   colorScheme: "pink",
    //   subtitle: "Visitors to buyers"
    // }
  ];

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Vendor Dashboard</h1>
            <div className="flex items-center text-gray-600">
              <Calendar className="w-4 h-4 mr-2" />
              <span className="text-sm">{currentDate}</span>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100">
              <Eye className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-700">Store Live</span>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            </div>
            {/* <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl shadow-sm transition-colors duration-200 flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span className="text-sm font-medium">Add Product</span>
            </button> */}
          </div>
        </div>
        
        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4 mb-8">
        {vendorStats.map((stat, index) => (
          <VendorStatCard
            key={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            trend={stat.trend}
            trendValue={stat.trendValue}
            colorScheme={stat.colorScheme}
            subtitle={stat.subtitle}
          />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3 mb-8">
        {/* Recent Orders - spans 2 columns */}
        <div className="lg:col-span-2">
          <RecentOrders />
        </div>
        
        {/* Quick Actions */}
        <div>
          <VendorQuickActions />
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        <SalesPerformance />
        <TopProducts />
      </div>

      {/* Store Performance Summary */}
      <div className="mt-8 bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
        <h3 className="text-xl font-bold text-gray-800 mb-6">Store Performance Summary</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-xl mx-auto mb-3">
              <Eye className="w-6 h-6 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-gray-800">12.5K</div>
            <div className="text-sm text-gray-600">Page Views</div>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-xl mx-auto mb-3">
              <ShoppingBag className="w-6 h-6 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-gray-800">89</div>
            <div className="text-sm text-gray-600">Items Sold</div>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-xl mx-auto mb-3">
              <Award className="w-6 h-6 text-purple-600" />
            </div>
            <div className="text-2xl font-bold text-gray-800">98%</div>
            <div className="text-sm text-gray-600">Satisfaction</div>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-orange-100 rounded-xl mx-auto mb-3">
              <Zap className="w-6 h-6 text-orange-600" />
            </div>
            <div className="text-2xl font-bold text-gray-800">24h</div>
            <div className="text-sm text-gray-600">Avg Response</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;