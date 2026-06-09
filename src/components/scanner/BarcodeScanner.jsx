import React, { useEffect, useRef, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Button } from '../ui/button';
import { Camera, X, ScanLine, CheckCircle } from 'lucide-react';
import { Html5Qrcode } from 'html5-qrcode';

export const BarcodeScanner = ({ open, onClose, onScan }) => {
  const scannerRef = useRef(null);
  const containerId = 'aick-barcode-scanner';
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');
  const [lastCode, setLastCode] = useState('');

  useEffect(() => {
    if (!open) return;
    let stopped = false;

    // Wait for the DOM to render the scanner container before initializing
    const timer = setTimeout(async () => {
      setStatus('starting');
      setError('');
      try {
        const containerEl = document.getElementById(containerId);
        if (!containerEl) {
          throw new Error('Scanner container not ready. Try closing and reopening.');
        }

        // Find available cameras (works on laptops + phones)
        let cameras = [];
        try {
          cameras = await Html5Qrcode.getCameras();
        } catch (e) {
          throw new Error('Camera access denied. Allow camera permission in your browser and reload.');
        }
        if (!cameras || cameras.length === 0) {
          throw new Error('No camera detected. Connect a webcam or use a device with a camera.');
        }

        // Prefer rear camera on phones; otherwise use the first available
        const rear = cameras.find((c) => /back|rear|environment/i.test(c.label || ''));
        const cameraId = rear ? rear.id : cameras[0].id;

        const html5Qr = new Html5Qrcode(containerId, { verbose: false });
        scannerRef.current = html5Qr;

        await html5Qr.start(
          cameraId,
          {
            fps: 10,
            qrbox: (vw, vh) => {
              const min = Math.min(vw, vh);
              return { width: Math.floor(min * 0.7), height: Math.floor(min * 0.35) };
            },
            aspectRatio: 1.6,
          },
          (decodedText) => {
            if (stopped) return;
            stopped = true;
            setLastCode(decodedText);
            setTimeout(() => {
              onScan(decodedText);
              handleClose();
            }, 300);
          },
          () => {}
        );
        setStatus('scanning');
      } catch (e) {
        console.error('Scanner error:', e);
        setError(e?.message || 'Could not start camera.');
        setStatus('error');
      }
    }, 300);

    return () => {
      stopped = true;
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
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent className="sm:max-w-lg p-0 overflow-hidden" aria-describedby="scanner-desc">
        <DialogHeader className="px-5 py-3 border-b border-slate-200">
          <DialogTitle className="flex items-center gap-2">
            <Camera size={18} className="text-[#D9501E]" />
            Scan Barcode
          </DialogTitle>
          <DialogDescription id="scanner-desc" className="sr-only">
            Camera-based barcode scanner. Point your camera at a barcode.
          </DialogDescription>
        </DialogHeader>
        <div className="relative bg-black" style={{ minHeight: 360 }}>
          <div id={containerId} style={{ width: '100%', minHeight: 360 }} />
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
        <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Point the camera at a barcode. Works on phones & laptops.</span>
          <Button variant="outline" size="sm" onClick={handleClose}>Cancel</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
