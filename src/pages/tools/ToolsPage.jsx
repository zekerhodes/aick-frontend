import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Upload, Download, FolderOpen, Image as ImageIcon, ScanLine, Barcode as BarcodeIcon, Printer, FileText } from 'lucide-react';
import Barcode from 'react-barcode';
import { api } from '../../lib/api';
import { toast } from '../../hooks/use-toast';

export const ToolsPage = () => {
  const { kind } = useParams();

  if (kind === 'barcode') return <BarcodeTool />;
  if (kind === 'import') return <ImportTool />;
  if (kind === 'export') return <ExportTool />;
  if (kind === 'documents') return <GalleryTool kind="documents" />;
  if (kind === 'images') return <GalleryTool kind="images" />;
  if (kind === 'audit') return <AuditTool />;
  return <ImportTool />;
};

const BarcodeTool = () => {
  const [assets, setAssets] = useState([]);
  const [selected, setSelected] = useState([]);
  const [size, setSize] = useState('medium');
  const [format, setFormat] = useState('CODE128');

  useEffect(() => {
    api.get('/assets?per_page=500').then(({ data }) => {
      setAssets(data.items || []);
      setSelected((data.items || []).slice(0, 4).map((a) => a.id));
    }).catch(() => {});
  }, []);

  const toggle = (id) => setSelected((s) => s.includes(id) ? s.filter((x) => x !== id) : [...s, id]);
  const items = assets.filter((a) => selected.includes(a.id));
  const widths = { small: 1.0, medium: 1.4, large: 1.8 };
  const heights = { small: 40, medium: 60, large: 80 };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2"><BarcodeIcon size={22} className="text-[#D9501E]" /> Barcode Generator</h1>
          <p className="text-sm text-slate-500 mt-1">Generate, preview and print barcode labels for hospital assets</p>
        </div>
        <Button onClick={() => window.print()} className="bg-[#D9501E] hover:bg-[#B8400F] text-white"><Printer size={14} className="mr-1.5" /> Print Labels</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-5 border-slate-200 lg:col-span-1">
          <h3 className="font-semibold text-slate-900 mb-4">Settings</h3>
          <div className="space-y-4">
            <div>
              <Label>Barcode Format</Label>
              <Select value={format} onValueChange={setFormat}>
                <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="CODE128">CODE 128</SelectItem>
                  <SelectItem value="CODE39">CODE 39</SelectItem>
                  <SelectItem value="EAN13">EAN-13</SelectItem>
                  <SelectItem value="UPC">UPC</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Label Size</Label>
              <Select value={size} onValueChange={setSize}>
                <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="small">Small (30mm)</SelectItem>
                  <SelectItem value="medium">Medium (50mm)</SelectItem>
                  <SelectItem value="large">Large (75mm)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="pt-4 border-t border-slate-100">
              <h4 className="text-sm font-semibold text-slate-900 mb-3">Select Assets ({selected.length})</h4>
              <div className="space-y-1 max-h-72 overflow-y-auto">
                {ASSETS.map((a) => (
                  <label key={a.id} className="flex items-center gap-2 py-1.5 px-2 rounded hover:bg-slate-50 cursor-pointer text-sm">
                    <input type="checkbox" checked={selected.includes(a.id)} onChange={() => toggle(a.id)} className="accent-[#D9501E]" />
                    <span className="font-mono text-xs text-slate-600">{a.tag}</span>
                    <span className="text-slate-700 truncate">{a.name}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </Card>
        <Card className="p-5 border-slate-200 lg:col-span-2">
          <h3 className="font-semibold text-slate-900 mb-4">Preview · Print Sheet</h3>
          <div className="bg-slate-50 p-6 rounded-md border border-slate-200 min-h-[500px]">
            <div className="bg-white p-6 shadow-sm grid grid-cols-2 gap-4">
              {items.map((a) => (
                <div key={a.id} className="border border-dashed border-slate-300 p-3 flex flex-col items-center">
                  <div className="text-[10px] font-bold text-slate-900 mb-1">AIC Kapsowar Hospital</div>
                  <Barcode value={a.tag} format={format} width={widths[size]} height={heights[size]} fontSize={11} background="#ffffff" />
                  <div className="text-[10px] text-slate-600 mt-1 text-center">{a.name.slice(0, 35)}{a.name.length > 35 ? '...' : ''}</div>
                </div>
              ))}
              {items.length === 0 && <p className="col-span-2 text-center text-slate-400 py-10">Select assets to preview labels</p>}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

const ImportTool = () => (
  <div className="space-y-6 max-w-3xl">
    <div>
      <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2"><Upload size={22} className="text-[#D9501E]" /> Import Assets</h1>
      <p className="text-sm text-slate-500 mt-1">Bulk upload assets from CSV / Excel — handles thousands of records</p>
    </div>
    <Card className="p-6 border-slate-200">
      <button className="w-full border-2 border-dashed border-slate-300 rounded-md p-12 flex flex-col items-center gap-3 text-slate-500 hover:border-[#D9501E] hover:text-[#D9501E] transition-colors">
        <Upload size={32} />
        <div className="font-medium">Drag & drop your CSV file here</div>
        <div className="text-xs">or click to browse — Max 50MB</div>
      </button>
      <div className="mt-6 grid grid-cols-2 gap-3">
        <Button variant="outline" className="w-full" onClick={() => toast({ title: 'Template downloaded', description: 'assets_template.csv' })}><Download size={14} className="mr-1.5" /> Download Template</Button>
        <Button className="w-full bg-[#D9501E] hover:bg-[#B8400F] text-white" onClick={() => toast({ title: 'Demo mode', description: 'Real import activates with backend' })}>Start Import</Button>
      </div>
    </Card>
    <Card className="p-6 border-slate-200">
      <h3 className="font-semibold text-slate-900 mb-3">Required Columns</h3>
      <div className="grid grid-cols-2 gap-2 text-xs">
        {['name *', 'tag *', 'category *', 'location *', 'department', 'serial_number', 'purchase_date', 'purchase_cost', 'vendor', 'warranty_expiry', 'assigned_to', 'condition', 'notes'].map((c) => (
          <div key={c} className="px-3 py-1.5 bg-slate-50 rounded font-mono">{c}</div>
        ))}
      </div>
    </Card>
  </div>
);

const ExportTool = () => (
  <div className="space-y-6 max-w-3xl">
    <div>
      <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2"><Download size={22} className="text-[#D9501E]" /> Export Data</h1>
      <p className="text-sm text-slate-500 mt-1">Download asset data in your preferred format</p>
    </div>
    <Card className="p-6 border-slate-200 space-y-4">
      <div>
        <Label>Data to Export</Label>
        <Select defaultValue="all-assets">
          <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all-assets">All Assets</SelectItem>
            <SelectItem value="by-category">Assets by Category</SelectItem>
            <SelectItem value="maintenance">Maintenance Records</SelectItem>
            <SelectItem value="warranties">Warranties</SelectItem>
            <SelectItem value="transactions">Transactions</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label>Format</Label>
        <Select defaultValue="csv">
          <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="csv">CSV</SelectItem>
            <SelectItem value="xlsx">Excel (XLSX)</SelectItem>
            <SelectItem value="pdf">PDF Report</SelectItem>
            <SelectItem value="json">JSON</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button className="w-full bg-[#D9501E] hover:bg-[#B8400F] text-white" onClick={() => toast({ title: 'Export started', description: 'Your download will begin shortly (demo)' })}><Download size={14} className="mr-1.5" /> Generate Export</Button>
    </Card>
  </div>
);

const GalleryTool = ({ kind }) => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          {kind === 'documents' ? <FolderOpen size={22} className="text-[#D9501E]" /> : <ImageIcon size={22} className="text-[#D9501E]" />}
          {kind === 'documents' ? 'Documents Gallery' : 'Image Gallery'}
        </h1>
        <p className="text-sm text-slate-500 mt-1">All {kind} attached to assets across the hospital</p>
      </div>
      <Button className="bg-[#D9501E] hover:bg-[#B8400F] text-white"><Upload size={14} className="mr-1.5" /> Upload</Button>
    </div>
    <Card className="p-6 border-slate-200">
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="aspect-square bg-slate-100 rounded-md flex items-center justify-center text-slate-400 border border-slate-200">
            {kind === 'documents' ? <FileText size={28} /> : <ImageIcon size={28} />}
          </div>
        ))}
      </div>
      <p className="text-xs text-slate-400 text-center mt-6">Sample placeholders — connect backend to load real {kind}.</p>
    </Card>
  </div>
);

const AuditTool = () => {
  const [assetCount, setAssetCount] = useState(0);
  useEffect(() => {
    api.get('/assets?per_page=1').then(({ data }) => setAssetCount(data.total || 0)).catch(() => {});
  }, []);
  return (
  <div className="space-y-6">
    <div>
      <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2"><ScanLine size={22} className="text-[#D9501E]" /> Physical Audit</h1>
      <p className="text-sm text-slate-500 mt-1">Scan barcodes to reconcile physical assets against records</p>
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="p-6 border-slate-200 lg:col-span-2">
        <h3 className="font-semibold text-slate-900 mb-4">Scan Asset Barcode</h3>
        <div className="relative">
          <ScanLine size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#D9501E]" />
          <Input placeholder="Focus here and scan with USB barcode reader..." className="pl-10 h-12 font-mono" autoFocus />
        </div>
        <div className="mt-6 bg-slate-50 rounded-md p-8 text-center text-slate-400 border-2 border-dashed border-slate-200">
          <ScanLine size={32} className="mx-auto mb-2 opacity-40" />
          <p className="text-sm">Scanned assets will appear here</p>
        </div>
      </Card>
      <Card className="p-6 border-slate-200">
        <h3 className="font-semibold text-slate-900 mb-3">Audit Session</h3>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between"><span className="text-slate-500">Started</span><span>--:--</span></div>
          <div className="flex justify-between"><span className="text-slate-500">Scanned</span><span className="font-semibold">0</span></div>
          <div className="flex justify-between"><span className="text-slate-500">Expected</span><span className="font-semibold">{assetCount}</span></div>
          <div className="flex justify-between"><span className="text-slate-500">Missing</span><span className="font-semibold text-red-600">0</span></div>
        </div>
        <Button className="w-full mt-4 bg-[#D9501E] hover:bg-[#B8400F] text-white">Start Audit Session</Button>
      </Card>
    </div>
  </div>
  );
};
