import { useList } from "@refinedev/core";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { MapPin, Bed, Bath, Plus } from "lucide-react";
import { Link } from "react-router";

interface Property {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  bedrooms: number;
  bathrooms: number;
  status: string;
  images?: string[];
  description?: string;
}

export const PropertyList = () => {
  const { query: { data, isLoading, isError } } = useList<Property>({
    resource: "properties",
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading properties...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error loading properties</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    );
  }

  const properties = data?.data || [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">My Properties</h1>
          <p className="text-gray-600">Manage your rental properties</p>
        </div>
        <Button asChild>
          <Link to="/properties/create">
            <Plus className="mr-2 h-4 w-4" />
            Add Property
          </Link>
        </Button>
      </div>

      {properties.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <MapPin className="h-6 w-6 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No properties yet</h3>
            <p className="text-gray-600 mb-4">
              Start by adding your first rental property to begin tracking bookings and work orders.
            </p>
            <Button asChild>
              <Link to="/properties/create">
                <Plus className="mr-2 h-4 w-4" />
                Add Your First Property
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {properties.map((property: Property) => (
            <Card key={property.id} className="hover:shadow-lg transition-shadow">
              <div className="aspect-video bg-gray-200 relative overflow-hidden rounded-t-lg">
                {property.images?.[0] ? (
                  <img
                    src={property.images[0]}
                    alt={property.name}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <MapPin className="h-12 w-12 text-gray-400" />
                  </div>
                )}
                <Badge 
                  className="absolute top-2 right-2"
                  variant={property.status === "active" ? "default" : "secondary"}
                >
                  {property.status}
                </Badge>
              </div>
              
              <CardHeader>
                <CardTitle className="text-xl">{property.name}</CardTitle>
                <CardDescription className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  {property.address}, {property.city}, {property.state} {property.zipCode}
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="flex items-center space-x-4 mb-4">
                  <div className="flex items-center">
                    <Bed className="h-4 w-4 mr-1 text-gray-500" />
                    <span className="text-sm">{property.bedrooms} bed</span>
                  </div>
                  <div className="flex items-center">
                    <Bath className="h-4 w-4 mr-1 text-gray-500" />
                    <span className="text-sm">{property.bathrooms} bath</span>
                  </div>
                </div>
                
                {property.description && (
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {property.description}
                  </p>
                )}
                
                <div className="flex space-x-2">
                  <Button asChild size="sm" className="flex-1">
                    <Link to={`/properties/show/${property.id}`}>
                      View Details
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="sm">
                    <Link to={`/properties/edit/${property.id}`}>
                      Edit
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};