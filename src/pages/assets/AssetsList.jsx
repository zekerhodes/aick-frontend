import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Search, Plus, Download, Barcode as BarcodeIcon, ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { api, formatKSh } from '../../lib/api';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger
} from '../../components/ui/dropdown-menu';

const STATUSES = ['In Service', 'In Storage', 'Under Maintenance', 'Checked Out', 'Leased', 'Reserved', 'Disposed', 'Lost'];

const statusColor = (s) => {
  const map = {
    'In Service': 'bg-emerald-50 text-emerald-700 border-emerald-200',
    'Under Maintenance': 'bg-amber-50 text-amber-700 border-amber-200',
    'Checked Out': 'bg-blue-50 text-blue-700 border-blue-200',
    'Reserved': 'bg-violet-50 text-violet-700 border-violet-200',
    'Disposed': 'bg-slate-100 text-slate-600 border-slate-200',
    'Leased': 'bg-indigo-50 text-indigo-700 border-indigo-200',
    'Lost': 'bg-red-50 text-red-700 border-red-200',
  };
  return map[s] || 'bg-slate-50 text-slate-700 border-slate-200';
};

export const AssetsList = () => {
  const navigate = useNavigate();
  const [q, setQ] = useState('');
  const [cat, setCat] = useState('all');
  const [loc, setLoc] = useState('all');
  const [status, setStatus] = useState('all');
  const [page, setPage] = useState(1);
  const perPage = 10;
  const [assets, setAssets] = useState([]);
  const [total, setTotal] = useState(0);
  const [categories, setCategories] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load lookups once
  useEffect(() => {
    (async () => {
      try {
        const [c, l] = await Promise.all([api.get('/categories'), api.get('/locations')]);
        setCategories(c.data.items || []);
        setLocations(l.data.items || []);
      } catch {}
    })();
  }, []);

  // Load assets when filters change
  useEffect(() => {
    const t = setTimeout(async () => {
      setLoading(true);
      try {
        const params = { page, per_page: perPage };
        if (q) params.search = q;
        if (cat !== 'all') params.category_id = cat;
        if (loc !== 'all') params.location_id = loc;
        if (status !== 'all') params.status = status;
        const { data } = await api.get('/assets', { params });
        setAssets(data.items || []);
        setTotal(data.total || 0);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }, 250);
    return () => clearTimeout(t);
  }, [q, cat, loc, status, page]);

  const totalPages = Math.max(1, Math.ceil(total / perPage));

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">List of Assets</h1>
          <p className="text-sm text-slate-500 mt-1">{total.toLocaleString()} assets · Kapsowar Hospital</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => navigate('/app/tools/export')}>
            <Download size={14} className="mr-1.5" /> Export
          </Button>
          <Button variant="outline" size="sm" onClick={() => navigate('/app/tools/barcode')}>
            <BarcodeIcon size={14} className="mr-1.5" /> Print Labels
          </Button>
          <Button size="sm" className="bg-[#D9501E] hover:bg-[#B8400F] text-white" onClick={() => navigate('/app/assets/new')}>
            <Plus size={14} className="mr-1.5" /> Add Asset
          </Button>
        </div>
      </div>

      <Card className="p-4 border-slate-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} placeholder="Search name, tag, serial..." className="pl-9 h-9" />
          </div>
          <Select value={cat} onValueChange={(v) => { setCat(v); setPage(1); }}>
            <SelectTrigger className="h-9"><SelectValue placeholder="Category" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={loc} onValueChange={(v) => { setLoc(v); setPage(1); }}>
            <SelectTrigger className="h-9"><SelectValue placeholder="Location" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Locations</SelectItem>
              {locations.map((l) => <SelectItem key={l.id} value={l.id}>{l.name}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={status} onValueChange={(v) => { setStatus(v); setPage(1); }}>
            <SelectTrigger className="h-9"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </Card>

      <Card className="border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-xs text-slate-600 uppercase tracking-wider">
              <tr>
                <th className="text-left px-4 py-3 font-semibold">Asset Tag</th>
                <th className="text-left px-4 py-3 font-semibold">Name</th>
                <th className="text-left px-4 py-3 font-semibold">Category</th>
                <th className="text-left px-4 py-3 font-semibold">Location</th>
                <th className="text-left px-4 py-3 font-semibold">Status</th>
                <th className="text-left px-4 py-3 font-semibold">Assigned To</th>
                <th className="text-right px-4 py-3 font-semibold">Cost</th>
                <th className="px-4 py-3 w-10"></th>
              </tr>
            </thead>
            <tbody>
              {loading && <tr><td colSpan={8} className="text-center py-8 text-slate-400 text-sm">Loading...</td></tr>}
              {!loading && assets.map((a) => (
                <tr key={a.id} className="border-b border-slate-100 hover:bg-slate-50/60 transition-colors">
                  <td className="px-4 py-3">
                    <Link to={`/app/assets/${a.id}`} className="font-mono text-xs text-[#D9501E] hover:underline">{a.tag}</Link>
                  </td>
                  <td className="px-4 py-3 font-medium text-slate-900 max-w-xs truncate">{a.name}</td>
                  <td className="px-4 py-3 text-slate-600">{a.category}</td>
                  <td className="px-4 py-3 text-slate-600">{a.location}</td>
                  <td className="px-4 py-3">
                    <Badge variant="outline" className={`text-[11px] ${statusColor(a.status)}`}>{a.status}</Badge>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{a.assigned_to}</td>
                  <td className="px-4 py-3 text-right font-medium text-slate-900">{formatKSh(a.purchase_cost)}</td>
                  <td className="px-4 py-3">
                    <DropdownMenu>
                      <DropdownMenuTrigger className="p-1 rounded hover:bg-slate-100"><MoreHorizontal size={14} /></DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => navigate(`/app/assets/${a.id}`)}>View details</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate('/app/assets/check-out')}>Check out</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate('/app/assets/maintenance')}>Log maintenance</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate('/app/tools/barcode')}>Print barcode</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
              {!loading && assets.length === 0 && (
                <tr><td colSpan={8} className="px-4 py-10 text-center text-slate-400 text-sm">No assets match your filters.</td></tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-t border-slate-200 text-xs text-slate-600">
          <span>Showing {total === 0 ? 0 : (page - 1) * perPage + 1}-{Math.min(page * perPage, total)} of {total}</span>
          <div className="flex items-center gap-1">
            <Button variant="outline" size="sm" className="h-7 w-7 p-0" disabled={page === 1} onClick={() => setPage((p) => p - 1)}><ChevronLeft size={14} /></Button>
            <span className="px-3">Page {page} / {totalPages}</span>
            <Button variant="outline" size="sm" className="h-7 w-7 p-0" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}><ChevronRight size={14} /></Button>
          </div>
        </div>
      </Card>
    </div>
  );
};
