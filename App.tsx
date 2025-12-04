import React, { useState } from 'react';
import { Lead, LeadStatus, PolicyType, ViewState } from './types';
import { Dashboard } from './components/Dashboard';
import { ScriptGenerator } from './components/ScriptGenerator';
import { LeadManager } from './components/LeadManager';
import { SOPLibrary } from './components/SOPLibrary';
import { LeadFinder } from './components/LeadFinder';
import { DashboardIcon, LeadsIcon, ScriptIcon, SOPIcon, RadarIcon } from './components/Icons';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>('dashboard');
  
  // Initial Mock Data
  const [leads, setLeads] = useState<Lead[]>([
    {
      id: '1',
      name: 'Robert Martinez',
      phone: '512-555-0123',
      email: 'robert.m@example.com',
      status: LeadStatus.NEW,
      policyInterest: PolicyType.MORTGAGE_PROTECTION,
      estimatedCommission: 3500,
      notes: 'New homeowner, closed 2 weeks ago. 35yo male, non-smoker.',
    },
    {
      id: '2',
      name: 'Sarah Jenkins',
      phone: '512-555-0198',
      email: 's.jenkins@example.com',
      status: LeadStatus.NEGOTIATION,
      policyInterest: PolicyType.WHOLE_LIFE,
      estimatedCommission: 12000,
      notes: 'Interested in Infinite Banking concept for small business liquidity.',
    },
    {
      id: '3',
      name: 'Michael Chang',
      phone: '415-555-0876',
      email: 'mchang@example.com',
      status: LeadStatus.APPOINTMENT,
      policyInterest: PolicyType.TERM_LIFE,
      estimatedCommission: 1500,
      notes: 'Looking for basic coverage, cost sensitive.',
    },
    {
      id: '4',
      name: 'Emma Wilson',
      phone: '210-555-3421',
      email: 'emma.w@example.com',
      status: LeadStatus.CLOSED_WON,
      policyInterest: PolicyType.MORTGAGE_PROTECTION,
      estimatedCommission: 4200,
      notes: 'Sold full return of premium rider.',
    }
  ]);

  const addLead = (newLead: Lead) => {
    setLeads([...leads, newLead]);
  };

  const updateLeadStatus = (id: string, status: LeadStatus) => {
    setLeads(leads.map(lead => 
      lead.id === id ? { ...lead, status } : lead
    ));
  };

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard leads={leads} />;
      case 'finder':
        return <LeadFinder onAddLead={addLead} />;
      case 'leads':
        return <LeadManager leads={leads} updateLeadStatus={updateLeadStatus} />;
      case 'script-gen':
        return <ScriptGenerator leads={leads} />;
      case 'sop':
        return <SOPLibrary />;
      default:
        return <Dashboard leads={leads} />;
    }
  };

  const NavButton = ({ view, icon, label }: { view: ViewState; icon: React.ReactNode; label: string }) => (
    <button
      onClick={() => setCurrentView(view)}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
        currentView === view 
          ? 'bg-gradient-to-r from-gold-500 to-gold-600 text-slate-900 font-bold shadow-lg shadow-gold-500/20' 
          : 'text-slate-400 hover:bg-slate-800 hover:text-white'
      }`}
    >
      <div className={currentView === view ? 'text-slate-900' : 'text-slate-400'}>
        {icon}
      </div>
      <span>{label}</span>
    </button>
  );

  return (
    <div className="flex h-screen bg-slate-950 text-white font-sans overflow-hidden">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col hidden md:flex">
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gold-500 rounded-lg flex items-center justify-center font-bold text-slate-900">
              IF
            </div>
            <h1 className="text-xl font-bold tracking-tight text-white">
              InsureFlow <span className="text-gold-500">AI</span>
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-2">Agent Command Center v2.0</p>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <NavButton view="dashboard" icon={<DashboardIcon />} label="Dashboard" />
          <NavButton view="finder" icon={<RadarIcon />} label="Lead Finder" />
          <NavButton view="leads" icon={<LeadsIcon />} label="My Pipeline" />
          <NavButton view="script-gen" icon={<ScriptIcon />} label="Script Generator" />
          <NavButton view="sop" icon={<SOPIcon />} label="SOP Library" />
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="bg-slate-800 rounded-lg p-4">
            <p className="text-xs text-slate-400 mb-1">Monthly Goal</p>
            <div className="flex justify-between items-end mb-2">
              <span className="text-sm font-bold text-white">$21,200</span>
              <span className="text-xs text-gold-500">84%</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-1.5">
              <div className="bg-gold-500 h-1.5 rounded-full" style={{ width: '84%' }}></div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-16 bg-slate-900/50 backdrop-blur-sm border-b border-slate-800 flex items-center justify-between px-6 md:px-8">
          <div className="md:hidden flex items-center gap-2">
            {/* Mobile Menu Placeholder */}
            <span className="text-gold-500 font-bold">InsureFlow AI</span>
          </div>
          
          <h2 className="text-lg font-semibold text-slate-200 capitalize hidden md:block">
            {currentView === 'script-gen' ? 'AI Script Generator' : currentView.replace('-', ' ')}
          </h2>

          <div className="flex items-center gap-4">
             <div className="flex items-center gap-2 text-sm text-slate-400">
               <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
               System Online
             </div>
             <div className="w-8 h-8 rounded-full bg-slate-700 border border-slate-600 flex items-center justify-center text-xs font-bold text-slate-300">
               AG
             </div>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-4 md:p-8 bg-slate-950">
          <div className="max-w-7xl mx-auto h-full">
            {renderContent()}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;