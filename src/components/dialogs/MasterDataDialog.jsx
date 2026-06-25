import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Save } from 'lucide-react';
import { api, formatApiError } from '../../lib/api';
import { toast } from '../../hooks/use-toast';

/**
 * Generic Add/Edit dialog for master data resources.
 * Configured via the `fields` prop per resource.
 */
export const MasterDataDialog = ({ open, onClose, onSaved, resource, title, fields, initial }) => {
  const isEdit = !!initial;
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      const initialState = {};
      fields.forEach((f) => { initialState[f.key] = initial?.[f.key] ?? f.default ?? ''; });
      setForm(initialState);
    }
  }, [open, initial, fields]);

  const set = (k) => (v) => setForm((f) => ({ ...f, [k]: typeof v === 'object' && v?.target ? v.target.value : v }));

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form };
      // remove empty optional fields
      Object.keys(payload).forEach((k) => { if (payload[k] === '') delete payload[k]; });
      if (isEdit) {
        await api.put(`/${resource}/${initial.id}`, payload);
        toast({ title: 'Updated', description: `${title} updated successfully` });
      } else {
        await api.post(`/${resource}`, payload);
        toast({ title: 'Created', description: `New ${title.toLowerCase()} added` });
      }
      onSaved?.();
      onClose();
    } catch (err) {
      toast({ title: 'Save failed', description: formatApiError(err), variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? `Edit ${title}` : `Add ${title}`}</DialogTitle>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          {fields.map((f) => (
            <div key={f.key}>
              <Label>{f.label}{f.required && ' *'}</Label>
              {f.type === 'textarea' ? (
                <Textarea value={form[f.key] || ''} onChange={set(f.key)} className="mt-1.5" rows={3} />
              ) : f.type === 'select' ? (
                <Select value={form[f.key] || ''} onValueChange={set(f.key)}>
                  <SelectTrigger className="mt-1.5"><SelectValue placeholder={`Select ${f.label.toLowerCase()}`} /></SelectTrigger>
                  <SelectContent>{f.options.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
                </Select>
              ) : (
                <Input type={f.type || 'text'} value={form[f.key] || ''} onChange={set(f.key)} className="mt-1.5" required={f.required} placeholder={f.placeholder} />
              )}
            </div>
          ))}
          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={saving} className="bg-[#D9501E] hover:bg-[#B8400F] text-white">
              <Save size={14} className="mr-1.5" /> {saving ? 'Saving...' : (isEdit ? 'Update' : 'Create')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// Field configs per resource
export const RESOURCE_FIELDS = {
  categories: [
    { key: 'name', label: 'Name', required: true },
    { key: 'code', label: 'Code', placeholder: 'e.g. MED' },
    { key: 'color', label: 'Color (hex)', placeholder: '#D9501E', default: '#D9501E' },
  ],
  locations: [
    { key: 'name', label: 'Name', required: true },
    { key: 'code', label: 'Code' },
    { key: 'site', label: 'Site', default: 'Kapsowar Main' },
  ],
  departments: [
    { key: 'name', label: 'Department Name', required: true },
    { key: 'head', label: 'Head of Department' },
  ],
  vendors: [
    { key: 'name', label: 'Vendor Name', required: true },
    { key: 'contact', label: 'Contact Email' },
    { key: 'phone', label: 'Phone' },
  ],
  'funding-sources': [
    { key: 'name', label: 'Source Name', required: true },
    { key: 'type', label: 'Type', type: 'select', options: ['Internal', 'Donor', 'Government', 'Grant'], default: 'Donor' },
  ],
  persons: [
    { key: 'name', label: 'Full Name', required: true },
    { key: 'role', label: 'Role / Job Title' },
    { key: 'email', label: 'Email', type: 'email' },
    { key: 'department', label: 'Department' },
    { key: 'phone', label: 'Phone' },
  ],
  sites: [
    { key: 'name', label: 'Site Name', required: true },
    { key: 'address', label: 'Address' },
    { key: 'country', label: 'Country', default: 'Kenya' },
    { key: 'timezone', label: 'Timezone', default: 'Africa/Nairobi' },
  ],
  'security-groups': [
    { key: 'name', label: 'Group Name', required: true },
    { key: 'permissions', label: 'Permissions Description', type: 'textarea' },
    { key: 'members', label: 'Member Count', type: 'number', default: 0 },
  ],
};
