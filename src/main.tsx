import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom/client';
import { 
  Zap, Plus, FileText, Receipt, TrendingUp, ChevronLeft, 
  Printer, Trash2, Check, Settings, Users, Download, X, PenTool
} from 'lucide-react';

const CURRENCIES = [
  { s: '$', c: 'USD' }, { s: '₦', c: 'NGN' }, { s: '£', c: 'GBP' }, { s: '€', c: 'EUR' }, { s: '₵', c: 'GHS' }, { s: 'KSh', c: 'KES' }, { s: 'R', c: 'ZAR' }
];

const App = () => {
  const [view, setView] = useState('landing');
  const [profile, setProfile] = useState<any>(null);
  const [docs, setDocs] = useState<any[]>([]);
  const [activeDoc, setActiveDoc] = useState<any>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);

  useEffect(() => {
    const p = localStorage.getItem('apa_p');
    const d = localStorage.getItem('apa_d');
    if (p) { setProfile(JSON.parse(p)); setView('dashboard'); }
    if (d) setDocs(JSON.parse(d));
  }, []);

  const handleImg = (e: any, k: string) => {
    const reader = new FileReader();
    reader.onload = () => setProfile({ ...profile, [k]: reader.result });
    if (e.target.files[0]) reader.readAsDataURL(e.target.files[0]);
  };

  const saveDoc = (d: any) => {
    const updated = [...docs, { ...d, id: Date.now() }];
    setDocs(updated);
    localStorage.setItem('apa_d', JSON.stringify(updated));
    setActiveDoc(d);
    setView('preview');
  };

  /* --- UI SECTIONS --- */

  if (view === 'landing') return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-10 text-center">
      <div className="bg-green-500 p-5 rounded-3xl mb-8 shadow-2xl animate-pulse"><Zap size={48} fill="currentColor" /></div>
      <h1 className="text-5xl font-black mb-4 tracking-tighter">ApaBizDesk</h1>
      <p className="text-slate-400 text-lg mb-12">The world's simplest invoice generator.</p>
      <button onClick={() => setView('onboarding')} className="w-full max-w-xs py-5 bg-green-500 rounded-2xl font-black text-xl shadow-xl shadow-green-500/20">Get Started Free</button>
    </div>
  );

  if (view === 'onboarding' || view === 'settings') return (
    <div className="p-6 max-w-xl mx-auto pb-20">
      <button onClick={() => setView('dashboard')} className="mb-6 text-slate-400 flex items-center gap-2 font-bold"><ChevronLeft size={20}/> Back</button>
      <h2 className="text-3xl font-black mb-2">Business Profile</h2>
      <p className="text-slate-500 mb-8 text-sm">Setup once, use on every invoice.</p>
      <form className="space-y-5" onSubmit={(e:any) => {
        e.preventDefault();
        const d = Object.fromEntries(new FormData(e.target));
        const final = { ...d, logo: profile?.logo, sig: profile?.sig };
        setProfile(final);
        localStorage.setItem('apa_p', JSON.stringify(final));
        setView('dashboard');
      }}>
        <div className="flex gap-4 mb-6">
          <div className="flex-1 p-4 border-2 border-dashed rounded-2xl text-center relative bg-white">
            <p className="text-[10px] font-black text-slate-400 uppercase">Business Logo</p>
            {profile?.logo && <img src={profile.logo} className="h-12 mx-auto mt-2 object-contain" />}
            <input type="file" className="absolute inset-0 opacity-0" onChange={e => handleImg(e, 'logo')} />
          </div>
        </div>
        <input name="name" defaultValue={profile?.name} placeholder="Business Name" className="w-full p-4 bg-white border rounded-2xl outline-none font-bold shadow-sm" required />
        <input name="email" defaultValue={profile?.email} placeholder="Email Address" className="w-full p-4 bg-white border rounded-2xl outline-none shadow-sm" required />
        <textarea name="addr" defaultValue={profile?.addr} placeholder="Full Address" className="w-full p-4 bg-white border rounded-2xl outline-none shadow-sm" rows={2} required />
        <div className="grid grid-cols-2 gap-4">
           <select name="curr" defaultValue={profile?.curr || '₦'} className="w-full p-4 bg-white border rounded-2xl outline-none font-black shadow-sm">
             {CURRENCIES.map(c => <option key={c.c} value={c.s}>{c.c} ({c.s})</option>)}
           </select>
           <input name="tax_id" defaultValue={profile?.tax_id} placeholder="Tax/VAT Number" className="w-full p-4 bg-white border rounded-2xl outline-none shadow-sm" />
        </div>
        <textarea name="pay" defaultValue={profile?.pay} placeholder="Payment Instructions (Bank Name, Acc Number)" className="w-full p-4 bg-white border rounded-2xl outline-none shadow-sm" rows={2} />
        <button type="submit" className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-lg shadow-xl">Save Profile</button>
      </form>
    </div>
  );

  if (view === 'create') return (
    <div className="p-6 max-w-xl mx-auto pb-32">
      <div className="flex items-center justify-between mb-8">
        <button onClick={() => setView('dashboard')} className="text-slate-400 font-bold flex items-center gap-2"><ChevronLeft size={20}/> Back</button>
        <h2 className="text-2xl font-black">New Invoice</h2>
      </div>
      
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 space-y-4">
          <label className="text-[10px] font-black text-slate-400 uppercase">Customer Information</label>
          <input id="cl" placeholder="Who is this for?" className="w-full p-4 bg-slate-50 rounded-2xl outline-none font-bold" />
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 space-y-4">
          <label className="text-[10px] font-black text-slate-400 uppercase">Items & Services</label>
          <input id="de" placeholder="Service or Product name" className="w-full p-4 bg-slate-50 rounded-2xl outline-none font-bold" />
          <div className="flex gap-4">
            <div className="flex-1"><p className="text-[9px] font-bold text-slate-400 uppercase mb-1">Qty</p><input id="qt" type="number" defaultValue="1" className="w-full p-4 bg-slate-50 rounded-2xl outline-none font-bold" /></div>
            <div className="flex-1"><p className="text-[9px] font-bold text-slate-400 uppercase mb-1">Price ({profile.curr})</p><input id="pr" type="number" placeholder="0.00" className="w-full p-4 bg-slate-50 rounded-2xl outline-none font-bold" /></div>
          </div>
        </div>

        {!showAdvanced ? (
          <button onClick={() => setShowAdvanced(true)} className="text-sm font-bold text-green-600 flex items-center gap-1">+ Add Tax or Discount</button>
        ) : (
          <div className="bg-slate-50 p-6 rounded-3xl space-y-4 animate-in slide-in-from-top-2">
            <div className="flex justify-between items-center"><h3 className="font-bold text-sm">Advanced Options</h3><button onClick={() => setShowAdvanced(false)}><X size={16}/></button></div>
            <div className="flex gap-4">
              <div className="flex-1"><p className="text-[9px] font-bold text-slate-400 uppercase mb-1">Tax (%)</p><input id="tx" type="number" defaultValue="0" className="w-full p-4 bg-white rounded-2xl outline-none" /></div>
              <div className="flex-1"><p className="text-[9px] font-bold text-slate-400 uppercase mb-1">Discount ({profile.curr})</p><input id="ds" type="number" defaultValue="0" className="w-full p-4 bg-white rounded-2xl outline-none" /></div>
            </div>
          </div>
        )}

        <button onClick={() => {
          const client = (document.getElementById('cl') as any).value;
          const desc = (document.getElementById('de') as any).value;
          const qty = Number((document.getElementById('qt') as any).value);
          const pr = Number((document.getElementById('pr') as any).value);
          const tax = Number((document.getElementById('tx') as any)?.value || 0);
          const disc = Number((document.getElementById('ds') as any)?.value || 0);
          const total = ((qty * pr) + ((qty * pr) * (tax/100))) - disc;
          saveDoc({ client, items: [{ desc, qty, pr }], total, tax, disc, num: `INV-${Math.floor(1000+Math.random()*9000)}`, date: new Date().toLocaleDateString() });
        }} className="w-full py-5 bg-green-500 text-white font-black rounded-2xl text-lg shadow-xl shadow-green-500/20">Generate Invoice</button>
      </div>
    </div>
  );

  if (view === 'preview') return (
    <div className="p-4 bg-slate-100 min-h-screen pb-32">
      <div className="max-w-xl mx-auto">
        <button onClick={() => setView('dashboard')} className="mb-4 flex items-center gap-2 font-black text-slate-400 text-xs"><ChevronLeft size={16}/> Back to Dashboard</button>
        <div id="invoice" className="bg-white p-8 rounded-sm shadow-2xl min-h-[750px] flex flex-col border-t-[12px] border-slate-900 font-serif">
          <div className="flex justify-between items-start mb-10 border-b pb-8">
            <div>
              {profile.logo && <img src={profile.logo} className="h-12 mb-4 object-contain" />}
              <h2 className="text-xl font-black uppercase leading-none">{profile.name}</h2>
              <p className="text-[9px] text-slate-400 font-bold uppercase mt-2">{profile.addr}</p>
            </div>
            <div className="text-right">
              <h1 className="text-4xl font-black text-slate-100 tracking-tighter italic">INVOICE</h1>
              <p className="text-[10px] font-black mt-2">NO: {activeDoc.num}</p>
              <p className="text-[9px] text-slate-400 font-bold">{activeDoc.date}</p>
            </div>
          </div>
          <div className="mb-10">
            <p className="text-[9px] font-black text-slate-300 uppercase mb-1">Customer</p>
            <p className="font-black text-slate-900 text-lg leading-none">{activeDoc.client || "Valued Client"}</p>
          </div>
          <table className="w-full mb-10 text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-slate-900 text-[10px] font-black text-slate-400 uppercase"><th className="pb-2">Description</th><th className="pb-2 text-right">Amount</th></tr>
            </thead>
            <tbody>
              {activeDoc.items.map((it:any, i:number) => (
                <tr key={i} className="border-b border-slate-50"><td className="py-5 text-sm font-bold text-slate-700">{it.desc} (x{it.qty})</td><td className="py-5 text-right font-black text-slate-900">{profile.curr}{(it.qty * it.pr).toLocaleString()}</td></tr>
              ))}
            </tbody>
          </table>
          <div className="mt-auto grid grid-cols-2 gap-8 pt-8 border-t-2 border-slate-900">
            <div>
              <p className="text-[9px] font-black text-slate-300 uppercase mb-2">Payment Details</p>
              <p className="text-[9px] font-bold text-slate-500 whitespace-pre-wrap">{profile.pay}</p>
            </div>
            <div className="text-right space-y-1">
               <div className="flex justify-between text-[10px] font-bold text-slate-400 border-b pb-2 mb-2"><span>Subtotal</span><span>{profile.curr}{(activeDoc.total + activeDoc.disc).toLocaleString()}</span></div>
               <div className="flex justify-between items-center"><span className="text-[10px] font-black text-slate-900 uppercase">Grand Total</span><span className="text-3xl font-black text-slate-900">{profile.curr}{activeDoc.total.toLocaleString()}</span></div>
            </div>
          </div>
          <div className="mt-12 text-center border-t pt-6"><p className="text-[9px] font-bold text-slate-300 italic tracking-widest">THANK YOU FOR YOUR BUSINESS • APABIZDESK</p></div>
        </div>
        <button onClick={() => window.print()} className="w-full mt-6 py-5 bg-slate-900 text-white rounded-[2rem] font-black shadow-2xl flex items-center justify-center gap-3"><Printer size={24}/> Print or Save as PDF</button>
      </div>
    </div>
  );

  return (
    <div className="p-6 pt-10">
      <div className="flex justify-between items-center mb-10">
        <div className="flex items-center gap-3">
           <div className="bg-green-500 p-2 rounded-xl text-white"><Zap size={20} fill="currentColor"/></div>
           <div><p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Business</p><h1 className="text-2xl font-black tracking-tighter">{profile.name}</h1></div>
        </div>
        <button onClick={() => setView('settings')} className="p-4 bg-white border rounded-2xl text-slate-400 shadow-sm"><Settings size={20}/></button>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-10">
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm text-center">
          <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Invoices</p>
          <p className="text-2xl font-black text-slate-900">{docs.length}</p>
        </div>
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm text-center">
          <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Volume</p>
          <p className="text-2xl font-black text-green-600 truncate">{profile.curr}{docs.reduce((a,b)=>a+b.total,0).toLocaleString()}</p>
        </div>
      </div>

      <div className="space-y-4">
        <button onClick={() => setView('create')} className="w-full p-8 bg-green-500 text-white rounded-[2.5rem] font-black flex items-center justify-between shadow-xl shadow-green-500/20">
          <div className="flex items-center gap-4 text-xl"><FileText size={28}/> New Invoice</div><Plus />
        </button>
        <div className="bg-white rounded-[2rem] border border-slate-100 p-6">
          <h3 className="font-black text-sm mb-4 uppercase tracking-widest text-slate-300">Recent Documents</h3>
          {docs.slice(-3).reverse().map((d, i) => (
            <div key={i} className="flex justify-between items-center py-3 border-b border-slate-50 last:border-0">
               <div><p className="font-bold text-sm">{d.client}</p><p className="text-[10px] text-slate-400">{d.num}</p></div>
               <p className="font-black text-slate-900 text-sm">{profile.curr}{d.total.toLocaleString()}</p>
            </div>
          ))}
          {docs.length === 0 && <p className="text-center text-slate-300 py-4 font-bold text-xs uppercase">No history yet</p>}
        </div>
      </div>
    </div>
  );
};

// @ts-ignore
ReactDOM.createRoot(document.getElementById('root')!).render(<App />);
