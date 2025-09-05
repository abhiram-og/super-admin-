// Mock Data for Development (when backend is not available)

export const mockData = {
  schools: [
    {
      id: '1',
      name: 'Springfield Elementary School',
      code: 'SPR001',
      email: 'admin@springfield-elem.edu',
      phone: '+1-555-0101',
      status: 'active',
      tier_name: 'standard',
      total_students: 450,
      total_teachers: 25,
      total_admins: 3,
      staff_count: 8,
      subscription_end: '2024-12-31T00:00:00Z',
      license_expiry: '2024-12-31T00:00:00Z',
      created_at: '2024-01-01T00:00:00Z',
    },
    {
      id: '2',
      name: 'Roosevelt High School',
      code: 'ROO001',
      email: 'principal@roosevelt-high.edu',
      phone: '+1-555-0102',
      status: 'active',
      tier_name: 'premium',
      total_students: 1200,
      total_teachers: 80,
      total_admins: 8,
      staff_count: 25,
      subscription_end: '2024-12-31T00:00:00Z',
      license_expiry: '2024-12-31T00:00:00Z',
      created_at: '2024-01-15T00:00:00Z',
    },
    {
      id: '3',
      name: 'Sunshine Academy',
      code: 'SUN001',
      email: 'info@sunshine-academy.edu',
      phone: '+1-555-0103',
      status: 'trial',
      tier_name: 'basic',
      total_students: 85,
      total_teachers: 8,
      total_admins: 2,
      staff_count: 5,
      subscription_end: '2024-03-31T00:00:00Z',
      license_expiry: '2024-03-31T00:00:00Z',
      created_at: '2024-02-01T00:00:00Z',
    },
  ],

  schoolStatistics: {
    total_schools: 3,
    active_schools: 2,
    trial_schools: 1,
    suspended_schools: 0,
    expired_licenses: 0,
    expiring_soon: 1,
    tier_distribution: [
      { tier__name: 'basic', count: 1 },
      { tier__name: 'standard', count: 1 },
      { tier__name: 'premium', count: 1 },
    ],
  },

  systemHealth: {
    total_components: 5,
    healthy: 4,
    warning: 1,
    critical: 0,
    down: 0,
    average_response_time: 124.26,
    average_uptime: 99.27,
    components: [
      { component: 'database', status: 'healthy', response_time: 45.2, uptime_percentage: 99.9 },
      { component: 'api', status: 'healthy', response_time: 120.5, uptime_percentage: 99.8 },
      { component: 'cache', status: 'healthy', response_time: 15.1, uptime_percentage: 99.95 },
      { component: 'storage', status: 'warning', response_time: 250.3, uptime_percentage: 98.5 },
      { component: 'email', status: 'healthy', response_time: 890.2, uptime_percentage: 99.2 },
    ],
  },

  platformMetrics: {
    current_metrics: {
      date: '2024-01-31',
      total_schools: 3,
      active_schools: 2,
      trial_schools: 1,
      total_students: 1735,
      total_teachers: 113,
      total_logins: 534,
      total_quiz_attempts: 267,
      total_revenue: '12450.00',
      monthly_recurring_revenue: '9800.00',
      api_requests: 15420,
      error_rate: 1.2,
      average_response_time: 156.7,
    },
    trends: {
      revenue: [8500, 9200, 10100, 11800, 12450],
      schools: [1, 2, 2, 3, 3],
      students: [450, 935, 1320, 1620, 1735],
      dates: ['2024-01-27', '2024-01-28', '2024-01-29', '2024-01-30', '2024-01-31'],
    },
    growth_rates: {
      revenue_growth: 5.5,
      schools_growth: 0,
      students_growth: 7.1,
    },
  },

  recentActivities: {
    recent_activities: [
      {
        id: '1',
        activity_type: 'school_created',
        title: 'New school registered',
        description: 'Sunshine Academy has been added to the platform',
        school_name: 'Sunshine Academy',
        created_at: '2024-01-31T10:30:00Z',
      },
      {
        id: '2',
        activity_type: 'integration_enabled',
        title: 'SMS integration enabled',
        description: 'Springfield Elementary enabled Twilio SMS integration',
        school_name: 'Springfield Elementary School',
        created_at: '2024-01-31T09:15:00Z',
      },
      {
        id: '3',
        activity_type: 'tier_upgraded',
        title: 'Plan upgraded',
        description: 'Roosevelt High School upgraded to Premium tier',
        school_name: 'Roosevelt High School',
        created_at: '2024-01-30T16:45:00Z',
      },
    ],
  },

  integrations: [
    {
      id: '1',
      name: 'Twilio SMS',
      type: 'sms',
      provider: 'Twilio',
      status: 'active',
      description: 'SMS notifications via Twilio',
    },
    {
      id: '2',
      name: 'SendGrid Email',
      type: 'email',
      provider: 'SendGrid',
      status: 'active',
      description: 'Email notifications via SendGrid',
    },
    {
      id: '3',
      name: 'Stripe Payments',
      type: 'payment',
      provider: 'Stripe',
      status: 'active',
      description: 'Payment processing via Stripe',
    },
    {
      id: '4',
      name: 'OpenAI GPT',
      type: 'ai',
      provider: 'OpenAI',
      status: 'active',
      description: 'AI-powered quiz generation',
    },
  ],

  complaints: [
    {
      id: '1',
      ticket_number: 'TKT-12345678',
      title: 'Login issues with teacher portal',
      description: 'Teachers are unable to log in to the portal since yesterday',
      category: 'technical',
      priority: 'high',
      status: 'open',
      school_name: 'Springfield Elementary School',
      reporter_name: 'John Smith',
      reporter_email: 'j.smith@school.edu',
      created_at: '2024-01-31T08:00:00Z',
    },
    {
      id: '2',
      ticket_number: 'TKT-87654321',
      title: 'Billing discrepancy in monthly invoice',
      description: 'The invoice amount does not match our agreed pricing',
      category: 'billing',
      priority: 'medium',
      status: 'in_progress',
      school_name: 'Roosevelt High School',
      reporter_name: 'Jane Doe',
      reporter_email: 'j.doe@school.edu',
      created_at: '2024-01-30T14:30:00Z',
    },
  ],
};

// Mock API with error simulation
export const mockApi = {
  // Schools
  schools: {
    list: async (params) => {
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
      return { results: mockData.schools, count: mockData.schools.length };
    },
    statistics: async () => {
      await new Promise(resolve => setTimeout(resolve, 300));
      return mockData.schoolStatistics;
    },
  },

  // Dashboard
  dashboard: {
    systemHealth: async () => {
      await new Promise(resolve => setTimeout(resolve, 400));
      return mockData.systemHealth;
    },
    platformMetrics: async () => {
      await new Promise(resolve => setTimeout(resolve, 600));
      return mockData.platformMetrics;
    },
    recentActivities: async () => {
      await new Promise(resolve => setTimeout(resolve, 200));
      return mockData.recentActivities;
    },
  },

  // Integrations
  integrations: {
    list: async () => {
      await new Promise(resolve => setTimeout(resolve, 300));
      return { results: mockData.integrations };
    },
  },

  // Compliance
  compliance: {
    complaints: {
      list: async () => {
        await new Promise(resolve => setTimeout(resolve, 400));
        return { results: mockData.complaints };
      },
    },
  },
};