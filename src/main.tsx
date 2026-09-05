import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom/client';
import { 
  Zap, Plus, FileText, Receipt, TrendingUp, ChevronLeft, 
  Printer, Trash2, Settings, Download, X, PenTool, Check, Eraser
} from 'lucide-react';

const CURRENCIES = [
  { s: '₦', c: 'NGN' }, { s: '$', c: 'USD' }, { s: '£', c: 'GBP' }, { s: '€', c: 'EUR' }, { s: '₵', c: 'GHS' }, { s: 'KSh', c: 'KES' }, { s: 'R', c: 'ZAR' }
];

/* --- SIGNATURE PAD COMPONENT --- */
const SignaturePad = ({ onSave, onCancel }: any) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.strokeStyle = '#0F172A';
        ctx.lineWidth = 3;
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
      }
    }
  }, []);

  const startDrawing = (e: any) => {
    setIsDrawing(true);
    draw(e);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx?.beginPath();
    }
  };

  const draw = (e: any) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (canvas && ctx) {
      const rect = canvas.getBoundingClientRect();
      const x = (e.clientX || e.touches[0].clientX) - rect.left;
      const y = (e.clientY || e.touches[0].clientY) - rect.top;
      ctx.lineTo(x, y);
      ctx.stroke();
      ctx.moveTo(x, y);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/90 z-50 flex items-center justify-center p-6 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md rounded-[2rem] overflow-hidden shadow-2xl">
        <div className="p-6 border-b flex justify-between items-center">
          <h3 className="font-bold text-slate-900">Draw Your Signature</h3>
          <button onClick={onCancel}><X size={20}/></button>
        </div>
        <canvas 
          ref={canvasRef}
          onMouseDown={startDrawing} onMouseMove={draw} onMouseUp={stopDrawing}
          onTouchStart={startDrawing} onTouchMove={draw} onTouchEnd={stopDrawing}
          className="w-full h-64 bg-slate-50 touch-none cursor-crosshair"
          width={400} height={250}
        />
        <div className="p-6 bg-slate-50 flex gap-3">
          <button onClick={() => {
            const ctx = canvasRef.current?.getContext('2d');
            ctx?.clearRect(0, 0, 400, 250);
          }} className="flex-1 py-3 bg-white border border-slate-200 rounded-xl font-bold flex items-center justify-center gap-2 text-slate-500">
            <Eraser size={18}/> Clear
          </button>
          <button onClick={() => {
            const dataUrl = canvasRef.current?.toDataURL();
            onSave(dataUrl);
          }} className="flex-1 py-3 bg-green-500 text-white rounded-xl font-bold flex items-center justify-center gap-2">
            <Check size={18}/> Save Signature
          </button>
        </div>
      </div>
    </div>
  );
};

/* --- MAIN APP --- */
const App = () => {
  const [view, setView] = useState('landing');
  const [profile, setProfile] = useState<any>(null);
  const [docs, setDocs] = useState<any[]>([]);
  const [activeDoc, setActiveDoc] = useState<any>(null);
  const [showSig, setShowSig] = useState(false);

  useEffect(() => {
    const p = localStorage.getItem('apa_p');
    const d = localStorage.getItem('apa_d');
    if (p) { setProfile(JSON.parse(p)); setView('dashboard'); }
    if (d) setDocs(JSON.parse(d));
  }, []);

  const handleImg = (e: any, k: string) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = () => setProfile({ ...profile, [k]: reader.result });
    if (file) reader.readAsDataURL(file);
  };

  const saveDoc = (d: any) => {
    const updated = [...docs, { ...d, id: Date.now() }];
    setDocs(updated);
    localStorage.setItem('apa_d', JSON.stringify(updated));
    setActiveDoc(d);
    setView('preview');
  };

  if (view === 'landing') return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-10 text-center">
      <div className="bg-green-500 p-5 rounded-3xl mb-8 shadow-2xl"><Zap size={48} fill="currentColor" /></div>
      <h1 className="text-5xl font-black mb-4 tracking-tighter">ApaBizDesk</h1>
      <p className="text-slate-400 text-lg mb-12">Professional documents for serious businesses.</p>
      <button onClick={() => setView('onboarding')} className="w-full max-w-xs py-5 bg-green-500 rounded-2xl font-black text-xl shadow-xl">Get Started Free</button>
    </div>
  );

  if (view === 'onboarding' || view === 'settings') return (
    <div className="p-6 max-w-xl mx-auto pb-20">
      {showSig && <SignaturePad onCancel={() => setShowSig(false)} onSave={(s:string) => { setProfile({...profile, sig: s}); setShowSig(false); }} />}
      <button onClick={() => setView('dashboard')} className="mb-6 text-slate-400 flex items-center gap-2 font-bold"><ChevronLeft size={20}/> Back</button>
      <h2 className="text-3xl font-black mb-8">Business Profile</h2>
      <form className="space-y-5" onSubmit={(e:any) => {
        e.preventDefault();
        const d = Object.fromEntries(new FormData(e.target));
        const final = { ...d, logo: profile?.logo, sig: profile?.sig };
        setProfile(final);
        localStorage.setItem('apa_p', JSON.stringify(final));
        setView('dashboard');
      }}>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 border-2 border-dashed rounded-3xl text-center relative bg-white h-32 flex flex-col justify-center items-center">
            {profile?.logo ? <img src={profile.logo} className="h-full w-full object-contain" /> : <div className="text-slate-300 text-[10px] font-black uppercase">Upload Logo</div>}
            <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={e => handleImg(e, 'logo')} />
          </div>
          <div className="p-4 border-2 border-dashed rounded-3xl text-center relative bg-white h-32 flex flex-col justify-center items-center">
            {profile?.sig ? <img src={profile.sig} className="h-full w-full object-contain" /> : <div className="text-slate-300 text-[10px] font-black uppercase">Draw Signature</div>}
            <button type="button" onClick={() => setShowSig(true)} className="absolute inset-0 z-10" />
          </div>
        </div>
        <input name="name" defaultValue={profile?.name} placeholder="Business Name" className="w-full p-4 bg-white border rounded-2xl outline-none font-bold" required />
        <textarea name="addr" defaultValue={profile?.addr} placeholder="Business Address" className="w-full p-4 bg-white border rounded-2xl outline-none" rows={2} required />
        <div className="grid grid-cols-2 gap-4">
           <select name="curr" defaultValue={profile?.curr || '₦'} className="w-full p-4 bg-white border rounded-2xl outline-none font-black">
             {CURRENCIES.map(c => <option key={c.c} value={c.s}>{c.c} ({c.s})</option>)}
           </select>
           <input name="email" defaultValue={profile?.email} placeholder="Business Email" className="w-full p-4 bg-white border rounded-2xl outline-none" required />
        </div>
        <textarea name="pay" defaultValue={profile?.pay} placeholder="Payment Instructions (e.g. Bank Info)" className="w-full p-4 bg-white border rounded-2xl outline-none" rows={2} />
        <input name="note" defaultValue={profile?.note || 'Thank you for your business!'} placeholder="Personalized Thank You Note" className="w-full p-4 bg-white border rounded-2xl outline-none italic text-sm" />
        <button type="submit" className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-lg">Save & Continue</button>
      </form>
    </div>
  );

  if (view === 'create') return (
    <div className="p-6 max-w-xl mx-auto pb-32">
      <div className="flex items-center justify-between mb-8">
        <button onClick={() => setView('dashboard')} className="text-slate-400 font-bold flex items-center gap-2"><ChevronLeft size={20}/> Back</button>
        <h2 className="text-2xl font-black">{activeDoc} Setup</h2>
      </div>
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 space-y-4 shadow-sm">
          <input id="cl" placeholder={activeDoc === 'Invoice' ? "Bill To: Customer Name" : "Received From: Customer Name"} className="w-full p-4 bg-slate-50 rounded-2xl outline-none font-bold" />
          <textarea id="cl_ad" placeholder="Customer Address" className="w-full p-4 bg-slate-50 rounded-2xl outline-none text-sm" rows={2} />
        </div>
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 space-y-4 shadow-sm">
          <input id="de" placeholder="Item/Service Description" className="w-full p-4 bg-slate-50 rounded-2xl outline-none font-bold" />
          <div className="flex gap-4">
            <div className="flex-1 text-center"><p className="text-[9px] font-black text-slate-300 uppercase mb-
