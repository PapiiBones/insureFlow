
import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { generateSalesScript } from '../services/geminiService';
import { Lead, PolicyType } from '../types';
import { LoadingSpinner, SendIcon, ScriptIcon } from './Icons';

interface ScriptGeneratorProps {
  leads: Lead[];
}

const TONE_OPTIONS = [
  'Confident & Authoritative (Wolf of Wall Street)',
  'Empathetic & Understanding',
  'Consultative & Educational',
  'Urgent & Action-Oriented',
  'Relaxed & Relatable'
];

const PERSONA_OPTIONS = [
  'Elite 1% Closer (High Pressure)',
  'Trusted Family Advisor (Warm & Safe)',
  'Data-Driven Analyst (Logical)',
  'New Agent (Humble & Hungry)',
  'Tech-Savvy Millennial (Modern & Quick)'
];

export const ScriptGenerator: React.FC<ScriptGeneratorProps> = ({ leads }) => {
  const [selectedLeadId, setSelectedLeadId] = useState<string>('');
  const [customContext, setCustomContext] = useState('');
  const [objection, setObjection] = useState('');
  const [tone, setTone] = useState(TONE_OPTIONS[0]);
  const [persona, setPersona] = useState(PERSONA_OPTIONS[0]);
  const [generatedScript, setGeneratedScript] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = async () => {
    // Validate selection or context
    const lead = leads.find(l => l.id === selectedLeadId);
    
    setIsLoading(true);
    const leadName = lead ? lead.name : "Prospect";
    const policy = lead ? lead.policyInterest : PolicyType.WHOLE_LIFE;
    
    const script = await generateSalesScript(
      leadName,
      policy,
      customContext || "Standard cold outbound call or lead response.",
      tone,
      persona,
      objection
    );
    
    setGeneratedScript(script);
    setIsLoading(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-140px)]">
      {/* Control Panel */}
      <div className="lg:col-span-1 bg-slate-800 border border-slate-700 rounded-xl p-6 flex flex-col gap-6 overflow-y-auto">
        <div>
          <h2 className="text-xl font-bold text-white mb-2">AI Script Director</h2>
          <p className="text-slate-400 text-sm">Generate high-tonality scripts tailored to your specific prospect.</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Select Active Lead</label>
            <select 
              value={selectedLeadId}
              onChange={(e) => setSelectedLeadId(e.target.value)}
              className="w-full bg-slate-900 border border-slate-600 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-gold-500 focus:border-transparent outline-none transition"
            >
              <option value="">-- Generic / Training --</option>
              {leads.map(lead => (
                <option key={lead.id} value={lead.id}>
                  {lead.name} - {lead.policyInterest}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Agent Persona</label>
              <select 
                value={persona}
                onChange={(e) => setPersona(e.target.value)}
                className="w-full bg-slate-900 border border-slate-600 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-gold-500 focus:border-transparent outline-none transition"
              >
                {PERSONA_OPTIONS.map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Sales Tonality</label>
              <select 
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="w-full bg-slate-900 border border-slate-600 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-gold-500 focus:border-transparent outline-none transition"
              >
                {TONE_OPTIONS.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Scenario / Context</label>
            <textarea 
              value={customContext}
              onChange={(e) => setCustomContext(e.target.value)}
              placeholder="e.g. Lead submitted a Facebook form yesterday about mortgage protection..."
              className="w-full h-24 bg-slate-900 border border-slate-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-gold-500 focus:border-transparent outline-none resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-red-400 mb-1">Objection Handling (Optional)</label>
            <input 
              type="text"
              value={objection}
              onChange={(e) => setObjection(e.target.value)}
              placeholder='e.g. "I need to talk to my spouse" or "Too expensive"'
              className="w-full bg-slate-900 border border-red-900/50 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
            />
          </div>

          <button
            onClick={handleGenerate}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-black font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-all shadow-lg shadow-gold-900/20"
          >
            {isLoading ? <LoadingSpinner /> : <SendIcon />}
            {isLoading ? "Generating Strategy..." : "Generate Script"}
          </button>
        </div>

        <div className="mt-auto pt-6 border-t border-slate-700">
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Pro Tips</h4>
            <ul className="text-xs text-slate-400 space-y-2 list-disc pl-4">
                <li>Maintain a downward inflection at end of sentences.</li>
                <li>Silence is a tool. Use it after asking for the sale.</li>
                <li>"Infinite Banking" allows them to become their own bank.</li>
            </ul>
        </div>
      </div>

      {/* Output Panel */}
      <div className="lg:col-span-2 bg-slate-800 border border-slate-700 rounded-xl p-8 overflow-y-auto shadow-inner bg-opacity-50">
        {generatedScript ? (
          <div className="prose prose-invert prose-p:text-slate-300 prose-headings:text-gold-500 max-w-none">
            <ReactMarkdown>{generatedScript}</ReactMarkdown>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-slate-500 opacity-50">
            <ScriptIcon />
            <p className="mt-4 text-lg">Ready to close? Configure the AI to start.</p>
          </div>
        )}
      </div>
    </div>
  );
};
