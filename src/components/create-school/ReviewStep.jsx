import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Building2, 
  Crown, 
  Users, 
  Settings, 
  Check, 
  AlertCircle,
  Calendar,
  Globe,
  Zap
} from "lucide-react";
import { format, addDays } from "date-fns";

export default function ReviewStep({ data }) {
  const moduleDefinitions = {
    people: 'People Management',
    academics: 'Academics & Classes',
    attendance: 'Daily Attendance',
    examinations: 'Examinations & Results',
    fees_finance: 'Fees & Finance',
    communication: 'Basic Communication',
    basic_website: 'Website Template',
    ticket_support: 'Ticket Support',
    hr_payroll: 'HR & Payroll',
    hostel_meals: 'Hostel & Meals',
    transport_gps: 'Transport & GPS',
    admissions_certificates: 'Admissions & Certificates',
    library_inventory: 'Library & Inventory',
    calendar_events: 'Calendar & Events',
    website_mobile_app: 'Website & Mobile App',
    inventory_asset_mgmt: 'Inventory & Asset Management',
    ai_mass_upload: 'AI Mass Upload',
    autonomous_db_recording: 'Autonomous DB Recording',
    auto_question_papers: 'Auto Question Papers',
    auto_grading: 'Auto Answer Sheet Grading',
    smart_certificates: 'Smart Certificates',
    elearning: 'Built-in E-Learning',
    ai_chatbot: '24/7 AI Chatbot',
    custom_branding: 'Custom Branding'
  };

  const enabledModules = Object.entries(data.modules)
    .filter(([_, enabled]) => enabled)
    .map(([moduleId, _]) => moduleDefinitions[moduleId] || moduleId);

  const enabledIntegrations = Object.entries(data.integrations)
    .filter(([_, config]) => config.enabled)
    .map(([integrationId, _]) => integrationId);

  const trialEndDate = addDays(new Date(), data.trial_days);

  const getTierColor = (tier) => {
    switch (tier) {
      case 'basic': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'standard': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'premium': return 'bg-amber-100 text-amber-800 border-amber-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Building2 className="w-8 h-8 text-blue-600" />
        </div>
        <h3 className="text-xl font-semibold text-slate-900 mb-2">Ready to Deploy</h3>
        <p className="text-slate-600">
          Review your school configuration before deployment. You can modify these settings later.
        </p>
      </div>

      {/* School Identity */}
      <Card className="shadow-sm border-slate-200">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-blue-600" />
            School Identity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-slate-500 mb-1">Legal Name</p>
              <p className="font-medium text-slate-900">{data.name}</p>
            </div>
            <div>
              <p className="text-slate-500 mb-1">Display Name</p>
              <p className="font-medium text-slate-900">{data.display_name}</p>
            </div>
            <div>
              <p className="text-slate-500 mb-1">URL Slug</p>
              <p className="font-medium text-slate-900">{data.slug}.medhashaala.com</p>
            </div>
            <div>
              <p className="text-slate-500 mb-1">Academic Year Starts</p>
              <p className="font-medium text-slate-900">
                {new Date(2024, data.academic_start_month - 1).toLocaleDateString('en-US', { month: 'long' })}
              </p>
            </div>
            <div>
              <p className="text-slate-500 mb-1">Timezone</p>
              <p className="font-medium text-slate-900">{data.timezone}</p>
            </div>
            <div>
              <p className="text-slate-500 mb-1">Locale</p>
              <p className="font-medium text-slate-900">{data.locale}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Subscription & License */}
      <Card className="shadow-sm border-slate-200">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2">
            <Crown className="w-5 h-5 text-amber-600" />
            Subscription & License
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <div>
                <p className="font-medium text-slate-900">Selected Tier</p>
                <p className="text-sm text-slate-600">Full access to tier features</p>
              </div>
              <Badge variant="outline" className={getTierColor(data.tier)}>
                {data.tier.charAt(0).toUpperCase() + data.tier.slice(1)}
              </Badge>
            </div>
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <div>
                <p className="font-medium text-slate-900">Trial Period</p>
                <p className="text-sm text-slate-600">Ends {format(trialEndDate, 'MMM d, yyyy')}</p>
              </div>
              <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                {data.trial_days} days
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modules Configuration */}
      <Card className="shadow-sm border-slate-200">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-purple-600" />
            Enabled Modules ({enabledModules.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {enabledModules.map((module, index) => (
              <div key={index} className="flex items-center gap-2 p-2 bg-slate-50 rounded-md">
                <Check className="w-4 h-4 text-green-600" />
                <span className="text-sm text-slate-700">{module}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Staff Members */}
      <Card className="shadow-sm border-slate-200">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-green-600" />
            Staff Members ({data.staff.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {data.staff.map((staff, index) => (
              <div key={index} className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
                <div>
                  <p className="font-medium text-slate-900">{staff.name}</p>
                  <p className="text-sm text-slate-600">{staff.email}</p>
                </div>
                <Badge variant="outline">
                  {staff.role.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Integrations */}
      <Card className="shadow-sm border-slate-200">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-600" />
            Integrations ({enabledIntegrations.length} enabled)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {enabledIntegrations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {enabledIntegrations.map((integration, index) => (
                <div key={index} className="flex items-center gap-2 p-2 bg-slate-50 rounded-md">
                  <Check className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-slate-700 capitalize">
                    {integration.replace(/_/g, ' ')}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4">
              <AlertCircle className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <p className="text-sm text-slate-600">
                No integrations configured. You can set these up later.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Deployment Checklist */}
      <Card className="shadow-sm border-green-200 bg-green-50">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-green-800">
            <Check className="w-5 h-5" />
            Deployment Checklist
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2 text-green-700">
              <Check className="w-4 h-4" />
              <span>School identity configured</span>
            </div>
            <div className="flex items-center gap-2 text-green-700">
              <Check className="w-4 h-4" />
              <span>Subscription tier selected</span>
            </div>
            <div className="flex items-center gap-2 text-green-700">
              <Check className="w-4 h-4" />
              <span>Modules configured based on tier</span>
            </div>
            <div className="flex items-center gap-2 text-green-700">
              <Check className="w-4 h-4" />
              <span>Administrator account will be created</span>
            </div>
            <div className="flex items-center gap-2 text-green-700">
              <Check className="w-4 h-4" />
              <span>Invitation emails will be sent</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}