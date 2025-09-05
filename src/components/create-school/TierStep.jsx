import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check, Crown, Star, Zap } from "lucide-react";

const tiers = [
  {
    id: 'basic',
    name: 'Basic',
    icon: Zap,
    price: '₹2,999/month',
    description: 'Essential school management features',
    features: [
      'People Management',
      'Academics & Classes',
      'Daily Attendance',
      'Examinations & Results',
      'Fees & Finance',
      'Basic Communication',
      'Website Template',
      'Ticket Support'
    ],
    color: 'blue'
  },
  {
    id: 'standard',
    name: 'Standard',
    icon: Star,
    price: '₹5,999/month',
    description: 'Advanced operations management',
    popular: true,
    features: [
      'Everything in Basic',
      'HR & Payroll System',
      'Hostel & Meal Management',
      'Transport & GPS Tracking',
      'Admissions Pipeline',
      'Library & Inventory',
      'Events & Calendar',
      'Custom Website & Mobile App'
    ],
    color: 'purple'
  },
  {
    id: 'premium',
    name: 'Premium',
    icon: Crown,
    price: '₹9,999/month',
    description: 'AI-powered intelligent automation',
    features: [
      'Everything in Standard',
      'AI Mass Upload & OCR',
      'Autonomous Data Recording',
      'Auto Question Paper Generation',
      'Smart Answer Sheet Grading',
      'Intelligent Certificates',
      'Built-in E-Learning Platform',
      '24/7 AI Chatbot',
      'Custom Branding & White-label'
    ],
    color: 'amber'
  }
];

const colorVariants = {
  blue: {
    border: 'border-blue-200',
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    button: 'bg-blue-600 hover:bg-blue-700'
  },
  purple: {
    border: 'border-purple-200',
    bg: 'bg-purple-50',
    text: 'text-purple-700',
    button: 'bg-purple-600 hover:bg-purple-700'
  },
  amber: {
    border: 'border-amber-200',
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    button: 'bg-amber-600 hover:bg-amber-700'
  }
};

export default function TierStep({ data, updateData }) {
  const handleTierSelect = (tierId) => {
    updateData({ tier: tierId });
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-slate-900 mb-2">Choose Your Plan</h3>
        <p className="text-slate-600">Select the tier that best fits your school's needs. You can upgrade anytime.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {tiers.map((tier) => {
          const TierIcon = tier.icon;
          const colors = colorVariants[tier.color];
          const isSelected = data.tier === tier.id;

          return (
            <Card
              key={tier.id}
              className={`relative cursor-pointer transition-all duration-200 ${
                isSelected
                  ? `ring-2 ring-${tier.color}-500 ${colors.border} shadow-lg`
                  : 'border-slate-200 hover:shadow-md'
              }`}
              onClick={() => handleTierSelect(tier.id)}
            >
              {tier.popular && (
                <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-purple-600">
                  Most Popular
                </Badge>
              )}
              
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className={`p-3 rounded-lg ${colors.bg}`}>
                    <TierIcon className={`w-6 h-6 ${colors.text}`} />
                  </div>
                  {isSelected && (
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
                <CardTitle className="text-xl">{tier.name}</CardTitle>
                <div className="space-y-1">
                  <p className="text-2xl font-bold text-slate-900">{tier.price}</p>
                  <p className="text-sm text-slate-600">{tier.description}</p>
                </div>
              </CardHeader>

              <CardContent>
                <ul className="space-y-3">
                  {tier.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3 text-sm">
                      <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  className={`w-full mt-6 ${
                    isSelected ? colors.button : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                  onClick={() => handleTierSelect(tier.id)}
                >
                  {isSelected ? 'Selected' : `Choose ${tier.name}`}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="bg-slate-50 p-6 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="trial_days">Trial Period (Days)</Label>
            <Input
              id="trial_days"
              type="number"
              min="7"
              max="90"
              value={data.trial_days}
              onChange={(e) => updateData({ trial_days: parseInt(e.target.value) })}
            />
            <p className="text-xs text-slate-500">Free trial period before billing starts</p>
          </div>
          <div className="space-y-2">
            <Label>License State</Label>
            <div className="flex items-center gap-2 h-10">
              <Badge variant="outline" className="bg-blue-50 text-blue-700">
                Trial
              </Badge>
              <span className="text-sm text-slate-600">Will auto-activate after trial</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}