import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom/client';
import { Zap, Plus, FileText, Receipt, TrendingUp, ChevronLeft, Printer, Settings, PenTool, Palette, X, ImageIcon, Clock, Copy, Eye } from 'lucide-react';

const CURRENCIES = [{s:'₦',c:'NGN'},{s:'$',c:'USD'},{s:'£',c:'GBP'},{s:'€',c:'EUR'},{s:'₵',c:'GHS'},{s:'KSh',c:'KES'},{s:'R',c:'ZAR'}];
const LAYOUTS = ['Classic', 'Modern', 'Minimal', 'Bold'];

const App = () => {
  const [view, setView] = useState('landing');
  const [profile, setProfile] = useState<any>(null);
  const [docs, setDocs] = useState<any[]>([]);
  const [active, setActive] = useState<any>(null);
  const [mode, setMode] = useState<'Invoice' | 'Receipt'>('Invoice');
  const [layout, setLayout] = useState('Classic');
  const [isDrawing, setIsDrawing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const p = localStorage.getItem('ap_p'), d = localStorage.getItem('ap_d');
    if (p) { setProfile(JSON.parse(p)); setView('dashboard'); }
    if (d) setDocs(JSON.parse(d));
  }, []);

  const saveProfile = (e: any) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const data = { ...Object.fromEntries(fd.entries()), logo: profile?.logo, sig: profile?.sig };
    setProfile(data);
    localStorage.setItem('ap_p', JSON.stringify(data));
    setView('dashboard');
  };

  const draw = (e: any) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
    const y = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;
    ctx.lineWidth = 2; ctx.lineCap = 'round'; ctx.strokeStyle = '#000';
    ctx.lineTo(x, y); ctx.stroke(); ctx.beginPath(); ctx.moveTo(x, y);
  };

  if (view === 'landing') return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-10 text-center font-sans">
      <div className="bg-green-500 p-5 rounded-3xl mb-6 shadow-2xl animate-pulse"><Zap size={48} fill="currentColor" /></div>
      <h1 className="text-5xl font-black mb-4 tracking-tighter uppercase">APA BizDesk</h1>
      <p className="text-slate-400 mb-10 text-lg">Professional, branding-free invoices and receipts.</p>
      <button onClick={() => setView('onboarding')} className="w-full max-w-xs py-5 bg-green-500 rounded-2xl font-black text-xl shadow-xl shadow-green-500/20">Get Started Free</button>
    </div>
  );

  if (view === 'onboarding' || view === 'settings') return (
    <div className="p-6 max-w-xl mx-auto pb-20 font-sans">
      <button onClick={() => setView('dashboard')} className="mb-4 text-slate-400 font-bold flex items-center gap-2"><ChevronLeft size={20}/> Back</button>
      <h2 className="text-3xl font-black mb-6 text-slate-900">Business Setup</h2>
      <form className="space-y-5" onSubmit={saveProfile}>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 border-2 border-dashed rounded-2xl text-center relative bg-white h-28 flex flex-col justify-center">
            <p className="text-[9px] font-black text-slate-300 uppercase">Logo Upload</p>
            {profile?.logo && <img src={profile.logo} className="h-full object-contain mx-auto" />}
            <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={e => {
              const r = new FileReader(); r.onload = () => setProfile({...profile, logo: r.result}); r.readAsDataURL(e.target.files![0]);
            }} />
          </div>
          <div className="p-1 border-2 border-dashed rounded-2xl bg-white h-28 overflow-hidden relative">
            <canvas ref={canvasRef} width={250} height={120} onMouseDown={()=>setIsDrawing(true)} onMouseMove={draw} onMouseUp={()=>{setIsDrawing(false); setProfile({...profile, sig: canvasRef.current?.toDataURL()})}} onTouchStart={()=>setIsDrawing(true)} onTouchMove={draw} onTouchEnd={()=>{setIsDrawing(false); setProfile({...profile, sig: canvasRef.current?.toDataURL()})}} className="w-full h-full touch-none cursor-crosshair" />
            <p className="absolute bottom-1 right-2 text-[7px] font-black text-slate-300 uppercase pointer-events-none">Draw Signature Here</p>
          </div>
        </div>
        <input name="name" defaultValue={profile?.name} placeholder="Business Name" className="w-full p-4 border rounded-2xl font-bold shadow-sm" required />
        <textarea name="addr" defaultValue={profile?.addr} placeholder="Full Address" className="w-full p-4 border rounded-2xl" rows={2} required />
        <div className="grid grid-cols-2 gap-4">
          <select name="curr" defaultValue={profile?.curr || '₦'} className="p-4 border rounded-2xl font-black bg-white">
            {CURRENCIES.map(c => <option key={c.c} value={c.s}>{c.c} ({c.s})</option>)}
          </select>
          <input name="email" defaultValue={profile?.email} placeholder="Email" className="p-4 border rounded-2xl" required />
        </div>
        <textarea name="pay" defaultValue={profile?.pay} placeholder="Payment Details (Bank Info)" className="w-full p-4 border rounded-2xl" rows={2} />
        <input name="note" defaultValue={profile?.note || 'Thank you for your business!'} placeholder="Custom Thank You Note" className="w-full p-4 border rounded-2xl italic text-sm" />
        <button type="submit" className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-lg shadow-xl">Save & Continue</button>
      </form>
    </div>
  );

  if (view === 'create') return (
    <div className="p-6 max-w-xl mx-auto pb-32 font-sans">
      <button onClick={() => setView('dashboard')} className="mb-4 text-slate-400 font-bold flex items-center gap-2"><ChevronLeft size={20}/> Back</button>
      <h2 className="text-3xl font-black mb-6">New {mode}</h2>
      <div className="space-y-4">
        <input id="cl" placeholder="Customer Name" className="w-full p-5 bg-white border rounded-2xl font-bold shadow-sm" />
        <div className="p-6 bg-white border rounded-3xl space-y-4 shadow-sm">
          <input id="de" placeholder="Item/Service Description" className="w-full p-4 bg-slate-50 rounded-2xl outline-none font-bold" />
          <div className="flex gap-4">
            <div className="flex-1 text-center"><p className="text-[9px] font-black text-slate-300 uppercase mb-1">Qty</p><input id="qt" type="number" defaultValue="1" className="w-full p-4 bg-slate-50 rounded-2xl outline-none font-bold text-center" /></div>
            <div className="flex-1 text-center"><p className="text-[9px] font-black text-slate-300 uppercase mb-1">Price</p><input id="pr" type="number" placeholder="0.00" className="w-full p-4 bg-slate-50 rounded-2xl outline-none font-bold text-center" /></div>
          </div>
        </div>
        <button onClick={() => {
          const c = (document.getElementById('cl') as any).value, d = (document.getElementById('de') as any).value, q = Number((document.getElementById('qt') as any).value), p = Number((document.getElementById('pr') as any).value);
          const doc = { type: mode, client: c, items: [{ d, q, p }], total: q * p, num: `${mode==='Invoice'?'INV':'REC'}-${Math.floor(1000+Math.random()*9000)}`, date: new Date().toLocaleDateString() };
          const ud = [...docs, doc]; setDocs(ud); localStorage.setItem('ap_d', JSON.stringify(ud)); setActive(doc); setView('preview');
        }} className={`w-full py-5 ${mode==='Invoice'?'bg-blue-600 shadow-blue-100':'bg-green-600 shadow-green-100'} text-white font-black rounded-2xl text-lg shadow-xl`}>Generate {mode}</button>
      </div>
    </div>
  );

  if (view === 'preview') return (
    <div className="p-4 bg-slate-200 min-h-screen pb-40 font-serif">
      <div className="max-w-xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <button onClick={() => setView('dashboard')} className="flex items-center gap-2 font-black text-slate-500 text-xs tracking-widest"><ChevronLeft size={16}/> DASHBOARD</button>
          <div className="flex bg-white p-1 rounded-xl shadow-sm gap-1 overflow-x-auto">
            {LAYOUTS.map(l => (
              <button key={l} onClick={() => setLayout(l)} className={`px-2.5 py-1.5 rounded-lg text-[8px] font-black transition ${layout === l ? 'bg-slate-900 text-white' : 'text-slate-400'}`}>{l.toUpperCase()}</button>
            ))}
          </div>
        </div>
        
        <div id="doc" className={`bg-white p-8 shadow-2xl min-h-[850px] flex flex-col relative overflow-hidden ${layout === 'Modern' ? 'border-l-[20px] border-blue-600' : layout === 'Bold' ? 'bg-slate-50 border-t-[30px] border-slate-900' : layout === 'Minimal' ? 'border-none p-12' : 'border-t-[16px] border-slate-900'}`}>
          {active.type === 'Receipt' && <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border-[12px] border-green-500/10 text-green-500/10 text-9xl font-black -rotate-12 pointer-events-none uppercase">PAID</div>}
          <div className={`flex justify-between items-start mb-12 ${layout === 'Minimal' ? '' : 'border-b-2 border-slate-50 pb-8'}`}>
            <div>
              {profile.logo && <img src={profile.logo} className="h-14 mb-4 object-contain" />}
              <h2 className={`font-black uppercase tracking-tight leading-none ${layout === 'Bold' ? 'text-3xl' : 'text-xl'}`}>{profile.name}</h2>
              <p className="text-[9px] text-slate-400 font-bold uppercase mt-2">{profile.addr}<br/>{profile.email}</p>
            </div>
            <div className="text-right">
              <h1 className={`font-black italic uppercase tracking-tighter leading-none ${layout === 'Bold' ? 'text-7xl text-slate-900 opacity-5' : 'text-4xl text-slate-100'}`}>{active.type}</h1>
              <p className="text-[10px] font-black mt-2 text-slate-900">NO: {active.num}</p>
              <p className="text-[9px] text-slate-400 font-bold">{active.date}</p>
            </div>
          </div>
          <div className="mb-12">
            <p className="text-[9px] font-black text-slate-300 uppercase mb-2 tracking-widest">Customer</p>
            <p className="font-black text-slate-900 text-xl leading-none">{active.client || "Valued Client"}</p>
          </div>
          <table className="w-full mb-12 text-left border-collapse">
            <thead>
              <tr className={`${layout === 'Modern' ? 'bg-blue-600 text-white' : 'border-b-2 border-slate-900 text-slate-400'} text-[10px] uppercase font-black`}>
                <th className="p-3">Description</th><th className="p-3 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {active.items.map((it:any, i:number) => (
                <tr key={i} className="border-b border-slate-50"><td className="py-5 t
