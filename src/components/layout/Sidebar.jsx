import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Puzzle, List, FileText, Wrench, Briefcase,
  ListChecks, PlusCircle, UserCheck, UserX, Send, Recycle, Cog, Move, CalendarDays,
  ClipboardList, FileBarChart, Upload, Download, Image as ImageIcon, FolderOpen, ScanLine, Barcode,
  User, Users, Users2, ShieldCheck, Tag, MapPin, Building2, Network, Truck, HandCoins,
  Pill, Package, ChevronDown, ChevronRight
} from 'lucide-react';
import { Logo } from '../branding/Logo';
import { Badge } from '../ui/badge';

const MENU = [
  {
    label: 'Dashboard', icon: LayoutDashboard, path: '/app/dashboard', solo: true,
  },
  {
    label: 'Assets', icon: Puzzle, key: 'assets',
    children: [
      { label: 'List of Assets', icon: ListChecks, path: '/app/assets' },
      { label: 'Add an Asset', icon: PlusCircle, path: '/app/assets/new' },
      { divider: true },
      { label: 'Check Out', icon: UserCheck, path: '/app/assets/check-out' },
      { label: 'Check In', icon: UserX, path: '/app/assets/check-in' },
      { label: 'Lease', icon: Send, path: '/app/assets/lease' },
      { label: 'Lease Return', icon: Send, path: '/app/assets/lease-return' },
      { label: 'Dispose', icon: Recycle, path: '/app/assets/dispose' },
      { label: 'Maintenance', icon: Cog, path: '/app/assets/maintenance' },
      { label: 'Move', icon: Move, path: '/app/assets/move' },
      { label: 'Reserve', icon: CalendarDays, path: '/app/assets/reserve' },
    ],
  },
  {
    label: 'Lists', icon: List, key: 'lists',
    children: [
      { label: 'List of Assets', icon: ListChecks, path: '/app/lists/assets' },
      { label: 'List of Maintenances', icon: ClipboardList, path: '/app/lists/maintenances' },
      { label: 'List of Warranties', icon: FileText, path: '/app/lists/warranties' },
    ],
  },
  {
    label: 'Reports', icon: FileText, key: 'reports',
    children: [
      { label: 'Automated Reports', icon: FileBarChart, path: '/app/reports/automated' },
      { label: 'Custom Reports', icon: FileBarChart, path: '/app/reports/custom' },
      { label: 'Asset Reports', icon: FileBarChart, path: '/app/reports/asset' },
      { label: 'Audit Reports', icon: FileBarChart, path: '/app/reports/audit' },
      { label: 'Check-Out Reports', icon: FileBarChart, path: '/app/reports/check-out' },
      { label: 'Leased Asset Reports', icon: FileBarChart, path: '/app/reports/leased' },
      { label: 'Maintenance Reports', icon: FileBarChart, path: '/app/reports/maintenance' },
      { label: 'Reservation Reports', icon: FileBarChart, path: '/app/reports/reservation' },
      { label: 'Status Reports', icon: FileBarChart, path: '/app/reports/status' },
      { label: 'Transaction Reports', icon: FileBarChart, path: '/app/reports/transaction' },
      { label: 'Other Reports', icon: FileBarChart, path: '/app/reports/other' },
    ],
  },
  {
    label: 'Tools', icon: Wrench, key: 'tools',
    children: [
      { label: 'Import', icon: Upload, path: '/app/tools/import' },
      { label: 'Export', icon: Download, path: '/app/tools/export' },
      { label: 'Documents Gallery', icon: FolderOpen, path: '/app/tools/documents' },
      { label: 'Image Gallery', icon: ImageIcon, path: '/app/tools/images' },
      { label: 'Audit', icon: ScanLine, path: '/app/tools/audit' },
      { label: 'Barcode Generator', icon: Barcode, path: '/app/tools/barcode' },
    ],
  },
  {
    label: 'Advanced', icon: Briefcase, key: 'advanced',
    children: [
      { label: 'Persons / Employees', icon: User, path: '/app/advanced/persons' },
      { label: 'Customers', icon: Users, path: '/app/advanced/customers' },
      { label: 'Users', icon: Users2, path: '/app/advanced/users' },
      { label: 'Security Groups', icon: ShieldCheck, path: '/app/advanced/security-groups' },
      { divider: true },
      { label: 'Categories', icon: Tag, path: '/app/advanced/categories' },
      { label: 'Locations', icon: MapPin, path: '/app/advanced/locations' },
      { label: 'Departments', icon: Network, path: '/app/advanced/departments' },
      { label: 'Sites', icon: Building2, path: '/app/advanced/sites' },
      { label: 'Vendors / Suppliers', icon: Truck, path: '/app/advanced/vendors' },
      { label: 'Funding Sources', icon: HandCoins, path: '/app/advanced/funding' },
    ],
  },
  {
    label: 'Future Modules', isHeader: true,
  },
  {
    label: 'Pharmacy', icon: Pill, key: 'pharmacy', comingSoon: true,
    children: [
      { label: 'Overview', icon: Pill, path: '/app/pharmacy' },
      { label: 'Drug Formulary', icon: List, path: '/app/pharmacy/formulary', disabled: true },
      { label: 'Stock on Hand', icon: Package, path: '/app/pharmacy/stock', disabled: true },
      { label: 'Expiry Alerts', icon: FileBarChart, path: '/app/pharmacy/expiry', disabled: true },
      { label: 'Dispense Log', icon: ClipboardList, path: '/app/pharmacy/dispense', disabled: true },
    ],
  },
  {
    label: 'Inventory', icon: Package, key: 'inventory', comingSoon: true,
    children: [
      { label: 'Overview', icon: Package, path: '/app/inventory' },
      { label: 'Item Catalog', icon: List, path: '/app/inventory/catalog', disabled: true },
      { label: 'Stock Levels', icon: FileBarChart, path: '/app/inventory/stock', disabled: true },
      { label: 'Movements', icon: Move, path: '/app/inventory/movements', disabled: true },
      { label: 'Purchase Orders', icon: ClipboardList, path: '/app/inventory/po', disabled: true },
    ],
  },
];

export const Sidebar = ({ onClose }) => {
  const location = useLocation();
  const [open, setOpen] = useState(() => {
    const initial = {};
    MENU.forEach((m) => {
      if (m.key && m.children) {
        initial[m.key] = m.children.some((c) => c.path && location.pathname.startsWith(c.path));
      }
    });
    if (location.pathname.startsWith('/app/assets')) initial.assets = true;
    return initial;
  });

  const toggle = (key) => setOpen((s) => ({ ...s, [key]: !s[key] }));

  return (
    <aside className="w-72 h-screen bg-white border-r border-slate-200 flex flex-col">
      <div className="h-16 px-5 flex items-center border-b border-slate-100">
        <Logo size="md" />
      </div>
      <nav className="flex-1 overflow-y-auto py-3 px-2 text-sm">
        {MENU.map((item, i) => {
          if (item.isHeader) {
            return (
              <div key={i} className="px-4 pt-5 pb-2 text-[10px] font-semibold uppercase tracking-widest text-slate-400">
                {item.label}
              </div>
            );
          }
          if (item.solo) {
            const Icon = item.icon;
            return (
              <NavLink
                key={i}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2.5 rounded-md mx-1 mb-1 font-medium transition-colors ${
                    isActive ? 'bg-orange-50 text-[#D9501E]' : 'text-slate-700 hover:bg-slate-50'
                  }`
                }
              >
                <Icon size={18} className="text-[#D9501E]" />
                <span>{item.label}</span>
              </NavLink>
            );
          }
          const Icon = item.icon;
          const isOpen = open[item.key];
          return (
            <div key={i} className="mb-1">
              <button
                onClick={() => toggle(item.key)}
                className="w-full flex items-center gap-3 px-4 py-2.5 rounded-md mx-1 font-semibold text-slate-800 hover:bg-slate-50 transition-colors"
              >
                <Icon size={18} className="text-[#D9501E]" />
                <span className="flex-1 text-left">{item.label}</span>
                {item.comingSoon && (
                  <Badge variant="secondary" className="text-[9px] py-0 px-1.5 bg-amber-100 text-amber-700 border-amber-200">SOON</Badge>
                )}
                {isOpen ? <ChevronDown size={15} className="text-slate-400" /> : <ChevronRight size={15} className="text-slate-400" />}
              </button>
              {isOpen && (
                <div className="ml-4 border-l border-slate-100 mt-0.5">
                  {item.children.map((c, j) => {
                    if (c.divider) return <div key={j} className="my-1.5 mx-3 border-t border-slate-100" />;
                    const SubIcon = c.icon;
                    if (c.disabled) {
                      return (
                        <div key={j} className="flex items-center gap-2.5 px-3 py-2 ml-2 text-xs text-slate-400 cursor-not-allowed">
                          <SubIcon size={14} />
                          <span>{c.label}</span>
                        </div>
                      );
                    }
                    return (
                      <NavLink
                        key={j}
                        to={c.path}
                        onClick={onClose}
                        className={({ isActive }) =>
                          `flex items-center gap-2.5 px-3 py-2 ml-2 rounded-md text-[13px] transition-colors ${
                            isActive ? 'bg-orange-50 text-[#D9501E] font-medium' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                          }`
                        }
                      >
                        <SubIcon size={14} className={c.disabled ? 'text-slate-300' : 'text-[#D9501E]/80'} />
                        <span>{c.label}</span>
                      </NavLink>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>
      <div className="px-5 py-3 border-t border-slate-100 text-[11px] text-slate-400">
        v0.1.0 · Kapsowar, Kenya
      </div>
    </aside>
  );
};
