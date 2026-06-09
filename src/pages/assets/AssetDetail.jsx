import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { api, formatKSh } from '../../lib/api';
import { ArrowLeft, Edit, Trash2, Printer, Barcode as BarcodeIcon, Tag, MapPin, User, Calendar, DollarSign, FileText } from 'lucide-react';
import Barcode from 'react-barcode';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { toast } from '../../hooks/use-toast';

export const AssetDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [asset, setAsset] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/assets/${id}`).then(({ data }) => setAsset(data)).catch(() => setAsset(null)).finally(() => setLoading(false));
  }, [id]);

  const onDelete = async () => {
    if (!window.confirm('Delete this asset? This cannot be undone.')) return;
    try {
      await api.delete(`/assets/${id}`);
      toast({ title: 'Asset deleted' });
      navigate('/app/assets');
    } catch (err) {
      toast({ title: 'Error', description: err?.response?.data?.detail || 'Delete failed', variant: 'destructive' });
    }
  };

  if (loading) return <div className="text-slate-400 text-sm py-12 text-center">Loading asset...</div>;
  if (!asset) {
    return (
      <div className="text-center py-20">
        <p className="text-slate-500">Asset not found.</p>
        <Button variant="outline" className="mt-4" onClick={() => navigate('/app/assets')}>Back to list</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={() => navigate('/app/assets')}><ArrowLeft size={14} className="mr-1.5" /> Back</Button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{asset.name}</h1>
            <p className="text-sm text-slate-500 mt-0.5 font-mono">{asset.tag}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => window.print()}><Printer size={14} className="mr-1.5" /> Print</Button>
          <Button variant="outline" size="sm" onClick={() => navigate(`/app/assets/${id}/edit`)}><Edit size={14} className="mr-1.5" /> Edit</Button>
          <Button variant="outline" size="sm" className="text-red-600" onClick={onDelete}><Trash2 size={14} className="mr-1.5" /> Delete</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6 border-slate-200">
            <div className="grid grid-cols-2 gap-x-6 gap-y-4 text-sm">
              <Field icon={Tag} label="Category" value={asset.category} />
              <Field icon={MapPin} label="Location" value={asset.location} />
              <Field icon={User} label="Assigned To" value={asset.assigned_to} />
              <Field icon={Calendar} label="Purchase Date" value={asset.purchase_date} />
              <Field icon={DollarSign} label="Purchase Cost" value={formatKSh(asset.purchase_cost)} />
              <Field icon={FileText} label="Serial Number" value={asset.serial_number} />
              <Field icon={Calendar} label="Warranty Expiry" value={asset.warranty_expiry} />
              <Field icon={FileText} label="Funding Source" value={asset.funding_source} />
            </div>
            <div className="mt-4 flex gap-2">
              <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">{asset.status}</Badge>
              <Badge variant="outline">Condition: {asset.condition || 'N/A'}</Badge>
            </div>
          </Card>
          <Card className="p-6 border-slate-200">
            <Tabs defaultValue="info">
              <TabsList>
                <TabsTrigger value="info">Details</TabsTrigger>
                <TabsTrigger value="docs">Documents</TabsTrigger>
              </TabsList>
              <TabsContent value="info" className="pt-4 text-sm text-slate-600">
                {asset.notes || 'No additional notes for this asset.'}
              </TabsContent>
              <TabsContent value="docs" className="pt-4">
                <p className="text-sm text-slate-400 text-center py-8">No documents uploaded.</p>
              </TabsContent>
            </Tabs>
          </Card>
        </div>
        <div className="space-y-6">
          <Card className="p-6 border-slate-200">
            <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2"><BarcodeIcon size={16} className="text-[#D9501E]" /> Barcode</h3>
            <div className="bg-white p-3 border border-slate-200 rounded-md flex justify-center">
              <Barcode value={asset.tag} format="CODE128" width={1.4} height={60} fontSize={11} background="#ffffff" />
            </div>
            <Button variant="outline" className="w-full mt-3" size="sm" onClick={() => navigate('/app/tools/barcode')}>
              <Printer size={14} className="mr-1.5" /> Print Label
            </Button>
          </Card>
          <Card className="p-6 border-slate-200">
            <h3 className="font-semibold text-slate-900 mb-3">Quick Actions</h3>
            <div className="space-y-2">
              <Link to="/app/assets/check-out" className="block w-full text-left text-sm text-slate-700 py-2 px-3 rounded hover:bg-slate-50">Check out</Link>
              <Link to="/app/assets/maintenance" className="block w-full text-left text-sm text-slate-700 py-2 px-3 rounded hover:bg-slate-50">Log maintenance</Link>
              <Link to="/app/assets/move" className="block w-full text-left text-sm text-slate-700 py-2 px-3 rounded hover:bg-slate-50">Move</Link>
              <Link to="/app/assets/reserve" className="block w-full text-left text-sm text-slate-700 py-2 px-3 rounded hover:bg-slate-50">Reserve</Link>
              <Link to="/app/assets/dispose" className="block w-full text-left text-sm text-red-600 py-2 px-3 rounded hover:bg-red-50">Dispose</Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

const Field = ({ icon: Icon, label, value }) => (
  <div>
    <div className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold flex items-center gap-1.5">
      <Icon size={12} /> {label}
    </div>
    <div className="mt-1 text-slate-900 font-medium">{value || '—'}</div>
  </div>
);
