import { useLogin } from "@refinedev/core";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";

export const Login = () => {
  const { mutate: login, isPending } = useLogin();

  const handleLogin = () => {
    login({});
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">
            🏠 OwnerPulse
          </CardTitle>
          <CardDescription>
            Property management for rental owners
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-center text-gray-600">
              Sign in to manage your rental properties, track bookings, and monitor work orders.
            </p>
            
            <Button 
              onClick={handleLogin} 
              disabled={isPending}
              className="w-full"
              size="lg"
            >
              {isPending ? "Signing in..." : "Sign in with Auth0"}
            </Button>
            
            <div className="text-center">
              <p className="text-xs text-gray-500">
                Secure authentication powered by Auth0
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
