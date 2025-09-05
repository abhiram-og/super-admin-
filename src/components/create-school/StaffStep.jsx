import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  UserPlus, X, Mail, User, Shield, Info, Edit, Eye, EyeOff, Key, RefreshCw 
} from "lucide-react";

// Only include the school administrator role
const roleTemplates = [
  { id: 'school_admin', name: 'School Administrator', description: 'Full access to all modules and settings', default: true }
];

// Helper function to generate a random password
const generatePassword = () => {
  const length = 12;
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
  let password = "";
  for (let i = 0; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return password;
};

export default function StaffStep({ data, updateData }) {
  const [newStaff, setNewStaff] = useState({
    email: '',
    name: '',
    password: generatePassword(),
    role: 'school_admin'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  const handleAddStaff = () => {
    if (!newStaff.email || !newStaff.name || !newStaff.password) return;
    
    const updatedStaff = [
      ...data.staff,
      {
        ...newStaff,
        id: Date.now().toString()
      }
    ];
    
    updateData({ staff: updatedStaff });
    setNewStaff({ 
      email: '', 
      name: '', 
      password: generatePassword(),
      role: 'school_admin' 
    });
  };

  const handleRemoveStaff = (staffId) => {
    const updatedStaff = data.staff.filter(s => s.id !== staffId);
    updateData({ staff: updatedStaff });
    if (editingId === staffId) {
      setEditingId(null);
    }
  };

  const handleEditStaff = (staffId) => {
    const staff = data.staff.find(s => s.id === staffId);
    if (staff) {
      setEditingId(staffId);
      setEditForm({ ...staff });
    }
  };

  const handleSaveEdit = () => {
    if (!editForm.email || !editForm.name || !editForm.password) return;
    
    const updatedStaff = data.staff.map(s => 
      s.id === editingId ? { ...editForm } : s
    );
    
    updateData({ staff: updatedStaff });
    setEditingId(null);
    setEditForm({});
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const handleGeneratePassword = () => {
    setNewStaff({ ...newStaff, password: generatePassword() });
  };

  const handleGenerateEditPassword = () => {
    setEditForm({ ...editForm, password: generatePassword() });
  };

  const hasSchoolAdmin = data.staff.some(s => s.role === 'school_admin');

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold text-slate-900 mb-2">Staff Setup</h3>
        <p className="text-slate-600">
          Add School Administrators who will receive invitation emails to set up their accounts.
          At least one School Administrator is required.
        </p>
      </div>

      {/* Requirements Check */}
      <div className={`p-4 rounded-lg border ${hasSchoolAdmin ? 'bg-green-50 border-green-200' : 'bg-amber-50 border-amber-200'}`}>
        <div className="flex items-center gap-2 mb-2">
          <div className={`p-1.5 rounded-full ${hasSchoolAdmin ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'}`}>
            <Info className="w-4 h-4" />
          </div>
          <h4 className="font-medium text-slate-900">Requirements</h4>
        </div>
        <p className="text-sm">
          {hasSchoolAdmin 
            ? 'Great! You have added a School Administrator who will receive setup instructions.'
            : 'Please add at least one School Administrator to proceed.'
          }
        </p>
      </div>

      {/* Add New Staff Form */}
      <Card className="shadow-sm border-slate-200">
        <CardContent className="p-6">
          <h4 className="font-medium text-slate-900 mb-4 flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-blue-600" />
            Add School Administrator
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="space-y-2">
              <Label htmlFor="staff-email" className="text-sm">Email Address *</Label>
              <Input
                id="staff-email"
                type="email"
                placeholder="admin@school.com"
                value={newStaff.email}
                onChange={(e) => setNewStaff({ ...newStaff, email: e.target.value })}
                className="text-sm"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="staff-name" className="text-sm">Full Name *</Label>
              <Input
                id="staff-name"
                placeholder="John Doe"
                value={newStaff.name}
                onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })}
                className="text-sm"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="space-y-2">
              <Label htmlFor="staff-password" className="text-sm">Password *</Label>
              <div className="relative">
                <Input
                  id="staff-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                  value={newStaff.password}
                  onChange={(e) => setNewStaff({ ...newStaff, password: e.target.value })}
                  className="text-sm pr-10"
                />
                <div className="absolute inset-y-0 right-0 flex items-center">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-full px-3"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm opacity-0">Generate</Label>
              <Button
                onClick={handleGeneratePassword}
                variant="outline"
                className="w-full gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Generate Strong Password
              </Button>
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button
              onClick={handleAddStaff}
              disabled={!newStaff.email || !newStaff.name || !newStaff.password}
              className="gap-2"
            >
              <UserPlus className="w-4 h-4" />
              Add Administrator
            </Button>
          </div>
          
          <div className="mt-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
            <div className="flex items-center gap-2 mb-1">
              <Shield className="w-4 h-4 text-purple-600" />
              <p className="text-sm font-medium text-purple-900">
                School Administrator
              </p>
              <Badge variant="outline" className="bg-purple-100 text-purple-700 text-xs">Default Role</Badge>
            </div>
            <p className="text-xs text-purple-700">
              Full access to all modules and settings. This role is required for initial setup.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Added Staff List */}
      {data.staff.length > 0 && (
        <Card className="shadow-sm border-slate-200">
          <CardContent className="p-6">
            <h4 className="font-medium text-slate-900 mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-blue-600" />
              Added School Administrators ({data.staff.length})
            </h4>
            
            <div className="space-y-4">
              {data.staff.map((staff) => (
                <div key={staff.id} className="border border-slate-200 rounded-lg bg-white p-4">
                  {editingId === staff.id ? (
                    // Edit Mode
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-sm">Email Address *</Label>
                          <Input
                            type="email"
                            value={editForm.email}
                            onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                            className="text-sm"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label className="text-sm">Full Name *</Label>
                          <Input
                            value={editForm.name}
                            onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                            className="text-sm"
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-sm">Password *</Label>
                          <div className="relative">
                            <Input
                              type={showPassword ? "text" : "password"}
                              value={editForm.password}
                              onChange={(e) => setEditForm({ ...editForm, password: e.target.value })}
                              className="text-sm pr-10"
                            />
                            <div className="absolute inset-y-0 right-0 flex items-center">
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-full px-3"
                                onClick={() => setShowPassword(!showPassword)}
                              >
                                {showPassword ? (
                                  <EyeOff className="h-4 w-4" />
                                ) : (
                                  <Eye className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label className="text-sm opacity-0">Generate</Label>
                          <Button
                            onClick={handleGenerateEditPassword}
                            variant="outline"
                            className="w-full gap-2"
                          >
                            <RefreshCw className="w-4 h-4" />
                            Generate New Password
                          </Button>
                        </div>
                      </div>
                      
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={handleCancelEdit}>
                          Cancel
                        </Button>
                        <Button onClick={handleSaveEdit}>
                          Save Changes
                        </Button>
                      </div>
                    </div>
                  ) : (
                    // View Mode
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-slate-600" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-medium text-slate-900">{staff.name}</p>
                            <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-200 text-xs">
                              School Administrator
                              <Shield className="w-3 h-3 ml-1" />
                            </Badge>
                          </div>
                          <div className="flex items-center gap-1 text-sm text-slate-600">
                            <Mail className="w-3 h-3" />
                            {staff.email}
                          </div>
                          <div className="flex items-center gap-1 text-sm text-slate-500 mt-1">
                            <Key className="w-3 h-3" />
                            Password: ••••••••
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditStaff(staff.id)}
                          className="text-slate-600 hover:text-blue-600 hover:bg-blue-50"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveStaff(staff.id)}
                          className="text-slate-400 hover:text-red-600 hover:bg-red-50"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {data.staff.length === 0 && (
        <Card className="shadow-sm border-slate-200">
          <CardContent className="p-6 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-slate-400" />
            </div>
            <h4 className="font-medium text-slate-900 mb-2">No administrators added yet</h4>
            <p className="text-slate-600 text-sm">
              Add at least one School Administrator to get started with your school setup.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}