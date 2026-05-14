import React, { useEffect, useState } from 'react';
import { Card } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Package, Wrench, UserCheck, AlertTriangle, TrendingUp, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { api, formatKSh } from '../../lib/api';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, CartesianGrid, Legend
} from 'recharts';

const COLORS = ['#D9501E', '#1E3A5F', '#7C3AED', '#059669', '#DC2626', '#0891B2', '#A16207', '#475569'];

const KpiCard = ({ icon: Icon, label, value, sub, accent }) => (
  <Card className="p-5 border-slate-200">
    <div className="flex items-start justify-between">
      <div>
        <div className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold">{label}</div>
        <div className="text-2xl font-bold text-slate-900 mt-1.5">{value}</div>
        {sub && <div className="text-xs text-slate-500 mt-1">{sub}</div>}
      </div>
      <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${accent}`}>
        <Icon size={18} />
      </div>
    </div>
  </Card>
);

export const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [txs, setTxs] = useState([]);
  const [maint, setMaint] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [s, t, m] = await Promise.all([
          api.get('/reports/dashboard-stats'),
          api.get('/reports/recent-transactions?limit=5'),
          api.get('/reports/upcoming-maintenance?limit=5'),
        ]);
        setStats(s.data);
        setTxs(t.data.items || []);
        setMaint(m.data.items || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading || !stats) {
    return <div className="text-slate-400 text-sm py-12 text-center">Loading dashboard...</div>;
  }

  const statusData = (stats.by_status || []).filter((s) => ['In Service', 'Under Maintenance', 'Checked Out', 'Reserved'].includes(s.name));
  const categoryData = (stats.by_category || []).slice(0, 6).map((c, i) => ({ ...c, value: c.count, color: COLORS[i % COLORS.length] }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-sm text-slate-500 mt-1">Overview of asset operations — Kapsowar Main Site</p>
        </div>
        <Badge variant="outline" className="text-xs bg-emerald-50 text-emerald-700 border-emerald-200">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 mr-1.5" /> All systems operational
        </Badge>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard icon={Package} label="Total Assets" value={stats.total_assets} sub="Across all locations" accent="bg-orange-50 text-[#D9501E]" />
        <KpiCard icon={TrendingUp} label="Total Value" value={formatKSh(stats.total_value)} sub="Acquisition value" accent="bg-blue-50 text-blue-600" />
        <KpiCard icon={Wrench} label="Under Maintenance" value={stats.under_maintenance} sub="Active work orders" accent="bg-amber-50 text-amber-600" />
        <KpiCard icon={UserCheck} label="Checked Out" value={stats.checked_out} sub="Currently issued" accent="bg-emerald-50 text-emerald-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-5 lg:col-span-2 border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-900">Assets by Status</h3>
            <Link to="/app/reports/status" className="text-xs text-[#D9501E] hover:underline flex items-center gap-1">
              View report <ArrowUpRight size={12} />
            </Link>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={statusData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} />
              <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 6 }} />
              <Bar dataKey="count" fill="#D9501E" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
        <Card className="p-5 border-slate-200">
          <h3 className="font-semibold text-slate-900 mb-4">Assets by Category</h3>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={categoryData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} innerRadius={45}>
                {categoryData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 6 }} />
              <Legend wrapperStyle={{ fontSize: 10 }} />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-5 border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-900">Recent Transactions</h3>
            <Link to="/app/reports/transaction" className="text-xs text-[#D9501E] hover:underline">View all</Link>
          </div>
          <div className="space-y-3">
            {txs.length === 0 ? <p className="text-sm text-slate-400 text-center py-6">No transactions yet.</p> : txs.map((t) => (
              <div key={t.id} className="flex items-start gap-3 pb-3 border-b border-slate-100 last:border-0 last:pb-0">
                <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-semibold text-slate-600">
                  {(t.type || '').split(' ').map((w) => w[0]).join('').slice(0, 2)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-slate-900 truncate">{t.asset_name}</div>
                  <div className="text-xs text-slate-500">{t.type} · {t.person}</div>
                </div>
                <div className="text-xs text-slate-400 whitespace-nowrap">{t.date}</div>
              </div>
            ))}
          </div>
        </Card>
        <Card className="p-5 border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-900 flex items-center gap-2"><AlertTriangle size={16} className="text-amber-500" /> Maintenance Schedule</h3>
            <Link to="/app/lists/maintenances" className="text-xs text-[#D9501E] hover:underline">View all</Link>
          </div>
          <div className="space-y-3">
            {maint.length === 0 ? <p className="text-sm text-slate-400 text-center py-6">No maintenance scheduled.</p> : maint.map((m) => (
              <div key={m.id} className="flex items-start gap-3 pb-3 border-b border-slate-100 last:border-0 last:pb-0">
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-slate-900 truncate">{m.asset_name}</div>
                  <div className="text-xs text-slate-500">{m.type} · {m.technician}</div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <Badge variant="outline" className={`text-[10px] ${m.status === 'Completed' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : m.status === 'In Progress' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-slate-50 text-slate-600 border-slate-200'}`}>
                    {m.status}
                  </Badge>
                  <span className="text-[11px] text-slate-400">{m.date}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};
