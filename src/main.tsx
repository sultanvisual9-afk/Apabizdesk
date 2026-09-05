import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom/client';
import { Zap, Plus, FileText, Receipt, TrendingUp, ChevronLeft, Printer, Settings, PenTool, Palette, X, ImageIcon } from 'lucide-react';

const CURRENCIES = [{s:'₦',c:'NGN'},{s:'$',c:'USD'},{s:'£',c:'GBP'},{s:'€',c:'EUR'},{s:'₵',c:'GHS'},{s:'KSh',c:'KES'}];
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
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-10 text-center">
      <Zap size={60} className="text-green-500 mb-6" fill="currentColor" />
      <h1 className="text-5xl font-black mb-4">ApaBizDesk</h1>
      <button onClick={() => setView('onboarding')} className="w-full max-w-xs py-5 bg-green-500 rounded-2xl font-black text-xl">Get Started</button>
    </div>
  );

  if (view === 'onboarding' || view === 'settings') return (
    <div className="p-6 max-w-xl mx-auto pb-20">
      <button onClick={() => setView('dashboard')} className="mb-4 text-slate-400 font-bold flex items-center gap-2"><ChevronLeft/> Back</button>
      <h2 className="text-3xl font-black mb-6">Business Setup</h2>
      <form className="space-y-4" onSubmit={saveProfile}>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 border-2 border-dashed rounded-2xl text-center relative bg-white h-24 flex flex-col justify-center">
            <p className="text-[9px] font-black text-slate-300">LOGO UPLOAD</p>
            {profile?.logo && <img src={profile.logo} className="h-full object-contain mx-auto" />}
            <input type="file" className="absolute inset-0 opacity-0" onChange={e => {
              const r = new FileReader(); r.onload = () => setProfile({...profile, logo: r.result}); r.readAsDataURL(e.target.files![0]);
            }} />
          </div>
          <div className="p-4 border-2 border-dashed rounded-2xl bg-white h-24 overflow-hidden relative">
            <canvas ref={canvasRef} width={200} height={100} onMouseDown={()=>setIsDrawing(true)} onMouseMove={draw} onMouseUp={()=>{setIsDrawing(false); setProfile({...profile, sig: canvasRef.current?.toDataURL()})}} onTouchStart={()=>setIsDrawing(true)} onTouchMove={draw} onTouchEnd={()=>{setIsDrawing(false); setProfile({...profile, sig: canvasRef.current?.toDataURL()})}} className="w-full h-full touch-none" />
            <p className="absolute top-1 right-2 text-[7px] font-bold text-slate-300">DRAW SIGNATURE HERE</p>
          </div>
        </div>
        <input name="name" defaultValue={profile?.name} placeholder="Business Name" className="w-full p-4 border rounded-2xl font-bold" required />
        <textarea name="addr" defaultValue={profile?.addr} placeholder="Address" className="w-full p-4 border rounded-2xl" rows={2} required />
        <div className="grid grid-cols-2 gap-4">
          <select name="curr" defaultValue={profile?.curr || '₦'} className="p-4 border rounded-2xl font-bold">{CURRENCIES.map(c => <option key={c.c} value={c.s}>{c.c} ({c.s})</option>)}</select>
          <input name="email" defaultValue={profile?.email} placeholder="Email" className="p-4 border rounded-2xl" required />
        </div>
        <textarea name="pay" defaultValue={profile?.pay} placeholder="Payment Info" className="w-full p-4 border rounded-2xl" rows={2} />
        <button type="submit" className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black">Save & Continue</button>
      </form>
    </div>
  );

  if (view === 'create') return (
    <div className="p-6 max-w-xl mx-auto pb-20">
      <button onClick={() => setView('dashboard')} className="mb-4 text-slate-400 font-bold flex items-center gap-2"><ChevronLeft/> Back</button>
      <h2 className="text-3xl font-black mb-6">New {mode}</h2>
      <div className="space-y-4">
        <input id="cl" placeholder="Customer Name" className="w-full p-5 bg-white border rounded-2xl font-bold" />
        <div className="p-6 bg-white border rounded-2xl space-y-4">
          <input id="de" placeholder="Description" className="w-full p-4 bg-slate-50 rounded-2xl outline-none font-bold" />
          <div className="flex gap-4">
            <input id="qt" type="number" defaultValue="1" className="w-1/3 p-4 bg-slate-50 rounded-2xl font-bold" />
            <input id="pr" type="number" placeholder="Price" className="flex-1 p-4 bg-slate-50 rounded-2xl font-bold" />
          </div>
        </div>
        <button onClick={() => {
          const c = (document.getElementById('cl') as any).value, d = (document.getElementById('de') as any).value, q = Number((document.getElementById('qt') as any).value), p = Number((document.getElementById('pr') as any).value);
          const doc = { type: mode, client: c, items: [{ d, q, p }], total: q * p, num: `${mode==='Invoice'?'INV':'REC'}-${Math.floor(1000+Math.random()*9000)}`, date: new Date().toLocaleDateString() };
          const ud = [...docs, doc]; setDocs(ud); localStorage.setItem('ap_d', JSON.stringify(ud)); setActive(doc); setView('preview');
        }} className={`w-full py-5 ${mode==='Invoice'?'bg-blue-600':'bg-green-600'} text-white font-black rounded-2xl text-lg shadow-xl`}>Generate {mode}</button>
      </div>
    </div>
  );

  if (view === 'preview') return (
    <div className="p-4 bg-slate-200 min-h-screen pb-40">
      <div className="max-w-xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <button onClick={() => setView('dashboard')} className="font-black text-slate-500 text-xs">DASHBOARD</button>
          <div className="flex gap-1">
            {LAYOUTS.map(l => <button key={l} onClick={()=>setLayout(l)} className={`px-2 py-1 rounded text-[8px] font-bold ${layout===l?'bg-slate-900 text-white':'bg-white'}`}>{l}</button>)}
          </div>
        </div>
        <div id="doc" className={`bg-white p-8 shadow-2xl min-h-[800px] flex flex-col relative ${layout==='Modern'?'border-l-[15px] border-blue-600':layout==='Bold'?'border-t-[25px] border-slate-900':layout==='Minimal'?'p-12':'border-t-[15px] border-slate-900'}`}>
          {active.type==='Receipt'&&<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-green-500/10 text-9xl font-black -rotate-12 uppercase">PAID</div>}
          <div className="flex justify-between mb-10">
            <div>{profile.logo && <img src={profile.logo} className="h-10 mb-2" />}<h2 className="font-black uppercase">{profile.name}</h2><p className="text-[8px] text-slate-400 font-bold uppercase">{profile.addr}</p></div>
            <div className="text-right"><h1 className="text-3xl font-black italic text-slate-100">{active.type}</h1><p className="text-[10px] font-black"># {active.num}</p></div>
          </div>
          <div className="mb-10 text-sm font-bold uppercase text-slate-300">Customer: <span className="text-slate-900">{active.client}</span></div>
          <table className="w-full mb-10 text-left border-collapse">
            <tr className="border-b-2 border-slate-900 text-[10px] font-black text-slate-400"><th>Item</th><th className="text-right">Total</th></tr>
            {active.items.map((it:any, i:number) => (
              <tr key={i} className="border-b"><td className="py-4 text-sm font-bold">{it.d} (x{it.q})</td><td className="py-4 text-right font-black">{profile.curr}{(it.q * it.p).toLocaleString()}</td></tr>
            ))}
          </table>
          <div className="mt-auto flex justify-between items-end border-t-2 border-slate-900 pt-8">
            <p className="text-[9px] font-bold text-slate-500 max-w-[200px]">{profile.pay}</p>
            <div className="text-right">
              {profile.sig && <img src={profile.sig} className="h-10 ml-auto" />}
              <p className="text-[10px] font-black uppercase">Total {profile.curr}{active.total.toLocaleString()}</p>
            </div>
          </div>
        </div>
        <button onClick={() => window.print()} className="w-full mt-6 py-5 bg-slate-900 text-white rounded-2xl font-black shadow-2xl flex items-center justify-center gap-3"><Printer size={24}/> Print or Save as PDF</button>
      </div>
    </div>
  );

  return (
    <div className="p-6 pt-10 font-sans">
      <div className="flex justify-between items-center mb-10">
        <div><p className="text-[9px] font-black text-slate-400 uppercase">Business</p><h1 className="text-2xl font-black tracking-tighter">{profile.name}</h1></div>
        <button onClick={() => setView('settings')} className="p-4 bg-white border rounded-2xl text-slate-400"><Settings size={20}/></button>
      </div>
      <div className="grid gap-4 mb-10">
        <button onClick={()=>{setMode('Invoice');setView('create')}} className="p-8 bg-blue-600 text-white rounded-[2rem] font-black flex justify-between items-center shadow-xl"><span>New Invoice</span><Plus/></button>
        <button onClick={()=>{setMode('Receipt');setView('create')}} className="p-8 bg-green-600 text-white rounded-[2rem] font-black flex justify-between items-center shadow-xl"><span>New Receipt</span><Plus/></button>
      </div>
      <div className="bg-white border p-6 rounded-[2rem] shadow-sm"><h3 className="font-black text-xs text-slate-300 uppercase mb-4 tracking-widest">History</h3>
        {docs.slice(-3).reverse().map((d, i) => (
          <div key={i} onClick={()=>{setActive(d);setView('preview')}} className="flex justify-between items-center py-3 border-b border-slate-50 last:border-0 cursor-pointer">
            <div className="font-bold text-sm">{d.client}<br/><span className="text-[10px] text-slate-400 font-normal">{d.num}</span></div>
            <p className="font-black text-sm">{profile.curr}{d.total.toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

// @ts-ignore
ReactDOM.createRoot(document.getElementById('root')!).render(<App />);
