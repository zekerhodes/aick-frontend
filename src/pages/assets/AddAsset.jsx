import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { ArrowLeft, Save, Upload, Barcode as BarcodeIcon } from 'lucide-react';
import Barcode from 'react-barcode';
import { toast } from '../../hooks/use-toast';
import { api } from '../../lib/api';

export const AddAsset = () => {
  const navigate = useNavigate();
  const [lookups, setLookups] = useState({ categories: [], locations: [], departments: [], vendors: [], funding: [], persons: [] });
  const [form, setForm] = useState({
    name: '', tag: `AICK-MED-${String(Math.floor(Math.random()*99999)).padStart(5,'0')}`,
    category_id: '', location_id: '', department: '', vendor_id: '', funding_id: '',
    assigned_to: '', status: 'In Service', condition: 'Excellent', serial_number: '',
    purchase_date: new Date().toISOString().slice(0, 10), purchase_cost: '', warranty_expiry: '', notes: '',
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const [c, l, d, v, f, p] = await Promise.all([
          api.get('/categories'), api.get('/locations'), api.get('/departments'),
          api.get('/vendors'), api.get('/funding-sources'), api.get('/persons'),
        ]);
        setLookups({
          categories: c.data.items || [], locations: l.data.items || [],
          departments: d.data.items || [], vendors: v.data.items || [],
          funding: f.data.items || [], persons: p.data.items || [],
        });
      } catch {}
    })();
  }, []);

  const set = (k) => (v) => setForm((f) => ({ ...f, [k]: typeof v === 'object' && v?.target ? v.target.value : v }));

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form, purchase_cost: parseFloat(form.purchase_cost) || 0 };
      await api.post('/assets', payload);
      toast({ title: 'Asset added', description: `${form.name} saved with tag ${form.tag}` });
      navigate('/app/assets');
    } catch (err) {
      toast({ title: 'Error', description: err?.response?.data?.detail || 'Failed to save asset', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={() => navigate(-1)}><ArrowLeft size={14} className="mr-1.5" /> Back</Button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Add an Asset</h1>
            <p className="text-sm text-slate-500 mt-0.5">Register a new asset into the hospital inventory</p>
          </div>
        </div>
      </div>

      <form onSubmit={save} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6 border-slate-200">
            <h3 className="font-semibold text-slate-900 mb-4">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Label>Asset Name *</Label>
                <Input value={form.name} onChange={set('name')} className="mt-1.5" placeholder="e.g. Philips IntelliVue MX450 Patient Monitor" required />
              </div>
              <div>
                <Label>Asset Tag *</Label>
                <Input value={form.tag} onChange={set('tag')} className="mt-1.5 font-mono" />
              </div>
              <div>
                <Label>Serial Number</Label>
                <Input value={form.serial_number} onChange={set('serial_number')} className="mt-1.5" placeholder="Manufacturer S/N" />
              </div>
              <div>
                <Label>Category *</Label>
                <Select value={form.category_id} onValueChange={set('category_id')}>
                  <SelectTrigger className="mt-1.5"><SelectValue placeholder="Select category" /></SelectTrigger>
                  <SelectContent>{lookups.categories.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <Label>Status</Label>
                <Select value={form.status} onValueChange={set('status')}>
                  <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {['In Service', 'In Storage', 'Under Maintenance', 'Checked Out', 'Reserved'].map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>

          <Card className="p-6 border-slate-200">
            <h3 className="font-semibold text-slate-900 mb-4">Location & Assignment</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Location *</Label>
                <Select value={form.location_id} onValueChange={set('location_id')}>
                  <SelectTrigger className="mt-1.5"><SelectValue placeholder="Select location" /></SelectTrigger>
                  <SelectContent>{lookups.locations.map((l) => <SelectItem key={l.id} value={l.id}>{l.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <Label>Department</Label>
                <Select value={form.department} onValueChange={set('department')}>
                  <SelectTrigger className="mt-1.5"><SelectValue placeholder="Select department" /></SelectTrigger>
                  <SelectContent>{lookups.departments.map((d) => <SelectItem key={d.id} value={d.name}>{d.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="md:col-span-2">
                <Label>Assigned To</Label>
                <Select value={form.assigned_to} onValueChange={set('assigned_to')}>
                  <SelectTrigger className="mt-1.5"><SelectValue placeholder="Select person" /></SelectTrigger>
                  <SelectContent>{lookups.persons.map((p) => <SelectItem key={p.id} value={p.name}>{p.name} — {p.role}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
          </Card>

          <Card className="p-6 border-slate-200">
            <h3 className="font-semibold text-slate-900 mb-4">Purchase & Warranty</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Vendor / Supplier</Label>
                <Select value={form.vendor_id} onValueChange={set('vendor_id')}>
                  <SelectTrigger className="mt-1.5"><SelectValue placeholder="Select vendor" /></SelectTrigger>
                  <SelectContent>{lookups.vendors.map((v) => <SelectItem key={v.id} value={v.id}>{v.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <Label>Funding Source</Label>
                <Select value={form.funding_id} onValueChange={set('funding_id')}>
                  <SelectTrigger className="mt-1.5"><SelectValue placeholder="Select source" /></SelectTrigger>
                  <SelectContent>{lookups.funding.map((f) => <SelectItem key={f.id} value={f.id}>{f.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <Label>Purchase Date</Label>
                <Input type="date" value={form.purchase_date} onChange={set('purchase_date')} className="mt-1.5" />
              </div>
              <div>
                <Label>Purchase Cost (KSh)</Label>
                <Input type="number" value={form.purchase_cost} onChange={set('purchase_cost')} className="mt-1.5" placeholder="0" />
              </div>
              <div>
                <Label>Warranty Expiry</Label>
                <Input type="date" value={form.warranty_expiry} onChange={set('warranty_expiry')} className="mt-1.5" />
              </div>
              <div>
                <Label>Condition</Label>
                <Select value={form.condition} onValueChange={set('condition')}>
                  <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {['Excellent', 'Good', 'Fair', 'Poor'].map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="mt-4">
              <Label>Notes</Label>
              <Textarea value={form.notes} onChange={set('notes')} className="mt-1.5" rows={3} placeholder="Any additional information..." />
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-6 border-slate-200">
            <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2"><BarcodeIcon size={16} className="text-[#D9501E]" /> Barcode Preview</h3>
            <div className="bg-white p-4 border border-slate-200 rounded-md flex justify-center">
              <Barcode value={form.tag || 'AICK-00000'} format="CODE128" width={1.5} height={60} fontSize={11} background="#ffffff" />
            </div>
            <p className="text-xs text-slate-500 mt-3">Auto-generated when asset is saved. Print labels from Tools → Barcode Generator.</p>
          </Card>
          <Card className="p-6 border-slate-200">
            <h3 className="font-semibold text-slate-900 mb-4">Photo</h3>
            <button type="button" className="w-full border-2 border-dashed border-slate-200 rounded-md p-8 flex flex-col items-center gap-2 text-slate-400 hover:border-[#D9501E] hover:text-[#D9501E] transition-colors">
              <Upload size={22} />
              <span className="text-xs">Click to upload photo</span>
              <span className="text-[10px] text-slate-400">PNG / JPG up to 5MB</span>
            </button>
          </Card>
          <div className="flex flex-col gap-2">
            <Button type="submit" disabled={saving} className="bg-[#D9501E] hover:bg-[#B8400F] text-white">
              <Save size={14} className="mr-1.5" /> {saving ? 'Saving...' : 'Save Asset'}
            </Button>
            <Button type="button" variant="outline" onClick={() => navigate('/app/assets')}>Cancel</Button>
          </div>
        </div>
      </form>
    </div>
  );
};
