
import React, { useState, useEffect } from 'react';
import { Lead, LeadStatus, Interaction } from '../types';
import { PhoneOutgoingIcon, XIcon, CalendarIcon, CheckCircleIcon } from './Icons';

interface CallLogModalProps {
  lead: Lead;
  onClose: () => void;
  onSave: (interaction: Interaction, newStatus: LeadStatus, nextFollowUp?: string) => void;
}

const OUTCOMES = [
  'No Answer',
  'Left Voicemail',
  'Gatekeeper',
  'Spoke with Lead',
  'Appointment Set',
  'Objection: Price',
  'Objection: Timing',
  'Not Interested'
];

export const CallLogModal: React.FC<CallLogModalProps> = ({ lead, onClose, onSave }) => {
  const [outcome, setOutcome] = useState(OUTCOMES[0]);
  const [duration, setDuration] = useState('00:00');
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState<LeadStatus>(lead.status);
  const [followUpDate, setFollowUpDate] = useState('');

  // Auto-suggest status based on outcome
  useEffect(() => {
    if (outcome === 'Appointment Set') {
      setStatus(LeadStatus.APPOINTMENT);
    } else if (outcome === 'Not Interested') {
      setStatus(LeadStatus.CLOSED_LOST);
    } else if (outcome === 'Spoke with Lead' && lead.status === LeadStatus.NEW) {
      setStatus(LeadStatus.CONTACTED);
    }
  }, [outcome, lead.status]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const interaction: Interaction = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      type: 'Call',
      outcome,
      notes,
      duration
    };

    onSave(interaction, status, followUpDate);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-lg rounded-xl shadow-2xl overflow-hidden">
        
        <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
              <PhoneOutgoingIcon />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Log Call</h3>
              <p className="text-xs text-slate-400">With {lead.name}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition">
            <XIcon />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Outcome</label>
              <select 
                value={outcome}
                onChange={(e) => setOutcome(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white focus:ring-1 focus:ring-gold-500 outline-none"
              >
                {OUTCOMES.map(o => (
                  <option key={o} value={o}>{o}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Duration (mm:ss)</label>
              <input 
                type="text" 
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white focus:ring-1 focus:ring-gold-500 outline-none"
                placeholder="00:00"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Call Notes</label>
            <textarea 
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full h-24 bg-slate-950 border border-slate-700 rounded-lg p-3 text-white focus:ring-1 focus:ring-gold-500 outline-none resize-none"
              placeholder="Key discussion points, objections, personal details..."
              required
            />
          </div>

          <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700/50 space-y-4">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
              <CheckCircleIcon /> Next Steps
            </h4>
            
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Update Status</label>
              <select 
                value={status}
                onChange={(e) => setStatus(e.target.value as LeadStatus)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white focus:ring-1 focus:ring-gold-500 outline-none"
              >
                {Object.values(LeadStatus).map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1 flex justify-between">
                <span>Schedule Follow-Up</span>
                <span className="text-xs text-slate-500 font-normal">Optional</span>
              </label>
              <div className="relative">
                <input 
                  type="datetime-local"
                  value={followUpDate}
                  onChange={(e) => setFollowUpDate(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white focus:ring-1 focus:ring-gold-500 outline-none"
                  style={{ colorScheme: 'dark' }}
                />
              </div>
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-3">
            <button 
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-sm font-medium text-slate-300 hover:bg-slate-700 transition"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="bg-gold-500 hover:bg-gold-600 text-black px-6 py-2 rounded-lg text-sm font-bold shadow-lg shadow-gold-500/10 transition"
            >
              Save Log
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
