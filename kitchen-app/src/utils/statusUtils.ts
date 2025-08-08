import { Invoice } from '../types/invoice';

export const getStatusColor = (status: Invoice['status']): string => {
  switch (status) {
    case 'fully_delivered':
      return 'bg-green-100 text-green-800';
    case 'partially_delivered':
      return 'bg-yellow-100 text-yellow-800';
    case 'pending':
      return 'bg-orange-100 text-orange-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const getSeverityColor = (severity: string): string => {
  switch (severity) {
    case 'total_loss':
      return 'bg-red-100 text-red-800';
    case 'major':
      return 'bg-orange-100 text-orange-800';
    case 'minor':
      return 'bg-yellow-100 text-yellow-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const formatStatusText = (status: string): string => {
  return status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
};