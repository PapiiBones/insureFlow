import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Lead, LeadStatus, PolicyType } from '../types';
import { MoneyIcon, PhoneIcon } from './Icons';

interface DashboardProps {
  leads: Lead[];
}

export const Dashboard: React.FC<DashboardProps> = ({ leads }) => {
  const totalCommission = leads
    .filter(l => l.status === LeadStatus.CLOSED_WON)
    .reduce((acc, curr) => acc + curr.estimatedCommission, 0);

  const pendingCommission = leads
    .filter(l => [LeadStatus.NEGOTIATION, LeadStatus.APPOINTMENT].includes(l.status))
    .reduce((acc, curr) => acc + curr.estimatedCommission, 0);

  const conversionRate = leads.length > 0 
    ? ((leads.filter(l => l.status === LeadStatus.CLOSED_WON).length / leads.length) * 100).toFixed(1) 
    : 0;

  // Mock data for the chart based on leads status distribution
  const statusData = Object.values(LeadStatus).map(status => ({
    name: status,
    count: leads.filter(l => l.status === status).length
  }));

  // Mock ROI data
  const roiData = [
    { month: 'Jan', spend: 2000, return: 4500 },
    { month: 'Feb', spend: 2500, return: 8000 },
    { month: 'Mar', spend: 3000, return: 12000 },
    { month: 'Apr', spend: 3500, return: 15500 },
    { month: 'May', spend: 4000, return: 22000 },
  ];

  // Logic for Policy Breakdown
  const policyBreakdown = Object.values(PolicyType).map(type => {
    const typeLeads = leads.filter(l => l.policyInterest === type);
    const earned = typeLeads
      .filter(l => l.status === LeadStatus.CLOSED_WON)
      .reduce((acc, curr) => acc + curr.estimatedCommission, 0);
    const pending = typeLeads
      .filter(l => [LeadStatus.NEGOTIATION, LeadStatus.APPOINTMENT].includes(l.status))
      .reduce((acc, curr) => acc + curr.estimatedCommission, 0);
    const count = typeLeads.length;

    return {
      type,
      earned,
      pending,
      count
    };
  }).filter(item => item.count > 0 || item.earned > 0 || item.pending > 0);

  // Data for Pie Chart (Distribution of value by policy type)
  const pieData = policyBreakdown.map(p => ({
    name: p.type,
    value: p.earned + p.pending
  })).filter(p => p.value > 0);

  const COLORS = ['#eab308', '#10b981', '#3b82f6', '#f43f5e', '#8b5cf6'];

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Stat Cards */}
        <div className="bg-slate-800 border border-slate-700 p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-slate-400 text-sm font-medium">Total Revenue (YTD)</h3>
            <div className="p-2 bg-green-500/10 rounded-lg text-green-500">
              <MoneyIcon />
            </div>
          </div>
          <p className="text-3xl font-bold text-white">${totalCommission.toLocaleString()}</p>
          <p className="text-xs text-green-400 mt-2">+12% from last month</p>
        </div>

        <div className="bg-slate-800 border border-slate-700 p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-slate-400 text-sm font-medium">Pipeline Value</h3>
            <div className="p-2 bg-gold-500/10 rounded-lg text-gold-500">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20v-6M6 20V10M18 20V4"/></svg>
            </div>
          </div>
          <p className="text-3xl font-bold text-white">${pendingCommission.toLocaleString()}</p>
          <p className="text-xs text-gold-500 mt-2">{leads.filter(l => [LeadStatus.NEGOTIATION, LeadStatus.APPOINTMENT].includes(l.status)).length} Active Deals</p>
        </div>

        <div className="bg-slate-800 border border-slate-700 p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-slate-400 text-sm font-medium">Conversion Rate</h3>
            <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500">
              <PhoneIcon />
            </div>
          </div>
          <p className="text-3xl font-bold text-white">{conversionRate}%</p>
          <p className="text-xs text-slate-400 mt-2">Target: 25%</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Charts */}
        <div className="bg-slate-800 border border-slate-700 p-6 rounded-xl shadow-lg">
          <h3 className="text-lg font-semibold text-white mb-6">Pipeline Health</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statusData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickFormatter={(val) => val.split(' ')[0]} />
                <YAxis stroke="#94a3b8" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff' }} 
                  itemStyle={{ color: '#fff' }}
                />
                <Bar dataKey="count" fill="#eab308" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-slate-800 border border-slate-700 p-6 rounded-xl shadow-lg">
          <h3 className="text-lg font-semibold text-white mb-6">Marketing ROI (Spend vs Return)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={roiData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="month" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff' }}
                />
                <Line type="monotone" dataKey="return" stroke="#22c55e" strokeWidth={2} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="spend" stroke="#ef4444" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Commission Breakdown Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Breakdown Table */}
          <div className="lg:col-span-2 bg-slate-800 border border-slate-700 p-6 rounded-xl shadow-lg">
             <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Revenue by Policy Type</h3>
                <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Live Data</span>
             </div>
             <div className="overflow-x-auto">
               <table className="w-full text-left text-sm">
                 <thead>
                   <tr className="text-slate-400 border-b border-slate-700">
                     <th className="pb-3 font-medium">Policy Type</th>
                     <th className="pb-3 font-medium">Active Leads</th>
                     <th className="pb-3 font-medium text-right">Earned</th>
                     <th className="pb-3 font-medium text-right">Pending</th>
                     <th className="pb-3 font-medium text-right">Total Potential</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-700">
                   {policyBreakdown.map((item) => (
                     <tr key={item.type} className="group hover:bg-slate-700/30 transition">
                       <td className="py-3 text-white font-medium">{item.type}</td>
                       <td className="py-3 text-slate-300">{item.count}</td>
                       <td className="py-3 text-right text-emerald-400 font-mono">${item.earned.toLocaleString()}</td>
                       <td className="py-3 text-right text-gold-500 font-mono">${item.pending.toLocaleString()}</td>
                       <td className="py-3 text-right text-white font-mono font-bold">${(item.earned + item.pending).toLocaleString()}</td>
                     </tr>
                   ))}
                   {policyBreakdown.length === 0 && (
                      <tr>
                        <td colSpan={5} className="py-6 text-center text-slate-500 italic">No commission data available yet.</td>
                      </tr>
                   )}
                 </tbody>
               </table>
             </div>
          </div>

          {/* Value Distribution Chart */}
          <div className="bg-slate-800 border border-slate-700 p-6 rounded-xl shadow-lg flex flex-col">
             <h3 className="text-lg font-semibold text-white mb-2">Value Distribution</h3>
             <div className="flex-1 min-h-[200px] relative">
               <ResponsiveContainer width="100%" height="100%">
                 <PieChart>
                   <Pie
                     data={pieData}
                     cx="50%"
                     cy="50%"
                     innerRadius={60}
                     outerRadius={80}
                     paddingAngle={5}
                     dataKey="value"
                   >
                     {pieData.map((entry, index) => (
                       <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                     ))}
                   </Pie>
                   <Tooltip 
                     contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff' }}
                     formatter={(value: number) => `$${value.toLocaleString()}`}
                   />
                 </PieChart>
               </ResponsiveContainer>
               
               <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                 <div className="text-center">
                    <span className="text-2xl font-bold text-white">${(totalCommission + pendingCommission).toLocaleString()}</span>
                    <p className="text-xs text-slate-500">Total Value</p>
                 </div>
               </div>
             </div>
             
             <div className="mt-4 space-y-2 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                {pieData.map((entry, index) => (
                  <div key={entry.name} className="flex items-center justify-between text-xs">
                     <div className="flex items-center gap-2">
                       <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                       <span className="text-slate-300 truncate max-w-[120px]" title={entry.name}>{entry.name}</span>
                     </div>
                     <span className="text-white font-medium">${(entry.value as number).toLocaleString()}</span>
                  </div>
                ))}
             </div>
          </div>
       </div>
    </div>
  );
};