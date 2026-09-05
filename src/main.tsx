import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { Zap, Plus, FileText, Receipt, TrendingUp, ChevronLeft, Printer, Settings, CheckCircle2 } from 'lucide-react';

const CURRENCIES = [{s:'₦',c:'NGN'},{s:'$',c:'USD'},{s:'£',c:'GBP'},{s:'€',c:'EUR'},{s:'₵',c:'GHS'},{s:'KSh',c:'KES'}];
const METHODS = ['Cash', 'Bank Transfer', 'Card', 'Online'];

const App = () => {
  const [view, setView] = useState('landing');
  const [profile, setProfile] = useState<any>(null);
  const [docs, setDocs] = useState<any[]>([]);
  const [active, setActive] = useState<any>(null);
  const [mode, setMode] = useState<'Invoice' | 'Receipt'>('Invoice');

  useEffect(() => {
    const p = localStorage.getItem('ap_p'), d = localStorage.getItem('ap_d');
    if (p) { setProfile(JSON.parse(p)); setView('dashboard'); }
    if (d) setDocs(JSON.parse(d));
  }, []);

  const save = (e: any) => {
    e.preventDefault();
    const d = Object.fromEntries(new FormData(e.target));
    const f = { ...d, logo: profile?.logo, sig: profile?.sig };
    setProfile(f);
    localStorage.setItem('ap_p', JSON.stringify(f));
    setView('dashboard');
  };

  const img = (e: any, k: string) => {
    const r = new FileReader();
    r.onload = () => setProfile({ ...profile, [k]: r.result });
    if (e.target.files[0]) r.readAsDataURL(e.target.files[0]);
  };

  if (view === 'landing') return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-10 text-center font-sans">
      <Zap size={60} className="text-green-500 mb-6" fill="currentColor" />
      <h1 className="text-5xl font-black mb-4">ApaBizDesk</h1>
      <button onClick={() => setView('onboarding')} className="w-full max-w-xs py-5 bg-green-500 rounded-2xl font-black text-xl shadow-xl">Get Started</button>
    </div>
  );

  if (view === 'onboarding' || view === 'settings') return (
    <div className="p-6 max-w-xl mx-auto pb-20 font-sans">
      <button onClick={() => setView('dashboard')} className="mb-4 text-slate-400 font-bold flex items-center gap-2"><ChevronLeft/> Back</button>
      <h2 className="text-3xl font-black mb-6">Business Profile</h2>
      <form className="space-y-4" onSubmit={save}>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 border-2 border-dashed rounded-2xl text-center relative bg-white h-24 flex flex-col justify-center">
            <p className="text-[9px] font-black text-slate-300">LOGO</p>
            {profile?.logo && <img src={profile.logo} className="h-full object-contain mx-auto" />}
            <input type="file" className="absolute inset-0 opacity-0" onChange={e => img(e, 'logo')} />
          </div>
          <div className="p-4 border-2 border-dashed rounded-2xl text-center relative bg-white h-24 flex flex-col justify-center">
            <p className="text-[9px] font-black text-slate-300">SIGNATURE</p>
            {profile?.sig && <img src={profile.sig} className="h-full object-contain mx-auto" />}
            <input type="file" className="absolute inset-0 opacity-0" onChange={e => img(e, 'sig')} />
          </div>
        </div>
        <input name="name" defaultValue={profile?.name} placeholder="Business Name" className="w-full p-4 border rounded-2xl font-bold" required />
        <textarea name="addr" defaultValue={profile?.addr} placeholder="Address" className="w-full p-4 border rounded-2xl" rows={2} required />
        <div className="grid grid-cols-2 gap-4">
          <select name="curr" defaultValue={profile?.curr || '₦'} className="p-4 border rounded-2xl font-bold">
            {CURRENCIES.map(c => <option key={c.c} value={c.s}>{c.c} ({c.s})</option>)}
          </select>
          <input name="email" defaultValue={profile?.email} placeholder="Email" className="p-4 border rounded-2xl" required />
        </div>
        <textarea name="pay" defaultValue={profile?.pay} placeholder="Bank / Payment Info" className="w-full p-4 border rounded-2xl" rows={2} />
        <input name="note" defaultValue={profile?.note || 'Thank you for your business!'} className="w-full p-4 border rounded-2xl italic" />
        <button type="submit" className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-lg">Save Profile</button>
      </form>
    </div>
  );

  if (view === 'create') return (
    <div className="p-6 max-w-xl mx-auto pb-20 font-sans">
      <button onClick={() => setView('dashboard')} className="mb-4 text-slate-400 font-bold flex items-center gap-2"><ChevronLeft/> Back</button>
      <h2 className="text-3xl font-black mb-6">New {mode}</h2>
      <div className="space-y-4">
        <input id="cl" placeholder="Customer Name" className="w-full p-5 bg-white border rounded-2xl font-bold" />
        {mode === 'Receipt' && <select id="pm" className="w-full p-4 border rounded-2xl font-bold">{METHODS.map(m=><option key={m}>{m}</option>)}</select>}
        <div className="p-6 bg-white border rounded-2xl space-y-4">
          <input id="de" placeholder="Item/Service Description" className="w-full p-4 bg-slate-50 rounded-2xl outline-none font-bold" />
          <div className="flex gap-4">
            <input id="qt" type="number" defaultValue="1" className="w-1/3 p-4 bg-slate-50 rounded-2xl font-bold" />
            <input id="pr" type="number" placeholder="Price" className="flex-1 p-4 bg-slate-50 rounded-2xl font-bold" />
          </div>
        </div>
        <button onClick={() => {
          const c = (document.getElementById('cl') as any).value, d = (document.getElementById('de') as any).value, q = Number((document.getElementById('qt') as any).value), p = Number((document.getElementById('pr') as any).value);
          const doc = { type: mode, client: c, items: [{ d, q, p }], total: q * p, num: `${mode==='Invoice'?'INV':'REC'}-${Math.floor(1000+Math.random()*9000)}`, date: new Date().toLocaleDateString(), method: (document.getElementById('pm') as any)?.value };
          const ud = [...docs, doc]; setDocs(ud); localStorage.setItem('ap_d', JSON.stringify(ud)); setActive(doc); setView('preview');
        }} className={`w-full py-5 ${mode==='Invoice'?'bg-blue-600':'bg-green-600'} text-white font-black rounded-2xl text-lg shadow-xl`}>Generate {mode}</button>
      </div>
    </div>
  );

  if (view === 'preview') return (
    <div className="p-4 bg-slate-200 min-h-screen pb-32 font-serif">
      <button onClick={() => setView('dashboard')} className="mb-4 flex items-center gap-2 font-black text-slate-500 text-xs uppercase"><ChevronLeft size={16}/> Back</button>
      <div id="doc" className="bg-white p-8 shadow-2xl min-h-[800px] flex flex-col border-t-[16px] border-slate-900 relative overflow-hidden">
        {active.type === 'Receipt' && <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border-[12px] border-green-500/10 text-green-500/10 text-9xl font-black -rotate-12 pointer-events-none">PAID</div>}
        <div className="flex justify-between items-start mb-10 border-b pb-8">
          <div>{profile.logo && <img src={profile.logo} className="h-12 mb-4 object-contain" />}<h2 className="text-xl font-black uppercase">{profile.name}</h2><p className="text-[9px] text-slate-400 font-bold uppercase mt-2">{profile.addr}<br/>{profile.email}</p></div>
          <div className="text-right"><h1 className={`text-4xl font-black italic uppercase ${active.type==='Receipt'?'text-green-500/20':'text-slate-100'}`}>{active.type}</h1><p className="text-[10px] font-black mt-2">NO: {active.num}</p><p className="text-[9px] text-slate-400 font-bold">{active.date}</p></div>
        </div>
        <div className="mb-10"><p className="text-[9px] font-black text-slate-300 uppercase mb-1">Customer</p><p className="font-black text-slate-900 text-lg leading-none">{active.client || "Customer"}</p></div>
        <table className="w-full mb-10 text-left border-collapse">
          <thead><tr className="border-b-2 border-slate-900 text-[10px] font-black text-slate-400 uppercase"><th className="pb-2">Description</th><th className="pb-2 text-right">Amount</th></tr></thead>
          <tbody>{active.items.map((it:any, i:number) => (
            <tr key={i} className="border-b border-slate-50"><td className="py-5 text-sm font-bold text-slate-700">{it.d} (x{it.q})</td><td className="py-5 text-right font-black text-slate-900">{profile.curr}{(it.q * it.p).toLocaleString()}</td></tr>
          ))}</tbody>
        </table>
        <div className="mt-auto flex justify-between items-end border-t-2 border-slate-900 pt-8">
          <div className="max-w-[200px]"><p className="text-[9px] font-black text-slate-300 uppercase mb-2">Payment Info</p>{active.type==='Receipt'&&<p className="text-[9px] font-black text-green-600 mb-1">Method: {active.method}</p>}<p className="text-[9px] font-bold text-slate-500 whitespace-pre-wrap">{profile.pay}</p>
          {profile.sig && <div className="mt-4"><img src={profile.sig} className="h-8 mb-1" /><p className="text-[7px] font-bold text-slate-300 border-t w-20 pt-1 uppercase">Signature</p></div>}</div>
          <div className="text-right"><p className="text-[10px] font-black text-slate-900 uppercase">Total {active.type==='Invoice'?'Due':'Paid'}</p><p className="text-4xl font-black text-slate-900">{profile.curr}{active.total.toLocaleString()}</p></div>
        </div>
        <div className="mt-12 text-center border-t pt-6"><p className="text-[10px] font-black text-slate-900 uppercase italic tracking-widest">{profile.note}</p></div>
      </div>
      <button onClick={() => window.print()} className="w-full mt-6 py-5 bg-slate-900 text-white rounded-[2rem] font-black shadow-2xl flex items-center justify-center gap-3"><Printer size={24}/> Print or Save as PDF</button>
    </div>
  );

  return (
    <div className="p-6 pt-10 font-sans">
      <div className="flex justify-between items-center mb-10">
        <div className="flex items-center gap-3"><div className="bg-green-500 p-2 rounded-xl text-white"><Zap size={20} fill="currentColor"/></div>
        <div><p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Company</p><h1 className="text-2xl font-black tracking-tighter">{profile.name}</h1></div></div>
        <button onClick={() => setView('settings')} className="p-4 bg-white border rounded-2xl text-slate-400 shadow-sm"><Settings size={20}/></button>
      </div>
      <div className="grid gap-4 mb-10">
        <button onClick={() => { setMode('Invoice'); setView('create'); }} className="p-8 bg-blue-600 text-white rounded-[2.5rem] font-black flex items-center justify-between shadow-xl shadow-blue-500/20"><div className="flex items-center gap-4 text-xl"><FileText size={28}/> New Invoice</div><Plus /></button>
        <button onClick={() => { setMode('Receipt'); setView('create'); }} className="p-8 bg-green-600 text-white rounded-[2.5rem] font-black flex items-center justify-between shadow-xl shadow-green-500/20"><div className="flex items-center gap-4 text-xl"><Receipt size={28}/> New Receipt</div><Plus /></button>
      </div>
      <div className="bg-white rounded-[2rem] border p-6"><h3 className="font-black text-xs mb-4 uppercase tracking-widest text-slate-300">History</h3>
        {docs.slice(-3).reverse().map((d, i) => (
          <div key={i} onClick={()=>{setActive(d);setView('preview')}} className="flex justify-between items-center py-3 border-b border-slate-50 last:border-0 cursor-pointer">
             <div><p className="font-bold text-sm">{d.client}</p><p className="text-[10px] text-slate-400">{d.num} • {d.type}</p></div>
             <p className={`font-black text-sm ${d.type==='Receipt'?'text-green-600':'text-slate-900'}`}>{profile.curr}{d.total.toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
// @ts-ignore
ReactDOM.createRoot(document.getElementById('root')!).render(<App />);
