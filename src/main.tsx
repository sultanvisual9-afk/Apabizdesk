import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom/client';
import { 
  Zap, Plus, FileText, Receipt, TrendingUp, ChevronLeft, 
  Download, Printer, Trash2, Check, Settings as SettingsIcon, 
  Users, Building2, Calendar, CreditCard, Mail, Phone, MapPin, 
  Globe, Info, Search, Copy, CheckCircle2, AlertCircle, Clock
} from 'lucide-react';

/* --- CONFIGURATION --- */
const CURRENCIES = [
  { code: 'NGN', symbol: '₦', name: 'Nigerian Naira' },
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'CAD', symbol: 'CA$', name: 'Canadian Dollar' },
  { code: 'AUD', symbol: 'AU$', name: 'Australian Dollar' },
  { code: 'GHS', symbol: 'GH₵', name: 'Ghanaian Cedi' },
  { code: 'ZAR', symbol: 'R', name: 'South African Rand' },
  { code: 'KES', symbol: 'KSh', name: 'Kenyan Shilling' },
];

const STATUSES = ['Draft', 'Sent', 'Unpaid', 'Partially Paid', 'Paid', 'Overdue', 'Cancelled'];

/* --- UTILS --- */
const formatCurr = (val: number, symbol: string) => 
  `${symbol}${val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

/* --- MAIN APP COMPONENTS --- */

const App = () => {
  const [view, setView] = useState('landing');
  const [profile, setProfile] = useState<any>(null);
  const [documents, setDocuments] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [activeDoc, setActiveDoc] = useState<any>(null);

  // Persistence
  useEffect(() => {
    const p = localStorage.getItem('apa_profile');
    const d = localStorage.getItem('apa_docs');
    const c = localStorage.getItem('apa_customers');
    if (p) setProfile(JSON.parse(p));
    if (d) setDocuments(JSON.parse(d));
    if (c) setCustomers(JSON.parse(c));
    if (p) setView('dashboard');
  }, []);

  const saveProfile = (data: any) => {
    setProfile(data);
    localStorage.setItem('apa_profile', JSON.stringify(data));
    setView('dashboard');
  };

  const saveDocument = (doc: any) => {
    const updated = doc.id 
      ? documents.map(d => d.id === doc.id ? doc : d)
      : [...documents, { ...doc, id: Date.now() }];
    setDocuments(updated);
    localStorage.setItem('apa_docs', JSON.stringify(updated));
    setActiveDoc(doc);
    setView('preview');
  };

  const duplicateDoc = (doc: any) => {
    const newDoc = { ...doc, id: Date.now(), number: `${doc.type === 'Invoice' ? 'INV' : 'REC'}-${Math.floor(1000 + Math.random() * 9000)}`, status: 'Draft' };
    saveDocument(newDoc);
  };

  if (view === 'landing') return <LandingPage onStart={() => setView('onboarding')} />;
  if (view === 'onboarding') return <ProfileSettings profile={profile} onSave={saveProfile} isNew />;
  
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans text-slate-900">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex w-64 bg-slate-900 text-white flex-col p-6 sticky top-0 h-screen">
        <div className="flex items-center gap-2 mb-10">
          <div className="bg-green-500 p-1.5 rounded-lg"><Zap size={20} fill="currentColor"/></div>
          <span className="text-xl font-black tracking-tighter">ApaBizDesk</span>
        </div>
        <nav className="space-y-1 flex-1">
          <NavItem active={view === 'dashboard'} onClick={() => setView('dashboard')} icon={<TrendingUp size={18}/>} label="Dashboard" />
          <NavItem active={view === 'history'} onClick={() => setView('history')} icon={<FileText size={18}/>} label="Documents" />
          <NavItem active={view === 'customers'} onClick={() => setView('customers')} icon={<Users size={18}/>} label="Customers" />
        </nav>
        <NavItem active={view === 'settings'} onClick={() => setView('settings')} icon={<SettingsIcon size={18}/>} label="Business Profile" />
      </aside>

      {/* Main Content */}
      <main className="flex-1 pb-24 md:pb-0 overflow-x-hidden">
        {view === 'dashboard' && <Dashboard profile={profile} docs={documents} onAction={setView} onOpen={setActiveDoc} />}
        {view === 'history' && <History docs={documents} onOpen={(d) => { setActiveDoc(d); setView('preview'); }} onDuplicate={duplicateDoc} />}
        {view === 'settings' && <ProfileSettings profile={profile} onSave={saveProfile} />}
        {view === 'create-invoice' && <DocumentBuilder type="Invoice" profile={profile} customers={customers} onSave={saveDocument} onBack={() => setView('dashboard')} />}
        {view === 'create-receipt' && <DocumentBuilder type="Receipt" profile={profile} customers={customers} onSave={saveDocument} onBack={() => setView('dashboard')} />}
        {view === 'preview' && <ProfessionalPreview doc={activeDoc} profile={profile} onBack={() => setView('dashboard')} />}
      </main>

      {/* Mobile Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 flex justify-around p-4 z-40">
        <button onClick={() => setView('dashboard')} className={view === 'dashboard' ? 'text-green-600' : 'text-slate-400'}><TrendingUp /></button>
        <button onClick={() => setView('create-invoice')} className="bg-green-500 text-white p-4 rounded-full -mt-12 shadow-xl border-4 border-slate-50"><Plus /></button>
        <button onClick={() => setView('history')} className={view === 'history' ? 'text-green-600' : 'text-slate-400'}><FileText /></button>
      </nav>
    </div>
  );
};

/* --- SUB-COMPONENTS --- */

const NavItem = ({ active, onClick, icon, label }: any) => (
  <button onClick={onClick} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition ${active ? 'bg-green-500 text-white shadow-lg shadow-green-900/20' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
    {icon} {label}
  </button>
);

const LandingPage = ({ onStart }: any) => (
  <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-8 text-center">
    <div className="bg-green-500 p-4 rounded-3xl mb-8 shadow-2xl animate-bounce"><Zap size={48} fill="currentColor"/></div>
    <h1 className="text-5xl font-black mb-4 tracking-tighter">ApaBizDesk</h1>
    <p className="text-slate-400 text-lg mb-10 max-w-md">The professional, international invoicing engine for modern businesses.</p>
    <button onClick={onStart} className="w-full max-w-xs py-5 bg-green-500 hover:bg-green-400 text-white font-black rounded-2xl text-lg transition-all shadow-xl shadow-green-500/20">Create My First Invoice</button>
  </div>
);

const ProfileSettings = ({ profile, onSave, isNew }: any) => {
  const [data, setData] = useState(profile || { name: '', email: '', phone: '', address: '', website: '', taxId: '', currency: 'USD', paymentDetails: '', terms: 'Due on Receipt', logo: '', signature: '' });

  const handleImage = (e: any, key: string) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => setData({ ...data, [key]: reader.result });
    if (file) reader.readAsDataURL(file);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 md:py-12">
      <div className="mb-10">
        <h2 className="text-3xl font-black text-slate-900">{isNew ? "Setup Your Business" : "Business Profile"}</h2>
        <p className="text-slate-500">This information will appear on all your documents.</p>
      </div>
      
      <form className="space-y-8" onSubmit={(e) => { e.preventDefault(); onSave(data); }}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <label className="block text-sm font-bold text-slate-700">Business Logo</label>
            <div className="h-40 w-full bg-white border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center overflow-hidden relative group">
              {data.logo ? <img src={data.logo} className="h-full w-full object-contain p-4" /> : <div className="text-center text-slate-400"><Building2 size={32} className="mx-auto mb-2"/> <span className="text-xs">Upload Logo</span></div>}
              <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => handleImage(e, 'logo')} />
            </div>
          </div>
          <div className="space-y-4">
            <label className="block text-sm font-bold text-slate-700">Authorized Signature</label>
            <div className="h-40 w-full bg-white border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center overflow-hidden relative group">
              {data.signature ? <img src={data.signature} className="h-full w-full object-contain p-4" /> : <div className="text-center text-slate-400"><Plus size={32} className="mx-auto mb-2"/> <span className="text-xs">Upload Signature</span></div>}
              <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => handleImage(e, 'signature')} />
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input label="Business Name" value={data.name} onChange={v => setData({...data, name: v})} required />
            <Input label="Email Address" value={data.email} onChange={v => setData({...data, email: v})} required />
            <Input label="Phone Number" value={data.phone} onChange={v => setData({...data, phone: v})} />
            <Input label="Website" value={data.website} onChange={v => setData({...data, website: v})} placeholder="www.example.com" />
          </div>
          <Input label="Physical Address" value={data.address} onChange={v => setData({...data, address: v})} isArea />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input label="Tax / VAT Number" value={data.taxId} onChange={v => setData({...data, taxId: v})} />
            <div className="space-y-2">
              <label className="text-xs font-black uppercase text-slate-400 tracking-widest">Default Currency</label>
              <select className="w-full p-4 bg-slate-50 rounded-2xl border-none outline-none font-bold" value={data.currency} onChange={e => setData({...data, currency: e.target.value})}>
                {CURRENCIES.map(c => <option key={c.code} value={c.code}>{c.name} ({c.symbol})</option>)}
              </select>
            </div>
          </div>
          <Input label="Default Payment Terms" value={data.terms} onChange={v => setData({...data, terms: v})} placeholder="e.g. Net 30" />
          <Input label="Payment Details (Bank Info)" value={data.paymentDetails} onChange={v => setData({...data, paymentDetails: v})} isArea placeholder="Bank Name, Account Number, Swift..." />
        </div>

        <button className="w-full py-5 bg-slate-900 text-white font-black rounded-3xl shadow-xl">Save Business Profile</button>
      </form>
    </div>
  );
};

const Dashboard = ({ profile, docs, onAction, onOpen }: any) => {
  const currency = CURRENCIES.find(c => c.code === profile.currency) || CURRENCIES[0];
  const totalInvoiced = docs.reduce((a, b) => a + b.total, 0);
  const totalPaid = docs.filter(d => d.status === 'Paid').reduce((a, b) => a + b.total, 0);
  const outstanding = totalInvoiced - totalPaid;

  return (
    <div className="p-6 md:p-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Overview</h1>
          <p className="text-slate-500 font-medium">Tracking your business growth.</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <button onClick={() => onAction('create-invoice')} className="flex-1 md:flex-none px-6 py-4 bg-green-500 text-white font-black rounded-2xl shadow-lg shadow-green-500/20 flex items-center justify-center gap-2">
            <Plus size={20}/> New Invoice
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <StatCard label="Total Invoiced" value={formatCurr(totalInvoiced, currency.symbol)} color="bg-blue-500" icon={<FileText className="text-white"/>} />
        <StatCard label="Total Paid" value={formatCurr(totalPaid, currency.symbol)} color="bg-green-500" icon={<CheckCircle2 className="text-white"/>} />
        <StatCard label="Outstanding" value={formatCurr(outstanding, currency.symbol)} color="bg-orange-500" icon={<Clock className="text-white"/>} />
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex justify-between items-center">
          <h3 className="font-black text-lg">Recent Documents</h3>
          <button onClick={() => onAction('history')} className="text-green-600 font-bold text-sm">View All</button>
        </div>
        <div className="divide-y divide-slate-50">
          {docs.slice(-5).reverse().map((doc, i) => (
            <div key={i} onClick={() => onOpen(doc)} className="p-6 hover:bg-slate-50 cursor-pointer transition flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-2xl ${doc.type === 'Invoice' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'}`}>
                  {doc.type === 'Invoice' ? <FileText size={20}/> : <Receipt size={20}/>}
                </div>
                <div>
                  <p className="font-black text-slate-900">{doc.number}</p>
                  <p className="text-xs font-bold text-slate-400">{doc.clientName || "Customer"}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-black text-slate-900">{formatCurr(doc.total, (CURRENCIES.find(c => c.code === doc.currency)?.symbol || '$'))}</p>
                <StatusBadge status={doc.status} />
              </div>
            </div>
          ))}
          {docs.length === 0 && <div className="p-20 text-center text-slate-300 font-bold">No documents created yet</div>}
        </div>
      </div>
    </div>
  );
};

const DocumentBuilder = ({ type, profile, onSave, onBack }: any) => {
  const [doc, setDoc] = useState({
    type,
    number: `${type === 'Invoice' ? 'INV' : 'REC'}-${Math.floor(1000 + Math.random() * 9000)}`,
    date: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
    currency: profile.currency,
    clientName: '',
    clientEmail: '',
    clientAddress: '',
    status: 'Unpaid',
    items: [{ id: 1, desc: '', qty: 1, price: 0 }],
    discount: 0,
    tax: 0,
    notes: profile.terms,
    paymentDetails: profile.paymentDetails
  });

  const currencySymbol = CURRENCIES.find(c => c.code === doc.currency)?.symbol || '$';
  const subtotal = doc.items.reduce((a, b) => a + (b.qty * b.price), 0);
  const taxAmount = subtotal * (doc.tax / 100);
  const total = subtotal - doc.discount + taxAmount;

  return (
    <div className="max-w-4xl mx-auto p-6 md:py-12">
      <div className="flex items-center justify-between mb-10">
        <button onClick={onBack} className="flex items-center gap-2 font-black text-slate-400 uppercase text-xs tracking-widest"><ChevronLeft size={16}/> Back</button>
        <div className="text-right">
          <h2 className="text-3xl font-black text-slate-900">New {type}</h2>
          <p className="text-xs font-bold text-slate-400"># {doc.number}</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Customer & Settings */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
             <h3 className="font-black text-slate-900 border-b border-slate-50 pb-4">Client Details</h3>
             <Input label="Customer Name" value={doc.clientName} onChange={v => setDoc({...doc, clientName: v})} required />
             <Input label="Customer Email" value={doc.clientEmail} onChange={v => setDoc({...doc, clientEmail: v})} />
             <Input label="Customer Address" value={doc.clientAddress} onChange={v => setDoc({...doc, clientAddress: v})} isArea />
          </div>
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
             <h3 className="font-black text-slate-900 border-b border-slate-50 pb-4">Document Meta</h3>
             <Input label="Issue Date" type="date" value={doc.date} onChange={v => setDoc({...doc, date: v})} />
             <Input label="Due Date" type="date" value={doc.dueDate} onChange={v => setDoc({...doc, dueDate: v})} />
             <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Currency</label>
                <select className="w-full p-4 bg-slate-50 rounded-2xl border-none outline-none font-bold" value={doc.currency} onChange={e => setDoc({...doc, currency: e.target.value})}>
                  {CURRENCIES.map(c => <option key={c.code} value={c.code}>{c.code} ({c.symbol})</option>)}
                </select>
             </div>
             <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Status</label>
                <select className="w-full p-4 bg-slate-50 rounded-2xl border-none outline-none font-bold" value={doc.status} onChange={e => setDoc({...doc, status: e.target.value})}>
                  {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
             </div>
          </div>
        </div>

        {/* Items */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
          <h3 className="font-black text-slate-900 border-b border-slate-50 pb-4">Line Items</h3>
          {doc.items.map((item, i) => (
            <div key={item.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end bg-slate-50/50 p-4 rounded-3xl group">
              <div className="md:col-span-6">
                <Input label="Description" value={item.desc} onChange={v => { const n = [...doc.items]; n[i].desc = v; setDoc({...doc, items: n}); }} />
              </div>
              <div className="md:col-span-2">
                <Input label="Qty" type="number" value={item.qty} onChange={v => { const n = [...doc.items]; n[i].qty = Number(v); setDoc({...doc, items: n}); }} />
              </div>
              <div className="md:col-span-3">
                <Input label={`Price (${currencySymbol})`} type="number" value={item.price} onChange={v => { const n = [...doc.items]; n[i].price = Number(v); setDoc({...doc, items: n}); }} />
              </div>
              <div className="md:col-span-1 pb-4 flex justify-center">
                <button onClick={() => setDoc({...doc, items: doc.items.filter(it => it.id !== item.id)})} className="text-slate-300 hover:text-red-500"><Trash2 size={18}/></button>
              </div>
            </div>
          ))}
          <button onClick={() => setDoc({...doc, items: [...doc.items, { id: Date.now(), desc: '', qty: 1, price: 0 }]})} className="w-full py-4 border-2 border-dashed border-slate-200 rounded-3xl text-slate-400 font-black text-sm uppercase tracking-widest">+ Add Item</button>
        </div>

        {/* Totals & Notes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-4">
            <h3 className="font-black text-slate-900 border-b border-slate-50 pb-4">Terms & Details</h3>
            <Input label="Payment Details" value={doc.paymentDetails} onChange={v => setDoc({...doc, paymentDetai
