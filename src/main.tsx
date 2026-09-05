
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { 
  Zap, Plus, FileText, Receipt, Users, Package, Settings as SettingsIcon, 
  TrendingUp, CheckCircle, AlertCircle, ChevronLeft, Eye, Edit3, 
  Save, Download, Printer, Trash2, Search, Filter, Mail, Phone, MapPin, Check, Menu, X
} from 'lucide-react';

/* --- TYPES --- */
interface BusinessProfile {
  name: string; logo: string; phone: string; email: string; 
  address: string; website: string; currency: string; taxRate: string;
}

/* --- COMPONENTS --- */

const LandingPage = ({ onGetStarted }: any) => (
  <div className="min-h-screen bg-white text-slate-900">
    <nav className="flex items-center justify-between px-6 py-6 max-w-7xl mx-auto">
      <div className="flex items-center gap-2">
        <div className="bg-slate-900 text-white p-1.5 rounded-lg"><Zap size={24} fill="currentColor" /></div>
        <span className="text-xl font-bold">APA BizDesk</span>
      </div>
      <button onClick={onGetStarted} className="px-5 py-2 bg-slate-900 text-white rounded-lg font-bold text-sm">Login</button>
    </nav>
    <header className="px-6 pt-12 pb-20 text-center">
      <h1 className="text-4xl md:text-6xl font-black mb-6">Professional Invoices. <span className="text-green-500">Made Simple.</span></h1>
      <p className="text-lg text-slate-500 mb-8 max-w-xl mx-auto">Create professional invoices and receipts for your business in minutes — directly from your phone.</p>
      <button onClick={onGetStarted} className="px-8 py-4 bg-green-500 text-white font-bold rounded-xl shadow-lg shadow-green-100">Get Started Free</button>
    </header>
  </div>
);

const Onboarding = ({ onComplete }: any) => {
  const [profile, setProfile] = useState({ name: '', phone: '', email: '', address: '', currency: 'NGN', taxRate: '7.5' });
  return (
    <div className="max-w-xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Setup Your Business</h2>
      <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); onComplete(profile); }}>
        <input required className="w-full p-4 border rounded-xl" placeholder="Business Name" onChange={e => setProfile({...profile, name: e.target.value})} />
        <input required className="w-full p-4 border rounded-xl" placeholder="Email" type="email" onChange={e => setProfile({...profile, email: e.target.value})} />
        <input required className="w-full p-4 border rounded-xl" placeholder="Phone" onChange={e => setProfile({...profile, phone: e.target.value})} />
        <textarea required className="w-full p-4 border rounded-xl" placeholder="Address" onChange={e => setProfile({...profile, address: e.target.value})} />
        <button className="w-full py-4 bg-slate-900 text-white font-bold rounded-xl">Save & Continue</button>
      </form>
    </div>
  );
};

const Dashboard = ({ businessName, onAction }: any) => (
  <div className="p-6">
    <h1 className="text-2xl font-bold mb-2">Good morning, {businessName}</h1>
    <p className="text-slate-500 mb-8">Manage your documents below.</p>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
      <button onClick={() => onAction('create-invoice')} className="p-6 bg-green-500 text-white rounded-2xl font-bold flex items-center gap-3"><Plus /> Create Invoice</button>
      <button onClick={() => onAction('create-receipt')} className="p-6 bg-slate-900 text-white rounded-2xl font-bold flex items-center gap-3"><Plus /> Create Receipt</button>
    </div>
    <div className="bg-white border rounded-2xl p-6">
      <h3 className="font-bold mb-4">Recent Documents</h3>
      <p className="text-slate-400 text-sm">No documents found yet.</p>
    </div>
  </div>
);

const InvoiceBuilder = ({ profile, onBack }: any) => {
  const [items, setItems] = useState([{ id: 1, desc: '', qty: 1, price: 0 }]);
  const subtotal = items.reduce((a, b) => a + (b.qty * b.price), 0);
  return (
    <div className="min-h-screen bg-slate-50 p-4">
      <button onClick={onBack} className="mb-4 flex items-center gap-2"><ChevronLeft /> Back</button>
      <div className="bg-white p-6 rounded-2xl shadow-sm space-y-4">
        <h2 className="font-bold text-xl">New Invoice</h2>
        {items.map((item, i) => (
          <div key={item.id} className="p-4 bg-slate-50 rounded-xl space-y-2">
            <input className="w-full bg-transparent border-b font-bold" placeholder="Description" onChange={e => {
              const newItems = [...items]; newItems[i].desc = e.target.value; setItems(newItems);
            }} />
            <div className="flex gap-4">
              <input type="number" className="w-20 bg-transparent border-b" placeholder="Qty" onChange={e => {
                const newItems = [...items]; newItems[i].qty = Number(e.target.value); setItems(newItems);
              }} />
              <input type="number" className="flex-1 bg-transparent border-b" placeholder="Price" onChange={e => {
                const newItems = [...items]; newItems[i].price = Number(e.target.value); setItems(newItems);
              }} />
            </div>
          </div>
        ))}
        <div className="pt-4 border-t flex justify-between font-bold">
          <span>Total</span>
          <span className="text-green-600">₦{subtotal.toLocaleString()}</span>
        </div>
        <button className="w-full py-4 bg-green-500 text-white font-bold rounded-xl">Save & Preview</button>
      </div>
    </div>
  );
};

/* --- MAIN APP ENGINE --- */

const App = () => {
  const [view, setView] = useState('landing');
  const [profile, setProfile] = useState<BusinessProfile | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('apa_biz_profile');
    if (saved) { setProfile(JSON.parse(saved)); setView('dashboard'); }
  }, []);

  const handleOnboarding = (data: BusinessProfile) => {
    setProfile(data);
    localStorage.setItem('apa_biz_profile', JSON.stringify(data));
    setView('dashboard');
  };

  if (view === 'landing') return <LandingPage onGetStarted={() => setView('onboarding')} />;
  if (view === 'onboarding') return <Onboarding onComplete={handleOnboarding} />;

  return (
    <div className="min-h-screen bg-white flex flex-col md:flex-row">
      <aside className="hidden md:flex w-64 bg-slate-900 text-white flex-col p-6">
        <div className="font-bold text-xl mb-10">APA BizDesk</div>
        <nav className="space-y-4 flex-1">
          <button onClick={() => setView('dashboard')} className="flex items-center gap-3 w-full opacity-70 hover:opacity-100"><TrendingUp /> Dashboard</button>
          <button className="flex items-center gap-3 w-full opacity-70 hover:opacity-100"><FileText /> History</button>
          <button className="flex items-center gap-3 w-full opacity-70 hover:opacity-100"><Users /> Customers</button>
        </nav>
      </aside>

      <main className="flex-1 pb-20">
        {view === 'dashboard' && <Dashboard businessName={profile?.name} onAction={setView} />}
        {view === 'create-invoice' && <InvoiceBuilder profile={profile} onBack={() => setView('dashboard')} />}
      </main>

      {/* Mobile Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around p-4">
        <button onClick={() => setView('dashboard')}><TrendingUp /></button>
        <button onClick={() => setView('create-invoice')} className="bg-green-500 text-white p-3 rounded-full -mt-8 shadow-lg"><Plus /></button>
        <button><SettingsIcon /></button>
      </nav>
    </div>
  );
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode><App /></React.StrictMode>
);
