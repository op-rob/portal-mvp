import { useState } from "react";
import { useList } from "@refinedev/core";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { 
  DollarSign,
  TrendingUp,
  TrendingDown,
  Calendar,
  Home,
  BarChart3,
  PieChart,
  Download,
  Filter
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";

interface Property {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
}

interface RevenueData {
  month: string;
  revenue: number;
  bookings: number;
  occupancyRate: number;
  avgNightlyRate: number;
}

interface PropertyRevenue {
  propertyId: string;
  propertyName: string;
  totalRevenue: number;
  bookings: number;
  avgBookingValue: number;
  occupancyRate: number;
  trend: number; // percentage change
}

// Mock revenue data - replace with real API data
const mockRevenueData: RevenueData[] = [
  { month: "Jul 2024", revenue: 8500, bookings: 12, occupancyRate: 75, avgNightlyRate: 185 },
  { month: "Aug 2024", revenue: 9200, bookings: 14, occupancyRate: 82, avgNightlyRate: 195 },
  { month: "Sep 2024", revenue: 8800, bookings: 13, occupancyRate: 78, avgNightlyRate: 190 },
  { month: "Oct 2024", revenue: 7600, bookings: 11, occupancyRate: 68, avgNightlyRate: 175 },
  { month: "Nov 2024", revenue: 6800, bookings: 9, occupancyRate: 58, avgNightlyRate: 165 },
  { month: "Dec 2024", revenue: 9800, bookings: 16, occupancyRate: 88, avgNightlyRate: 210 },
  { month: "Jan 2025", revenue: 11200, bookings: 18, occupancyRate: 92, avgNightlyRate: 225 }
];

const mockPropertyRevenue: PropertyRevenue[] = [
  {
    propertyId: "1",
    propertyName: "Sunset Villa",
    totalRevenue: 45600,
    bookings: 28,
    avgBookingValue: 1628,
    occupancyRate: 85,
    trend: 12.5
  },
  {
    propertyId: "2", 
    propertyName: "Downtown Loft",
    totalRevenue: 38200,
    bookings: 24,
    avgBookingValue: 1592,
    occupancyRate: 78,
    trend: 8.3
  },
  {
    propertyId: "3",
    propertyName: "Beach House",
    totalRevenue: 52800,
    bookings: 22,
    avgBookingValue: 2400,
    occupancyRate: 82,
    trend: -3.2
  }
];

export const Revenue = () => {
  const [timeRange, setTimeRange] = useState<string>("12months");
  const [selectedProperty, setSelectedProperty] = useState<string>("all");
  
  const { query: { data: propertiesData, isLoading: propertiesLoading } } = useList<Property>({
    resource: "properties",
  });

  const properties = propertiesData?.data || [];
  
  // Calculate key metrics
  const totalRevenue = mockRevenueData.reduce((sum, data) => sum + data.revenue, 0);
  const totalBookings = mockRevenueData.reduce((sum, data) => sum + data.bookings, 0);
  const avgOccupancyRate = Math.round(mockRevenueData.reduce((sum, data) => sum + data.occupancyRate, 0) / mockRevenueData.length);
  const avgNightlyRate = Math.round(mockRevenueData.reduce((sum, data) => sum + data.avgNightlyRate, 0) / mockRevenueData.length);
  
  // Calculate growth metrics
  const currentMonth = mockRevenueData[mockRevenueData.length - 1];
  const previousMonth = mockRevenueData[mockRevenueData.length - 2];
  const revenueGrowth = previousMonth ? ((currentMonth.revenue - previousMonth.revenue) / previousMonth.revenue * 100) : 0;
  const bookingGrowth = previousMonth ? ((currentMonth.bookings - previousMonth.bookings) / previousMonth.bookings * 100) : 0;

  if (propertiesLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading revenue data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center">
            <DollarSign className="mr-3 h-8 w-8" />
            Revenue Analytics
          </h1>
          <p className="text-gray-600">Track your rental income and financial performance</p>
        </div>
        
        {/* Controls */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Time Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="6months">Last 6 Months</SelectItem>
                <SelectItem value="12months">Last 12 Months</SelectItem>
                <SelectItem value="ytd">Year to Date</SelectItem>
                <SelectItem value="custom">Custom Range</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Select value={selectedProperty} onValueChange={setSelectedProperty}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Properties" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Properties</SelectItem>
              {properties.map((property) => (
                <SelectItem key={property.id} value={property.id}>
                  {property.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              ${totalRevenue.toLocaleString()}
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              {revenueGrowth > 0 ? (
                <>
                  <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                  <span className="text-green-600">+{revenueGrowth.toFixed(1)}%</span>
                </>
              ) : (
                <>
                  <TrendingDown className="h-3 w-3 mr-1 text-red-500" />
                  <span className="text-red-600">{revenueGrowth.toFixed(1)}%</span>
                </>
              )}
              <span className="ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalBookings}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              {bookingGrowth > 0 ? (
                <>
                  <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                  <span className="text-green-600">+{bookingGrowth.toFixed(1)}%</span>
                </>
              ) : (
                <>
                  <TrendingDown className="h-3 w-3 mr-1 text-red-500" />
                  <span className="text-red-600">{bookingGrowth.toFixed(1)}%</span>
                </>
              )}
              <span className="ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Occupancy Rate</CardTitle>
            <Home className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgOccupancyRate}%</div>
            <p className="text-xs text-muted-foreground">
              Across all properties
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Nightly Rate</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${avgNightlyRate}</div>
            <p className="text-xs text-muted-foreground">
              Per night average
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart3 className="mr-2 h-5 w-5" />
            Revenue Trend
          </CardTitle>
          <CardDescription>Monthly revenue over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80 w-full">
            {/* Simple bar chart visualization */}
            <div className="flex items-end justify-between h-64 px-4">
              {mockRevenueData.map((data) => {
                const maxRevenue = Math.max(...mockRevenueData.map(d => d.revenue));
                const height = (data.revenue / maxRevenue) * 100;
                
                return (
                  <div key={data.month} className="flex flex-col items-center flex-1 mx-1">
                    <div className="flex flex-col items-center mb-2 text-xs text-gray-600">
                      <span className="font-medium">${(data.revenue / 1000).toFixed(1)}k</span>
                      <span>{data.bookings} bookings</span>
                    </div>
                    <div 
                      className="w-full bg-blue-500 hover:bg-blue-600 rounded-t transition-colors cursor-pointer"
                      style={{ height: `${height}%`, minHeight: '20px' }}
                      title={`${data.month}: $${data.revenue.toLocaleString()}`}
                    />
                    <div className="mt-2 text-xs text-gray-500 text-center">
                      {data.month.split(' ')[0]}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Property Performance & Occupancy Correlation */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Property Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Home className="mr-2 h-5 w-5" />
              Property Performance
            </CardTitle>
            <CardDescription>Revenue breakdown by property</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockPropertyRevenue.map((property) => (
                <div key={property.propertyId} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{property.propertyName}</h4>
                      <Badge 
                        variant={property.trend > 0 ? "default" : "secondary"}
                        className={property.trend > 0 ? "text-green-700 bg-green-100" : "text-red-700 bg-red-100"}
                      >
                        {property.trend > 0 ? "+" : ""}{property.trend.toFixed(1)}%
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Total Revenue</p>
                        <p className="font-bold text-green-600">${property.totalRevenue.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Bookings</p>
                        <p className="font-medium">{property.bookings}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Avg Booking</p>
                        <p className="font-medium">${property.avgBookingValue.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Occupancy</p>
                        <p className="font-medium">{property.occupancyRate}%</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Revenue vs Occupancy */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <PieChart className="mr-2 h-5 w-5" />
              Revenue vs Occupancy
            </CardTitle>
            <CardDescription>Correlation between occupancy and revenue</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Scatter plot representation */}
              <div className="h-48 relative border rounded p-4">
                <div className="absolute bottom-0 left-0 text-xs text-gray-500 transform -rotate-90 origin-left">
                  Revenue ($k)
                </div>
                <div className="absolute bottom-0 right-0 left-8 text-xs text-gray-500 text-center">
                  Occupancy Rate (%)
                </div>
                
                <div className="h-full w-full relative">
                  {mockRevenueData.map((data) => {
                    const x = (data.occupancyRate / 100) * 100; // percentage of width
                    const y = 100 - (data.revenue / 12000) * 100; // percentage from top
                    
                    return (
                      <div
                        key={data.month}
                        className="absolute w-3 h-3 bg-blue-500 rounded-full"
                        style={{
                          left: `${x}%`,
                          top: `${y}%`,
                          transform: 'translate(-50%, -50%)'
                        }}
                        title={`${data.month}: ${data.occupancyRate}% occupancy, $${data.revenue.toLocaleString()} revenue`}
                      />
                    );
                  })}
                </div>
              </div>

              {/* Monthly breakdown */}
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Monthly Breakdown</h4>
                {mockRevenueData.slice(-3).map((data) => (
                  <div key={data.month} className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">{data.month}</span>
                    <div className="flex items-center gap-4">
                      <span>${(data.revenue / 1000).toFixed(1)}k</span>
                      <span className="text-gray-500">{data.occupancyRate}%</span>
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full" 
                          style={{ width: `${data.occupancyRate}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Financial Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Financial Summary</CardTitle>
          <CardDescription>Key financial insights and recommendations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="space-y-2">
              <h4 className="font-medium text-green-600">Revenue Highlights</h4>
              <ul className="text-sm space-y-1 text-gray-600">
                <li>• Best performing month: December ($9.8k)</li>
                <li>• Highest occupancy: January (92%)</li>
                <li>• Peak nightly rate: $225 in January</li>
                <li>• Total bookings: {totalBookings} across all properties</li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium text-blue-600">Growth Trends</h4>
              <ul className="text-sm space-y-1 text-gray-600">
                <li>• Revenue growth: {revenueGrowth > 0 ? '+' : ''}{revenueGrowth.toFixed(1)}% MoM</li>
                <li>• Booking growth: {bookingGrowth > 0 ? '+' : ''}{bookingGrowth.toFixed(1)}% MoM</li>
                <li>• Avg booking value: ${Math.round(totalRevenue / totalBookings)}</li>
                <li>• Revenue per property: ${Math.round(totalRevenue / mockPropertyRevenue.length).toLocaleString()}</li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium text-orange-600">Recommendations</h4>
              <ul className="text-sm space-y-1 text-gray-600">
                <li>• Optimize pricing during low occupancy periods</li>
                <li>• Focus marketing on Beach House (highest revenue)</li>
                <li>• Investigate revenue decline trends</li>
                <li>• Consider seasonal pricing adjustments</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
