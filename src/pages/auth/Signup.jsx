import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Logo } from '../../components/branding/Logo';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Label } from '../../components/ui/label';
import { Card } from '../../components/ui/card';

export const Signup = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [error, setError] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) { setError('Passwords do not match.'); return; }
    if (!form.name || !form.email || !form.password) { setError('All fields required.'); return; }
    try {
      await signup(form.name, form.email, form.password);
      navigate('/app/dashboard');
    } catch (err) {
      setError(err?.response?.data?.detail || 'Signup failed. Try again.');
    }
  };

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50">
      <Card className="w-full max-w-md p-8 shadow-sm border-slate-200">
        <Logo size="md" />
        <h2 className="text-2xl font-bold text-slate-900 mt-6">Request access</h2>
        <p className="text-sm text-slate-500 mt-1 mb-6">Create your hospital staff account</p>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <Label>Full name</Label>
            <Input value={form.name} onChange={set('name')} className="mt-1.5" placeholder="Dr. Jane Doe" />
          </div>
          <div>
            <Label>Work email</Label>
            <Input type="email" value={form.email} onChange={set('email')} className="mt-1.5" placeholder="jdoe@kapsowar.org" />
          </div>
          <div>
            <Label>Password</Label>
            <Input type="password" value={form.password} onChange={set('password')} className="mt-1.5" />
          </div>
          <div>
            <Label>Confirm password</Label>
            <Input type="password" value={form.confirm} onChange={set('confirm')} className="mt-1.5" />
          </div>
          {error && <div className="text-sm text-red-600">{error}</div>}
          <Button type="submit" className="w-full bg-[#D9501E] hover:bg-[#B8400F] text-white">Create account</Button>
        </form>
        <div className="mt-6 text-center text-sm text-slate-500">
          Already have an account? <Link to="/login" className="text-[#D9501E] font-medium hover:underline">Sign in</Link>
        </div>
      </Card>
    </div>
  );
};
