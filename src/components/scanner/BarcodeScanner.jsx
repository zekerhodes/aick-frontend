import React, { useEffect, useRef, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Button } from '../ui/button';
import { Camera, X, ScanLine, CheckCircle, RotateCcw } from 'lucide-react';
import { Html5Qrcode } from 'html5-qrcode';

export const BarcodeScanner = ({ open, onClose, onScan }) => {
  const scannerRef = useRef(null);
  const containerId = 'aick-barcode-scanner';
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');
  const [lastCode, setLastCode] = useState('');
  const [cameras, setCameras] = useState([]);
  const [activeCameraId, setActiveCameraId] = useState(null);

  const startCamera = async (cameraId) => {
    setStatus('starting');
    setError('');
    setLastCode('');

    // Stop any existing scanner
    if (scannerRef.current) {
      try { await scannerRef.current.stop(); await scannerRef.current.clear(); } catch {}
      scannerRef.current = null;
    }

    try {
      const containerEl = document.getElementById(containerId);
      if (!containerEl) throw new Error('Scanner not ready');

      const html5Qr = new Html5Qrcode(containerId, { verbose: false });
      scannerRef.current = html5Qr;

      await html5Qr.start(
        cameraId,
        {
          fps: 15,
          qrbox: (vw, vh) => {
            const min = Math.min(vw, vh);
            const size = Math.floor(min * 0.75);
            return { width: size, height: size };
          },
          aspectRatio: 1.0,
          disableFlip: false,
        },
        (decodedText) => {
          setLastCode(decodedText);
          setTimeout(async () => {
            try { await html5Qr.stop(); await html5Qr.clear(); } catch {}
            scannerRef.current = null;
            onScan(decodedText);
            onClose();
          }, 300);
        },
        () => {}
      );
      setStatus('scanning');
      setActiveCameraId(cameraId);
    } catch (e) {
      console.error('Scanner error:', e);
      setError(e?.message || 'Could not start camera.');
      setStatus('error');
    }
  };

  useEffect(() => {
    if (!open) return;

    const timer = setTimeout(async () => {
      try {
        const list = await Html5Qrcode.getCameras();
        if (!list || list.length === 0) {
          setError('No camera detected. Grant permission and reload.');
          setStatus('error');
          return;
        }
        setCameras(list);
        // Prefer rear camera label on phones; else first available
        const rear = list.find((c) => /back|rear|environment/i.test(c.label || ''));
        const chosen = rear ? rear.id : list[0].id;
        await startCamera(chosen);
      } catch (e) {
        setError(e?.message || 'Camera permission denied.');
        setStatus('error');
      }
    }, 300);

    return () => {
      clearTimeout(timer);
      const s = scannerRef.current;
      if (s) {
        try { s.stop().then(() => s.clear()).catch(() => {}); } catch {}
        scannerRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const handleClose = () => {
    const s = scannerRef.current;
    if (s) {
      try { s.stop().then(() => s.clear()).catch(() => {}); } catch {}
      scannerRef.current = null;
    }
    setStatus('idle');
    setError('');
    setLastCode('');
    setCameras([]);
    setActiveCameraId(null);
    onClose();
  };

  const switchCamera = async () => {
    if (cameras.length < 2) return;
    const idx = cameras.findIndex((c) => c.id === activeCameraId);
    const next = cameras[(idx + 1) % cameras.length];
    await startCamera(next.id);
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent className="sm:max-w-lg p-0 overflow-hidden" aria-describedby="scanner-desc">
        <DialogHeader className="px-5 py-3 border-b border-slate-200">
          <DialogTitle className="flex items-center gap-2">
            <Camera size={18} className="text-[#D9501E]" />
            Scan Barcode or QR Code
          </DialogTitle>
          <DialogDescription id="scanner-desc" className="sr-only">
            Camera-based scanner for barcodes and QR codes.
          </DialogDescription>
        </DialogHeader>
        <div className="relative bg-black" style={{ minHeight: 400 }}>
          <div id={containerId} style={{ width: '100%', minHeight: 400 }} />
          {status === 'starting' && (
            <div className="absolute inset-0 flex items-center justify-center text-white text-sm pointer-events-none">
              <ScanLine className="mr-2 animate-pulse" /> Starting camera...
            </div>
          )}
          {status === 'error' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-sm p-6 text-center bg-slate-900">
              <X size={24} className="mb-2 text-red-400" />
              <p className="font-semibold">Camera unavailable</p>
              <p className="text-xs text-slate-300 mt-2 max-w-xs">{error}</p>
            </div>
          )}
          {lastCode && (
            <div className="absolute bottom-3 left-3 right-3 bg-emerald-600 text-white text-sm px-3 py-2 rounded shadow flex items-center gap-2">
              <CheckCircle size={16} /> Scanned: <span className="font-mono">{lastCode}</span>
            </div>
          )}
        </div>
        <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 gap-2">
          <span className="flex-1">Hold code steady, fill the square, ensure good lighting.</span>
          {cameras.length > 1 && (
            <Button variant="outline" size="sm" onClick={switchCamera} title="Switch camera">
              <RotateCcw size={14} className="mr-1" /> Switch
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={handleClose}>Cancel</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
