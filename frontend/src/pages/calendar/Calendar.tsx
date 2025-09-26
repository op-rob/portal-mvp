import { useState } from "react";
import { useList } from "@refinedev/core";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, MapPin, Users, DollarSign } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";

interface Property {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  status: string;
}

interface Booking {
  id: string;
  propertyId: string;
  propertyName?: string;
  guestName: string;
  checkIn: string;
  checkOut: string;
  status: string;
  totalAmount: number;
  guestCount: number;
}

// Mock booking data - replace with real API data
const mockBookings: Booking[] = [
  {
    id: "1",
    propertyId: "1",
    propertyName: "Sunset Villa",
    guestName: "John Smith",
    checkIn: "2025-01-15",
    checkOut: "2025-01-20",
    status: "confirmed",
    totalAmount: 1250,
    guestCount: 4
  },
  {
    id: "2", 
    propertyId: "2",
    propertyName: "Downtown Loft",
    guestName: "Sarah Johnson",
    checkIn: "2025-01-18",
    checkOut: "2025-01-25",
    status: "checked-in",
    totalAmount: 1850,
    guestCount: 2
  },
  {
    id: "3",
    propertyId: "1", 
    propertyName: "Sunset Villa",
    guestName: "Mike Wilson",
    checkIn: "2025-01-28",
    checkOut: "2025-02-03",
    status: "confirmed",
    totalAmount: 1680,
    guestCount: 6
  },
  {
    id: "4",
    propertyId: "3",
    propertyName: "Beach House",
    guestName: "Lisa Brown",
    checkIn: "2025-02-10",
    checkOut: "2025-02-17",
    status: "pending",
    totalAmount: 2100,
    guestCount: 3
  }
];

export const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedProperty, setSelectedProperty] = useState<string>("all");
  
  const { query: { data: propertiesData, isLoading: propertiesLoading } } = useList<Property>({
    resource: "properties",
  });

  const properties = propertiesData?.data || [];
  
  // Filter bookings based on selected property
  const filteredBookings = selectedProperty === "all" 
    ? mockBookings 
    : mockBookings.filter(booking => booking.propertyId === selectedProperty);

  // Generate calendar days for current month
  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days = [];
    const current = new Date(startDate);
    
    for (let i = 0; i < 42; i++) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    
    return days;
  };

  // Get bookings for a specific date
  const getBookingsForDate = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    return filteredBookings.filter(booking => {
      const checkIn = new Date(booking.checkIn);
      const checkOut = new Date(booking.checkOut);
      const currentDate = new Date(dateString);
      
      return currentDate >= checkIn && currentDate < checkOut;
    });
  };

  // Navigation functions
  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const calendarDays = generateCalendarDays();

  if (propertiesLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading calendar...</p>
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
            <CalendarIcon className="mr-3 h-8 w-8" />
            Booking Calendar
          </h1>
          <p className="text-gray-600">View and manage your property bookings</p>
        </div>
        
        {/* Property Filter */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">Property:</label>
            <Select value={selectedProperty} onValueChange={setSelectedProperty}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select property" />
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
        </div>
      </div>

      {/* Calendar Navigation */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" onClick={previousMonth}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <h2 className="text-xl font-semibold">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h2>
              <Button variant="outline" size="sm" onClick={nextMonth}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded"></div>
                <span>Confirmed</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded"></div>
                <span>Checked In</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                <span>Pending</span>
              </div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {/* Week day headers */}
            {weekDays.map((day) => (
              <div key={day} className="p-2 text-center text-sm font-medium text-gray-500 border-b">
                {day}
              </div>
            ))}
            
            {/* Calendar days */}
            {calendarDays.map((day, index) => {
              const isCurrentMonth = day.getMonth() === currentDate.getMonth();
              const isToday = day.toDateString() === new Date().toDateString();
              const bookings = getBookingsForDate(day);
              
              return (
                <div
                  key={index}
                  className={`min-h-[120px] p-1 border border-gray-200 ${
                    !isCurrentMonth ? 'bg-gray-50 text-gray-400' : 'bg-white'
                  } ${isToday ? 'bg-blue-50 border-blue-200' : ''}`}
                >
                  <div className={`text-sm font-medium mb-1 ${isToday ? 'text-blue-600' : ''}`}>
                    {day.getDate()}
                  </div>
                  
                  {/* Bookings for this day */}
                  <div className="space-y-1">
                    {bookings.slice(0, 2).map((booking) => (
                      <div
                        key={booking.id}
                        className={`text-xs p-1 rounded text-white truncate ${
                          booking.status === 'confirmed' ? 'bg-green-500' :
                          booking.status === 'checked-in' ? 'bg-blue-500' :
                          booking.status === 'pending' ? 'bg-yellow-500' : 'bg-gray-500'
                        }`}
                        title={`${booking.guestName} - ${booking.propertyName}`}
                      >
                        {booking.guestName}
                      </div>
                    ))}
                    {bookings.length > 2 && (
                      <div className="text-xs text-gray-500 text-center">
                        +{bookings.length - 2} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Bookings Summary */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Upcoming Check-ins</CardTitle>
            <CardDescription>Next 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            {filteredBookings
              .filter(booking => {
                const checkIn = new Date(booking.checkIn);
                const today = new Date();
                const nextWeek = new Date(today);
                nextWeek.setDate(today.getDate() + 7);
                return checkIn >= today && checkIn <= nextWeek;
              })
              .slice(0, 3)
              .map((booking) => (
                <div key={booking.id} className="flex items-center justify-between py-2 border-b last:border-b-0">
                  <div>
                    <p className="font-medium">{booking.guestName}</p>
                    <p className="text-sm text-gray-600 flex items-center">
                      <MapPin className="h-3 w-3 mr-1" />
                      {booking.propertyName}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(booking.checkIn).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {booking.guestCount}
                  </Badge>
                </div>
              ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Current Guests</CardTitle>
            <CardDescription>Checked in now</CardDescription>
          </CardHeader>
          <CardContent>
            {filteredBookings
              .filter(booking => booking.status === 'checked-in')
              .slice(0, 3)
              .map((booking) => (
                <div key={booking.id} className="flex items-center justify-between py-2 border-b last:border-b-0">
                  <div>
                    <p className="font-medium">{booking.guestName}</p>
                    <p className="text-sm text-gray-600 flex items-center">
                      <MapPin className="h-3 w-3 mr-1" />
                      {booking.propertyName}
                    </p>
                    <p className="text-sm text-gray-500">
                      Until {new Date(booking.checkOut).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge className="bg-blue-500">
                    Active
                  </Badge>
                </div>
              ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Monthly Revenue</CardTitle>
            <CardDescription>{monthNames[currentDate.getMonth()]} bookings</CardDescription>
          </CardHeader>
          <CardContent>
            {(() => {
              const monthBookings = filteredBookings.filter(booking => {
                const checkIn = new Date(booking.checkIn);
                return checkIn.getMonth() === currentDate.getMonth() && 
                       checkIn.getFullYear() === currentDate.getFullYear();
              });
              
              const totalRevenue = monthBookings.reduce((sum, booking) => sum + booking.totalAmount, 0);
              const averageBooking = monthBookings.length > 0 ? totalRevenue / monthBookings.length : 0;
              
              return (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Total Revenue</span>
                    <span className="text-xl font-bold text-green-600 flex items-center">
                      <DollarSign className="h-4 w-4 mr-1" />
                      {totalRevenue.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Bookings</span>
                    <span className="font-medium">{monthBookings.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Avg/Booking</span>
                    <span className="font-medium">${averageBooking.toFixed(0)}</span>
                  </div>
                </div>
              );
            })()}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
