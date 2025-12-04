
import React, { useState, useEffect } from 'react';
import { Lead } from '../types';
import { MailIcon, MessageSquareIcon, SendIcon, XIcon } from './Icons';

interface CommunicationModalProps {
  lead: Lead;
  onClose: () => void;
  onSend: (type: 'sms' | 'email', content: string) => void;
}

type TemplateType = 'sms' | 'email';

interface Template {
  id: string;
  label: string;
  subject?: string;
  body: string;
}

const SMS_TEMPLATES: Template[] = [
  {
    id: 'sms-intro',
    label: 'Initial Outreach',
    body: "Hi {name}, this is your local agent regarding your {policy} request. Do you have 5 mins to chat about your options?"
  },
  {
    id: 'sms-followup',
    label: 'Follow Up - No Contact',
    body: "Hi {name}, I tried reaching you earlier. When is a good time to go over the {policy} quotes I prepared for you?"
  },
  {
    id: 'sms-appt',
    label: 'Appointment Confirm',
    body: "Hi {name}, confirming our call for tomorrow at [Time] to discuss your coverage. Please reply C to confirm."
  }
];

const EMAIL_TEMPLATES: Template[] = [
  {
    id: 'email-intro',
    label: 'Information Request',
    subject: "Your {policy} Information Request",
    body: "Hi {name},\n\nThank you for your interest in {policy}. I have reviewed your preliminary information and have found a few options that fit your criteria.\n\nAre you available for a brief 10-minute call this week to review them?\n\nBest,\n[Agent Name]"
  },
  {
    id: 'email-quote',
    label: 'Quote Details',
    subject: "{policy} Quote Options",
    body: "Dear {name},\n\nAs promised, here is a summary of the {policy} benefits we discussed. These plans provide the security your family needs.\n\nLet me know when you'd like to move forward with the application.\n\nSincerely,\n[Agent Name]"
  }
];

export const CommunicationModal: React.FC<CommunicationModalProps> = ({ lead, onClose, onSend }) => {
  const [activeTab, setActiveTab] = useState<TemplateType>('sms');
  const [message, setMessage] = useState('');
  const [subject, setSubject] = useState('');
  const [isSending, setIsSending] = useState(false);

  // Helper to personalize templates
  const personalize = (text: string) => {
    return text
      .replace(/{name}/g, lead.name.split(' ')[0])
      .replace(/{policy}/g, lead.policyInterest);
  };

  const handleTemplateSelect = (templateId: string) => {
    const templates = activeTab === 'sms' ? SMS_TEMPLATES : EMAIL_TEMPLATES;
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setMessage(personalize(template.body));
      if (activeTab === 'email' && template.subject) {
        setSubject(personalize(template.subject));
      }
    }
  };

  const handleSend = async () => {
    setIsSending(true);
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    onSend(activeTab, activeTab === 'email' ? `Subject: ${subject}\n\n${message}` : message);
    setIsSending(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-lg rounded-xl shadow-2xl flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-800">
          <div>
            <h3 className="text-lg font-bold text-white">Contact {lead.name}</h3>
            <p className="text-xs text-slate-400">Via {activeTab === 'sms' ? lead.phone : lead.email}</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition">
            <XIcon />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-800">
          <button 
            onClick={() => setActiveTab('sms')}
            className={`flex-1 py-3 flex items-center justify-center gap-2 text-sm font-medium transition ${activeTab === 'sms' ? 'text-gold-500 bg-slate-800/50 border-b-2 border-gold-500' : 'text-slate-400 hover:bg-slate-800'}`}
          >
            <MessageSquareIcon /> SMS
          </button>
          <button 
            onClick={() => setActiveTab('email')}
            className={`flex-1 py-3 flex items-center justify-center gap-2 text-sm font-medium transition ${activeTab === 'email' ? 'text-gold-500 bg-slate-800/50 border-b-2 border-gold-500' : 'text-slate-400 hover:bg-slate-800'}`}
          >
            <MailIcon /> Email
          </button>
        </div>

        {/* Content */}
        <div className="p-6 flex-1 overflow-y-auto">
          
          {/* Templates */}
          <div className="mb-4">
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Quick Templates</label>
            <div className="flex flex-wrap gap-2">
              {(activeTab === 'sms' ? SMS_TEMPLATES : EMAIL_TEMPLATES).map(t => (
                <button
                  key={t.id}
                  onClick={() => handleTemplateSelect(t.id)}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs px-3 py-1.5 rounded-full border border-slate-700 transition"
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Email Subject */}
          {activeTab === 'email' && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-300 mb-1">Subject</label>
              <input 
                value={subject} 
                onChange={(e) => setSubject(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white focus:ring-1 focus:ring-gold-500 focus:border-gold-500 outline-none"
                placeholder="Email Subject..."
              />
            </div>
          )}

          {/* Message Body */}
          <div>
             <label className="block text-sm font-medium text-slate-300 mb-1">Message</label>
             <textarea
               value={message}
               onChange={(e) => setMessage(e.target.value)}
               className="w-full h-40 bg-slate-950 border border-slate-700 rounded-lg p-3 text-white focus:ring-1 focus:ring-gold-500 focus:border-gold-500 outline-none resize-none"
               placeholder={activeTab === 'sms' ? "Type your SMS message..." : "Type your email body..."}
             />
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-800/50 flex justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm font-medium text-slate-300 hover:bg-slate-700 transition"
          >
            Cancel
          </button>
          <button 
            onClick={handleSend}
            disabled={!message || isSending}
            className="bg-gold-500 hover:bg-gold-600 disabled:opacity-50 disabled:cursor-not-allowed text-black px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition"
          >
            {isSending ? "Sending..." : "Send Message"} <SendIcon />
          </button>
        </div>

      </div>
    </div>
  );
};
