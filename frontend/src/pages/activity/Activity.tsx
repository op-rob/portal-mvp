import { useState } from "react";
import { useList } from "@refinedev/core";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { 
  Activity as ActivityIcon,
  Calendar,
  Wrench,
  Home,
  DollarSign,
  User,
  Bell,
  CheckCircle,
  AlertTriangle,
  Clock,
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

interface ActivityItem {
  id: string;
  type: 'booking' | 'work_order' | 'payment' | 'property' | 'guest' | 'system';
  title: string;
  description: string;
  timestamp: string;
  propertyId?: string;
  propertyName?: string;
  status?: string;
  priority?: 'low' | 'medium' | 'high';
  amount?: number;
  guestName?: string;
  actionRequired?: boolean;
}

// Mock activity data - replace with real API data
const mockActivities: ActivityItem[] = [
  {
    id: "1",
    type: "booking",
    title: "New Booking Confirmed",
    description: "John Smith booked Sunset Villa for 5 nights",
    timestamp: "2025-01-15T10:30:00Z",
    propertyId: "1",
    propertyName: "Sunset Villa",
    status: "confirmed",
    amount: 1250,
    guestName: "John Smith"
  },
  {
    id: "2", 
    type: "work_order",
    title: "Work Order Completed",
    description: "Kitchen faucet repair has been completed",
    timestamp: "2025-01-15T09:15:00Z",
    propertyId: "1",
    propertyName: "Sunset Villa",
    status: "completed",
    priority: "medium"
  },
  {
    id: "3",
    type: "payment",
    title: "Payment Received", 
    description: "Booking payment processed successfully",
    timestamp: "2025-01-15T08:45:00Z",
    propertyId: "2",
    propertyName: "Downtown Loft",
    status: "processed",
    amount: 1850,
    guestName: "Sarah Johnson"
  },
  {
    id: "4",
    type: "guest",
    title: "Guest Checked In",
    description: "Sarah Johnson has checked into Downtown Loft",
    timestamp: "2025-01-14T16:00:00Z",
    propertyId: "2", 
    propertyName: "Downtown Loft",
    status: "checked-in",
    guestName: "Sarah Johnson"
  },
  {
    id: "5",
    type: "work_order",
    title: "New Work Order Created",
    description: "Broken window reported at Beach House",
    timestamp: "2025-01-14T14:20:00Z",
    propertyId: "3",
    propertyName: "Beach House",
    status: "pending",
    priority: "high",
    actionRequired: true
  },
  {
    id: "6",
    type: "system",
    title: "Maintenance Reminder",
    description: "HVAC filter replacement due for Downtown Loft",
    timestamp: "2025-01-14T12:00:00Z",
    propertyId: "2",
    propertyName: "Downtown Loft",
    status: "pending",
    priority: "low",
    actionRequired: true
  },
  {
    id: "7",
    type: "booking",
    title: "Guest Checked Out",
    description: "Mike Wilson checked out of Sunset Villa", 
    timestamp: "2025-01-14T11:00:00Z",
    propertyId: "1",
    propertyName: "Sunset Villa",
    status: "completed",
    guestName: "Mike Wilson"
  },
  {
    id: "8",
    type: "property",
    title: "Property Updated",
    description: "Beach House listing photos were updated",
    timestamp: "2025-01-13T15:30:00Z",
    propertyId: "3",
    propertyName: "Beach House",
    status: "updated"
  }
];

export const Activity = () => {
  const [selectedProperty, setSelectedProperty] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");
  
  const { query: { data: propertiesData, isLoading: propertiesLoading } } = useList<Property>({
    resource: "properties",
  });

  const properties = propertiesData?.data || [];
  
  // Filter activities
  const filteredActivities = mockActivities.filter(activity => {
    const propertyMatch = selectedProperty === "all" || activity.propertyId === selectedProperty;
    const typeMatch = selectedType === "all" || activity.type === selectedType;
    return propertyMatch && typeMatch;
  });

  // Sort activities by timestamp (most recent first)
  const sortedActivities = filteredActivities.sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  // Get activity icon and color
  const getActivityIcon = (type: ActivityItem['type']) => {
    switch (type) {
      case 'booking':
        return <Calendar className="h-4 w-4" />;
      case 'work_order':
        return <Wrench className="h-4 w-4" />;
      case 'payment':
        return <DollarSign className="h-4 w-4" />;
      case 'property':
        return <Home className="h-4 w-4" />;
      case 'guest':
        return <User className="h-4 w-4" />;
      case 'system':
        return <Bell className="h-4 w-4" />;
      default:
        return <ActivityIcon className="h-4 w-4" />;
    }
  };

  const getActivityColor = (type: ActivityItem['type']) => {
    switch (type) {
      case 'booking':
        return 'bg-blue-500';
      case 'work_order':
        return 'bg-orange-500';
      case 'payment':
        return 'bg-green-500';
      case 'property':
        return 'bg-purple-500';
      case 'guest':
        return 'bg-indigo-500';
      case 'system':
        return 'bg-gray-500';
      default:
        return 'bg-gray-400';
    }
  };

  const getStatusIcon = (status: string, priority?: string) => {
    if (status === 'completed') return <CheckCircle className="h-4 w-4 text-green-500" />;
    if (status === 'pending' && priority === 'high') return <AlertTriangle className="h-4 w-4 text-red-500" />;
    if (status === 'pending') return <Clock className="h-4 w-4 text-yellow-500" />;
    return null;
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(diffInHours * 60);
      return `${diffInMinutes}m ago`;
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else if (diffInHours < 48) {
      return '1 day ago';
    } else {
      return date.toLocaleDateString();
    }
  };

  if (propertiesLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading activity feed...</p>
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
            <ActivityIcon className="mr-3 h-8 w-8" />
            Activity Feed
          </h1>
          <p className="text-gray-600">Stay updated with all your property activities</p>
        </div>
        
        {/* Filters */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-500" />
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
          </div>

          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="booking">Bookings</SelectItem>
              <SelectItem value="work_order">Work Orders</SelectItem>
              <SelectItem value="payment">Payments</SelectItem>
              <SelectItem value="property">Properties</SelectItem>
              <SelectItem value="guest">Guests</SelectItem>
              <SelectItem value="system">System</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Activity Summary Cards */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Today's Activities</p>
                <p className="text-2xl font-bold">
                  {sortedActivities.filter(a => {
                    const today = new Date().toDateString();
                    return new Date(a.timestamp).toDateString() === today;
                  }).length}
                </p>
              </div>
              <ActivityIcon className="h-8 w-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Action Required</p>
                <p className="text-2xl font-bold text-red-600">
                  {sortedActivities.filter(a => a.actionRequired).length}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">New Bookings</p>
                <p className="text-2xl font-bold text-blue-600">
                  {sortedActivities.filter(a => a.type === 'booking' && a.status === 'confirmed').length}
                </p>
              </div>
              <Calendar className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Payments</p>
                <p className="text-2xl font-bold text-green-600">
                  ${sortedActivities
                    .filter(a => a.type === 'payment' && a.amount)
                    .reduce((sum, a) => sum + (a.amount || 0), 0)
                    .toLocaleString()}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Activity Feed */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>
            {sortedActivities.length} activities • Updated {formatTimestamp(new Date().toISOString())}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {sortedActivities.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <ActivityIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium mb-2">No activities found</p>
              <p className="text-sm">Try adjusting your filters to see more activities.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {sortedActivities.map((activity) => (
                <div key={activity.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start space-x-4">
                    {/* Activity Icon */}
                    <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-white ${getActivityColor(activity.type)}`}>
                      {getActivityIcon(activity.type)}
                    </div>
                    
                    {/* Activity Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <h3 className="text-sm font-medium text-gray-900">
                            {activity.title}
                          </h3>
                          {activity.status && getStatusIcon(activity.status, activity.priority)}
                          {activity.actionRequired && (
                            <Badge variant="destructive" className="text-xs">
                              Action Required
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-gray-500">
                          {formatTimestamp(activity.timestamp)}
                        </p>
                      </div>
                      
                      <p className="text-sm text-gray-600 mt-1">
                        {activity.description}
                      </p>
                      
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          {activity.propertyName && (
                            <span className="flex items-center">
                              <Home className="h-3 w-3 mr-1" />
                              {activity.propertyName}
                            </span>
                          )}
                          {activity.guestName && (
                            <span className="flex items-center">
                              <User className="h-3 w-3 mr-1" />
                              {activity.guestName}
                            </span>
                          )}
                          {activity.amount && (
                            <span className="flex items-center font-medium text-green-600">
                              <DollarSign className="h-3 w-3 mr-1" />
                              ${activity.amount.toLocaleString()}
                            </span>
                          )}
                        </div>
                        
                        {/* Action Buttons */}
                        {activity.actionRequired && (
                          <div className="flex items-center space-x-2">
                            {activity.type === 'work_order' && (
                              <Button size="sm" variant="outline">
                                <Wrench className="h-3 w-3 mr-1" />
                                View Work Order
                              </Button>
                            )}
                            {activity.type === 'system' && (
                              <Button size="sm" variant="outline">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Mark Complete
                              </Button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Load More Button */}
      {sortedActivities.length > 0 && (
        <div className="text-center">
          <Button variant="outline">
            Load More Activities
          </Button>
        </div>
      )}
    </div>
  );
};
