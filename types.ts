
export enum LeadStatus {
  NEW = 'New Lead',
  CONTACTED = 'Contacted',
  APPOINTMENT = 'Appointment Set',
  NEGOTIATION = 'Negotiation',
  CLOSED_WON = 'Policy Sold',
  CLOSED_LOST = 'Lost',
}

export enum PolicyType {
  MORTGAGE_PROTECTION = 'Mortgage Protection',
  WHOLE_LIFE = 'Whole Life (Infinite Banking)',
  FINAL_EXPENSE = 'Final Expense',
  TERM_LIFE = 'Term Life',
}

export interface Interaction {
  id: string;
  date: string;
  type: 'Call' | 'SMS' | 'Email';
  outcome: string;
  notes: string;
  duration?: string;
}

export interface Lead {
  id: string;
  name: string;
  phone: string;
  email: string;
  status: LeadStatus;
  policyInterest: PolicyType;
  estimatedCommission: number;
  notes: string;
  lastContacted?: string;
  nextFollowUp?: string;
  history: Interaction[];
}

export interface SOP {
  id: string;
  title: string;
  category: 'Sales' | 'Product' | 'Operations';
  content: string;
  tags: string[];
}

export type ViewState = 'dashboard' | 'leads' | 'script-gen' | 'sop' | 'finder';