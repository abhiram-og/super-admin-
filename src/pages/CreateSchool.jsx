
import React, { useState } from "react";
import { Tenant } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Check, Building2, BookOpen, Users, Zap, Eye, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { withRetry } from "@/components/utils/withRetry";

import IdentityStep from "../components/create-school/IdentityStep";
import ModulesStep from "../components/create-school/ModulesStep";
import StaffStep from "../components/create-school/StaffStep";
import IntegrationsStep from "../components/create-school/IntegrationsStep";
import ReviewStep from "../components/create-school/ReviewStep";

const steps = [
  { id: "identity", title: "School Identity", description: "Basic information", icon: Building2, color: "blue" },
  { id: "modules", title: "Modules", description: "Enable features", icon: BookOpen, color: "purple" },
  { id: "staff", title: "Staff", description: "Invite administrators", icon: Users, color: "green" },
  { id: "integrations", title: "Integrations", description: "Connect services", icon: Zap, color: "orange" },
  { id: "review", title: "Review", description: "Final confirmation", icon: Eye, color: "indigo" },
];

export default function CreateSchool() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [isCreating, setIsCreating] = useState(false);
  const [schoolData, setSchoolData] = useState({
    // Identity
    name: "",
    display_name: "",
    slug: "",
    gstin: "",
    timezone: "Asia/Kolkata",
    locale: "en_IN",
    academic_start_month: 4,

    // Tier (set to basic by default)
    tier: "basic",
    license_state: "trial",
    trial_days: 30,

    // Modules
    modules: {},

    // Staff invitations
    staff: [],

    // Integrations
    integrations: {
      sms: { enabled: false },
      email: { enabled: false },
      whatsapp: { enabled: false },
      push: { enabled: false },
      storage: { enabled: true },
      ai_services: { enabled: false },
    },
  });

  const updateSchoolData = (updates) => {
    setSchoolData((prev) => ({ ...prev, ...updates }));
  };

  const goToStep = (stepIndex) => {
    if (stepIndex >= 0 && stepIndex < steps.length) {
      setCurrentStep(stepIndex);
    }
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0: // Identity
        return schoolData.name && schoolData.display_name && schoolData.slug;
      case 1: // Modules
        return true;
      case 2: // Staff
        return schoolData.staff.length > 0;
      case 3: // Integrations
        return true;
      case 4: // Review
        return true;
      default:
        return false;
    }
  };

  const createSchool = async () => {
    if (!canProceed()) return;

    setIsCreating(true);
    try {
      const trialEndsAt = new Date();
      trialEndsAt.setDate(trialEndsAt.getDate() + schoolData.trial_days);

      const payload = {
        ...schoolData,
        trial_ends_at: trialEndsAt.toISOString(),
        usage_stats: {
          active_users: 0,
          storage_mb: 0,
          sms_sent_today: 0,
          ai_jobs_today: 0,
        },
        health_status: "healthy",
      };

      const newSchool = await withRetry(
        () => Tenant.create(payload),
        { retries: 4, baseDelay: 1000, maxConcurrent: 1 }
      );

      // TODO: Send invitation emails to staff
      // TODO: Initialize integrations

      navigate(createPageUrl("Schools"));
    } catch (error) {
      console.error("Error creating school:", error);
    }
    setIsCreating(false);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return <IdentityStep data={schoolData} updateData={updateSchoolData} />;
      case 1:
        return <ModulesStep data={schoolData} updateData={updateSchoolData} />;
      case 2:
        return <StaffStep data={schoolData} updateData={updateSchoolData} />;
      case 3:
        return <IntegrationsStep data={schoolData} updateData={updateSchoolData} />;
      case 4:
        return <ReviewStep data={schoolData} />;
      default:
        return null;
    }
  };

  const getColorClass = (color) => {
    const colorMap = {
      blue: { bg: "bg-blue-100", text: "text-blue-600", border: "border-blue-200" },
      purple: { bg: "bg-purple-100", text: "text-purple-600", border: "border-purple-200" },
      green: { bg: "bg-green-100", text: "text-green-600", border: "border-green-200" },
      orange: { bg: "bg-orange-100", text: "text-orange-600", border: "border-orange-200" },
      indigo: { bg: "bg-indigo-100", text: "text-indigo-600", border: "border-indigo-200" },
    };
    return colorMap[color] || colorMap.blue;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 p-4 sm:p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-6 bg-white rounded-2xl shadow-sm border border-slate-100">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate(createPageUrl("Schools"))}
            className="flex-shrink-0 rounded-full"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-slate-900 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Create New School
            </h1>
            <p className="text-slate-600 mt-1">Set up a new school with complete configuration</p>
          </div>
          <div className="flex items-center gap-3 bg-slate-50 px-4 py-2 rounded-full">
            <div className="text-sm font-medium text-slate-700">
              Step {currentStep + 1} of {steps.length}
            </div>
            <div className="w-24 bg-slate-200 h-2 rounded-full">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500" 
                style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {steps.map((step, index) => {
            const StepIcon = step.icon;
            const isActive = index === currentStep;
            const isCompleted = index < currentStep;
            const colorClass = getColorClass(step.color);
            
            return (
              <div 
                key={step.id}
                onClick={() => goToStep(index)}
                className={`flex flex-col items-center p-4 rounded-xl cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                  isActive 
                    ? `${colorClass.bg} border-2 ${colorClass.border} shadow-md` 
                    : isCompleted 
                      ? "bg-green-50 border border-green-200 shadow-sm" 
                      : "bg-white border border-slate-100 shadow-sm"
                }`}
              >
                <div className={`flex items-center justify-center w-12 h-12 rounded-full mb-3 transition-all ${
                  isActive 
                    ? `${colorClass.bg} ${colorClass.text} shadow-inner` 
                    : isCompleted 
                      ? "bg-green-100 text-green-600" 
                      : "bg-slate-100 text-slate-400"
                }`}>
                  <StepIcon className="w-6 h-6" />
                </div>
                <h3 className={`text-sm font-semibold text-center ${
                  isActive ? "text-slate-900" : isCompleted ? "text-green-900" : "text-slate-600"
                }`}>
                  {step.title}
                </h3>
                <p className="text-xs text-slate-500 text-center mt-1">{step.description}</p>
                {isCompleted && (
                  <div className="mt-2 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Step Content */}
        <Card className="shadow-lg border-slate-200 overflow-hidden transition-all duration-300">
          <CardHeader className="border-b border-slate-100 px-6 py-5 bg-gradient-to-r from-slate-50 to-white">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-xl ${getColorClass(steps[currentStep].color).bg} ${getColorClass(steps[currentStep].color).text}`}>
                {React.createElement(steps[currentStep].icon, { className: "w-6 h-6" })}
              </div>
              <div>
                <CardTitle className="text-2xl font-bold text-slate-900">{steps[currentStep].title}</CardTitle>
                <p className="text-slate-600 mt-1">{steps[currentStep].description}</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6 bg-white">{renderStepContent()}</CardContent>
        </Card>

        {/* Navigation Buttons */}
        <div className="flex flex-col-reverse sm:flex-row gap-4 sm:gap-0 sm:justify-between items-center p-6 bg-white rounded-2xl shadow-sm border border-slate-100">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 0}
            className="w-full sm:w-auto rounded-full px-6 py-5 border-slate-300 hover:bg-slate-50 transition-all"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>

          <div className="text-sm text-slate-500 text-center mb-4 sm:mb-0 flex items-center gap-2">
            {currentStep < steps.length - 1 ? (
              <>
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Step {currentStep + 1} of {steps.length}</span>
              </>
            ) : (
              <>
                <Check className="w-4 h-4 text-green-500" />
                <span>Ready to create your school</span>
              </>
            )}
          </div>

          {currentStep < steps.length - 1 ? (
            <Button
              onClick={nextStep}
              disabled={!canProceed()}
              className="w-full sm:w-auto rounded-full px-6 py-5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105"
            >
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={createSchool}
              disabled={!canProceed() || isCreating}
              className="w-full sm:w-auto rounded-full px-6 py-5 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 transition-all transform hover:scale-105"
            >
              {isCreating ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Creating...
                </>
              ) : (
                <>
                  Create School
                  <Check className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
