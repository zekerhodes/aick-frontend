import React, { useState, useRef } from 'react';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { FileText, Link as LinkIcon, Upload, Download, Trash2, Save, ExternalLink } from 'lucide-react';
import { api, formatApiError, API } from '../../lib/api';
import { toast } from '../../hooks/use-toast';

const formatBytes = (b) => {
  if (!b) return '';
  if (b < 1024) return `${b} B`;
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} KB`;
  return `${(b / (1024 * 1024)).toFixed(1)} MB`;
};

const authHeader = () => {
  try {
    const u = JSON.parse(localStorage.getItem('aick_user') || '{}');
    return u?.token ? { Authorization: `Bearer ${u.token}` } : {};
  } catch { return {}; }
};

export const AssetSOP = ({ asset, onUpdated }) => {
  const [text, setText] = useState(asset.sop_text || '');
  const [url, setUrl] = useState(asset.sop_url || '');
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [files, setFiles] = useState(asset.sop_files || []);
  const fileInputRef = useRef(null);

  const saveTextAndUrl = async () => {
    setSaving(true);
    try {
      const { data } = await api.put(`/assets/${asset.id}`, { sop_text: text, sop_url: url });
      onUpdated?.(data);
      toast({ title: 'SOP saved' });
    } catch (err) {
      toast({ title: 'Save failed', description: formatApiError(err), variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const uploadFile = async (file) => {
    if (!file) return;
    if (file.size > 15 * 1024 * 1024) {
      toast({ title: 'File too large', description: `Max 15 MB. This file is ${(file.size / (1024 * 1024)).toFixed(1)} MB.`, variant: 'destructive' });
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const { data } = await api.post(`/assets/${asset.id}/sop-files`, fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setFiles((f) => [...f, data]);
      toast({ title: 'File uploaded', description: file.name });
    } catch (err) {
      toast({ title: 'Upload failed', description: formatApiError(err), variant: 'destructive' });
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const deleteFile = async (fileId, filename) => {
    if (!window.confirm(`Remove "${filename}" from this asset's SOP?`)) return;
    try {
      await api.delete(`/assets/${asset.id}/sop-files/${fileId}`);
      setFiles((f) => f.filter((x) => x.id !== fileId));
      toast({ title: 'File removed' });
    } catch (err) {
      toast({ title: 'Delete failed', description: formatApiError(err), variant: 'destructive' });
    }
  };

  const downloadUrl = (fileId) => `${API}/assets/${asset.id}/sop-files/${fileId}`;

  const downloadFile = async (fileId, filename) => {
    try {
      const res = await fetch(downloadUrl(fileId), { headers: authHeader() });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = filename; a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      toast({ title: 'Download failed', description: String(err), variant: 'destructive' });
    }
  };

  return (
    <div className="space-y-6 pt-4" data-testid="sop-tab">
      <div>
        <Label>SOP Text - steps, safety notes, quick reference</Label>
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={10}
          placeholder={'e.g.\n1. Wear PPE before use.\n2. Verify calibration monthly.\n3. Refer to manufacturer manual page 42 for shutdown sequence.'}
          className="mt-1.5 font-mono text-[13px]"
          data-testid="sop-text"
        />
        <p className="text-[11px] text-slate-500 mt-1">Line breaks and indentation are preserved when printed.</p>
      </div>

      <div>
        <Label className="flex items-center gap-1.5"><LinkIcon size={13} /> External SOP link</Label>
        <div className="flex gap-2 mt-1.5">
          <Input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://drive.google.com/... or intranet URL"
            data-testid="sop-url"
          />
          {url && (
            <Button type="button" variant="outline" onClick={() => window.open(url, '_blank')} title="Open link">
              <ExternalLink size={14} />
            </Button>
          )}
        </div>
      </div>

      <Button onClick={saveTextAndUrl} disabled={saving} className="bg-[#D9501E] hover:bg-[#B8400F] text-white" data-testid="save-sop">
        <Save size={14} className="mr-1.5" /> {saving ? 'Saving...' : 'Save SOP'}
      </Button>

      <div className="pt-4 border-t border-slate-100">
        <div className="flex items-center justify-between mb-3">
          <Label className="flex items-center gap-1.5"><FileText size={13} /> Attached documents ({files.length})</Label>
          <label className="cursor-pointer">
            <input
              type="file"
              ref={fileInputRef}
              hidden
              onChange={(e) => uploadFile(e.target.files?.[0])}
              accept=".pdf,.doc,.docx,.xls,.xlsx,.txt,.png,.jpg,.jpeg,.webp"
              data-testid="sop-file-input"
            />
            <span className="inline-flex items-center gap-1.5 text-sm text-[#D9501E] hover:text-[#B8400F] px-3 py-1.5 border border-[#D9501E] rounded-md">
              <Upload size={13} /> {uploading ? 'Uploading...' : 'Upload file'}
            </span>
          </label>
        </div>
        {files.length === 0 ? (
          <p className="text-sm text-slate-400 text-center py-6 border border-dashed border-slate-200 rounded-md">
            No files attached yet. Upload PDFs, Word docs, images (max 15 MB each).
          </p>
        ) : (
          <div className="divide-y divide-slate-100 border border-slate-200 rounded-md">
            {files.map((f) => (
              <div key={f.id} className="flex items-center gap-3 px-3 py-2.5" data-testid={`sop-file-${f.id}`}>
                <FileText size={16} className="text-slate-400 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-slate-900 truncate">{f.filename}</div>
                  <div className="text-[11px] text-slate-500">{formatBytes(f.size)} - {f.uploaded_by || 'unknown'}</div>
                </div>
                <Button size="sm" variant="outline" onClick={() => downloadFile(f.id, f.filename)} title="Download">
                  <Download size={13} />
                </Button>
                <Button size="sm" variant="outline" className="text-red-600" onClick={() => deleteFile(f.id, f.filename)} title="Remove">
                  <Trash2 size={13} />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
