import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const timezones = [
  { value: 'Asia/Kolkata', label: 'Asia/Kolkata (IST)' },
  { value: 'Asia/Dubai', label: 'Asia/Dubai (GST)' },
  { value: 'America/New_York', label: 'America/New_York (EST)' },
  { value: 'Europe/London', label: 'Europe/London (GMT)' },
];

const locales = [
  { value: 'en_IN', label: 'English (India)' },
  { value: 'hi_IN', label: 'Hindi (India)' },
  { value: 'en_US', label: 'English (US)' },
  { value: 'en_GB', label: 'English (UK)' },
];

const months = [
  { value: 1, label: 'January' },
  { value: 2, label: 'February' },
  { value: 3, label: 'March' },
  { value: 4, label: 'April' },
  { value: 5, label: 'May' },
  { value: 6, label: 'June' },
  { value: 7, label: 'July' },
  { value: 8, label: 'August' },
  { value: 9, label: 'September' },
  { value: 10, label: 'October' },
  { value: 11, label: 'November' },
  { value: 12, label: 'December' },
];

export default function IdentityStep({ data, updateData }) {
  const handleChange = (field, value) => {
    updateData({ [field]: value });
    
    // Auto-generate slug from display name
    if (field === 'display_name') {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/^-+|-+$/g, '');
      updateData({ slug });
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="name">Legal Name *</Label>
          <Input
            id="name"
            placeholder="ABC Public School"
            value={data.name}
            onChange={(e) => handleChange('name', e.target.value)}
          />
          <p className="text-xs text-slate-500">Official registered name of the institution</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="display_name">Display Name *</Label>
          <Input
            id="display_name"
            placeholder="ABC Public School"
            value={data.display_name}
            onChange={(e) => handleChange('display_name', e.target.value)}
          />
          <p className="text-xs text-slate-500">Name shown to users in the application</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="slug">URL Slug *</Label>
          <Input
            id="slug"
            placeholder="abc-public-school"
            value={data.slug}
            onChange={(e) => handleChange('slug', e.target.value)}
          />
          <p className="text-xs text-slate-500">Used in URLs: {data.slug}.medhashaala.com</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="gstin">GSTIN (Optional)</Label>
          <Input
            id="gstin"
            placeholder="22AAAAA0000A1Z5"
            value={data.gstin}
            onChange={(e) => handleChange('gstin', e.target.value)}
          />
          <p className="text-xs text-slate-500">Goods and Services Tax Identification Number</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="timezone">Timezone</Label>
          <Select value={data.timezone} onValueChange={(value) => handleChange('timezone', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select timezone" />
            </SelectTrigger>
            <SelectContent>
              {timezones.map((tz) => (
                <SelectItem key={tz.value} value={tz.value}>
                  {tz.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="locale">Locale</Label>
          <Select value={data.locale} onValueChange={(value) => handleChange('locale', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select locale" />
            </SelectTrigger>
            <SelectContent>
              {locales.map((locale) => (
                <SelectItem key={locale.value} value={locale.value}>
                  {locale.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* 🔹 Academic Year Start Month (left side) */}
        <div className="space-y-2">
          <Label htmlFor="academic_start_month">Academic Year Start Month</Label>
          <Select
            value={data.academic_start_month.toString()}
            onValueChange={(value) => handleChange('academic_start_month', parseInt(value))}
          >
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select month" />
            </SelectTrigger>
            <SelectContent>
              {months.map((month) => (
                <SelectItem key={month.value} value={month.value.toString()}>
                  {month.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-slate-500">
            When does the academic year start? (Most Indian schools start in April)
          </p>
        </div>

        {/* 🔹 Select Features (right side of Academic Year) */}
<div className="space-y-2">
  <Label htmlFor="features">Select Features</Label>
  <Select
    value={data.tier || ""}
    onValueChange={(value) => {
      handleChange("tier", value);

      // also reset modules when tier changes
      updateData({ modules: {} });
    }}
  >
    <SelectTrigger>
      <SelectValue placeholder="Select features" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="basic">Basic</SelectItem>
      <SelectItem value="standard">Standard</SelectItem>
      <SelectItem value="premium">Premium</SelectItem>
      <SelectItem value="customized">Customized</SelectItem>
    </SelectContent>
  </Select>
</div>

      </div>
    </div>
  );
}


