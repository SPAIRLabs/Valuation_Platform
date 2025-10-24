import { Bank } from '../types';

export const BANKS: Bank[] = [
  {
    code: 'bL',
    name: 'Bank of Baroda',
    color: '#e11d48', // rose-600
  },
  {
    code: 'SH',
    name: 'State Bank of India',
    color: '#2563eb', // blue-600
  },
  {
    code: 'HDFC',
    name: 'HDFC Bank',
    color: '#7c3aed', // violet-600
  },
  {
    code: 'ICICI',
    name: 'ICICI Bank',
    color: '#ea580c', // orange-600
  },
];

export const getBankByCode = (code: string): Bank | undefined => {
  return BANKS.find((bank) => bank.code === code);
};
