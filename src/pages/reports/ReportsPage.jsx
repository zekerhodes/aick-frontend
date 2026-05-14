import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { FileBarChart, Download, Printer, Calendar, Play } from 'lucide-react';
import { api, formatKSh } from '../../lib/api';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell, Legend } from 'recharts';

const COLORS = ['#D9501E', '#1E3A5F', '#7C3AED', '#059669', '#DC2626', '#0891B2', '#A16207', '#475569'];

const REPORT_TEMPLATES = {
  automated: { title: 'Automated Reports', desc: 'Scheduled reports delivered automatically', reports: ['Daily Asset Summary', 'Weekly Maintenance Digest', 'Monthly Asset Acquisition', 'Quarterly Compliance Report', 'Year-End Asset Valuation'] },
  custom: { title: 'Custom Reports', desc: 'Build your own reports with any data fields', reports: ['Build New Custom Report', 'My Saved Reports (4)', 'Shared Reports (2)'] },
  asset: { title: 'Asset Reports', desc: 'Comprehensive asset listings and details', reports: ['All Assets', 'Assets by Category', 'Assets by Location', 'Assets by Department', 'Assets by Vendor', 'Asset Depreciation Schedule', 'High-Value Assets', 'Asset Photo Gallery'] },
  audit: { title: 'Audit Reports', desc: 'Physical audit results and reconciliation', reports: ['Audit History', 'Missing Assets', 'Found Assets', 'Audit Variance', 'Audit by Auditor'] },
  'check-out': { title: 'Check-Out Reports', desc: 'Track who has what', reports: ['Currently Checked Out', 'Check-Out History', 'Overdue Returns', 'Check-Out by Person', 'Check-Out by Department'] },
  leased: { title: 'Leased Asset Reports', desc: 'Lease tracking and revenue', reports: ['Active Leases', 'Lease History', 'Expiring Leases', 'Lease Revenue Summary'] },
  maintenance: { title: 'Maintenance Reports', desc: 'Service history and upcoming work', reports: ['Maintenance History', 'Scheduled Maintenance', 'Maintenance Costs', 'Mean Time Between Failures', 'Maintenance by Technician'] },
  reservation: { title: 'Reservation Reports', desc: 'Booking and reservation analytics', reports: ['Active Reservations', 'Reservation History', 'Conflicts Calendar', 'Utilization Rate'] },
  status: { title: 'Status Reports', desc: 'Asset status across the organization', reports: ['Status Summary', 'Status Change History', 'Disposed Assets', 'Lost / Missing Assets'] },
  transaction: { title: 'Transaction Reports', desc: 'Complete audit trail of all asset transactions', reports: ['All Transactions', 'Transactions by Date Range', 'Transactions by User', 'Transactions by Asset'] },
  other: { title: 'Other Reports', desc: 'Additional and miscellaneous reports', reports: ['User Activity Log', 'Login History', 'Failed Login Attempts', 'Settings Change Log', 'Data Import History'] },
};

export const ReportsPage = () => {
  const { kind } = useParams();
  const cfg = REPORT_TEMPLATES[kind] || REPORT_TEMPLATES.asset;
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get('/reports/dashboard-stats').then(({ data }) => setStats(data)).catch(() => {});
  }, []);

  const catData = (stats?.by_category || []).map((c, i) => ({ name: (c.name || '').split(' ')[0], count: c.count, color: COLORS[i % COLORS.length] }));
  const valByCat = (stats?.by_category || []).map((c, i) => ({ name: (c.name || '').split(' ')[0], value: c.count * 100000, color: COLORS[i % COLORS.length] })).filter((x) => x.value > 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{cfg.title}</h1>
          <p className="text-sm text-slate-500 mt-1">{cfg.desc}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm"><Calendar size={14} className="mr-1.5" /> Date Range</Button>
          <Button variant="outline" size="sm"><Download size={14} className="mr-1.5" /> Export PDF</Button>
          <Button size="sm" className="bg-[#D9501E] hover:bg-[#B8400F] text-white"><Printer size={14} className="mr-1.5" /> Print</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-5 border-slate-200">
            <h3 className="font-semibold text-slate-900 mb-4">Asset Distribution by Category</h3>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={catData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 6 }} />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {catData.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Card>
          <Card className="p-5 border-slate-200">
            <h3 className="font-semibold text-slate-900 mb-4">Total Value by Category (KSh)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={valByCat} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={110} label={(e) => formatKSh(e.value)} labelLine={false}>
                  {valByCat.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Pie>
                <Tooltip formatter={(v) => formatKSh(v)} contentStyle={{ fontSize: 12, borderRadius: 6 }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </div>
        <Card className="p-5 border-slate-200 h-fit">
          <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2"><FileBarChart size={16} className="text-[#D9501E]" /> Available Reports</h3>
          <div className="space-y-1">
            {cfg.reports.map((r, i) => (
              <button key={i} className="w-full flex items-center justify-between text-left text-sm text-slate-700 py-2.5 px-3 rounded hover:bg-slate-50 group">
                <span>{r}</span>
                <Play size={12} className="text-slate-300 group-hover:text-[#D9501E]" />
              </button>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};
