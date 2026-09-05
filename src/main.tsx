import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { 
  Zap, Plus, FileText, Receipt, TrendingUp, ChevronLeft, 
  Printer, Trash2, Check, Settings, Users, Copy, Eye, Clock
} from 'lucide-react';

const CURRENCIES = [
  { s: '₦', c: 'NGN' }, { s: '$', c: 'USD' }, { s: '£', c: 'GBP' }, { s: '€', c: 'EUR' }, { s: '₵', c: 'GHS' }, { s: 'KSh', c: 'KES' }
];

const App = () => {
  const [view, setView] = useState('landing');
  const [profile, setProfile] = useState<any>(null);
  const [docs, setDocs] = useState<any[]>([]);
  const [activeDoc, setActiveDoc] = useState<any>(null);

  useEffect(() => {
    const p = localStorage.getItem('apa_p');
    const d = localStorage.getItem('apa_d');
    if (p) setProfile(JSON.parse(p));
    if (d) setDocs(JSON.parse(d));
    if (p) setView('dashboard');
  }, []);

  const saveProfile = (e: any) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const data = { ...Object.fromEntries(fd.entries()), logo: profile?.logo, sig: profile?.sig };
    setProfile(data);
    localStorage.setItem('apa_p', JSON.stringify(data));
    setView('dashboard');
  };

  const handleImg = (e: any, k: string) => {
    const reader = new FileReader();
    reader.onload = () => setProfile({ ...profile, [k]: reader.result });
    if (e.target.files[0]) reader.readAsDataURL(e.target.files[0]);
  };

  const saveDoc = (d: any) => {
    const newDocs = [...docs, { ...d, id: Date.now() }];
    setDocs(newDocs);
    localStorage.setItem('apa_d', JSON.stringify(newDocs));
    setActiveDoc(d);
    setView('preview');
  };

  if (view === 'landing') return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-10 text-center">
      <div className="bg-green-500 p-4 rounded-3xl mb-6 shadow-2xl"><Zap size={48} fill="currentColor" /></div>
      <h1 className="text-4xl font-black mb-4 tracking-tighter">APA BizDesk</h1>
      <p className="text-slate-400 mb-10">Professional Global Invoicing Engine.</p>
      <button onClick={() => setView('onboarding')} className="w-full max-w-xs py-4 bg-green-500 rounded-2xl font-bold shadow-xl">Get Started</button>
    </div>
  );

  if (view === 'onboarding' || view === 'settings') return (
    <div className="p-6 max-w-xl mx-auto pb-20">
      <button onClick={() => setView('dashboard')} className="mb-4 text-slate-400 flex items-center gap-2"><ChevronLeft size={16}/> Back</button>
      <h2 className="text-3xl font-black mb-6">Business Profile</h2>
      <form onSubmit={saveProfile} className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 border-2 border-dashed rounded-2xl text-center relative">
            <p className="text-[10px] font-bold text-slate-400 uppercase">Logo</p>
            {profile?.logo && <img src={profile.logo} className="h-10 mx-auto mt-1" />}
            <input type="file" className="absolute inset-0 opacity-0" onChange={e => handleImg(e, 'logo')} />
          </div>
          <div className="p-4 border-2 border-dashed rounded-2xl text-center relative">
            <p className="text-[10px] font-bold text-slate-400 uppercase">Signature</p>
            {profile?.sig && <img src={profile.sig} className="h-10 mx-auto mt-1" />}
            <input type="file" className="absolute inset-0 opacity-0" onChange={e => handleImg(e, 'sig')} />
          </div>
        </div>
        <input name="name" defaultValue={profile?.name} placeholder="Business Name" className="w-full p-4 bg-white border rounded-2xl outline-none" required />
        <input name="email" defaultValue={profile?.email} placeholder="Email" className="w-full p-4 bg-white border rounded-2xl outline-none" required />
        <textarea name="addr" defaultValue={profile?.addr} placeholder="Business Address" className="w-full p-4 bg-white border rounded-2xl outline-none" rows={2} required />
        <div className="grid grid-cols-2 gap-4">
          <input name="tax" defaultValue={profile?.tax} placeholder="Tax/VAT #" className="w-full p-4 bg-white border rounded-2xl outline-none" />
          <select name="curr" defaultValue={profile?.curr || '₦'} className="w-full p-4 bg-white border rounded-2xl outline-none font-bold">
            {CURRENCIES.map(c => <option key={c.c} value={c.s}>{c.c} ({c.s})</option>)}
          </select>
        </div>
        <textarea name="pay" defaultValue={profile?.pay} placeholder="Bank Payment Details" className="w-full p-4 bg-white border rounded-2xl outline-none" rows={2} />
        <button type="submit" className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black">Save & Continue</button>
      </form>
    </div>
  );

  if (view === 'create') return (
    <div className="p-6 max-w-xl mx-auto pb-24">
      <button onClick={() => setView('dashboard')} className="mb-4 text-slate-400 flex items-center gap-2"><ChevronLeft size={16}/> Back</button>
      <h2 className="text-3xl font-black mb-6">New Invoice</h2>
      <div className="space-y-4 bg-white p-6 rounded-3xl shadow-sm border">
        <input id="cl" placeholder="Customer Name" className="w-full p-4 bg-slate-50 rounded-2xl outline-none font-bold" />
        <textarea id="cl_ad" placeholder="Customer Address" className="w-full p-4 bg-slate-50 rounded-2xl outline-none text-sm" rows={2} />
        <div className="p-4 bg-slate-100 rounded-2xl space-y-4">
          <input id="de" placeholder="Service/Product Description" className="w-full bg-transparent border-b-2 border-slate-200 font-bold p-2" />
          <div className="flex gap-4">
            <div className="flex-1"><p className="text-[9px] font-bold text-slate-400">QTY</p><input id="qt" type="number" defaultValue="1" className="w-full bg-transparent border-b-2 font-bold p-1" /></div>
            <div className="flex-1"><p className="text-[9px] font-bold text-slate-400">PRICE ({profile.curr})</p><input id="pr" type="number" className="w-full bg-transparent border-b-2 font-bold p-1" /></div>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="flex-1"><p className="text-[9px] font-bold text-slate-400">TAX %</p><input id="tx" type="number" defaultValue="0" className="w-full p-3 bg-slate-50 rounded-xl" /></div>
          <div className="flex-1"><p className="text-[9px] font-bold text-slate-400">DISCOUNT</p><input id="ds" type="number" defaultValue="0" className="w-full p-3 bg-slate-50 rounded-xl" /></div>
        </div>
        <button onClick={() => {
          const client = (document.getElementById('cl') as any).value;
          const addr = (document.getElementById('cl_ad') as any).value;
          const desc = (document.getElementById('de') as any).value;
          const qty = Number((document.getElementById('qt') as any).value);
          const pr = Number((document.getElementById('pr') as any).value);
          const tax = Number((document.getElementById('tx') as any).value);
          const disc = Number((document.getElementById('ds') as any).value);
          const sub = qty * pr;
          const total = (sub + (sub * (tax/100))) - disc;
          saveDoc({ client, addr, items: [{ desc, qty, pr }], total, tax, disc, num: `INV-${Math.floor(1000+Math.random()*9000)}`, date: new Date().toLocaleDateString() });
        }} className="w-full py-5 bg-green-500 text-white font-black rounded-2xl shadow-xl">Generate Professional Invoice</button>
      </div>
    </div>
  );

  if (view === 'preview') return (
    <div className="p-4 bg-slate-200 min-h-screen pb-32">
      <button onClick={() => setView('dashboard')} className="mb-4 flex items-center gap-2 font-black text-slate-500 uppercase text-xs"><ChevronLeft size={16}/> Dashboard</button>
      <div id="invoice" className="bg-white p-8 rounded-sm shadow-2xl min-h-[800px] flex flex-col border-t-[16px] border-slate-900 font-serif">
        <div className="flex justify-between items-start mb-12 border-b pb-8">
          <div>
            {profile.logo && <img src={profile.logo} className="h-12 mb-4" />}
            <h2 className="text-xl font-black uppercase tracking-tighter">{profile.name}</h2>
            <p className="text-[10px] text-slate-400 font-bold leading-tight">{profile.addr}<br/>{profile.email}</p>
          </div>
          <div className="text-right">
            <h1 className="text-5xl font-black text-slate-100 tracking-tighter italic leading-none">INVOICE</h1>
            <p className="text-xs font-black mt-2"># {activeDoc.num}</p>
            <p className="text-[10px] text-slate-400 font-bold">{activeDoc.date}</p>
          </div>
        </div>
        <div className="mb-12">
          <p className="text-[10px] font-black text-slate-300 uppercase mb-2">Bill To</p>
          <p className="font-black text-slate-900 text-lg leading-none">{activeDoc.client}</p>
          <p className="text-xs text-slate-400 font-bold mt-1">{activeDoc.addr}</p>
        </div>
        <table className="w-full mb-12 text-left">
          <tr className="border-b-2 border-slate-900 text-[10px] uppercase font-black text-slate-400"><th className="pb-2">Description</th><th className="pb-2 text-right">Amount</th></tr>
          {activeDoc.items.map((it:any, i:number) => (
            <tr key={i} className="border-b border-slate-50"><td className="py-5 text-sm font-bold text-slate-700">{it.desc} (x{it.qty})</td><td className="py-5 text-right font-black text-slate-900">{profile.curr}{(it.qty * it.pr).toLocaleString()}</td></tr>
          ))}
        </table>
        <div className="mt-auto grid grid-cols-2 gap-10 pt-10 border-t-2 border-slate-900">
          <div>
            <p className="text-[10px] font-black text-slate-300 uppercase mb-2">Payment Details</p>
            <p className="text-[10px] font-bold text-slate-500 whitespace-pre-wrap">{profile.pay}</p>
            {profile.sig && <div className="mt-6"><img src={profile.sig} className="h-10 mb-1" /><p className="text-[8px] font-black text-slate-300 uppercase border-t w-32 pt-1">Authorized By</p></div>}
          </div>
          <div className="text-right space-y-1">
            <div className="flex justify-between text-xs font-bold text-slate-400"><span>Tax ({activeDoc.tax}%)</span><span>{profile.curr}{((activeDoc.total + activeDoc.disc) * (activeDoc.tax/100)).toLocaleString()}</span></div>
            <div className="flex justify-between text-xs font-bold text-slate-400 border-b pb-2"><span>Discount</span><span>-{profile.curr}{activeDoc.disc.toLocaleString()}</span></div>
            <div className="flex justify-between items-center pt-2">
              <span className="font-black text-slate-900 text-sm uppercase">Total Due</span>
              <span className="text-4xl font-black text-slate-900">{profile.curr}{activeDoc.total.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
      <button onClick={() => window.print()} className="w-full mt-6 py-5 bg-slate-900 text-white rounded-[2rem] font-black shadow-2xl flex items-center justify-center gap-3"><Printer size={24}/> Print or Save as PDF</button>
    </div>
  );

  if (view === 'history') return (
    <div className="p-6 md:p-12">
      <button onClick={() => setView('dashboard')} className="mb-4 text-slate-400 flex items-center gap-2"><ChevronLeft size={16}/> Back</button>
      <h1 className="text-4xl font-black mb-8">Document History</h1>
      <div className="space-y-3">
        {docs.map((d: any, i: number) => (
          <div key={i} onClick={() => { setActiveDoc(d); setView('preview'); }} className="bg-white p-5 rounded-3xl border flex justify-between items-center shadow-sm">
            <div className="flex items-center gap-4"><div className="p-3 bg-slate-50 rounded-2xl text-slate-400"><FileText/></div>
            <div><p className="font-black text-slate-900">{d.num}</p><p className="text-[10px] font-bold text-slate-400 uppercase">{d.client}</p></div></div>
            <p className="font-black text-lg">{profile.curr}{d.total.toLocaleString()}</p>
          </div>
        ))}
        {docs.length === 0 && <div className="p-20 text-center text-slate-300 font-bold">No documents yet.</div>}
      </div>
    </div>
  );

  return (
    <div className="p-6 pt-10">
      <div className="flex justify-between items-center mb-10">
        <div><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Company</p><h1 className="text-3xl font-black tracking-tighter">{profile.name}</h1></div>
        <button onClick={() => setView('settings')} className="p-4 bg-white border rounded-2xl text-slate-400 shadow-sm"><Settings size={20}/></button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10 text-center">
        <div className="bg-white p-6 rounded-[2rem] border shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Total Invoiced</p>
          <p className="text-2xl font-black">{profile.curr}{docs.reduce((a,b)=>a+b.total,0).toLocaleString()}</p>
        </div>
      </div>
      <div className="grid gap-4">
        <button onClick={() => setView('create')} className="p-8 bg-green-500 text-white rounded-[2.5rem] font-black flex items-center justify-between shadow-xl shadow-green-500/20">
          <div className="flex items-center gap-4 text-lg"><FileText size={28}/> New Invoice</div><Plus />
        </button>
        <button onClick={() => setView('history')} className="p-8 bg-slate-900 text-white rounded-[2.5rem] font-black flex items-center justify-between shadow-xl">
          <div className="flex items-center gap-4 text-lg"><Clock size={28}/> View History</div><ChevronLeft className="rotate-180" />
        </button>
      </div>
    </div>
  );
};

// @ts-ignore
ReactDOM.createRoot(document.getElementById('root')!).render(<App />);
