import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { 
  Zap, Plus, FileText, Receipt, TrendingUp, ChevronLeft, 
  Download, Printer, Trash2, Check, Settings as SettingsIcon, Users
} from 'lucide-react';

/* --- COMPONENTS --- */

const LandingPage = ({ onGetStarted }: any) => (
  <div className="min-h-screen bg-white text-slate-900 flex flex-col items-center justify-center p-6 text-center">
    <div className="bg-slate-900 text-white p-3 rounded-2xl mb-6"><Zap size={40} fill="currentColor" /></div>
    <h1 className="text-4xl font-black mb-4">APA BizDesk</h1>
    <p className="text-slate-500 mb-8 max-w-sm">Professional invoices and receipts made simple for your business.</p>
    <button onClick={onGetStarted} className="w-full max-w-xs py-4 bg-green-500 text-white font-bold rounded-2xl shadow-lg shadow-green-100">Get Started Free</button>
  </div>
);

const Onboarding = ({ onComplete }: any) => {
  const [profile, setProfile] = useState({ name: '', phone: '', email: '', address: '' });
  return (
    <div className="max-w-xl mx-auto p-6 pt-12">
      <h2 className="text-3xl font-bold mb-2">Business Setup</h2>
      <p className="text-slate-500 mb-8">Enter your details to appear on your invoices.</p>
      <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); onComplete(profile); }}>
        <input required className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-green-500 outline-none" placeholder="Business Name" onChange={e => setProfile({...profile, name: e.target.value})} />
        <input required className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-green-500 outline-none" placeholder="Email" type="email" onChange={e => setProfile({...profile, email: e.target.value})} />
        <input required className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-green-500 outline-none" placeholder="Phone Number" onChange={e => setProfile({...profile, phone: e.target.value})} />
        <textarea required className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-green-500 outline-none" placeholder="Business Address" rows={3} onChange={e => setProfile({...profile, address: e.target.value})} />
        <button className="w-full py-4 bg-slate-900 text-white font-bold rounded-2xl">Save Business Profile</button>
      </form>
    </div>
  );
};

const Dashboard = ({ businessName, onAction }: any) => (
  <div className="p-6 pt-12">
    <div className="mb-8">
      <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest mb-1">Welcome Back</p>
      <h1 className="text-3xl font-black text-slate-900">{businessName}</h1>
    </div>
    
    <div className="grid grid-cols-1 gap-4 mb-8">
      <button onClick={() => onAction('create-invoice')} className="p-6 bg-green-500 text-white rounded-[2rem] font-bold flex items-center justify-between shadow-xl shadow-green-100">
        <div className="flex items-center gap-4"><div className="bg-white/20 p-2 rounded-xl"><FileText /></div> Create New Invoice</div>
        <Plus size={20} />
      </button>
      <button onClick={() => onAction('create-receipt')} className="p-6 bg-slate-900 text-white rounded-[2rem] font-bold flex items-center justify-between shadow-xl shadow-slate-200">
        <div className="flex items-center gap-4"><div className="bg-white/20 p-2 rounded-xl"><Receipt /></div> Create New Receipt</div>
        <Plus size={20} />
      </button>
    </div>

    <div className="bg-white border border-slate-100 rounded-3xl p-8 text-center">
      <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300"><TrendingUp /></div>
      <h3 className="font-bold text-slate-900">No Recent Activity</h3>
      <p className="text-slate-400 text-sm mt-1">Your created documents will appear here.</p>
    </div>
  </div>
);

const DocumentPreview = ({ doc, profile, onBack }: any) => (
  <div className="min-h-screen bg-slate-100 p-4 pb-24">
    <button onClick={onBack} className="mb-6 flex items-center gap-2 font-bold text-slate-500"><ChevronLeft /> Back</button>
    <div id="printable-area" className="bg-white w-full aspect-[1/1.4] rounded-xl shadow-2xl p-8 flex flex-col">
      <div className="flex justify-between items-start mb-10">
        <div>
          <h2 className="text-2xl font-black text-slate-900">{profile.name}</h2>
          <p className="text-[10px] text-slate-400 max-w-[150px] uppercase font-bold mt-1">{profile.address}</p>
        </div>
        <div className="text-right">
          <h1 className="text-3xl font-black text-slate-200 uppercase tracking-tighter italic">{doc.type}</h1>
          <p className="text-xs font-bold text-slate-900 mt-2"># {doc.number}</p>
        </div>
      </div>
      
      <div className="mb-10">
        <p className="text-[10px] font-black text-slate-300 uppercase mb-1">Bill To</p>
        <p className="font-bold text-slate-900">{doc.client || "Valued Customer"}</p>
      </div>

      <table className="w-full mb-10">
        <thead>
          <tr className="border-b-2 border-slate-900 text-left text-[10px] uppercase font-black text-slate-400">
            <th className="pb-2">Description</th>
            <th className="pb-2 text-right">Total</th>
          </tr>
        </thead>
        <tbody>
          {doc.items.map((item: any, i: number) => (
            <tr key={i} className="border-b border-slate-50">
              <td className="py-4 text-sm font-bold text-slate-700">{item.desc || "Item Name"} (x{item.qty})</td>
              <td className="py-4 text-right font-black text-slate-900">₦{(item.qty * item.price).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-auto pt-6 border-t-2 border-slate-900 flex justify-between items-center">
        <span className="font-black text-slate-900 uppercase tracking-widest text-sm">Amount Paid</span>
        <span className="text-3xl font-black text-green-600">₦{doc.total.toLocaleString()}</span>
      </div>
    </div>

    <div className="fixed bottom-6 left-6 right-6 flex gap-3">
      <button onClick={() => window.print()} className="flex-1 py-4 bg-slate-900 text-white font-bold rounded-2xl flex items-center justify-center gap-2 shadow-xl"><Printer size={20}/> Print / Save</button>
      <button onClick={onBack} className="flex-1 py-4 bg-white border-2 border-slate-200 text-slate-600 font-bold rounded-2xl">Done</button>
    </div>
  </div>
);

const DocumentBuilder = ({ type, profile, onSave, onBack }: any) => {
  const [client, setClient] = useState('');
  const [items, setItems] = useState([{ id: 1, desc: '', qty: 1, price: 0 }]);
  const total = items.reduce((a, b) => a + (b.qty * b.price), 0);

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <button onClick={onBack} className="mb-6 flex items-center gap-2 font-bold text-slate-500"><ChevronLeft /> Back</button>
      <h2 className="text-2xl font-black mb-6 text-slate-900">Create {type}</h2>
      
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-3xl shadow-sm space-y-4">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Customer</p>
          <input className="w-full p-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-green-500" placeholder="Customer Name" onChange={e => setClient(e.target.value)} />
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm space-y-4">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Items & Pricing</p>
          {items.map((item, i) => (
            <div key={item.id} className="p-4 bg-slate-50 rounded-2xl space-y-4 relative">
              <input className="w-full bg-transparent border-b-2 border-slate-200 font-bold p-2 outline-none" placeholder="Item Name" onChange={e => {
                const n = [...items]; n[i].desc = e.target.value; setItems(n);
              }} />
              <div className="flex gap-4">
                <div className="flex-1"><label className="text-[9px] font-bold text-slate-400 uppercase">Qty</label><input type="number" className="w-full bg-transparent border-b-2 border-slate-200 font-bold p-2" onChange={e => {const n = [...items]; n[i].qty = Number(e.target.value); setItems(n);}} /></div>
                <div className="flex-1"><label className="text-[9px] font-bold text-slate-400 uppercase">Price</label><input type="number" className="w-full bg-transparent border-b-2 border-slate-200 font-bold p-2" onChange={e => {const n = [...items]; n[i].price = Number(e.target.value); setItems(n);}} /></div>
              </div>
            </div>
          ))}
          <button onClick={() => setItems([...items, {id: Date.now(), desc: '', qty: 1, price: 0}])} className="w-full py-3 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 font-bold text-sm">+ Add Another Item</button>
        </div>

        <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white flex justify-between items-center shadow-xl">
           <div><p className="text-[10px] font-bold text-slate-400 uppercase">Grand Total</p><p className="text-3xl font-black">₦{total.toLocaleString()}</p></div>
           <button onClick={() => onSave({ type, client, items, total, number: Math.floor(1000 + Math.random() * 9000) })} className="px-6 py-4 bg-green-500 rounded-2xl font-black text-sm">Preview Document</button>
        </div>
      </div>
    </div>
  );
};

/* --- MAIN APP --- */

const App = () => {
  const [view, setView] = useState('landing');
  const [profile, setProfile] = useState<any>(null);
  const [currentDoc, setCurrentDoc] = useState<any>(null);

  useEffect(() => {
    const saved = localStorage.getItem('apa_biz_profile');
    if (saved) { setProfile(JSON.parse(saved)); setView('dashboard'); }
  }, []);

  const handleOnboarding = (data: any) => {
    setProfile(data);
    localStorage.setItem('apa_biz_profile', JSON.stringify(data));
    setView('dashboard');
  };

  const saveAndPreview = (doc: any) => {
    setCurrentDoc(doc);
    setView('preview');
  };

  if (view === 'landing') return <LandingPage onGetStarted={() => setView('onboarding')} />;
  if (view === 'onboarding') return <Onboarding onComplete={handleOnboarding} />;
  if (view === 'preview') return <DocumentPreview doc={currentDoc} profile={profile} onBack={() => setView('dashboard')} />;
  if (view === 'create-invoice') return <DocumentBuilder type="Invoice" profile={profile} onBack={() => setView('dashboard')} onSave={saveAndPreview} />;
  if (view === 'create-receipt') return <DocumentBuilder type="Receipt" profile={profile} onBack={() => setView('dashboard')} onSave={saveAndPreview} />;

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <main className="flex-1 pb-24">
        {view === 'dashboard' && <Dashboard businessName={profile?.name} onAction={setView} />}
      </main>
      <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-slate-100 flex justify-around p-6">
        <button onClick={() => setView('dashboard')} className="text-slate-900"><TrendingUp /></button>
        <button onClick={() => setView('create-invoice')} className="bg-green-500 text-white p-4 rounded-full -mt-12 shadow-xl shadow-green-100"><Plus /></button>
        <button className="text-slate-300"><SettingsIcon /></button>
      </nav>
    </div>
  );
};

// @ts-ignore
ReactDOM.createRoot(document.getElementById('root')!).render(<React.StrictMode><App /></React.StrictMode>);
