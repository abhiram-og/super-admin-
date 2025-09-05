// Django Backend API Client
class DjangoApiClient {
  constructor(baseURL = 'http://localhost:8000/api') {
    this.baseURL = baseURL;
    this.token = null;
  }

  setToken(token) {
    this.token = token;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    const config = {
      ...options,
      headers,
    };

    if (config.body && typeof config.body === 'object') {
      config.body = JSON.stringify(config.body);
    }

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      }
      
      return await response.text();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // HTTP Methods
  get(endpoint, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;
    return this.request(url, { method: 'GET' });
  }

  post(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'POST',
      body: data,
    });
  }

  put(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'PUT',
      body: data,
    });
  }

  patch(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'PATCH',
      body: data,
    });
  }

  delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }
}

// Create the main API client instance
export const apiClient = new DjangoApiClient();

// API Endpoints
export const api = {
  // Schools
  schools: {
    list: (params) => apiClient.get('/schools/schools/', params),
    get: (id) => apiClient.get(`/schools/schools/${id}/`),
    create: (data) => apiClient.post('/schools/schools/', data),
    update: (id, data) => apiClient.patch(`/schools/schools/${id}/`, data),
    delete: (id) => apiClient.delete(`/schools/schools/${id}/`),
    statistics: () => apiClient.get('/schools/schools/statistics/'),
    activate: (id) => apiClient.post(`/schools/schools/${id}/activate/`),
    suspend: (id) => apiClient.post(`/schools/schools/${id}/suspend/`),
    usageStats: (id) => apiClient.get(`/schools/schools/${id}/usage_stats/`),
    expiringLicenses: (days = 30) => apiClient.get('/schools/schools/expiring_licenses/', { days }),
  },

  // School Tiers
  schoolTiers: {
    list: () => apiClient.get('/schools/tiers/'),
    get: (id) => apiClient.get(`/schools/tiers/${id}/`),
    create: (data) => apiClient.post('/schools/tiers/', data),
    update: (id, data) => apiClient.patch(`/schools/tiers/${id}/`, data),
    delete: (id) => apiClient.delete(`/schools/tiers/${id}/`),
  },

  // School Staff
  schoolStaff: {
    list: (params) => apiClient.get('/schools/staff/', params),
    get: (id) => apiClient.get(`/schools/staff/${id}/`),
    create: (data) => apiClient.post('/schools/staff/', data),
    update: (id, data) => apiClient.patch(`/schools/staff/${id}/`, data),
    delete: (id) => apiClient.delete(`/schools/staff/${id}/`),
  },

  // Dashboard
  dashboard: {
    systemHealth: () => apiClient.get('/dashboard/system-health/overview/'),
    platformMetrics: () => apiClient.get('/dashboard/metrics/dashboard_summary/'),
    revenueChart: (days = 30) => apiClient.get('/dashboard/metrics/revenue_chart/', { days }),
    recentActivities: () => apiClient.get('/dashboard/activities/summary/'),
    aiQuizAnalytics: (days = 30) => apiClient.get('/dashboard/ai-quiz/analytics/', { days }),
  },

  // Integrations
  integrations: {
    list: (params) => apiClient.get('/integrations/integrations/', params),
    get: (id) => apiClient.get(`/integrations/integrations/${id}/`),
    create: (data) => apiClient.post('/integrations/integrations/', data),
    update: (id, data) => apiClient.patch(`/integrations/integrations/${id}/`, data),
    delete: (id) => apiClient.delete(`/integrations/integrations/${id}/`),
    types: () => apiClient.get('/integrations/integrations/types/'),
    schools: (id) => apiClient.get(`/integrations/integrations/${id}/schools/`),
  },

  // School Integrations
  schoolIntegrations: {
    list: (params) => apiClient.get('/integrations/school-integrations/', params),
    get: (id) => apiClient.get(`/integrations/school-integrations/${id}/`),
    create: (data) => apiClient.post('/integrations/school-integrations/', data),
    update: (id, data) => apiClient.patch(`/integrations/school-integrations/${id}/`, data),
    enable: (id) => apiClient.post(`/integrations/school-integrations/${id}/enable/`),
    disable: (id) => apiClient.post(`/integrations/school-integrations/${id}/disable/`),
    statistics: () => apiClient.get('/integrations/school-integrations/statistics/'),
  },

  // DLT Registrations
  dltRegistrations: {
    list: (params) => apiClient.get('/integrations/dlt-registrations/', params),
    get: (id) => apiClient.get(`/integrations/dlt-registrations/${id}/`),
    create: (data) => apiClient.post('/integrations/dlt-registrations/', data),
    update: (id, data) => apiClient.patch(`/integrations/dlt-registrations/${id}/`, data),
    approve: (id) => apiClient.post(`/integrations/dlt-registrations/${id}/approve/`),
    reject: (id, reason) => apiClient.post(`/integrations/dlt-registrations/${id}/reject/`, { reason }),
    statistics: () => apiClient.get('/integrations/dlt-registrations/statistics/'),
  },

  // Compliance
  compliance: {
    auditLogs: {
      list: (params) => apiClient.get('/compliance/audit-logs/', params),
      get: (id) => apiClient.get(`/compliance/audit-logs/${id}/`),
      statistics: () => apiClient.get('/compliance/audit-logs/statistics/'),
    },
    complaints: {
      list: (params) => apiClient.get('/compliance/complaints/', params),
      get: (id) => apiClient.get(`/compliance/complaints/${id}/`),
      create: (data) => apiClient.post('/compliance/complaints/', data),
      update: (id, data) => apiClient.patch(`/compliance/complaints/${id}/`, data),
      assign: (id, assignedToId) => apiClient.post(`/compliance/complaints/${id}/assign/`, { assigned_to_id: assignedToId }),
      resolve: (id, resolution) => apiClient.post(`/compliance/complaints/${id}/resolve/`, { resolution }),
      statistics: () => apiClient.get('/compliance/complaints/statistics/'),
    },
    reports: {
      list: (params) => apiClient.get('/compliance/reports/', params),
      get: (id) => apiClient.get(`/compliance/reports/${id}/`),
      create: (data) => apiClient.post('/compliance/reports/', data),
      generate: (id) => apiClient.post(`/compliance/reports/${id}/generate/`),
      types: () => apiClient.get('/compliance/reports/types/'),
    },
  },

  // Analytics
  analytics: {
    userEngagement: {
      globalStats: (days = 30) => apiClient.get('/analytics/user-engagement/global_stats/', { days }),
      schoolComparison: (days = 30) => apiClient.get('/analytics/user-engagement/school_comparison/', { days }),
    },
    revenue: {
      dashboard: (days = 30) => apiClient.get('/analytics/revenue/revenue_dashboard/', { days }),
      subscriptionMetrics: (days = 30) => apiClient.get('/analytics/revenue/subscription_metrics/', { days }),
    },
    featureUsage: {
      popularFeatures: (days = 30) => apiClient.get('/analytics/feature-usage/popular_features/', { days }),
      performance: (featureName, days = 30) => apiClient.get('/analytics/feature-usage/feature_performance/', { feature_name: featureName, days }),
    },
    tenantHealth: {
      overview: () => apiClient.get('/analytics/tenant-health/health_overview/'),
      schoolTrend: (id, days = 30) => apiClient.get(`/analytics/tenant-health/${id}/school_health_trend/`, { days }),
    },
  },

  // Users
  users: {
    list: (params) => apiClient.get('/users/users/', params),
    get: (id) => apiClient.get(`/users/users/${id}/`),
    create: (data) => apiClient.post('/users/users/', data),
    update: (id, data) => apiClient.patch(`/users/users/${id}/`, data),
    activate: (id) => apiClient.post(`/users/users/${id}/activate/`),
    deactivate: (id) => apiClient.post(`/users/users/${id}/deactivate/`),
    statistics: () => apiClient.get('/users/users/statistics/'),
  },
};

export default api;