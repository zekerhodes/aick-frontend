import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Plus, Search, Edit, Trash2, User, Users, Users2, ShieldCheck, Tag, MapPin, Network, Building2, Truck, HandCoins } from 'lucide-react';
import { api } from '../../lib/api';

const CONFIGS = {
  persons: { title: 'Persons / Employees', icon: User, resource: 'persons', columns: ['Name', 'Role', 'Department', 'Email', 'Phone'], render: (r) => [r.name, r.role, r.department, r.email, r.phone] },
  customers: { title: 'Customers', icon: Users, resource: 'persons', columns: ['Name', 'Email', 'Phone'], render: (r) => [r.name, r.email, r.phone], filter: () => false },
  users: { title: 'Users', icon: Users2, resource: 'persons', columns: ['Name', 'Email', 'Role', 'Department'], render: (r) => [r.name, r.email, r.role, r.department] },
  'security-groups': { title: 'Security Groups', icon: ShieldCheck, resource: 'security-groups', columns: ['Group', 'Members', 'Permissions'], render: (r) => [r.name, r.members, r.permissions] },
  categories: { title: 'Asset Categories', icon: Tag, resource: 'categories', columns: ['Name', 'Code'], render: (r) => [r.name, r.code] },
  locations: { title: 'Locations', icon: MapPin, resource: 'locations', columns: ['Name', 'Code', 'Site'], render: (r) => [r.name, r.code, r.site] },
  departments: { title: 'Departments', icon: Network, resource: 'departments', columns: ['Name', 'Head of Department'], render: (r) => [r.name, r.head] },
  sites: { title: 'Sites', icon: Building2, resource: 'sites', columns: ['Site Name', 'Address', 'Country', 'Timezone'], render: (r) => [r.name, r.address, r.country, r.timezone] },
  vendors: { title: 'Vendors / Suppliers', icon: Truck, resource: 'vendors', columns: ['Name', 'Contact', 'Phone'], render: (r) => [r.name, r.contact, r.phone] },
  funding: { title: 'Funding Sources', icon: HandCoins, resource: 'funding-sources', columns: ['Source', 'Type'], render: (r) => [r.name, <Badge key={r.id} variant="outline" className={r.type === 'Donor' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : r.type === 'Government' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-slate-50 text-slate-700 border-slate-200'}>{r.type}</Badge>] },
};

export const AdvancedPage = () => {
  const { kind } = useParams();
  const cfg = CONFIGS[kind] || CONFIGS.persons;
  const Icon = cfg.icon;
  const [q, setQ] = useState('');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    setLoading(true);
    api.get(`/${cfg.resource}`).then(({ data }) => {
      let list = data.items || [];
      if (cfg.filter) list = list.filter(cfg.filter);
      setItems(list);
    }).catch(console.error).finally(() => setLoading(false));
  }, [kind, cfg.resource]);

  const filtered = items.filter((r) => !q || JSON.stringify(r).toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2"><Icon size={22} className="text-[#D9501E]" /> {cfg.title}</h1>
          <p className="text-sm text-slate-500 mt-1">{filtered.length} records · AIC Kapsowar</p>
        </div>
        <Button className="bg-[#D9501E] hover:bg-[#B8400F] text-white" size="sm"><Plus size={14} className="mr-1.5" /> Add New</Button>
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
              <tr>
                {cfg.columns.map((c) => <th key={c} className="text-left px-4 py-3 font-semibold">{c}</th>)}
                <th className="px-4 py-3 w-20">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && <tr><td colSpan={cfg.columns.length + 1} className="text-center py-8 text-slate-400 text-sm">Loading...</td></tr>}
              {!loading && filtered.map((r, i) => (
                <tr key={r.id || i} className="border-b border-slate-100 hover:bg-slate-50/60">
                  {cfg.render(r).map((cell, j) => (
                    <td key={j} className={`px-4 py-3 ${j === 0 ? 'font-medium text-slate-900' : 'text-slate-600'}`}>{cell || '—'}</td>
                  ))}
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <button className="p-1.5 rounded hover:bg-slate-100 text-slate-500"><Edit size={13} /></button>
                      <button className="p-1.5 rounded hover:bg-red-50 text-red-500"><Trash2 size={13} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {!loading && filtered.length === 0 && (
                <tr><td colSpan={cfg.columns.length + 1} className="text-center py-10 text-slate-400 text-sm">No records found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
