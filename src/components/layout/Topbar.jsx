import React, { useState } from 'react';
import { Search, Bell, LogOut, Settings, User as UserIcon, Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Input } from '../ui/input';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger
} from '../ui/dropdown-menu';
import { Badge } from '../ui/badge';

export const Topbar = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [q, setQ] = useState('');

  const initials = (user?.name || 'AU')
    .split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase();

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center gap-4 px-4 md:px-6 sticky top-0 z-30">
      <button onClick={onMenuClick} className="lg:hidden p-2 rounded-md hover:bg-slate-100">
        <Menu size={18} />
      </button>
      <div className="flex-1 max-w-xl relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search assets, tags, serial numbers..."
          className="pl-9 h-9 bg-slate-50 border-slate-200 focus-visible:ring-[#D9501E]/30 focus-visible:border-[#D9501E]/40"
        />
      </div>
      <div className="flex items-center gap-2">
        <button className="relative p-2 rounded-md hover:bg-slate-100">
          <Bell size={18} className="text-slate-600" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-[#D9501E]" />
        </button>
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-md hover:bg-slate-50 transition-colors">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#D9501E] to-[#B8400F] text-white text-xs font-semibold flex items-center justify-center">
              {initials}
            </div>
            <div className="hidden md:flex flex-col items-start leading-tight">
              <span className="text-[13px] font-medium text-slate-800">{user?.name || 'User'}</span>
              <span className="text-[10px] text-slate-500">{user?.role || 'Member'}</span>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col">
                <span>{user?.name}</span>
                <span className="text-[11px] font-normal text-slate-500">{user?.email}</span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate('/app/advanced/users')}>
              <UserIcon size={14} className="mr-2" /> Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate('/app/advanced/security-groups')}>
              <Settings size={14} className="mr-2" /> Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => { logout(); navigate('/login'); }} className="text-red-600">
              <LogOut size={14} className="mr-2" /> Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};
