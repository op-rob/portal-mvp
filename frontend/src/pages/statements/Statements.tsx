import { useState } from "react";
import { useList } from "@refinedev/core";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { 
  FileText,
  Download,
  Receipt,
  Calendar,
  DollarSign,
  Filter,
  Search,
  Eye,
  FileDown,
  Calculator,
  Building2,
  TrendingUp
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Input } from "../../components/ui/input";

interface Property {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
}

interface Statement {
  id: string;
  type: 'monthly' | 'quarterly' | 'annual' | 'receipt' | 'tax' | 'expense';
  title: string;
  description: string;
  period: string;
  amount: number;
  propertyId?: string;
  propertyName?: string;
  dateGenerated: string;
  status: 'ready' | 'processing' | 'archived';
  fileSize: string;
  pages: number;
}

interface BookingReceipt {
  id: string;
  bookingId: string;
  guestName: string;
  propertyName: string;
  checkIn: string;
  checkOut: string;
  amount: number;
  fees: number;
  taxes: number;
  total: number;
  dateIssued: string;
  status: 'paid' | 'pending' | 'refunded';
}

// Mock statements data - replace with real API data
const mockStatements: Statement[] = [
  {
    id: "1",
    type: "monthly",
    title: "January 2025 Monthly Statement",
    description: "Complete revenue and expense summary for January",
    period: "January 2025",
    amount: 11200,
    dateGenerated: "2025-02-01T00:00:00Z",
    status: "ready",
    fileSize: "2.4 MB",
    pages: 12
  },
  {
    id: "2", 
    type: "annual",
    title: "2024 Annual Tax Statement",
    description: "Complete year-end financial summary for tax filing",
    period: "2024",
    amount: 94800,
    dateGenerated: "2025-01-15T00:00:00Z",
    status: "ready",
    fileSize: "5.8 MB", 
    pages: 28
  },
  {
    id: "3",
    type: "quarterly",
    title: "Q4 2024 Quarterly Report",
    description: "October-December financial performance",
    period: "Q4 2024",
    amount: 26400,
    dateGenerated: "2025-01-05T00:00:00Z",
    status: "ready",
    fileSize: "3.1 MB",
    pages: 16
  },
  {
    id: "4",
    type: "expense",
    title: "Property Maintenance Expenses - Jan 2025",
    description: "All maintenance and repair costs for January",
    period: "January 2025",
    amount: 2850,
    dateGenerated: "2025-02-01T00:00:00Z",
    status: "ready",
    fileSize: "1.2 MB",
    pages: 8
  },
  {
    id: "5",
    type: "monthly",
    title: "December 2024 Monthly Statement",
    description: "Complete revenue and expense summary for December",
    period: "December 2024",
    amount: 9800,
    dateGenerated: "2025-01-01T00:00:00Z",
    status: "archived",
    fileSize: "2.2 MB",
    pages: 11
  }
];

const mockReceipts: BookingReceipt[] = [
  {
    id: "1",
    bookingId: "BK001",
    guestName: "John Smith",
    propertyName: "Sunset Villa",
    checkIn: "2025-01-15",
    checkOut: "2025-01-20",
    amount: 1125,
    fees: 85,
    taxes: 90,
    total: 1300,
    dateIssued: "2025-01-15T10:30:00Z",
    status: "paid"
  },
  {
    id: "2",
    bookingId: "BK002", 
    guestName: "Sarah Johnson",
    propertyName: "Downtown Loft",
    checkIn: "2025-01-18",
    checkOut: "2025-01-25",
    amount: 1680,
    fees: 125,
    taxes: 135,
    total: 1940,
    dateIssued: "2025-01-18T14:15:00Z",
    status: "paid"
  },
  {
    id: "3",
    bookingId: "BK003",
    guestName: "Mike Wilson", 
    propertyName: "Beach House",
    checkIn: "2025-01-28",
    checkOut: "2025-02-03",
    amount: 2100,
    fees: 150,
    taxes: 168,
    total: 2418,
    dateIssued: "2025-01-28T16:45:00Z",
    status: "paid"
  }
];

export const Statements = () => {
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedProperty, setSelectedProperty] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"statements" | "receipts">("statements");
  
  const { query: { data: propertiesData, isLoading: propertiesLoading } } = useList<Property>({
    resource: "properties",
  });

  const properties = propertiesData?.data || [];
  
  // Filter statements
  const filteredStatements = mockStatements.filter(statement => {
    const typeMatch = selectedType === "all" || statement.type === selectedType;
    const searchMatch = searchTerm === "" || 
      statement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      statement.description.toLowerCase().includes(searchTerm.toLowerCase());
    return typeMatch && searchMatch;
  });

  // Filter receipts
  const filteredReceipts = mockReceipts.filter(receipt => {
    const propertyMatch = selectedProperty === "all" || receipt.propertyName === selectedProperty;
    const searchMatch = searchTerm === "" ||
      receipt.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      receipt.propertyName.toLowerCase().includes(searchTerm.toLowerCase());
    return propertyMatch && searchMatch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready': return 'bg-green-100 text-green-800';
      case 'processing': return 'bg-yellow-100 text-yellow-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'refunded': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: Statement['type']) => {
    switch (type) {
      case 'monthly': return <Calendar className="h-4 w-4" />;
      case 'quarterly': return <TrendingUp className="h-4 w-4" />;
      case 'annual': return <FileText className="h-4 w-4" />;
      case 'receipt': return <Receipt className="h-4 w-4" />;
      case 'tax': return <Calculator className="h-4 w-4" />;
      case 'expense': return <DollarSign className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const handleDownload = (_statementId: string, title: string) => {
    // In a real app, this would trigger a PDF download
    console.log(`Downloading statement: ${title}`);
    // Simulate download
    const link = document.createElement('a');
    link.href = '#'; // Would be actual PDF URL
    link.download = `${title.replace(/\s+/g, '_')}.pdf`;
    link.click();
  };

  const handlePreview = (statementId: string) => {
    // In a real app, this would open a preview modal or new tab
    console.log(`Previewing statement: ${statementId}`);
  };

  if (propertiesLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading statements...</p>
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
            <FileText className="mr-3 h-8 w-8" />
            Financial Statements
          </h1>
          <p className="text-gray-600">Download receipts, statements, and tax documents</p>
        </div>
        
        <Button className="bg-green-600 hover:bg-green-700">
          <FileDown className="mr-2 h-4 w-4" />
          Generate New Statement
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Available Documents</p>
                <p className="text-2xl font-bold">{mockStatements.length + mockReceipts.length}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">This Year</p>
                <p className="text-2xl font-bold text-green-600">
                  ${mockStatements.filter(s => s.period.includes('2025')).reduce((sum, s) => sum + s.amount, 0).toLocaleString()}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tax Documents</p>
                <p className="text-2xl font-bold">{mockStatements.filter(s => s.type === 'tax' || s.type === 'annual').length}</p>
              </div>
              <Calculator className="h-8 w-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Recent Receipts</p>
                <p className="text-2xl font-bold">{mockReceipts.length}</p>
              </div>
              <Receipt className="h-8 w-8 text-orange-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tab Navigation */}
      <div className="border-b">
        <nav className="flex space-x-8">
          <button
            type="button"
            onClick={() => setActiveTab("statements")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "statements"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            <FileText className="inline h-4 w-4 mr-2" />
            Statements & Reports
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("receipts")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "receipts"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            <Receipt className="inline h-4 w-4 mr-2" />
            Booking Receipts
          </button>
        </nav>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search documents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {activeTab === "statements" ? (
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="monthly">Monthly Statements</SelectItem>
                <SelectItem value="quarterly">Quarterly Reports</SelectItem>
                <SelectItem value="annual">Annual Statements</SelectItem>
                <SelectItem value="tax">Tax Documents</SelectItem>
                <SelectItem value="expense">Expense Reports</SelectItem>
              </SelectContent>
            </Select>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <Select value={selectedProperty} onValueChange={setSelectedProperty}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Properties" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Properties</SelectItem>
                {properties.map((property) => (
                  <SelectItem key={property.id} value={property.name}>
                    {property.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {/* Content */}
      {activeTab === "statements" ? (
        <Card>
          <CardHeader>
            <CardTitle>Financial Statements & Reports</CardTitle>
            <CardDescription>
              {filteredStatements.length} documents available for download
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredStatements.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p className="text-lg font-medium mb-2">No statements found</p>
                <p className="text-sm">Try adjusting your filters or generate a new statement.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredStatements.map((statement) => (
                  <div key={statement.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-white bg-blue-500`}>
                        {getTypeIcon(statement.type)}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-medium">{statement.title}</h3>
                          <Badge className={getStatusColor(statement.status)}>
                            {statement.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">{statement.description}</p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span>{statement.period}</span>
                          <span className="flex items-center">
                            <DollarSign className="h-3 w-3 mr-1" />
                            ${statement.amount.toLocaleString()}
                          </span>
                          <span>{statement.fileSize} • {statement.pages} pages</span>
                          <span>Generated {formatDate(statement.dateGenerated)}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handlePreview(statement.id)}
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        Preview
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleDownload(statement.id, statement.title)}
                        disabled={statement.status === 'processing'}
                      >
                        <Download className="h-3 w-3 mr-1" />
                        Download
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Booking Receipts</CardTitle>
            <CardDescription>
              {filteredReceipts.length} receipts available for download
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredReceipts.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Receipt className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p className="text-lg font-medium mb-2">No receipts found</p>
                <p className="text-sm">Try adjusting your filters or check back after new bookings.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredReceipts.map((receipt) => (
                  <div key={receipt.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-white bg-green-500">
                        <Receipt className="h-4 w-4" />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-medium">{receipt.guestName}</h3>
                          <Badge className={getStatusColor(receipt.status)}>
                            {receipt.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">
                          <Building2 className="inline h-3 w-3 mr-1" />
                          {receipt.propertyName}
                        </p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span>{formatDate(receipt.checkIn)} - {formatDate(receipt.checkOut)}</span>
                          <span>Booking #{receipt.bookingId}</span>
                          <span className="font-medium text-green-600">
                            ${receipt.total.toLocaleString()}
                          </span>
                          <span>Issued {formatDate(receipt.dateIssued)}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handlePreview(receipt.id)}
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        Preview
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleDownload(receipt.id, `Receipt_${receipt.bookingId}`)}
                      >
                        <Download className="h-3 w-3 mr-1" />
                        Download
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Bulk Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Bulk Actions</CardTitle>
          <CardDescription>Download multiple documents at once</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Download All 2025 Statements
            </Button>
            <Button variant="outline">
              <Calculator className="mr-2 h-4 w-4" />
              Download Tax Package 2024
            </Button>
            <Button variant="outline">
              <Receipt className="mr-2 h-4 w-4" />
              Download All Receipts (Last 30 Days)
            </Button>
            <Button variant="outline">
              <FileText className="mr-2 h-4 w-4" />
              Export Financial Summary (CSV)
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
