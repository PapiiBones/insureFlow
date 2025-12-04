import React from 'react';
import { Lead, LeadStatus, PolicyType } from '../types';

interface LeadManagerProps {
  leads: Lead[];
  updateLeadStatus: (id: string, status: LeadStatus) => void;
}

export const LeadManager: React.FC<LeadManagerProps> = ({ leads, updateLeadStatus }) => {
  
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

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden shadow-lg">
      <div className="p-6 border-b border-slate-700 flex justify-between items-center">
        <h2 className="text-xl font-bold text-white">Active Leads</h2>
        <button className="bg-gold-500 hover:bg-gold-600 text-black px-4 py-2 rounded-lg text-sm font-semibold transition">
          + Add New Lead
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-900/50 text-slate-400 text-sm">
              <th className="px-6 py-4 font-medium">Prospect Name</th>
              <th className="px-6 py-4 font-medium">Policy Interest</th>
              <th className="px-6 py-4 font-medium">Potential Comm.</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {leads.map((lead) => (
              <tr key={lead.id} className="hover:bg-slate-700/30 transition">
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
                <td className="px-6 py-4 text-emerald-400 font-mono">
                  ${lead.estimatedCommission.toLocaleString()}
                </td>
                <td className="px-6 py-4">
                  <select 
                    value={lead.status}
                    onChange={(e) => updateLeadStatus(lead.id, e.target.value as LeadStatus)}
                    className={`text-xs font-semibold px-3 py-1 rounded-full border appearance-none cursor-pointer outline-none ${getStatusColor(lead.status)}`}
                  >
                    {Object.values(LeadStatus).map(s => (
                      <option key={s} value={s} className="bg-slate-800 text-slate-200">{s}</option>
                    ))}
                  </select>
                </td>
                <td className="px-6 py-4">
                  <button className="text-sm text-gold-500 hover:text-gold-400 font-medium">
                    Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};