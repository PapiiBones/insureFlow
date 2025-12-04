
import React, { useState } from 'react';
import { Lead, LeadStatus, PolicyType } from '../types';
import { findPotentialLeads } from '../services/geminiService';
import { LoadingSpinner, RadarIcon, UserPlusIcon } from './Icons';

interface LeadFinderProps {
  onAddLead: (lead: Lead) => void;
}

export const LeadFinder: React.FC<LeadFinderProps> = ({ onAddLead }) => {
  const [city, setCity] = useState('');
  const [policyType, setPolicyType] = useState<PolicyType>(PolicyType.MORTGAGE_PROTECTION);
  const [isScanning, setIsScanning] = useState(false);
  const [foundLeads, setFoundLeads] = useState<Partial<Lead>[]>([]);
  const [addedLeadIds, setAddedLeadIds] = useState<Set<string>>(new Set());

  const handleScan = async () => {
    if (!city) return;
    setIsScanning(true);
    setFoundLeads([]);
    
    // Simulate network delay for "scanning" effect
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const results = await findPotentialLeads(city, policyType);
    setFoundLeads(results);
    setIsScanning(false);
  };

  const handleAdd = (lead: Partial<Lead>, index: number) => {
    const newLead: Lead = {
      id: Date.now().toString() + index,
      name: lead.name || 'Unknown',
      phone: lead.phone || '',
      email: lead.email || '',
      status: LeadStatus.NEW,
      policyInterest: policyType,
      estimatedCommission: lead.estimatedCommission || 1000,
      notes: `Source: Auto-Finder (${city}). ${lead.notes}`,
      history: []
    };
    
    onAddLead(newLead);
    const newSet = new Set(addedLeadIds);
    newSet.add(index.toString());
    setAddedLeadIds(newSet);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-140px)]">
      {/* Control Panel */}
      <div className="lg:col-span-1 bg-slate-800 border border-slate-700 rounded-xl p-6 flex flex-col gap-6">
        <div>
          <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
            <RadarIcon />
            Lead Scout AI
          </h2>
          <p className="text-slate-400 text-sm">
            Scan public records and demographic data to identify high-intent prospects in your target market.
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Target Market (City, State)</label>
            <input 
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="e.g. Austin, TX"
              className="w-full bg-slate-900 border border-slate-600 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-gold-500 focus:border-transparent outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Lead Type</label>
            <select 
              value={policyType}
              onChange={(e) => setPolicyType(e.target.value as PolicyType)}
              className="w-full bg-slate-900 border border-slate-600 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-gold-500 focus:border-transparent outline-none"
            >
              {Object.values(PolicyType).map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <button
            onClick={handleScan}
            disabled={isScanning || !city}
            className={`w-full font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-all shadow-lg
              ${isScanning || !city 
                ? 'bg-slate-700 text-slate-400 cursor-not-allowed' 
                : 'bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-black shadow-gold-900/20'}`
            }
          >
            {isScanning ? <LoadingSpinner /> : <RadarIcon />}
            {isScanning ? "Scanning Records..." : "Scan Market"}
          </button>
        </div>

        <div className="mt-auto pt-6 border-t border-slate-700">
           <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
             <h4 className="text-xs font-bold text-blue-400 uppercase mb-1">Scale Tip</h4>
             <p className="text-xs text-slate-400">Reinvest 20% of commissions into lead generation to create a flywheel effect.</p>
           </div>
        </div>
      </div>

      {/* Results Panel */}
      <div className="lg:col-span-2 bg-slate-800 border border-slate-700 rounded-xl p-6 overflow-y-auto">
        <h3 className="text-lg font-bold text-white mb-6">Scan Results</h3>
        
        {isScanning ? (
          <div className="flex flex-col items-center justify-center h-64 space-y-4">
             <div className="relative">
               <div className="w-16 h-16 border-4 border-gold-500/30 border-t-gold-500 rounded-full animate-spin"></div>
               <div className="absolute inset-0 flex items-center justify-center">
                 <RadarIcon />
               </div>
             </div>
             <div className="text-center space-y-1">
               <p className="text-white font-medium">Analyzing Demographics...</p>
               <p className="text-sm text-slate-500">Filtering for homeowner data and income qualification.</p>
             </div>
          </div>
        ) : foundLeads.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {foundLeads.map((lead, index) => {
              const isAdded = addedLeadIds.has(index.toString());
              return (
                <div key={index} className="bg-slate-900 border border-slate-700 rounded-lg p-5 hover:border-slate-500 transition-colors flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h4 className="text-lg font-semibold text-white">{lead.name}</h4>
                      <span className="text-xs bg-slate-700 text-slate-300 px-2 py-0.5 rounded-full">{policyType}</span>
                    </div>
                    <div className="text-sm text-slate-400 mb-2 flex gap-4">
                      <span>{lead.phone}</span>
                      <span>{lead.email}</span>
                    </div>
                    <p className="text-sm text-emerald-400/90 italic">"{lead.notes}"</p>
                  </div>
                  
                  <div className="flex flex-col items-end gap-2 min-w-[140px]">
                    <span className="text-lg font-bold text-gold-500">${lead.estimatedCommission?.toLocaleString()}</span>
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider">Est. Commission</span>
                    <button
                      onClick={() => handleAdd(lead, index)}
                      disabled={isAdded}
                      className={`mt-2 flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all
                        ${isAdded 
                          ? 'bg-green-500/20 text-green-500 cursor-default' 
                          : 'bg-gold-500 hover:bg-gold-600 text-black'}`
                      }
                    >
                      {isAdded ? (
                        <>In Pipeline</>
                      ) : (
                        <>
                          <UserPlusIcon /> Add Lead
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
           <div className="h-full flex flex-col items-center justify-center text-slate-500 opacity-50 min-h-[300px]">
             <RadarIcon />
             <p className="mt-4 text-lg">No scan data available. Start a new search.</p>
           </div>
        )}
      </div>
    </div>
  );
};