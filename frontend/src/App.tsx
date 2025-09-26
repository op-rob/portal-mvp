import { Authenticated, Refine } from "@refinedev/core";
import { DevtoolsPanel, DevtoolsProvider } from "@refinedev/devtools";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";

import routerProvider, {
  CatchAllNavigate,
  DocumentTitleHandler,
  NavigateToResource,
  UnsavedChangesNotifier,
} from "@refinedev/react-router";
import { BrowserRouter, Outlet, Route, Routes } from "react-router";
import "./App.css";
import authProvider from "./authProvider.auth0";
import dataProvider from "./dataProvider.custom";
import { Auth0App } from "./Auth0App";
import { ErrorComponent } from "./components/refine-ui/layout/error-component";
import { Layout } from "./components/refine-ui/layout/layout";
import { Toaster } from "./components/refine-ui/notification/toaster";
import { useNotificationProvider } from "./components/refine-ui/notification/use-notification-provider";
import { ThemeProvider } from "./components/refine-ui/theme/theme-provider";
import { PropertyList } from "./pages/properties/list";
import { Login } from "./pages/login";
import { Dashboard } from "./pages/dashboard";
import { Calendar } from "./pages/calendar";
import { Activity } from "./pages/activity";
import { Revenue } from "./pages/revenue";
import { Statements } from "./pages/statements";

function App() {
  return (
    <Auth0App>
      <BrowserRouter>
        <RefineKbarProvider>
          <ThemeProvider>
            <DevtoolsProvider>
              <Refine
                dataProvider={dataProvider}
                authProvider={authProvider}
                routerProvider={routerProvider}
                notificationProvider={useNotificationProvider()}
                resources={[
                  {
                    name: "dashboard",
                    list: "/",
                    meta: {
                      label: "Dashboard",
                      icon: "📊",
                    },
                  },
                  {
                    name: "calendar",
                    list: "/calendar",
                    meta: {
                      label: "Calendar",
                      icon: "📅",
                    },
                  },
                  {
                    name: "activity",
                    list: "/activity",
                    meta: {
                      label: "Activity",
                      icon: "📋",
                    },
                  },
                  {
                    name: "revenue",
                    list: "/revenue",
                    meta: {
                      label: "Revenue",
                      icon: "💰",
                    },
                  },
                  {
                    name: "statements",
                    list: "/statements",
                    meta: {
                      label: "Statements",
                      icon: "📄",
                    },
                  },
                  {
                    name: "properties",
                    list: "/properties",
                    create: "/properties/create",
                    edit: "/properties/edit/:id",
                    show: "/properties/show/:id",
                    meta: {
                      canDelete: true,
                      label: "Properties",
                      icon: "🏠",
                    },
                  },
                ]}
                options={{
                  syncWithLocation: true,
                  warnWhenUnsavedChanges: true,
                  projectId: "haShx7-LYdexa-ApG8to",
                  title: {
                    text: "OwnerPulse",
                    icon: "🏠",
                  },
                }}
              >
                <Routes>
                  <Route
                    element={
                      <Authenticated
                        key="authenticated-inner"
                        fallback={<CatchAllNavigate to="/login" />}
                      >
                        <Layout>
                          <Outlet />
                        </Layout>
                      </Authenticated>
                    }
                  >
                    <Route
                      index
                      element={<Dashboard />}
                    />
                    <Route path="/calendar">
                      <Route index element={<Calendar />} />
                    </Route>
                    <Route path="/activity">
                      <Route index element={<Activity />} />
                    </Route>
                    <Route path="/revenue">
                      <Route index element={<Revenue />} />
                    </Route>
                    <Route path="/statements">
                      <Route index element={<Statements />} />
                    </Route>
                    <Route path="/properties">
                      <Route index element={<PropertyList />} />
                      {/* TODO: Add PropertyCreate, PropertyEdit, PropertyShow */}
                    </Route>
                    <Route path="*" element={<ErrorComponent />} />
                  </Route>
                  <Route
                    element={
                      <Authenticated
                        key="authenticated-outer"
                        fallback={<Outlet />}
                      >
                        <NavigateToResource />
                      </Authenticated>
                    }
                  >
                    <Route path="/login" element={<Login />} />
                  </Route>
                </Routes>

                <Toaster />
                <RefineKbar />
                <UnsavedChangesNotifier />
                <DocumentTitleHandler />
              </Refine>
              <DevtoolsPanel />
            </DevtoolsProvider>
          </ThemeProvider>
        </RefineKbarProvider>
      </BrowserRouter>
    </Auth0App>
  );
}

export default App;
