import React, { useState } from 'react';
import { generateSOPContent } from '../services/geminiService';
import { LoadingSpinner, SOPIcon } from './Icons';
import ReactMarkdown from 'react-markdown';

export const SOPLibrary: React.FC = () => {
  const [activeSOP, setActiveSOP] = useState<string | null>(null);
  const [generatedContent, setGeneratedContent] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const staticSOPs = [
    { id: '1', title: 'Infinite Banking Concept Explained', topic: 'explaining the infinite banking concept using whole life insurance to a novice client' },
    { id: '2', title: 'Handling "Too Expensive" Objections', topic: 'overcoming price objections in mortgage protection insurance sales' },
    { id: '3', title: 'Referral Generation System', topic: 'asking for referrals after closing a life insurance policy' },
    { id: '4', title: 'Underwriting Pre-qualification', topic: 'field underwriting health questions for whole life policies' },
  ];

  const handleSOPClick = async (id: string, topic: string) => {
    setActiveSOP(id);
    setLoading(true);
    const content = await generateSOPContent(topic);
    setGeneratedContent(content);
    setLoading(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-140px)]">
       <div className="lg:col-span-1 space-y-4 overflow-y-auto pr-2">
         <div className="bg-slate-800 border border-slate-700 p-6 rounded-xl">
           <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-4">
             <SOPIcon />
             SOP Library
           </h2>
           <p className="text-slate-400 text-sm mb-6">Master the process. Scalability requires standardization.</p>
           
           <div className="space-y-3">
             {staticSOPs.map(sop => (
               <button
                 key={sop.id}
                 onClick={() => handleSOPClick(sop.id, sop.topic)}
                 className={`w-full text-left p-4 rounded-lg border transition-all ${
                   activeSOP === sop.id 
                     ? 'bg-gold-500 text-black border-gold-500 shadow-lg shadow-gold-500/20' 
                     : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-500'
                 }`}
               >
                 <div className="font-semibold">{sop.title}</div>
               </button>
             ))}
           </div>
         </div>
       </div>

       <div className="lg:col-span-2 bg-slate-800 border border-slate-700 rounded-xl p-8 overflow-y-auto relative">
         {loading ? (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-800/80 backdrop-blur-sm z-10">
              <div className="flex flex-col items-center">
                <LoadingSpinner />
                <span className="mt-4 text-gold-500 font-medium">Retrieving Protocol...</span>
              </div>
            </div>
         ) : null}
         
         {generatedContent ? (
            <div className="prose prose-invert prose-headings:text-gold-500 prose-strong:text-white max-w-none">
              <ReactMarkdown>{generatedContent}</ReactMarkdown>
            </div>
         ) : (
           <div className="h-full flex flex-col items-center justify-center text-slate-500 opacity-50">
             <SOPIcon />
             <p className="mt-4 text-lg">Select a procedure to view details.</p>
           </div>
         )}
       </div>
    </div>
  );
};