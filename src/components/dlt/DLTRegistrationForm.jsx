import React, { useState } from 'react';
import { DLTRegistration } from '@/api/entities';
import { UploadFile } from '@/api/integrations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Upload, File, Loader2 } from 'lucide-react';

export default function DLTRegistrationForm({ school, dltRecord, onSubmitSuccess }) {
  const [formData, setFormData] = useState(dltRecord || { tenant_id: school.id });
  const [isUploading, setIsUploading] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };
  const handleSelectChange = (id, value) => {
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleFileUpload = async (e, fieldName) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(prev => ({ ...prev, [fieldName]: true }));
    try {
      const { file_url } = await UploadFile({ file });
      setFormData(prev => ({ ...prev, [fieldName]: file_url }));
    } catch (error) {
      console.error("File upload failed:", error);
    } finally {
      setIsUploading(prev => ({ ...prev, [fieldName]: false }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (formData.id) {
        await DLTRegistration.update(formData.id, formData);
      } else {
        await DLTRegistration.create(formData);
      }
      onSubmitSuccess?.();
    } catch (error) {
      console.error("DLT submission failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const FileInput = ({ label, fieldName, url }) => (
    <div className="space-y-2">
      <Label className="block text-sm font-medium">{label}</Label>
      <div className="flex flex-wrap items-center gap-2">
        {/* hidden native input */}
        <input
          id={fieldName}
          type="file"
          onChange={(e) => handleFileUpload(e, fieldName)}
          className="hidden"
        />
        <label htmlFor={fieldName} className="w-full sm:w-auto">
          <Button variant="outline" className="w-full sm:w-auto flex items-center gap-2 justify-center min-w-[120px]">
            {isUploading[fieldName]
              ? <Loader2 className="w-4 h-4 animate-spin" />
              : <Upload className="w-4 h-4" />
            }
            <span className="text-sm">{url ? 'Change File' : 'Upload File'}</span>
          </Button>
        </label>

        {url && (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-sm underline ml-1 break-words"
          >
            <File className="w-4 h-4" />
            <span className="max-w-[160px] truncate">View</span>
          </a>
        )}
      </div>
    </div>
  );

  return (
    // vertical scroll only, no horizontal overflow
    <form onSubmit={handleSubmit} className="space-y-4 max-h-[75vh] overflow-y-auto overflow-x-hidden p-4 sm:p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="principal_entity_id">Principal Entity ID</Label>
          <Input id="principal_entity_id" value={formData.principal_entity_id || ''} onChange={handleInputChange} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="telemarketer_id">Telemarketer ID</Label>
          <Input id="telemarketer_id" value={formData.telemarketer_id || ''} onChange={handleInputChange} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="contact_email">Contact Email</Label>
          <Input id="contact_email" type="email" value={formData.contact_email || ''} onChange={handleInputChange} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="contact_phone">Contact Phone</Label>
          <Input id="contact_phone" type="tel" value={formData.contact_phone || ''} onChange={handleInputChange} />
        </div>
      </div>

      {/* responsive file inputs: stack on mobile */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 border-t pt-4">
        <FileInput label="Certificate of Incorporation" fieldName="company_coi_url" url={formData.company_coi_url} />
        <FileInput label="GST Certificate" fieldName="company_gst_url" url={formData.company_gst_url} />
        <FileInput label="Letter of Authority" fieldName="company_loa_url" url={formData.company_loa_url} />
      </div>

      <div className="border-t pt-4 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="status">Registration Status</Label>
          <Select
            value={formData.status || 'not_submitted'}
            onValueChange={(v) => handleSelectChange('status', v)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="not_submitted">Not Submitted</SelectItem>
              <SelectItem value="submitted">Submitted</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
              <SelectItem value="resubmission_required">Resubmission Required</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes">Notes</Label>
          <Textarea id="notes" value={formData.notes || ''} onChange={handleInputChange} />
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          Save Changes
        </Button>
      </div>
    </form>
  );
}
