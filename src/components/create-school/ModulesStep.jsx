
import React, { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  XCircle,
  Zap,
  Building,
  Wrench,
  Info,
  ChevronDown,
  ChevronUp,
  Check,
  Users,
  BookOpen,
  Calendar,
  ClipboardCheck,
  CreditCard,
  MessageSquare,
  Globe,
  Headphones,
  DollarSign,
  Home,
  Bus,
  Book,
  CalendarDays,
  Smartphone,
  Package,
  Upload,
  Database,
  FileText,
  Scan,
  Award,
  GraduationCap,
  MessageCircle,
  PaintBucket
} from "lucide-react";
import { Tenant } from "@/api/entities"; // Added import for Tenant entity
import { withRetry } from "@/components/utils/withRetry";

// 🔹 Icon mapping for modules
const moduleIcons = {
  people: Users,
  academics: BookOpen,
  attendance: Calendar,
  examinations: ClipboardCheck,
  fees_finance: CreditCard,
  communication: MessageSquare,
  basic_website: Globe,
  ticket_support: Headphones,
  hr_payroll: DollarSign,
  hostel_meals: Home,
  transport_gps: Bus,
  admissions_certificates: Book,
  library_inventory: Package,
  calendar_events: CalendarDays,
  website_mobile_app: Smartphone,
  inventory_asset_mgmt: Package,
  ai_mass_upload: Upload,
  autonomous_db_recording: Database,
  auto_question_papers: FileText,
  auto_grading: Scan,
  smart_certificates: Award,
  elearning: GraduationCap,
  ai_chatbot: MessageCircle,
  custom_branding: PaintBucket
};

// 🔹 Define module categories
const moduleCategories = {
  "Core Modules": {
    icon: Building,
    color: "blue",
    description: "Essential features for basic school operations",
    modules: [
      { id: "people", name: "People Management", description: "Manage students, teachers, and staff" },
      { id: "academics", name: "Academics & Classes", description: "Class schedules, subjects, and curriculum" },
      { id: "attendance", name: "Daily Attendance", description: "Track student and staff attendance" },
      { id: "examinations", name: "Examinations & Results", description: "Create exams and manage results" },
      { id: "fees_finance", name: "Fees & Finance", description: "Manage fee collection and finances" },
      { id: "communication", name: "Basic Communication", description: "Messaging and notification system" },
      { id: "basic_website", name: "Website Template", description: "Basic school website" },
      { id: "ticket_support", name: "Ticket Support", description: "Helpdesk and support system" },
    ],
  },
  "Operations": {
    icon: Wrench,
    color: "purple",
    description: "Advanced operational management tools",
    modules: [
      { id: "hr_payroll", name: "HR & Payroll System", description: "Human resources and payroll management" },
      { id: "hostel_meals", name: "Hostel & Meal Management", description: "Manage hostel and meal services" },
      { id: "transport_gps", name: "Transport & GPS Tracking", description: "School transport with GPS tracking" },
      { id: "admissions_certificates", name: "Admissions Pipeline", description: "Streamline student admissions process" },
      { id: "library_inventory", name: "Library & Inventory", description: "Library and inventory management" },
      { id: "calendar_events", name: "Events & Calendar", description: "Manage school events and calendar" },
      { id: "website_mobile_app", name: "Custom Website & Mobile App", description: "Custom website and mobile application" },
      { id: "inventory_asset_mgmt", name: "Inventory & Asset Management", description: "Track school assets and inventory" },
    ],
  },
  "AI Features": {
    icon: Zap,
    color: "amber",
    description: "Intelligent automation powered by AI",
    modules: [
      { id: "ai_mass_upload", name: "AI Mass Upload & OCR", description: "Bulk data upload with OCR technology" },
      { id: "autonomous_db_recording", name: "Autonomous Data Recording", description: "Automated data entry and management" },
      { id: "auto_question_papers", name: "Auto Question Paper Generation", description: "Automated question paper creation" },
      { id: "auto_grading", name: "Smart Answer Sheet Grading", description: "Automated grading of answer sheets" },
      { id: "smart_certificates", name: "Intelligent Certificates", description: "Automated certificate generation" },
      { id: "elearning", name: "Built-in E-Learning Platform", description: "Online learning platform" },
      { id: "ai_chatbot", name: "24/7 AI Chatbot", description: "AI-powered assistance and support" },
      { id: "custom_branding", name: "Custom Branding & White-label", description: "Custom branding options for your school" },
    ],
  },
};

// 🔹 Tier mapping
const tierMapping = {
  basic: ["Core Modules"],
  standard: ["Core Modules", "Operations"],
  premium: ["Core Modules", "Operations", "AI Features"],
  customized: [], // free choice
};

export default function ModulesStep({ schoolId, data, updateData, isSuperAdmin = true }) {
  const [expandedCategories, setExpandedCategories] = useState({
    "Core Modules": true,
    "Operations": true,
    "AI Features": true
  });
  const [selectedModule, setSelectedModule] = useState(null);

  const fetchModuleConfiguration = useCallback(async () => {
    try {
      const results = await withRetry(() => Tenant.filter({ id: schoolId }), { maxConcurrent: 1, baseDelay: 1000 });
      const school = Array.isArray(results) ? results[0] : null;
      if (school) {
        updateData({
          tier: school.tier || data.tier,
          modules: school.modules || {}
        });
      }
    } catch (error) {
      console.error("Failed to load module configuration from Tenant entity:", error);
    }
  }, [schoolId, updateData, data?.tier]);

  useEffect(() => {
    if (schoolId) {
      fetchModuleConfiguration();
    }
  }, [fetchModuleConfiguration, schoolId]);

  // 🔹 Auto-apply tier selections
  useEffect(() => {
    if (!data?.tier || data.tier === "customized") return;

    const allowedCategories = tierMapping[data.tier] || [];
    const updates = {};

    Object.entries(moduleCategories).forEach(([category, { modules }]) => {
      modules.forEach((mod) => {
        updates[mod.id] = allowedCategories.includes(category);
      });
    });

    updateData({ modules: updates });
  }, [data?.tier, updateData]);

  const handleModuleToggle = (modId, enabled) => {
    updateData({
      modules: {
        ...data.modules,
        [modId]: enabled,
      }
    });
  };

  const toggleCategory = (category) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const getCategoryStats = (modules) => {
    const enabled = modules.filter((mod) => data.modules?.[mod.id]).length;
    return { enabled, total: modules.length };
  };

  const enableAllInCategory = (category) => {
    if (data?.tier !== "customized") return;
    const updates = {};
    moduleCategories[category].modules.forEach(mod => {
      updates[mod.id] = true;
    });

    updateData({
      modules: {
        ...data.modules,
        ...updates
      }
    });
  };

  const disableAllInCategory = (category) => {
    if (data?.tier !== "customized") return;
    const updates = {};
    moduleCategories[category].modules.forEach(mod => {
      updates[mod.id] = false;
    });

    updateData({
      modules: {
        ...data.modules,
        ...updates
      }
    });
  };

  const colorMap = {
    blue: {
      bg: "bg-blue-50",
      text: "text-blue-700",
      border: "border-blue-200",
      light: "bg-blue-100",
      dark: "bg-blue-600",
      hover: "hover:bg-blue-100"
    },
    purple: {
      bg: "bg-purple-50",
      text: "text-purple-700",
      border: "border-purple-200",
      light: "bg-purple-100",
      dark: "bg-purple-600",
      hover: "hover:bg-purple-100"
    },
    amber: {
      bg: "bg-amber-50",
      text: "text-amber-700",
      border: "border-amber-200",
      light: "bg-amber-100",
      dark: "bg-amber-600",
      hover: "hover:bg-amber-100"
    }
  };

  return (
    <div className="space-y-6 p-4 md:p-6 max-w-7xl mx-auto w-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-1">Module Configuration</h2>
          <p className="text-slate-600 text-sm md:text-base">Customize which features are enabled for your school</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="bg-slate-50 text-slate-600 px-3 py-1 text-sm md:text-base">
            {data.tier?.toUpperCase() || 'STANDARD'} Tier
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 md:gap-6">
        {Object.entries(moduleCategories).map(
          ([category, { icon: CategoryIcon, color, description, modules }]) => {
            const stats = getCategoryStats(modules);
            const colors = colorMap[color];
            const isExpanded = expandedCategories[category];

            return (
              <Card key={category} className={`overflow-hidden ${colors.border} transition-all duration-300`}>
                <CardHeader
                  className={`cursor-pointer ${colors.bg} pb-4 pt-5 px-5 md:px-6`}
                  onClick={() => toggleCategory(category)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${colors.light}`}>
                        <CategoryIcon className={`w-5 h-5 ${colors.text}`} />
                      </div>
                      <div>
                        <CardTitle className="text-lg md:text-xl">{category}</CardTitle>
                        <p className="text-sm text-slate-600 mt-1">{description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className={`${colors.dark} text-white`}>
                        {stats.enabled}/{stats.total}
                      </Badge>
                      {isExpanded ? (
                        <ChevronUp className="text-slate-500 w-5 h-5" />
                      ) : (
                        <ChevronDown className="text-slate-500 w-5 h-5" />
                      )}
                    </div>
                  </div>
                </CardHeader>

                {isExpanded && (
                  <CardContent className="pt-6 px-5 md:px-6 pb-6">
                    <div className="flex flex-wrap gap-2 mb-5">
                      <button
                        disabled={data?.tier !== "customized"}
                        onClick={(e) => {
                          e.stopPropagation();
                          enableAllInCategory(category);
                        }}
                        className="text-xs h-8 px-3 py-1 border rounded-md flex items-center gap-1"
                      >
                        <Check className="w-3 h-3" /> Enable All
                      </button>
                      <button
                        disabled={data?.tier !== "customized"}
                        onClick={(e) => {
                          e.stopPropagation();
                          disableAllInCategory(category);
                        }}
                        className="text-xs h-8 px-3 py-1 border rounded-md flex items-center gap-1"
                      >
                        <XCircle className="w-3 h-3" /> Disable All
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {modules.map((mod) => {
                        const isEnabled = data.modules?.[mod.id];
                        const isSelected = selectedModule === mod.id;
                        const ModIcon = moduleIcons[mod.id];

                        return (
                          <div
                            key={mod.id}
                            className={`p-4 rounded-lg border transition-all cursor-pointer ${
                              isEnabled
                                ? "bg-green-50 border-green-200 shadow-sm"
                                : "bg-slate-50 border-slate-200"
                            } ${isSelected ? "ring-2 ring-blue-500" : ""}`}
                            onClick={() => setSelectedModule(mod.id === selectedModule ? null : mod.id)}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex items-start gap-3 flex-1">
                                <div className={`p-2 rounded-md ${isEnabled ? 'bg-green-100' : 'bg-slate-200'}`}>
                                  <ModIcon className={`w-4 h-4 ${isEnabled ? 'text-green-700' : 'text-slate-500'}`} />
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <h4 className={`font-medium text-sm md:text-base ${isEnabled ? "text-slate-900" : "text-slate-500"}`}>
                                      {mod.name}
                                    </h4>
                                  </div>
                                  <p className="text-xs text-slate-500">
                                    {mod.description}
                                  </p>
                                </div>
                              </div>

                              {isSuperAdmin && (
                                <Switch
                                  checked={!!isEnabled}
                                  disabled={data?.tier !== "customized"}
                                  onCheckedChange={(checked) =>
                                    handleModuleToggle(mod.id, checked)
                                  }
                                  onClick={(e) => e.stopPropagation()}
                                  className="ml-2 flex-shrink-0"
                                />
                              )}
                            </div>

                            {isSelected && (
                              <div className="mt-3 pt-3 border-t border-slate-200">
                                <p className="text-xs text-slate-500">
                                  This module includes features for {mod.description.toLowerCase()}.
                                  It will be accessible to authorized users once enabled.
                                </p>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                )}
              </Card>
            );
          }
        )}
      </div>

      <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium text-slate-900 text-sm md:text-base">Configuration Tips</h4>
            <p className="text-xs text-slate-600 mt-1">
              Enable only the modules you need immediately. You can always enable additional modules later
              as your school's needs evolve. Core modules are recommended for all schools.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
