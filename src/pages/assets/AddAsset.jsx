import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { ArrowLeft, Save, Camera, Barcode as BarcodeIcon } from 'lucide-react';
import Barcode from 'react-barcode';
import { toast } from '../../hooks/use-toast';
import { api } from '../../lib/api';
import { BarcodeScanner } from '../../components/scanner/BarcodeScanner';

/**
 * Used for BOTH Add and Edit. If :id is in URL, fetches and edits; otherwise creates new.
 */
export const AssetForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;
  const [lookups, setLookups] = useState({ categories: [], locations: [], departments: [], vendors: [], funding: [], persons: [] });
  const [form, setForm] = useState({
    name: '', tag: `AICK-MED-${String(Math.floor(Math.random()*99999)).padStart(5,'0')}`,
    category_id: '', location_id: '', department: '', vendor_id: '', funding_id: '',
    assigned_to: '', status: 'In Service', condition: 'Excellent', serial_number: '',
    purchase_date: new Date().toISOString().slice(0, 10), purchase_cost: '', warranty_expiry: '', notes: '',
  });
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(isEdit);
  const [scannerOpen, setScannerOpen] = useState(false);

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
      if (isEdit) {
        try {
          const { data } = await api.get(`/assets/${id}`);
          setForm({ ...form, ...data, purchase_cost: data.purchase_cost || '' });
        } catch {
          toast({ title: 'Error', description: 'Asset not found', variant: 'destructive' });
          navigate('/app/assets');
        } finally {
          setLoading(false);
        }
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const set = (k) => (v) => setForm((f) => ({ ...f, [k]: typeof v === 'object' && v?.target ? v.target.value : v }));

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form, purchase_cost: parseFloat(form.purchase_cost) || 0 };
      Object.keys(payload).forEach((k) => { if (payload[k] === '' || payload[k] === null) delete payload[k]; });
      if (isEdit) {
        await api.put(`/assets/${id}`, payload);
        toast({ title: 'Asset updated', description: form.name });
      } else {
        await api.post('/assets', payload);
        toast({ title: 'Asset added', description: `${form.name} saved with tag ${form.tag}` });
      }
      navigate('/app/assets');
    } catch (err) {
      toast({ title: 'Error', description: err?.response?.data?.detail || 'Failed to save asset', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-slate-400 text-sm py-12 text-center">Loading asset...</div>;

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={() => navigate(-1)}><ArrowLeft size={14} className="mr-1.5" /> Back</Button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{isEdit ? 'Edit Asset' : 'Add an Asset'}</h1>
            <p className="text-sm text-slate-500 mt-0.5">{isEdit ? 'Update asset information' : 'Register a new asset into the hospital inventory'}</p>
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
              <div className="md:col-span-2">
                <Label>Asset Tag / Barcode *</Label>
                <div className="flex gap-2 mt-1.5">
                  <Input value={form.tag} onChange={set('tag')} className="font-mono flex-1" />
                  <Button type="button" variant="outline" onClick={() => setScannerOpen(true)} title="Scan barcode with camera">
                    <Camera size={14} className="mr-1.5" /> Scan
                  </Button>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">Type a new tag or scan an existing manufacturer barcode to adopt it.</p>
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
              <div className="md:col-span-2">
                <Label>Status</Label>
                <Select value={form.status} onValueChange={set('status')}>
                  <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {['In Service', 'In Storage', 'Under Maintenance', 'Checked Out', 'Reserved', 'Disposed'].map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
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
                <Input type="date" value={form.purchase_date || ''} onChange={set('purchase_date')} className="mt-1.5" />
              </div>
              <div>
                <Label>Purchase Cost (KSh)</Label>
                <Input type="number" value={form.purchase_cost} onChange={set('purchase_cost')} className="mt-1.5" placeholder="0" />
              </div>
              <div>
                <Label>Warranty Expiry</Label>
                <Input type="date" value={form.warranty_expiry || ''} onChange={set('warranty_expiry')} className="mt-1.5" />
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
              <Textarea value={form.notes || ''} onChange={set('notes')} className="mt-1.5" rows={3} placeholder="Any additional information..." />
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-6 border-slate-200">
            <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2"><BarcodeIcon size={16} className="text-[#D9501E]" /> Barcode Preview</h3>
            <div className="bg-white p-4 border border-slate-200 rounded-md flex justify-center">
              <Barcode value={form.tag || 'AICK-00000'} format="CODE128" width={1.5} height={60} fontSize={11} background="#ffffff" />
            </div>
            <Button type="button" variant="outline" className="w-full mt-3" size="sm" onClick={() => setScannerOpen(true)}>
              <Camera size={14} className="mr-1.5" /> Scan Existing Barcode
            </Button>
          </Card>
          <div className="flex flex-col gap-2">
            <Button type="submit" disabled={saving} className="bg-[#D9501E] hover:bg-[#B8400F] text-white">
              <Save size={14} className="mr-1.5" /> {saving ? 'Saving...' : (isEdit ? 'Update Asset' : 'Save Asset')}
            </Button>
            <Button type="button" variant="outline" onClick={() => navigate('/app/assets')}>Cancel</Button>
          </div>
        </div>
      </form>

      <BarcodeScanner open={scannerOpen} onClose={() => setScannerOpen(false)} onScan={(code) => { set('tag')(code); toast({ title: 'Barcode scanned', description: code }); }} />
    </div>
  );
};

// Backwards-compatible exports
export const AddAsset = AssetForm;
export const EditAsset = AssetForm;
