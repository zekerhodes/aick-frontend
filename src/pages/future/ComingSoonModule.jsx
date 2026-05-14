import React from 'react';
import { Card } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Pill, Package, Calendar, AlertTriangle, ClipboardList, FileBarChart, Lock, Sparkles } from 'lucide-react';

const MODULES = {
  pharmacy: {
    icon: Pill,
    title: 'Pharmacy Module',
    subtitle: 'Drug inventory, dispensing & expiry tracking',
    features: [
      { icon: Pill, name: 'Drug Formulary', desc: 'Master list of medications with generic names, strengths, and forms' },
      { icon: Package, name: 'Stock on Hand', desc: 'Real-time inventory by ward, theatre, and pharmacy store' },
      { icon: AlertTriangle, name: 'Expiry Alerts', desc: 'Automated warnings 30/60/90 days before drug expiry' },
      { icon: ClipboardList, name: 'Dispense Log', desc: 'Track every prescription dispensed with patient & prescriber audit trail' },
      { icon: Calendar, name: 'Batch / Lot Tracking', desc: 'Trace medications by batch number for recalls and quality control' },
      { icon: FileBarChart, name: 'Pharmacy Reports', desc: 'Consumption analytics, reorder reports, controlled substances register' },
    ],
    color: '#10B981',
  },
  inventory: {
    icon: Package,
    title: 'Inventory / Consumables Module',
    subtitle: 'Medical consumables, stationery & general stores',
    features: [
      { icon: Package, name: 'Item Catalog', desc: 'Master catalog of all consumable items with SKU and units' },
      { icon: FileBarChart, name: 'Stock Levels', desc: 'Multi-location stock tracking with reorder thresholds' },
      { icon: ClipboardList, name: 'Stock Movements', desc: 'Complete ledger of inflows, outflows, and inter-store transfers' },
      { icon: ClipboardList, name: 'Purchase Orders', desc: 'Create and approve POs with budget tracking' },
      { icon: AlertTriangle, name: 'Reorder Alerts', desc: 'Automated alerts when stock falls below minimum levels' },
      { icon: Calendar, name: 'Cycle Counts', desc: 'Scheduled stocktakes with variance reporting' },
    ],
    color: '#3B82F6',
  },
};

export const ComingSoonModule = ({ kind }) => {
  const m = MODULES[kind] || MODULES.pharmacy;
  const Icon = m.icon;

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <div className="h-14 w-14 rounded-xl flex items-center justify-center" style={{ background: `${m.color}15`, color: m.color }}>
            <Icon size={26} />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl font-bold text-slate-900">{m.title}</h1>
              <Badge className="bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-100">
                <Sparkles size={11} className="mr-1" /> Coming Soon
              </Badge>
            </div>
            <p className="text-sm text-slate-500">{m.subtitle}</p>
          </div>
        </div>
        <Button variant="outline" disabled><Lock size={14} className="mr-1.5" /> Module Locked</Button>
      </div>

      <Card className="p-6 border-slate-200 border-l-4" style={{ borderLeftColor: m.color }}>
        <h3 className="font-semibold text-slate-900 mb-2">Scaffolded & ready for activation</h3>
        <p className="text-sm text-slate-600 leading-relaxed">
          This module's data models, routes, and integration points are already wired into the system. When you're ready to launch,
          we can activate it by flipping a feature flag in the backend—the shared infrastructure (users, locations, vendors, audit logs,
          barcode generator) carries over automatically, saving significant build time.
        </p>
      </Card>

      <div>
        <h3 className="font-semibold text-slate-900 mb-4">Planned Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {m.features.map((f, i) => {
            const FIcon = f.icon;
            return (
              <Card key={i} className="p-5 border-slate-200 hover:border-slate-300 transition-colors">
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${m.color}15`, color: m.color }}>
                    <FIcon size={18} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 text-sm">{f.name}</h4>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      <Card className="p-6 border-slate-200 bg-gradient-to-br from-slate-50 to-white">
        <h3 className="font-semibold text-slate-900 mb-3">Shared Infrastructure (already built)</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
          {['Users & Auth', 'Locations', 'Departments', 'Vendors', 'Barcode Gen', 'Audit Log', 'CSV Import', 'Reports Engine'].map((s) => (
            <div key={s} className="flex items-center gap-2 text-slate-700">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              {s}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
