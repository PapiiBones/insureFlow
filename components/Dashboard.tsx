import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, LineChart, Line } from 'recharts';
import { Lead, LeadStatus } from '../types';
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

  return (
    <div className="space-y-6 animate-fade-in">
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
    </div>
  );
};