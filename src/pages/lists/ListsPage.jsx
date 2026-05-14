import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Search, Download } from 'lucide-react';
import { api, formatKSh } from '../../lib/api';

export const ListsPage = () => {
  const { kind } = useParams();
  const [q, setQ] = useState('');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const fetchUrl = kind === 'assets' ? '/assets?per_page=500' : kind === 'maintenances' ? '/maintenance-records' : '/warranties';
    api.get(fetchUrl).then(({ data }) => setItems(data.items || [])).catch(console.error).finally(() => setLoading(false));
  }, [kind]);

  // For warranties, we synthesize from assets if endpoint returns nothing
  const [warranties, setWarranties] = useState([]);
  useEffect(() => {
    if (kind === 'warranties') {
      api.get('/assets?per_page=500').then(({ data }) => {
        const w = (data.items || []).filter((a) => a.warranty_expiry).map((a) => ({
          id: 'w-' + a.id, asset_name: a.name, vendor: a.vendor,
          start_date: a.purchase_date, end_date: a.warranty_expiry,
          status: new Date(a.warranty_expiry) > new Date() ? 'Active' : 'Expired',
        }));
        setWarranties(w);
      });
    }
  }, [kind]);

  const configs = {
    assets: { title: 'List of Assets', columns: ['Tag', 'Name', 'Category', 'Status', 'Cost'], render: (a) => [a.tag, a.name, a.category, a.status, formatKSh(a.purchase_cost)] },
    maintenances: { title: 'List of Maintenances', columns: ['Asset', 'Type', 'Date', 'Technician', 'Status', 'Cost'], render: (m) => [m.asset_name, m.type, m.date, m.technician, m.status, formatKSh(m.cost)] },
    warranties: { title: 'List of Warranties', columns: ['Asset', 'Vendor', 'Start', 'Expiry', 'Status'], render: (w) => [w.asset_name, w.vendor, w.start_date, w.end_date, w.status] },
  };
  const cfg = configs[kind] || configs.assets;
  const data = kind === 'warranties' ? warranties : items;
  const filtered = data.filter((r) => !q || JSON.stringify(r).toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{cfg.title}</h1>
          <p className="text-sm text-slate-500 mt-1">{filtered.length.toLocaleString()} records</p>
        </div>
        <Button variant="outline" size="sm"><Download size={14} className="mr-1.5" /> Export CSV</Button>
      </div>
      <Card className="p-4 border-slate-200">
        <div className="relative max-w-md">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search..." className="pl-9 h-9" />
        </div>
      </Card>
      <Card className="border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-xs text-slate-600 uppercase tracking-wider">
              <tr>{cfg.columns.map((c) => <th key={c} className="text-left px-4 py-3 font-semibold">{c}</th>)}</tr>
            </thead>
            <tbody>
              {loading && <tr><td colSpan={cfg.columns.length} className="text-center py-8 text-slate-400 text-sm">Loading...</td></tr>}
              {!loading && filtered.map((r, i) => (
                <tr key={r.id || i} className="border-b border-slate-100 hover:bg-slate-50/60">
                  {cfg.render(r).map((cell, j) => (
                    <td key={j} className="px-4 py-3 text-slate-700">
                      {j === 0 && kind === 'assets' ? <span className="font-mono text-xs text-[#D9501E]">{cell}</span> :
                       (cell === 'Active' || cell === 'Completed') ? <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">{cell}</Badge> :
                       cell === 'Expired' ? <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">{cell}</Badge> :
                       (cell === 'In Progress' || cell === 'Scheduled') ? <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">{cell}</Badge> :
                       cell || '—'}
                    </td>
                  ))}
                </tr>
              ))}
              {!loading && filtered.length === 0 && (
                <tr><td colSpan={cfg.columns.length} className="text-center py-10 text-slate-400 text-sm">No records found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
