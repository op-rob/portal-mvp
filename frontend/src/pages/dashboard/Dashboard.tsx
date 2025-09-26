import { useList } from "@refinedev/core";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { 
  Home, 
  Calendar, 
  Wrench, 
  DollarSign, 
  TrendingUp, 
  AlertTriangle,
  Plus,
  ArrowRight
} from "lucide-react";
import { Link } from "react-router";

interface Property {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  status: string;
  bedrooms: number;
  bathrooms: number;
}

interface Booking {
  id: string;
  propertyId: string;
  guestName: string;
  checkIn: string;
  checkOut: string;
  status: string;
  totalAmount: number;
}

interface WorkOrder {
  id: string;
  propertyId: string;
  title: string;
  status: string;
  priority: string;
  createdAt: string;
}

export const Dashboard = () => {
  const { query: { data: propertiesData, isLoading: propertiesLoading } } = useList<Property>({
    resource: "properties",
  });

  // Mock data for demonstration - replace with real API calls
  const mockBookings: Booking[] = [
    {
      id: "1",
      propertyId: "1", 
      guestName: "John Smith",
      checkIn: "2025-01-15",
      checkOut: "2025-01-20",
      status: "confirmed",
      totalAmount: 1250
    },
    {
      id: "2",
      propertyId: "2",
      guestName: "Sarah Johnson", 
      checkIn: "2025-01-18",
      checkOut: "2025-01-25",
      status: "checked-in",
      totalAmount: 1850
    }
  ];

  const mockWorkOrders: WorkOrder[] = [
    {
      id: "1",
      propertyId: "1",
      title: "Fix kitchen faucet leak",
      status: "in-progress", 
      priority: "medium",
      createdAt: "2025-01-10"
    },
    {
      id: "2", 
      propertyId: "2",
      title: "Replace HVAC filter",
      status: "pending",
      priority: "low", 
      createdAt: "2025-01-12"
    },
    {
      id: "3",
      propertyId: "1", 
      title: "Repair broken window",
      status: "pending",
      priority: "high",
      createdAt: "2025-01-14"
    }
  ];

  const properties = propertiesData?.data || [];
  
  // Calculate metrics
  const totalProperties = properties.length;
  const activeProperties = properties.filter(p => p.status === "active").length;
  const occupancyRate = totalProperties > 0 ? Math.round((activeProperties / totalProperties) * 100) : 0;
  const monthlyRevenue = mockBookings.reduce((sum, booking) => sum + booking.totalAmount, 0);
  const pendingWorkOrders = mockWorkOrders.filter(wo => wo.status === "pending").length;

  if (propertiesLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's what's happening with your properties.</p>
        </div>
        <Button asChild>
          <Link to="/properties/create">
            <Plus className="mr-2 h-4 w-4" />
            Add Property
          </Link>
        </Button>
      </div>

      {/* Metrics Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Properties</CardTitle>
            <Home className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProperties}</div>
            <p className="text-xs text-muted-foreground">
              {activeProperties} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Occupancy Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{occupancyRate}%</div>
            <p className="text-xs text-muted-foreground">
              This month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${monthlyRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Issues</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingWorkOrders}</div>
            <p className="text-xs text-muted-foreground">
              Work orders
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Bookings */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center">
                <Calendar className="mr-2 h-5 w-5" />
                Recent Bookings
              </CardTitle>
              <CardDescription>Latest guest reservations</CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link to="/bookings">
                View All
                <ArrowRight className="ml-1 h-3 w-3" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {mockBookings.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No recent bookings
              </div>
            ) : (
              <div className="space-y-4">
                {mockBookings.slice(0, 3).map((booking) => (
                  <div key={booking.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{booking.guestName}</p>
                      <p className="text-sm text-gray-600">
                        {new Date(booking.checkIn).toLocaleDateString()} - {new Date(booking.checkOut).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${booking.totalAmount}</p>
                      <Badge 
                        variant={booking.status === 'confirmed' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {booking.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Work Orders */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center">
                <Wrench className="mr-2 h-5 w-5" />
                Work Orders
              </CardTitle>
              <CardDescription>Property maintenance requests</CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link to="/work-orders">
                View All
                <ArrowRight className="ml-1 h-3 w-3" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {mockWorkOrders.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No work orders
              </div>
            ) : (
              <div className="space-y-4">
                {mockWorkOrders.slice(0, 3).map((workOrder) => (
                  <div key={workOrder.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{workOrder.title}</p>
                      <p className="text-sm text-gray-600">
                        {new Date(workOrder.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge 
                        variant={
                          workOrder.priority === 'high' ? 'destructive' :
                          workOrder.priority === 'medium' ? 'default' : 'secondary'
                        }
                        className="text-xs mb-1"
                      >
                        {workOrder.priority}
                      </Badge>
                      <p className="text-sm text-gray-600">{workOrder.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      {totalProperties === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <Home className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Welcome to OwnerPulse!</h3>
            <p className="text-gray-600 mb-4">
              Get started by adding your first rental property to begin tracking bookings and managing work orders.
            </p>
            <Button asChild size="lg">
              <Link to="/properties/create">
                <Plus className="mr-2 h-4 w-4" />
                Add Your First Property
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
