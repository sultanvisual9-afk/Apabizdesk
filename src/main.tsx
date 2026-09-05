import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom/client';
import { Zap, Plus, FileText, Receipt, TrendingUp, ChevronLeft, Printer, Settings } from 'lucide-react';

const CURS = [{s:'₦',c:'NGN'},{s:'$',c:'USD'},{s:'£',c:'GBP'},{s:'€',c:'EUR'}];
const LAYS = ['Classic', 'Modern', 'Corporate', 'Creative', 'Minimal', 'Bold', 'Tech', 'Luxury'];

const App = () => {
  const [v, setV] = useState('landing'), [p, setP] = useState<any>(null), [ds, setDs] = useState<any[]>([]), [ac, setAc] = useState<any>(null);
  const [m, setM] = useState('Invoice'), [l, setL] = useState('Classic'), [dr, setDr] = useState(false);
  const cv = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const sP = localStorage.getItem('ap_p'), sD = localStorage.getItem('ap_d');
    if (sP) { setP(JSON.parse(sP)); setV('dashboard'); }
    if (sD) setDs(JSON.parse(sD));
  }, []);

  const saveP = (e: any) => {
    e.preventDefault();
    const d = { ...Object.fromEntries(new FormData(e.target)), logo: p?.logo, sig: p?.sig };
    setP(d); localStorage.setItem('ap_p', JSON.stringify(d)); setV('dashboard');
  };

  const draw = (e: any) => {
    if (!dr) return; const c = cv.current, x = c?.getContext('2d'); if (!x || !c) return;
    const r = c.getBoundingClientRect(), px = (e.touches ? e.touches[0].clientX : e.clientX) - r.left, py = (e.touches ? e.touches[0].clientY : e.clientY) - r.top;
    x.lineWidth = 2; x.lineCap = 'round'; x.strokeStyle = l==='Tech'?'#22c55e':'#000'; x.lineTo(px, py); x.stroke(); x.beginPath(); x.moveTo(px, py);
  };

  if (v === 'landing') return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-10 text-center font-sans">
      <Zap size={60} className="text-green-500 mb-6" fill="currentColor" />
      <h1 className="text-4xl font-black mb-2 tracking-tighter uppercase">APA BizDesk</h1>
      <button onClick={() => setV('onboarding')} className="w-full max-w-xs py-5 bg-green-500 rounded-2xl font-black text-xl shadow-xl">Get Started</button>
    </div>
  );

  if (v === 'onboarding' || v === 'settings') return (
    <div className="p-6 max-w-xl mx-auto pb-20 font-sans">
      <button onClick={() => setV('dashboard')} className="mb-4 text-slate-400 font-bold flex items-center gap-2"><ChevronLeft size={16}/> Back</button>
      <form className="space-y-4" onSubmit={saveP}>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 border-2 border-dashed rounded-2xl text-center relative bg-white h-24 flex flex-col justify-center">
            <p className="text-[8px] font-black text-slate-300 uppercase">Logo</p>
            {p?.logo && <img src={p.logo} className="h-10 mx-auto" />}
            <input type="file" className="absolute inset-0 opacity-0" onChange={e => { const r = new FileReader(); r.onload = () => setP({...p, logo: r.result}); r.readAsDataURL(e.target.files![0]); }} />
          </div>
          <div className="p-2 border-2 border-dashed rounded-2xl bg-white h-24 relative overflow-hidden">
            <canvas ref={cv} width={200} height={100} onMouseDown={()=>setDr(true)} onMouseMove={draw} onMouseUp={()=>{setDr(false); setP({...p, sig: cv.current?.toDataURL()})}} onTouchStart={()=>setDr(true)} onTouchMove={draw} onTouchEnd={()=>{setDr(false); setP({...p, sig: cv.current?.toDataURL()})}} className="w-full h-full touch-none" />
            <p className="absolute top-1 right-2 text-[7px] text-slate-300 font-bold">SIGN HERE</p>
          </div>
        </div>
        <input name="name" defaultValue={p?.name} placeholder="Business Name" className="w-full p-4 border rounded-xl font-bold" required />
        <textarea name="addr" defaultValue={p?.addr} placeholder="Address" className="w-full p-4 border rounded-xl" rows={2} required />
        <div className="grid grid-cols-2 gap-4">
          <select name="curr" defaultValue={p?.curr || '₦'} className="p-4 border rounded-xl font-bold bg-white">{CURS.map(c => <option key={c.c} value={c.s}>{c.c} ({c.s})</option>)}</select>
          <input name="email" defaultValue={p?.email} placeholder="Email" className="p-4 border rounded-xl" required />
        </div>
        <textarea name="pay" defaultValue={p?.pay} placeholder="Payment Details" className="w-full p-4 border rounded-xl" rows={2} />
        <input name="note" defaultValue={p?.note || 'Thank you for your business!'} className="w-full p-4 border rounded-xl italic" />
        <button type="submit" className="w-full py-4 bg-slate-900 text-white rounded-xl font-black">Save Profile</button>
      </form>
    </div>
  );

  if (v === 'create') return (
    <div className="p-6 max-w-xl mx-auto font-sans bg-slate-50 min-h-screen">
      <button onClick={() => setV('dashboard')} className="mb-4 text-slate-400 font-bold flex gap-2"><ChevronLeft/> Back</button>
      <h2 className="text-2xl font-black mb-6 uppercase">New {m}</h2>
      <div className="space-y-4">
        <input id="cl" placeholder="Customer Name" className="w-full p-5 bg-white border rounded-2xl font-bold shadow-sm" />
        {m === 'Receipt' && <select id="pm" className="w-full p-4 border rounded-xl font-bold bg-white"><option>Cash</option><option>Bank Transfer</option><option>POS / Card</option></select>}
        <div className="p-6 bg-white border rounded-3xl space-y-4 shadow-sm">
          <input id="de" placeholder="Description" className="w-full bg-transparent border-b font-bold p-1 outline-none" />
          <div className="flex gap-4">
            <input id="qt" type="number" defaultValue="1" className="w-1/4 bg-transparent border-b font-bold p-1 text-center" />
            <input id="pr" type="number" placeholder="Price" className="flex-1 bg-transparent border-b font-bold p-1 text-center" />
          </div>
        </div>
        <button onClick={() => {
          const c = (document.getElementById('cl') as any).value, d = (document.getElementById('de') as any).value, q = Number((document.getElementById('qt') as any).value), pr = Number((document.getElementById('pr') as any).value);
          const doc = { type: m, client: c, items: [{ d, q, pr }], total: q * pr, num: `${m==='Invoice'?'INV':'REC'}-${Math.floor(1000+Math.random()*9000)}`, date: new Date().toLocaleDateString(), meth: (document.getElementById('pm') as any)?.value };
          const ud = [...ds, doc]; setDs(ud); localStorage.setItem('ap_d', JSON.stringify(ud)); setAc(doc); setV('preview');
        }} className={`w-full py-5 ${m==='Invoice'?'bg-blue-600':'bg-green-600'} text-white font-black rounded-2xl text-lg shadow-xl`}>Preview {m}</button>
      </div>
    </div>
  );

  if (v === 'preview') return (
    <div className="p-4 bg-slate-200 min-h-screen pb-32 font-serif">
      <style>{`@media print { .no-p { display: none !important; } #doc { margin: 0 !important; box-shadow: none !important; border-radius: 0 !important; width: 100% !important; } } .bg-grid { background-image: radial-gradient(#e5e7eb 1px, transparent 1px); background-size: 20px 20px; } .bg-dots { background-image: radial-gradient(#fb923c 1px, transparent 1px); background-size: 15px 15px; }`}</style>
      <div className="max-w-xl mx-auto">
        <div className="flex justify-between items-center mb-4 no-p">
          <button onClick={() => setV('dashboard')} className="text-xs font-black text-slate-500 uppercase tracking-widest">Dashboard</button>
          <div className="flex gap-1 overflow-x-auto p-1 bg-white rounded-xl shadow-sm max-w-[200px]">
            {LAYS.map(t => <button key={t} onClick={()=>setL(t)} className={`px-2 py-1 rounded text-[8px] font-black transition ${l===t?'bg-slate-900 text-white':'text-slate-400'}`}>{t}</button>)}
          </div>
        </div>
        <div id="doc" className={`bg-white p-10 shadow-2xl min-h-[850px] flex flex-col relative overflow-hidden transition-all duration-500 ${l==='Modern'?'border-l-[25px] border-blue-600 bg-slate-50':l==='Bold'?'border-t-[40px] border-slate-900 bg-slate-100':l==='Corporate'?'bg-grid':l==='Creative'?'bg-orange-50 bg-dots':l==='Tech'?'bg-slate-900 text-slate-300 border-b-[20px] border-green-500':l==='Luxury'?'bg-[#fffdf5] border-[10px] border-double border-yellow-700/20':l==='Minimal'?'border-none p-14':'border-t-[15px] border-slate-900'}`}>
          {ac.type==='Receipt'&&<div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-9xl font-black -rotate-12 pointer-events-none uppercase ${l==='Tech'?'text-white/5':'text-green-500/10'}`}>PAID</div>}
          <div className={`flex justify-between items-start mb-12 ${l==='Minimal'?'':'border-b pb-8'}`}>
            <div>{p.logo && <img src={p.logo} className="h-14 mb-4 object-contain" />}<h2 className={`font-black uppercase tracking-tighter ${l==='Bold'?'text-4xl':'text-2xl'} ${l==='Tech'?'text-green-500':''}`}>{p.name}</h2><p className={`text-[10px] font-bold uppercase mt-1 ${l==='Tech'?'text-slate-500':'text-slate-400'}`}>{p.addr}<br/>{p.email}</p></div>
            <div className="text-right"><h1 className={`text-4xl font-black italic uppercase ${l==='Tech'?'text-white':'text-slate-100'}`}>{ac.type}</h1><p className={`text-[10px] font-black mt-2 ${l==='Tech'?'text-green-500':'text-slate-900'}`}>NO: {ac.num}</p><p className="text-[9px] text-slate-400 font-bold">{ac.date}</p></div>
          </div>
          <div className="mb-12"><p className="text-[9px] font-black text-slate-300 uppercase mb-2 tracking-widest">{ac.type==='Invoice'?'Bill To':'Received From'}</p><p className={`font-black text-2xl leading-none ${l==='Tech'?'text-white':'text-slate-900'}`}>{ac.client}</p></div>
          <table className="w-full mb-12 text-left">
            <thead><tr className={`${l==='Creative'?'bg-orange-500 text-white':l==='Modern'?'bg-blue-600 text-white':l==='Tech'?'bg-green-500 text-slate-900':'border-b-2 border-slate-900 text-slate-400'} text-[10px] uppercase font-black`}><th className="p-3">Description</th><th className="p-3 text-right">Total</th></tr></thead>
            <tbody>{ac.items.map((it:any, i:number) => ( <tr key={i} className="border-b border-slate-100/50"><td className="py-5 text-sm font-bold">{it.d} (x{it.q})</td><td className="py-5 text-right font-black">{p.curr}{(it.q * it.pr).toLocaleString()}</td></tr> ))}</tbody>
          </table>
          <div className="mt-auto flex justify-between items-end border-t-2 border-slate-900 pt-8">
            <div className="max-w-[220px]"><p className="text-[9px] font-black text-slate-300 uppercase mb-2">Details</p>{ac.type==='Receipt' && <p className="text-[10px] font-black text-green-600 italic mb-1">Method: {ac.meth}</p>}<p className="text-[9px] font-bold whitespace-pre-wrap">{p.pay}</p>
            {p.sig && <div className="mt-6"><img src={p.sig} className="h-10 mb-1" style={l==='Tech'?{filter:'invert(1)'}:{}} /><p className="text-[7px] font-black border-t w-20 pt-1 uppercase">Signature</p></div>}</div>
            <div className="text-right"><p className="text-[10px] font-black text-slate-900 uppercase mb-1">Total {ac.type==='Invoice'?'Due':'Paid'}</p><p className={`font-black leading-none ${l==='Bold'||l==='Tech'?'text-6xl':'text-4xl'} ${l==='Tech'?'text-green-500':'text-slate-900'}`}>{p.curr}{ac.total.toLocaleString()}</p></div>
          </div>
          <div className="mt-12 text-center border-t border-slate-100 pt-8"><p className="text-[10px] font-black uppercase italic tracking-widest opacity-40">{p.note}</p></div>
        </div>
        <button onClick={() => window.print()} className="w-full mt-6 py-5 bg-slate-900 text-white rounded-xl font-black shadow-2xl flex justify-center gap-3 items-center no-p"><Printer size={22}/> Print / PDF</button>
      </div>
    </div>
  );

  return (
    <div className="p-6 pt-10 font-sans bg-white min-h-screen">
      <div className="flex justify-between items-center mb-10">
        <div className="flex items-center gap-3"><div className="bg-green-500 p-2.5 rounded-2xl text-white shadow-lg"><Zap size={20} fill="currentColor"/></div>
        <div><p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Account</p><h1 className="text-2xl font-black tracking-tighter text-slate-900">{p.name}</h1></div></div>
        <button onClick={() => setV('settings')} className="p-4 bg-white border border-slate-100 rounded-2xl text-slate-400 shadow-sm"><Settings size={22}/></button>
      </div>
      <div className="grid gap-4 mb-10">
        <button onClick={()=>{setM('Invoice');setV('create')}} className="p-8 bg-blue-600 text-white rounded-3xl font-black flex justify-between shadow-xl"><span>New Invoice</span><Plus/></button>
        <button onClick={()=>{setM('Receipt');setV('create')}} className="p-8 bg-green-600 text-white rounded-3xl font-black flex justify-between shadow-xl"><span>New Receipt</span><Plus/></button>
      </div>
      <div className="bg-white border p-8 rounded-3xl shadow-sm"><h3 className="text-[10px] font-black text-slate-300 uppercase mb-6 tracking-widest">History</h3>
        {ds.slice(-3).reverse().map((d, i) => ( <div key={i} onClick={()=>{setAc(d);setV('preview')}} className="flex justify-between items-center py-4 border-b last:border-0 cursor-pointer"><div><p className="font-bold text-slate-900">{d.client}</p><p className="text-[10px] text-slate-400 font-bold uppercase">{d.num} • {d.type}</p></div><p className={`font-black text-sm ${d.type==='Receipt'?'text-green-600':'text-slate-900'}`}>{p.curr}{d.total.toLocaleString()}</p></div> ))}
      </div>
    </div>
  );
};
// @ts-ignore
ReactDOM.createRoot(document.getElementById('root')!).render(<React.StrictMode><App /></React.StrictMode>);
