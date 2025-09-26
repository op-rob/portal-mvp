import { DataProvider } from "@refinedev/core";
import simpleRestProvider from "@refinedev/simple-rest";

interface AuthTokenProvider {
  getAccessToken: () => Promise<string>;
}

let tokenProvider: AuthTokenProvider;

export const setTokenProvider = (provider: AuthTokenProvider) => {
  tokenProvider = provider;
};

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

// Create the base data provider
const baseDataProvider = simpleRestProvider(API_URL);

// Wrap the data provider to add authentication headers
const dataProvider: DataProvider = {
  ...baseDataProvider,
  
  // Override all HTTP methods to add auth headers
  getList: async ({ resource, pagination, filters, sorters, meta }) => {
    const headers = await getAuthHeaders();
    return baseDataProvider.getList({
      resource,
      pagination,
      filters,
      sorters,
      meta: {
        ...meta,
        headers,
      },
    });
  },
  
  getOne: async ({ resource, id, meta }) => {
    const headers = await getAuthHeaders();
    return baseDataProvider.getOne({
      resource,
      id,
      meta: {
        ...meta,
        headers,
      },
    });
  },
  
  create: async ({ resource, variables, meta }) => {
    const headers = await getAuthHeaders();
    return baseDataProvider.create({
      resource,
      variables,
      meta: {
        ...meta,
        headers,
      },
    });
  },
  
  update: async ({ resource, id, variables, meta }) => {
    const headers = await getAuthHeaders();
    return baseDataProvider.update({
      resource,
      id,
      variables,
      meta: {
        ...meta,
        headers,
      },
    });
  },
  
  deleteOne: async ({ resource, id, meta }) => {
    const headers = await getAuthHeaders();
    return baseDataProvider.deleteOne({
      resource,
      id,
      meta: {
        ...meta,
        headers,
      },
    });
  },
  
  getApiUrl: () => API_URL,
};

// Helper function to get auth headers
const getAuthHeaders = async () => {
  try {
    if (tokenProvider) {
      const token = await tokenProvider.getAccessToken();
      return {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };
    }
  } catch (error) {
    console.warn("Failed to get access token:", error);
  }
  
  return {
    "Content-Type": "application/json",
  };
};

export default dataProvider;