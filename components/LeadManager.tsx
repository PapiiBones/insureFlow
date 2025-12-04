
import React, { useState } from 'react';
import { Lead, LeadStatus, PolicyType } from '../types';
import { CommunicationModal } from './CommunicationModal';
import { MessageSquareIcon } from './Icons';

interface LeadManagerProps {
  leads: Lead[];
  updateLead: (id: string, updates: Partial<Lead>) => void;
}

export const LeadManager: React.FC<LeadManagerProps> = ({ leads, updateLead }) => {
  const [selectedLeadForComm, setSelectedLeadForComm] = useState<Lead | null>(null);
  
  const getStatusColor = (status: LeadStatus) => {
    switch (status) {
      case LeadStatus.NEW: return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
      case LeadStatus.CONTACTED: return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      case LeadStatus.APPOINTMENT: return 'bg-purple-500/20 text-purple-400 border-purple-500/50';
      case LeadStatus.CLOSED_WON: return 'bg-green-500/20 text-green-400 border-green-500/50';
      case LeadStatus.CLOSED_LOST: return 'bg-red-500/20 text-red-400 border-red-500/50';
      default: return 'bg-slate-500/20 text-slate-400';
    }
  };

  const handleSendMessage = (type: 'sms' | 'email', content: string) => {
    if (selectedLeadForComm) {
      // In a real app, this would call an API
      console.log(`Sending ${type} to ${selectedLeadForComm.name}:`, content);
      
      // Update last contacted
      updateLead(selectedLeadForComm.id, {
        lastContacted: new Date().toISOString(),
        status: selectedLeadForComm.status === LeadStatus.NEW ? LeadStatus.CONTACTED : selectedLeadForComm.status
      });

      alert(`${type.toUpperCase()} sent successfully to ${selectedLeadForComm.name}!`);
    }
  };

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden shadow-lg h-full flex flex-col">
      <div className="p-6 border-b border-slate-700 flex justify-between items-center">
        <h2 className="text-xl font-bold text-white">Active Leads</h2>
        <button className="bg-gold-500 hover:bg-gold-600 text-black px-4 py-2 rounded-lg text-sm font-semibold transition shadow-lg shadow-gold-500/20">
          + Add New Lead
        </button>
      </div>
      
      <div className="overflow-auto flex-1 custom-scrollbar">
        <table className="w-full text-left">
          <thead className="sticky top-0 bg-slate-900 z-10 shadow-sm">
            <tr className="text-slate-400 text-sm border-b border-slate-700">
              <th className="px-6 py-4 font-medium">Prospect Name</th>
              <th className="px-6 py-4 font-medium">Policy Interest</th>
              <th className="px-6 py-4 font-medium">Last Contact</th>
              <th className="px-6 py-4 font-medium">Potential Comm.</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {leads.map((lead) => (
              <tr key={lead.id} className="hover:bg-slate-700/30 transition group">
                <td className="px-6 py-4">
                  <div className="font-medium text-white">{lead.name}</div>
                  <div className="text-xs text-slate-500">{lead.phone}</div>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                    ${lead.policyInterest === PolicyType.WHOLE_LIFE ? 'bg-indigo-900 text-indigo-200' : 'bg-slate-700 text-slate-300'}`}>
                    {lead.policyInterest}
                  </span>
                </td>
                <td className="px-6 py-4 text-slate-400 text-sm">
                   {lead.lastContacted ? (
                     new Date(lead.lastContacted).toLocaleDateString()
                   ) : (
                     <span className="text-slate-600 italic">Never</span>
                   )}
                </td>
                <td className="px-6 py-4 text-emerald-400 font-mono">
                  ${lead.estimatedCommission.toLocaleString()}
                </td>
                <td className="px-6 py-4">
                  <select 
                    value={lead.status}
                    onChange={(e) => updateLead(lead.id, { status: e.target.value as LeadStatus })}
                    className={`text-xs font-semibold px-3 py-1 rounded-full border appearance-none cursor-pointer outline-none ${getStatusColor(lead.status)}`}
                  >
                    {Object.values(LeadStatus).map(s => (
                      <option key={s} value={s} className="bg-slate-800 text-slate-200">{s}</option>
                    ))}
                  </select>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => setSelectedLeadForComm(lead)}
                      className="p-2 bg-slate-700 hover:bg-gold-500 hover:text-black text-slate-300 rounded-lg transition"
                      title="Send Message"
                    >
                      <MessageSquareIcon />
                    </button>
                    <button className="text-sm text-slate-400 hover:text-white font-medium px-3 py-2">
                      Details
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedLeadForComm && (
        <CommunicationModal 
          lead={selectedLeadForComm} 
          onClose={() => setSelectedLeadForComm(null)}
          onSend={handleSendMessage}
        />
      )}
    </div>
  );
};
