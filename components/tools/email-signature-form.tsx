'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { SignatureData } from '@/lib/tools/generate-signature-html';

interface EmailSignatureFormProps {
  data: SignatureData;
  onChange: (data: SignatureData) => void;
}

export function EmailSignatureForm({ data, onChange }: EmailSignatureFormProps) {
  const handleChange = (field: keyof SignatureData, value: string) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="space-y-5">
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-zinc-300 uppercase tracking-wide">Required</h3>

        <div className="space-y-2">
          <Label htmlFor="fullName">Full Name</Label>
          <Input
            id="fullName"
            type="text"
            placeholder="Jane Smith"
            value={data.fullName}
            onChange={(e) => handleChange('fullName', e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="jobTitle">Job Title</Label>
          <Input
            id="jobTitle"
            type="text"
            placeholder="Freelance Designer"
            value={data.jobTitle}
            onChange={(e) => handleChange('jobTitle', e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="jane@example.com"
            value={data.email}
            onChange={(e) => handleChange('email', e.target.value)}
          />
        </div>
      </div>

      <div className="border-t border-zinc-800 pt-5 space-y-4">
        <h3 className="text-sm font-medium text-zinc-300 uppercase tracking-wide">Optional</h3>

        <div className="space-y-2">
          <Label htmlFor="company">Company</Label>
          <Input
            id="company"
            type="text"
            placeholder="Smith Design Co."
            value={data.company || ''}
            onChange={(e) => handleChange('company', e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            type="tel"
            placeholder="+1 (555) 123-4567"
            value={data.phone || ''}
            onChange={(e) => handleChange('phone', e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="website">Website</Label>
          <Input
            id="website"
            type="url"
            placeholder="https://janesmith.com"
            value={data.website || ''}
            onChange={(e) => handleChange('website', e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="linkedin">LinkedIn</Label>
            <Input
              id="linkedin"
              type="text"
              placeholder="linkedin.com/in/janesmith"
              value={data.linkedin || ''}
              onChange={(e) => handleChange('linkedin', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="twitter">X / Twitter</Label>
            <Input
              id="twitter"
              type="text"
              placeholder="@janesmith"
              value={data.twitter || ''}
              onChange={(e) => handleChange('twitter', e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="photoUrl">Photo URL</Label>
          <Input
            id="photoUrl"
            type="url"
            placeholder="https://example.com/photo.jpg"
            value={data.photoUrl || ''}
            onChange={(e) => handleChange('photoUrl', e.target.value)}
          />
          <p className="text-xs text-zinc-500">Used in &quot;With Photo&quot; template. Square images work best.</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="address">Address / Location</Label>
          <Input
            id="address"
            type="text"
            placeholder="New York, NY"
            value={data.address || ''}
            onChange={(e) => handleChange('address', e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
