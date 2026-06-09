import React, { useEffect, useRef, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Camera, X, ScanLine, CheckCircle } from 'lucide-react';
import { Html5Qrcode } from 'html5-qrcode';

/**
 * BarcodeScanner: full-screen camera-based scanner.
 * Supports CODE128, CODE39, EAN, UPC, QR, and most common barcode formats.
 * Works on laptop webcams AND mobile phones (Chrome/Safari).
 */
export const BarcodeScanner = ({ open, onClose, onScan }) => {
  const scannerRef = useRef(null);
  const containerId = 'aick-barcode-scanner';
  const [status, setStatus] = useState('idle'); // idle | starting | scanning | error
  const [error, setError] = useState('');
  const [lastCode, setLastCode] = useState('');

  useEffect(() => {
    if (!open) return;
    let stopped = false;

    const start = async () => {
      setStatus('starting');
      setError('');
      try {
        const html5Qr = new Html5Qrcode(containerId, { verbose: false });
        scannerRef.current = html5Qr;
        await html5Qr.start(
          { facingMode: 'environment' }, // prefer rear camera on phones; falls back to laptop webcam
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
            setLastCode(decodedText);
            // Small delay to let user see the success state
            setTimeout(() => {
              onScan(decodedText);
              handleClose();
            }, 250);
          },
          () => {}
        );
        setStatus('scanning');
      } catch (e) {
        console.error(e);
        setError(e?.message || 'Could not access camera. Check browser permissions.');
        setStatus('error');
      }
    };

    start();
    return () => {
      stopped = true;
      const s = scannerRef.current;
      if (s) {
        try { s.stop().then(() => s.clear()).catch(() => {}); } catch {}
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const handleClose = () => {
    const s = scannerRef.current;
    if (s) {
      try { s.stop().then(() => s.clear()).catch(() => {}); } catch {}
    }
    setStatus('idle');
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent className="sm:max-w-lg p-0 overflow-hidden">
        <DialogHeader className="px-5 py-3 border-b border-slate-200">
          <DialogTitle className="flex items-center gap-2">
            <Camera size={18} className="text-[#D9501E]" />
            Scan Barcode
          </DialogTitle>
        </DialogHeader>
        <div className="relative bg-black" style={{ minHeight: 360 }}>
          <div id={containerId} style={{ width: '100%' }} />
          {status === 'starting' && (
            <div className="absolute inset-0 flex items-center justify-center text-white text-sm">
              <ScanLine className="mr-2 animate-pulse" /> Starting camera...
            </div>
          )}
          {status === 'error' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-sm p-6 text-center bg-slate-900">
              <X size={24} className="mb-2 text-red-400" />
              <p className="font-semibold">Camera unavailable</p>
              <p className="text-xs text-slate-300 mt-2 max-w-xs">{error}</p>
              <p className="text-[11px] text-slate-400 mt-3">On HTTPS sites (Vercel), allow camera access in your browser settings.</p>
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
