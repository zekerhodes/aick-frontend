import React, { useState, useEffect, useMemo } from 'react';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { CalendarDays, Wrench, ShieldCheck, UserCheck, ChevronLeft, ChevronRight, List as ListIcon, Grid3x3 } from 'lucide-react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, addMonths, subMonths, isSameMonth, isSameDay, parseISO, startOfDay } from 'date-fns';
import { api } from '../../lib/api';
import { Link } from 'react-router-dom';

const TYPE_META = {
  maintenance: { label: 'Maintenance', color: 'bg-amber-100 text-amber-800 border-amber-200', icon: Wrench },
  warranty: { label: 'Warranty', color: 'bg-red-100 text-red-800 border-red-200', icon: ShieldCheck },
  return: { label: 'Return due', color: 'bg-blue-100 text-blue-800 border-blue-200', icon: UserCheck },
};

export const MaintenanceCalendar = () => {
  const [cursor, setCursor] = useState(() => startOfDay(new Date()));
  const [events, setEvents] = useState([]);
  const [view, setView] = useState('month');
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  const monthStart = startOfMonth(cursor);
  const monthEnd = endOfMonth(cursor);
  const gridStart = startOfWeek(monthStart, { weekStartsOn: 0 });
  const gridEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });

  useEffect(() => {
    setLoading(true);
    const params = {
      start: format(gridStart, 'yyyy-MM-dd'),
      end: format(gridEnd, 'yyyy-MM-dd'),
    };
    api.get('/reports/calendar-events', { params })
      .then(({ data }) => setEvents(data.events || []))
      .catch(() => setEvents([]))
      .finally(() => setLoading(false));
  }, [cursor]);

  const days = useMemo(() => {
    const arr = [];
    let d = gridStart;
    while (d <= gridEnd) { arr.push(d); d = addDays(d, 1); }
    return arr;
  }, [cursor]);

  const eventsByDate = useMemo(() => {
    const map = {};
    events.forEach((e) => { (map[e.date] = map[e.date] || []).push(e); });
    return map;
  }, [events]);

  const weeksInList = useMemo(() => {
    const groups = {};
    events.forEach((e) => {
      const d = parseISO(e.date);
      const wkStart = format(startOfWeek(d, { weekStartsOn: 1 }), 'yyyy-MM-dd');
      (groups[wkStart] = groups[wkStart] || []).push(e);
    });
    return Object.entries(groups).sort(([a], [b]) => a.localeCompare(b));
  }, [events]);

  return (
    <div className="space-y-6" data-testid="maintenance-calendar-page">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <CalendarDays size={22} className="text-[#D9501E]" /> Maintenance Calendar
          </h1>
          <p className="text-sm text-slate-500 mt-1">Scheduled maintenance, warranty expiries and returns due</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex border border-slate-200 rounded-md overflow-hidden">
            <button
              onClick={() => setView('month')}
              data-testid="calendar-view-month"
              className={`px-3 py-1.5 text-sm flex items-center gap-1.5 ${view === 'month' ? 'bg-[#D9501E] text-white' : 'bg-white text-slate-700 hover:bg-slate-50'}`}
            >
              <Grid3x3 size={14} /> Month
            </button>
            <button
              onClick={() => setView('list')}
              data-testid="calendar-view-list"
              className={`px-3 py-1.5 text-sm flex items-center gap-1.5 ${view === 'list' ? 'bg-[#D9501E] text-white' : 'bg-white text-slate-700 hover:bg-slate-50'}`}
            >
              <ListIcon size={14} /> List
            </button>
          </div>
        </div>
      </div>

      <Card className="p-4 border-slate-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setCursor(subMonths(cursor, 1))} data-testid="calendar-prev-month"><ChevronLeft size={14} /></Button>
            <div className="text-lg font-semibold text-slate-900 min-w-[180px] text-center">{format(cursor, 'MMMM yyyy')}</div>
            <Button variant="outline" size="sm" onClick={() => setCursor(addMonths(cursor, 1))} data-testid="calendar-next-month"><ChevronRight size={14} /></Button>
            <Button variant="ghost" size="sm" onClick={() => setCursor(startOfDay(new Date()))} data-testid="calendar-today">Today</Button>
          </div>
          <div className="hidden md:flex items-center gap-3 text-xs text-slate-500">
            {Object.entries(TYPE_META).map(([k, m]) => (
              <span key={k} className="flex items-center gap-1.5">
                <span className={`inline-block w-2.5 h-2.5 rounded-sm ${m.color.split(' ')[0]}`} />
                {m.label}
              </span>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="py-16 text-center text-slate-400 text-sm">Loading calendar...</div>
        ) : view === 'month' ? (
          <div>
            <div className="grid grid-cols-7 text-[11px] uppercase tracking-wider text-slate-500 font-semibold border-b border-slate-200 pb-2 mb-1">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
                <div key={d} className="px-2">{d}</div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {days.map((d) => {
                const key = format(d, 'yyyy-MM-dd');
                const evs = eventsByDate[key] || [];
                const outside = !isSameMonth(d, cursor);
                const today = isSameDay(d, new Date());
                return (
                  <div
                    key={key}
                    className={`min-h-[100px] p-1.5 rounded-md border ${outside ? 'bg-slate-50/50 text-slate-400' : 'bg-white'} ${today ? 'border-[#D9501E]' : 'border-slate-200'}`}
                  >
                    <div className={`text-xs font-semibold mb-1 ${today ? 'text-[#D9501E]' : ''}`}>{format(d, 'd')}</div>
                    <div className="space-y-1">
                      {evs.slice(0, 3).map((e) => {
                        const meta = TYPE_META[e.type] || TYPE_META.maintenance;
                        return (
                          <button
                            key={e.id}
                            onClick={() => setSelected(e)}
                            data-testid={`calendar-event-${e.id}`}
                            className={`w-full text-left text-[10px] leading-tight px-1.5 py-1 rounded border truncate ${meta.color} hover:opacity-80`}
                            title={e.title}
                          >
                            {e.title}
                          </button>
                        );
                      })}
                      {evs.length > 3 && (
                        <button
                          onClick={() => setSelected({ multi: true, date: key, list: evs })}
                          className="text-[10px] text-slate-500 hover:text-[#D9501E]"
                        >
                          +{evs.length - 3} more
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {weeksInList.length === 0 && <div className="py-12 text-center text-slate-400 text-sm">No events in this range.</div>}
            {weeksInList.map(([weekStart, evs]) => (
              <div key={weekStart}>
                <div className="text-xs uppercase tracking-wider text-slate-500 font-semibold border-b border-slate-200 pb-1 mb-2">
                  Week of {format(parseISO(weekStart), 'MMM d, yyyy')} - {evs.length} event{evs.length === 1 ? '' : 's'}
                </div>
                <div className="divide-y divide-slate-100">
                  {evs.sort((a, b) => a.date.localeCompare(b.date)).map((e) => {
                    const meta = TYPE_META[e.type] || TYPE_META.maintenance;
                    const Icon = meta.icon;
                    return (
                      <button
                        key={e.id}
                        onClick={() => setSelected(e)}
                        data-testid={`calendar-list-item-${e.id}`}
                        className="w-full text-left py-2 px-1 hover:bg-slate-50 rounded flex items-center gap-3"
                      >
                        <div className={`w-10 text-center text-xs font-mono ${meta.color} py-1 rounded border`}>
                          {format(parseISO(e.date), 'MMM d')}
                        </div>
                        <Icon size={14} className="text-slate-400" />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm text-slate-900 truncate">{e.title}</div>
                          <div className="text-xs text-slate-500 truncate">
                            {e.type === 'maintenance' && e.meta.technician}
                            {e.type === 'return' && e.meta.person}
                            {e.type === 'warranty' && e.meta.vendor}
                          </div>
                        </div>
                        <Badge variant="outline" className={meta.color}>{meta.label}</Badge>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {selected && !selected.multi && (
        <EventDialog event={selected} onClose={() => setSelected(null)} />
      )}
      {selected?.multi && (
        <MultiDialog date={selected.date} list={selected.list} onClose={() => setSelected(null)} onPick={(e) => setSelected(e)} />
      )}
    </div>
  );
};

const EventDialog = ({ event, onClose }) => {
  const meta = TYPE_META[event.type] || TYPE_META.maintenance;
  const Icon = meta.icon;
  return (
    <div className="fixed inset-0 bg-slate-900/40 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <Card className="p-6 max-w-md w-full border-slate-200 bg-white" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start gap-3 mb-4">
          <div className={`p-2 rounded-md ${meta.color}`}><Icon size={18} /></div>
          <div className="flex-1 min-w-0">
            <div className="text-xs uppercase tracking-wider text-slate-500 font-semibold">{meta.label}</div>
            <h3 className="font-semibold text-slate-900 text-lg leading-tight">{event.title}</h3>
            <div className="text-xs text-slate-500 mt-1">{format(parseISO(event.date), 'EEEE, MMMM d, yyyy')}</div>
          </div>
        </div>
        <div className="space-y-1.5 text-sm text-slate-700 mb-4">
          {event.meta?.technician && <div><span className="text-slate-500">Technician:</span> {event.meta.technician}</div>}
          {event.meta?.status && <div><span className="text-slate-500">Status:</span> {event.meta.status}</div>}
          {event.meta?.person && <div><span className="text-slate-500">Person:</span> {event.meta.person}</div>}
          {event.meta?.vendor && <div><span className="text-slate-500">Vendor:</span> {event.meta.vendor}</div>}
          {event.meta?.location && <div><span className="text-slate-500">Location:</span> {event.meta.location}</div>}
          {event.meta?.tag && <div><span className="text-slate-500">Asset Tag:</span> <span className="font-mono">{event.meta.tag}</span></div>}
          {event.meta?.cost != null && event.meta.cost > 0 && <div><span className="text-slate-500">Cost:</span> Ksh {event.meta.cost.toLocaleString()}</div>}
          {event.meta?.notes && <div className="pt-2 border-t border-slate-100 text-slate-600">{event.meta.notes}</div>}
        </div>
        <div className="flex justify-between items-center">
          {event.asset_id && (
            <Link to={`/app/assets/${event.asset_id}`} className="text-sm text-[#D9501E] hover:underline">
              Open asset
            </Link>
          )}
          <Button variant="outline" size="sm" onClick={onClose} data-testid="event-dialog-close">Close</Button>
        </div>
      </Card>
    </div>
  );
};

const MultiDialog = ({ date, list, onClose, onPick }) => (
  <div className="fixed inset-0 bg-slate-900/40 z-50 flex items-center justify-center p-4" onClick={onClose}>
    <Card className="p-6 max-w-md w-full border-slate-200 bg-white" onClick={(e) => e.stopPropagation()}>
      <div className="mb-4">
        <div className="text-xs uppercase tracking-wider text-slate-500 font-semibold">Events on</div>
        <h3 className="font-semibold text-slate-900 text-lg">{format(parseISO(date), 'EEEE, MMMM d, yyyy')}</h3>
      </div>
      <div className="space-y-1 max-h-72 overflow-y-auto">
        {list.map((e) => {
          const meta = TYPE_META[e.type] || TYPE_META.maintenance;
          return (
            <button key={e.id} onClick={() => onPick(e)} className={`w-full text-left px-3 py-2 rounded border ${meta.color} hover:opacity-80`}>
              <div className="text-xs uppercase font-semibold">{meta.label}</div>
              <div className="text-sm">{e.title}</div>
            </button>
          );
        })}
      </div>
      <div className="mt-4 flex justify-end">
        <Button variant="outline" size="sm" onClick={onClose}>Close</Button>
      </div>
    </Card>
  </div>
);
