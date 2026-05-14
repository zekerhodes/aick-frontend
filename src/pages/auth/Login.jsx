import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Logo } from '../../components/branding/Logo';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Label } from '../../components/ui/label';
import { Card } from '../../components/ui/card';
import { Eye, EyeOff, Cross, MapPin } from 'lucide-react';

export const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('admin@kapsowar.org');
  const [password, setPassword] = useState('demo1234');
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }
    try {
      await login(email, password);
      navigate('/app/dashboard');
    } catch (err) {
      setError(err?.response?.data?.detail || 'Login failed. Try again.');
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left brand panel */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #1E3A5F 0%, #0F2540 100%)' }}>
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 20% 20%, #D9501E 0%, transparent 40%), radial-gradient(circle at 80% 70%, #D9501E 0%, transparent 50%)' }} />
        <div className="relative z-10 flex flex-col justify-between p-12 text-white w-full">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #D9501E 0%, #B8400F 100%)' }}>
              <Cross size={22} strokeWidth={2.5} />
            </div>
            <div>
              <div className="font-bold text-xl tracking-tight">AIC Kapsowar Hospital</div>
              <div className="text-[11px] text-slate-300 tracking-wider uppercase">Asset Management System</div>
            </div>
          </div>
          <div>
            <h1 className="text-4xl font-bold leading-tight mb-4">Healing Hands,<br/>Caring Hearts.</h1>
            <p className="text-slate-300 max-w-md leading-relaxed">
              Track every piece of equipment, instrument, and asset across the hospital with precision — from the
              maternity ward to the operating theatre.
            </p>
            <div className="mt-8 flex items-center gap-2 text-sm text-slate-300">
              <MapPin size={14} /> Kapsowar, Elgeyo-Marakwet County, Kenya
            </div>
          </div>
          <div className="text-xs text-slate-400">© {new Date().getFullYear()} AIC Kapsowar Hospital. Serving since 1933.</div>
        </div>
      </div>

      {/* Right login form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-slate-50">
        <Card className="w-full max-w-md p-8 shadow-sm border-slate-200">
          <div className="lg:hidden mb-6"><Logo size="md" /></div>
          <h2 className="text-2xl font-bold text-slate-900">Welcome back</h2>
          <p className="text-sm text-slate-500 mt-1 mb-6">Sign in to access the asset management portal</p>
          <form onSubmit={submit} className="space-y-4">
            <div>
              <Label htmlFor="email">Email address</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1.5" placeholder="you@kapsowar.org" />
            </div>
            <div>
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <a href="#" className="text-xs text-[#D9501E] hover:underline">Forgot password?</a>
              </div>
              <div className="relative mt-1.5">
                <Input id="password" type={showPwd ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
                <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            {error && <div className="text-sm text-red-600">{error}</div>}
            <Button type="submit" className="w-full bg-[#D9501E] hover:bg-[#B8400F] text-white">Sign In</Button>
          </form>
          <div className="mt-6 text-center text-sm text-slate-500">
            Don't have an account? <Link to="/signup" className="text-[#D9501E] font-medium hover:underline">Request access</Link>
          </div>
          <div className="mt-6 p-3 bg-amber-50 border border-amber-200 rounded-md text-[11px] text-amber-800">
            <strong>Demo mode:</strong> Use any email + password. Real JWT auth activates with the backend.
          </div>
        </Card>
      </div>
    </div>
  );
};
