import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { ArrowLeft, ScanLine, Check } from 'lucide-react';
import { api } from '../../lib/api';
import { toast } from '../../hooks/use-toast';

const CONFIG = {
  'check-out': { title: 'Check Out Asset', desc: 'Issue an asset to a person or department', cta: 'Check Out', endpoint: 'check-out', fields: ['person', 'returnDate', 'notes'] },
  'check-in': { title: 'Check In Asset', desc: 'Return a checked-out asset', cta: 'Check In', endpoint: 'check-in', fields: ['condition', 'notes'] },
  'lease': { title: 'Lease Asset', desc: 'Lease an asset to an external party', cta: 'Lease', endpoint: 'lease', fields: ['person', 'returnDate', 'cost', 'notes'] },
  'lease-return': { title: 'Lease Return', desc: 'Process the return of a leased asset', cta: 'Process Return', endpoint: 'lease-return', fields: ['condition', 'notes'] },
  'dispose': { title: 'Dispose Asset', desc: 'Remove an asset from active inventory', cta: 'Dispose Asset', endpoint: 'dispose', fields: ['reason', 'notes'], destructive: true },
  'maintenance': { title: 'Log Maintenance', desc: 'Schedule or record asset maintenance', cta: 'Save Maintenance', endpoint: 'maintenance', fields: ['maintType', 'technician', 'cost', 'date', 'notes'] },
  'move': { title: 'Move Asset', desc: 'Transfer asset to a different location', cta: 'Move Asset', endpoint: 'move', fields: ['location', 'notes'] },
  'reserve': { title: 'Reserve Asset', desc: 'Book an asset for future use', cta: 'Reserve', endpoint: 'reserve', fields: ['person', 'date', 'returnDate', 'notes'] },
};

export const AssetAction = ({ kind }) => {
  const navigate = useNavigate();
  const cfg = CONFIG[kind] || CONFIG['check-out'];
  const [assets, setAssets] = useState([]);
  const [persons, setPersons] = useState([]);
  const [locations, setLocations] = useState([]);
  const [assetId, setAssetId] = useState('');
  const [assetTag, setAssetTag] = useState('');
  const [form, setForm] = useState({ person: '', location_id: '', date: new Date().toISOString().slice(0, 10), return_date: '', reason: '', cost: '', notes: '', condition: 'Good', maintType: 'Preventive', technician: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      const [a, p, l] = await Promise.all([api.get('/assets?per_page=200'), api.get('/persons'), api.get('/locations')]);
      setAssets(a.data.items || []);
      setPersons(p.data.items || []);
      setLocations(l.data.items || []);
    })().catch(() => {});
  }, []);

  const set = (k) => (v) => setForm((f) => ({ ...f, [k]: typeof v === 'object' && v?.target ? v.target.value : v }));

  const submit = async (e) => {
    e.preventDefault();
    if (!assetId) {
      toast({ title: 'Select an asset', description: 'Please select or scan an asset first.', variant: 'destructive' });
      return;
    }
    setSaving(true);
    try {
      const payload = {};
      if (cfg.fields.includes('person')) payload.person = form.person;
      if (cfg.fields.includes('returnDate')) payload.return_date = form.return_date;
      if (cfg.fields.includes('cost')) payload.cost = parseFloat(form.cost) || 0;
      if (cfg.fields.includes('reason')) payload.reason = form.reason;
      if (cfg.fields.includes('condition')) payload.condition = form.condition;
      if (cfg.fields.includes('maintType')) { payload.type = form.maintType; payload.technician = form.technician; payload.cost = parseFloat(form.cost) || 0; }
      if (cfg.fields.includes('date')) { payload.date = form.date; if (kind === 'reserve') payload.start_date = form.date; }
      if (kind === 'reserve') payload.end_date = form.return_date;
      if (cfg.fields.includes('location')) payload.location_id = form.location_id;
      payload.notes = form.notes;
      await api.post(`/assets/${assetId}/${cfg.endpoint}`, payload);
      toast({ title: `${cfg.cta} successful`, description: `Action recorded for ${assetTag}` });
      navigate('/app/assets');
    } catch (err) {
      toast({ title: 'Error', description: err?.response?.data?.detail || 'Action failed', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-3">
        <Button variant="outline" size="sm" onClick={() => navigate(-1)}><ArrowLeft size={14} className="mr-1.5" /> Back</Button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{cfg.title}</h1>
          <p className="text-sm text-slate-500 mt-0.5">{cfg.desc}</p>
        </div>
      </div>

      <form onSubmit={submit}>
        <Card className="p-6 border-slate-200 space-y-5">
          <div>
            <Label>Select Asset *</Label>
            <div className="flex gap-2 mt-1.5">
              <div className="relative flex-1">
                <ScanLine size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <Input value={assetTag} onChange={(e) => { setAssetTag(e.target.value); const m = assets.find((a) => a.tag === e.target.value); if (m) setAssetId(m.id); }} placeholder="Scan tag or pick from list" className="pl-9 font-mono" />
              </div>
              <Select value={assetId} onValueChange={(v) => { setAssetId(v); const a = assets.find((x) => x.id === v); if (a) setAssetTag(a.tag); }}>
                <SelectTrigger className="w-64"><SelectValue placeholder="or pick asset" /></SelectTrigger>
                <SelectContent>{assets.map((a) => <SelectItem key={a.id} value={a.id}>{a.tag} — {a.name.slice(0, 35)}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>

          {cfg.fields.includes('person') && (
            <div>
              <Label>Person *</Label>
              <Select value={form.person} onValueChange={set('person')}>
                <SelectTrigger className="mt-1.5"><SelectValue placeholder="Select person" /></SelectTrigger>
                <SelectContent>{persons.map((p) => <SelectItem key={p.id} value={p.name}>{p.name} — {p.department}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          )}

          {cfg.fields.includes('location') && (
            <div>
              <Label>New Location *</Label>
              <Select value={form.location_id} onValueChange={set('location_id')}>
                <SelectTrigger className="mt-1.5"><SelectValue placeholder="Select destination" /></SelectTrigger>
                <SelectContent>{locations.map((l) => <SelectItem key={l.id} value={l.id}>{l.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          )}

          {cfg.fields.includes('maintType') && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Maintenance Type</Label>
                <Select value={form.maintType} onValueChange={set('maintType')}>
                  <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {['Preventive', 'Corrective', 'Calibration', 'Inspection'].map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Technician</Label>
                <Input value={form.technician} onChange={set('technician')} placeholder="e.g. Eng. Brian Kimutai" className="mt-1.5" />
              </div>
            </div>
          )}

          {cfg.fields.includes('condition') && (
            <div>
              <Label>Return Condition</Label>
              <Select value={form.condition} onValueChange={set('condition')}>
                <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                <SelectContent>{['Excellent', 'Good', 'Fair', 'Poor', 'Damaged'].map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          )}

          {cfg.fields.includes('reason') && (
            <div>
              <Label>Disposal Reason *</Label>
              <Select value={form.reason} onValueChange={set('reason')}>
                <SelectTrigger className="mt-1.5"><SelectValue placeholder="Select reason" /></SelectTrigger>
                <SelectContent>{['End of Life', 'Damaged Beyond Repair', 'Obsolete', 'Sold', 'Donated', 'Lost', 'Stolen'].map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            {cfg.fields.includes('date') && (
              <div>
                <Label>{kind === 'reserve' ? 'Start Date' : 'Date'}</Label>
                <Input type="date" value={form.date} onChange={set('date')} className="mt-1.5" />
              </div>
            )}
            {cfg.fields.includes('returnDate') && (
              <div>
                <Label>{kind === 'reserve' ? 'End Date' : 'Expected Return Date'}</Label>
                <Input type="date" value={form.return_date} onChange={set('return_date')} className="mt-1.5" />
              </div>
            )}
            {cfg.fields.includes('cost') && (
              <div>
                <Label>Cost (KSh)</Label>
                <Input type="number" value={form.cost} onChange={set('cost')} className="mt-1.5" placeholder="0" />
              </div>
            )}
          </div>

          <div>
            <Label>Notes</Label>
            <Textarea value={form.notes} onChange={set('notes')} className="mt-1.5" rows={3} placeholder="Additional details..." />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <Button type="button" variant="outline" onClick={() => navigate(-1)}>Cancel</Button>
            <Button type="submit" disabled={saving} className={cfg.destructive ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-[#D9501E] hover:bg-[#B8400F] text-white'}>
              <Check size={14} className="mr-1.5" /> {saving ? 'Saving...' : cfg.cta}
            </Button>
          </div>
        </Card>
      </form>
    </div>
  );
};
